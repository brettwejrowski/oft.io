import math

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.database import get_db
from app.models.comment import Comment
from app.models.post import Post
from app.models.user import User
from app.models.vote import Vote
from app.schemas.comment import CommentCreate, CommentRead
from app.schemas.post import PostRead
from app.schemas.vote import VoteCreate, VoteRead

router = APIRouter(prefix="/posts", tags=["posts"])


@router.get("/nearby", response_model=list[PostRead])
async def get_nearby_posts(
    lat: float,
    lng: float,
    radius_km: float = 10.0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """Return posts within a bounding box approximation of the given radius."""
    # 1 degree lat ≈ 111 km
    lat_delta = radius_km / 111.0
    lng_delta = radius_km / (111.0 * math.cos(math.radians(lat)))

    result = await db.execute(
        select(Post)
        .where(
            Post.location_lat.between(lat - lat_delta, lat + lat_delta),
            Post.location_lng.between(lng - lng_delta, lng + lng_delta),
        )
        .order_by(Post.score.desc())
        .limit(limit)
    )
    return result.scalars().all()


@router.get("/{post_id}", response_model=PostRead)
async def get_post(post_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return post


@router.post("/{post_id}/vote", response_model=VoteRead)
async def vote_on_post(
    post_id: int,
    body: VoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post_result = await db.execute(select(Post).where(Post.id == post_id))
    post = post_result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    vote_result = await db.execute(
        select(Vote).where(Vote.user_id == current_user.id, Vote.post_id == post_id)
    )
    existing_vote = vote_result.scalar_one_or_none()

    if existing_vote:
        # Update score delta and vote value
        score_delta = body.value - existing_vote.value
        existing_vote.value = body.value
        post.score += score_delta
        vote = existing_vote
    else:
        vote = Vote(user_id=current_user.id, post_id=post_id, value=body.value)
        post.score += body.value
        db.add(vote)

    await db.commit()
    await db.refresh(vote)
    return vote


@router.get("/{post_id}/comments", response_model=list[CommentRead])
async def list_comments(post_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Comment)
        .where(Comment.post_id == post_id)
        .order_by(Comment.created_at.asc())
    )
    return result.scalars().all()


@router.post("/{post_id}/comments", response_model=CommentRead, status_code=status.HTTP_201_CREATED)
async def create_comment(
    post_id: int,
    body: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post_result = await db.execute(select(Post).where(Post.id == post_id))
    if not post_result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    comment = Comment(**body.model_dump(), user_id=current_user.id, post_id=post_id)
    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    return comment

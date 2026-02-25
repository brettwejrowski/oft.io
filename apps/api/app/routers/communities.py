from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.database import get_db
from app.models.community import Community
from app.models.post import Post
from app.models.user import User
from app.schemas.community import CommunityCreate, CommunityRead
from app.schemas.post import PostCreate, PostRead

router = APIRouter(prefix="/communities", tags=["communities"])


@router.get("", response_model=list[CommunityRead])
async def list_communities(
    skip: int = 0, limit: int = 50, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Community).offset(skip).limit(limit))
    return result.scalars().all()


@router.post("", response_model=CommunityRead, status_code=status.HTTP_201_CREATED)
async def create_community(
    body: CommunityCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = await db.execute(select(Community).where(Community.slug == body.slug))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Slug already taken")

    community = Community(**body.model_dump(), created_by=current_user.id)
    db.add(community)
    await db.commit()
    await db.refresh(community)
    return community


@router.get("/{slug}", response_model=CommunityRead)
async def get_community(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Community).where(Community.slug == slug))
    community = result.scalar_one_or_none()
    if not community:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Community not found")
    return community


@router.get("/{slug}/posts", response_model=list[PostRead])
async def list_community_posts(
    slug: str, skip: int = 0, limit: int = 50, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Community).where(Community.slug == slug))
    community = result.scalar_one_or_none()
    if not community:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Community not found")

    posts_result = await db.execute(
        select(Post)
        .where(Post.community_id == community.id)
        .order_by(Post.score.desc(), Post.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return posts_result.scalars().all()


@router.post("/{slug}/posts", response_model=PostRead, status_code=status.HTTP_201_CREATED)
async def create_community_post(
    slug: str,
    body: PostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Community).where(Community.slug == slug))
    community = result.scalar_one_or_none()
    if not community:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Community not found")

    post = Post(**body.model_dump(), user_id=current_user.id)
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post

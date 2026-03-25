// @ts-nocheck
import { communitiesApi } from '@placewise/shared';
import type { PageLoad } from './$types';

export const load = async ({ params }: Parameters<PageLoad>[0]) => {
  const [community, posts] = await Promise.all([
    communitiesApi.get(params.slug),
    communitiesApi.listPosts(params.slug),
  ]);
  return { community, posts };
};

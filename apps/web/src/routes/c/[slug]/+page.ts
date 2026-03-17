import { communitiesApi } from '@placewise/shared';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const [community, posts] = await Promise.all([
    communitiesApi.get(params.slug),
    communitiesApi.listPosts(params.slug),
  ]);
  return { community, posts };
};

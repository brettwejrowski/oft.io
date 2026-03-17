import { postsApi } from '@placewise/shared';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const id = Number(params.id);
  const [post, comments] = await Promise.all([postsApi.get(id), postsApi.listComments(id)]);
  return { post, comments };
};

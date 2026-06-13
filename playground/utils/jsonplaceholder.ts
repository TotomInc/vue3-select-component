export type JsonPlaceholderPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

export function postToSelectOption(post: JsonPlaceholderPost) {
  return {
    label: post.title,
    value: post.id,
  };
}

/**
 * Fetches a page of posts from JSONPlaceholder.
 * Uses `_start` and `_limit` query params. See https://jsonplaceholder.typicode.com/guide/
 */
export async function fetchPostsPage(params: { start: number; limit: number }) {
  const url = new URL(POSTS_URL);
  url.searchParams.set("_start", String(params.start));
  url.searchParams.set("_limit", String(params.limit));

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch posts (${response.status})`);
  }

  const total = Number(response.headers.get("X-Total-Count") ?? 0);
  const posts = await response.json() as JsonPlaceholderPost[];

  return { posts, total };
}

/**
 * Searches posts by title substring via the `title_like` query param.
 */
export async function searchPosts(params: { query: string; limit?: number }) {
  const url = new URL(POSTS_URL);
  const trimmedQuery = params.query.trim();

  if (trimmedQuery) {
    url.searchParams.set("title_like", trimmedQuery);
  }

  url.searchParams.set("_limit", String(params.limit ?? 50));

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to search posts (${response.status})`);
  }

  const posts = await response.json() as JsonPlaceholderPost[];

  return posts;
}

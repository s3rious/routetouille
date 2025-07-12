import { DELETE, GET, PATCH, POST } from "services/api";

type PostDTO = {
  id: number;
  title: string;
  body: string;
  datetime: Date;
};

async function generateRandomPost(): Promise<PostDTO> {
  type LitipsumDTO = {
    title: string;
    text: string[];
  };
  const id: number = Math.floor(Math.random() * 100);

  const baseUrl = "http://localhost:4000/api/litipsum/";

  const { title, text }: LitipsumDTO = await (
    await fetch(`${baseUrl}${id}`)
  ).json();

  return {
    id,
    title: `${title} ${id}`,
    body: text.join("\n"),
    datetime: new Date(),
  };
}

async function fetchPosts(): Promise<PostDTO[]> {
  const posts: PostDTO[] = await Promise.all(
    Array.from({ length: 69 }).map(async (_) => await generateRandomPost()),
  );
  const postsData: PostDTO[] = [];

  for (const post of posts) {
    if (!postsData.map((postsPost) => postsPost.id).includes(post.id)) {
      postsData.push(post);
    }
  }

  return await GET("posts/", null, postsData);
}

async function fetchPost(id: number): Promise<PostDTO> {
  const random: PostDTO = await generateRandomPost();

  const postData: PostDTO = {
    ...random,
    id,
  };

  return await GET(`posts/${id}`, null, postData);
}

async function createPost(data: Omit<PostDTO, "id">): Promise<PostDTO> {
  const postData: PostDTO = {
    id: 69,
    ...data,
  };

  return await POST("posts/", null, postData);
}

async function updatePost(
  id: number,
  data: Omit<PostDTO, "id">,
): Promise<PostDTO> {
  const postData: PostDTO = {
    id,
    ...data,
  };

  return await PATCH(`posts/${id}`, null, postData);
}

async function deletePost(id: number): Promise<boolean> {
  return await DELETE(`posts/${id}`, null, true);
}

export { fetchPosts, fetchPost, createPost, updatePost, deletePost };

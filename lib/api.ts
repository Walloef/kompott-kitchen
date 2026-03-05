import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";
import {
  GetAllPostsDocument,
  GetLandingPageDocument,
  GetPaginatedPostsDocument,
  GetPostAndMoreDocument,
  GetPreviewPostDocument,
  PostFieldsFragmentDoc,
} from "@/generated/graphql";
import { useFragment } from "@/generated/fragment-masking";

async function fetchGraphQL<T, TVariables>(
  document: TypedDocumentNode<T, TVariables>,
  variables: TVariables,
  preview = false,
  tags: string[] = [],
): Promise<T> {
  const res = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          preview
            ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
            : process.env.CONTENTFUL_ACCESS_TOKEN
        }`,
      },
      body: JSON.stringify({
        query: print(document),
        variables,
      }),
      ...(preview
        ? { cache: "no-store" }
        : { next: { tags: ["contentful", ...tags] } }),
    },
  );

  const json = await res.json();

  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }

  return json.data as T;
}

export async function getAllPosts(preview: boolean) {
  const data = await fetchGraphQL(GetAllPostsDocument, { preview }, preview, [
    "posts",
  ]);

  const items = (data?.pageBlogPostCollection?.items ?? []).filter(
    (item): item is NonNullable<typeof item> => item !== null,
  );
  return useFragment(PostFieldsFragmentDoc, items);
}

export async function getPreviewPostBySlug(slug: string | null) {
  if (!slug) return undefined;
  const data = await fetchGraphQL(GetPreviewPostDocument, { slug }, true, [
    "posts",
    `post-${slug}`,
  ]);

  const item = data?.pageBlogPostCollection?.items?.[0];
  return item ? useFragment(PostFieldsFragmentDoc, item) : undefined;
}

export async function getPostAndMorePosts(slug: string, preview: boolean) {
  const data = await fetchGraphQL(
    GetPostAndMoreDocument,
    { slug, preview },
    preview,
    ["posts", `post-${slug}`],
  );

  const recipe = data?.pageBlogPostCollection?.items?.[0];
  const moreRecipes = (data?.morePostsCollection?.items ?? []).filter(
    (item): item is NonNullable<typeof item> => item !== null,
  );

  return {
    recipe: recipe ? useFragment(PostFieldsFragmentDoc, recipe) : undefined,
    moreRecipes: useFragment(PostFieldsFragmentDoc, moreRecipes),
  };
}

export async function getPaginatedPosts(
  page: number,
  limit: number,
  isDraftMode = false,
) {
  const skip = (page - 1) * limit;

  const data = await fetchGraphQL(
    GetPaginatedPostsDocument,
    {
      preview: isDraftMode,
      limit,
      skip,
    },
    isDraftMode,
    ["posts"],
  );

  return {
    posts: data?.pageBlogPostCollection?.items ?? [],
    total: data?.pageBlogPostCollection?.total ?? 0,
  };
}

export async function getLandingPage(isDraftMode = false) {
  const data = await fetchGraphQL(
    GetLandingPageDocument,
    {
      preview: isDraftMode,
    },
    isDraftMode,
    ["landing-page"],
  );

  return data?.pageLandingCollection?.items?.[0] ?? null;
}

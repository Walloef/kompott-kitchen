import Link from "next/link";
import { draftMode } from "next/headers";

import { getPaginatedPosts } from "@/lib/api";
import { PostFieldsFragment, PostFieldsFragmentDoc } from "@/generated/graphql";
import { useFragment } from "@/generated/fragment-masking";
import MoreRecipes from "../components/MoreRecipes";
import Heading from "../components/Heading";
import Header from "../components/Header";

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { isEnabled } = await draftMode();

  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page ?? "1", 10);
  const POSTS_PER_PAGE = 6;

  const { posts: unmaskedPosts, total } = await getPaginatedPosts(
    currentPage,
    POSTS_PER_PAGE,
    isEnabled,
  );

  const posts = unmaskedPosts.map((maskedPost) =>
    maskedPost ? useFragment(PostFieldsFragmentDoc, maskedPost) : null,
  );

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <>
      <Header>
        <Link href="/" className="underline">
          Home
        </Link>
      </Header>
      <div className="container mx-auto px-5 py-16">
        <Heading tag="h2" classNames="mb-8">
          All Recipes
        </Heading>
        <MoreRecipes
          moreRecipes={posts.filter(
            (post): post is PostFieldsFragment => post !== null,
          )}
        />
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 items-center">
            {currentPage > 1 ? (
              <Link
                href={`/recipes?page=${currentPage - 1}`}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                ← Previous
              </Link>
            ) : (
              <span className="px-4 py-2 bg-gray-200 text-gray-400 rounded cursor-not-allowed">
                ← Previous
              </span>
            )}

            <span className="font-medium">
              Page {currentPage} of {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Link
                href={`/recipes?page=${currentPage + 1}`}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Next →
              </Link>
            ) : (
              <span className="px-4 py-2 bg-gray-200 text-gray-400 rounded cursor-not-allowed">
                Next →
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );
}

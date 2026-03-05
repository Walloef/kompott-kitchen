import { Metadata } from "next";
import Link from "next/link";
import { draftMode } from "next/headers";

import { Markdown } from "@/lib/markdown";
import { getAllPosts, getPostAndMorePosts } from "@/lib/api";
import { PostFieldsFragment } from "@/generated/graphql";
import Header from "@/app/components/Header";
import { getMetadata } from "@/helpers/getMetaData";
import ContentfulImage from "@/lib/contentful-image";
import Heading from "@/app/components/Heading";

import MoreRecipes from "../../components/MoreRecipes";
import Date from "../../date";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { isEnabled } = await draftMode();
  const { slug } = await params;

  const { recipe } = await getPostAndMorePosts(slug, isEnabled);

  if (!recipe) {
    return { title: "Post Not Found" };
  }

  return getMetadata(recipe.seoFields, recipe.title, recipe.shortDescription);
}

export async function generateStaticParams() {
  const allPosts = await getAllPosts(false);

  return allPosts
    .filter(
      (post): post is PostFieldsFragment & { slug: string } =>
        post.slug != null,
    )
    .map((post) => ({
      slug: post.slug,
    }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { isEnabled } = await draftMode();
  const { slug } = await params;

  const { recipe, moreRecipes } = await getPostAndMorePosts(slug, isEnabled);

  if (!recipe) {
    return (
      <div className="container mx-auto px-5 py-24 text-center text-2xl font-bold">
        Recipe not found
      </div>
    );
  }

  return (
    <>
      <Header>
        <Link
          href="/"
          className="underline hover:text-gray-600 transition-colors"
        >
          Home
        </Link>
      </Header>

      <div className="container mx-auto px-5">
        <article>
          <Heading tag="h1" classNames="my-12">
            {recipe.title}
          </Heading>

          {recipe.featuredImage && (
            <div className="relative mb-8 md:mb-16 w-full aspect-video rounded-lg overflow-hidden shadow-lg bg-gray-100">
              <ContentfulImage
                image={recipe.featuredImage}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
          )}

          <div className="mx-auto max-w-2xl">
            <div className="mb-6 text-lg text-gray-500 font-medium">
              <Date dateString={recipe.publishedDate} />
            </div>
          </div>

          <div className="mx-auto max-w-2xl">
            {recipe.content && (
              <div className="prose prose-lg md:prose-xl text-gray-800 max-w-none">
                <Markdown content={recipe.content} />
              </div>
            )}
          </div>
        </article>

        <hr className="border-gray-200 mt-28 mb-24" />
      </div>
      {moreRecipes && moreRecipes.length > 0 && (
        <>
          <MoreRecipes
            title="More Recipes"
            moreRecipes={moreRecipes}
            cols={2}
          />
        </>
      )}
    </>
  );
}

import Link from "next/link";

import { PostFieldsFragment } from "@/generated/graphql";
import { HeadingTags } from "@/@types/global";
import ContentfulImage from "@/lib/contentful-image";

import DateComponent from "../date";
import Heading from "./Heading";
import Header from "./Header";

function RecipePreview({
  recipe,
  headingTag,
}: {
  recipe: PostFieldsFragment;
  headingTag: HeadingTags;
}) {
  const { title, slug, featuredImage, publishedDate, shortDescription } =
    recipe;

  return (
    <div className="bg-white relative rounded-md p-4 transition-colors hover:border-black active:border-black has-[:focus-within]:outline has-[:focus-within]:outline-2 has-[:focus-within]:outline-offset-4 has-[:focus-within]:outline-pink-500">
      {featuredImage && (
        <div className="relative w-full aspect-[5/3] overflow-hidden rounded-md mb-2 shrink-0 shadow-md">
          <ContentfulImage
            image={featuredImage}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="text-sm my-3">
        <DateComponent dateString={publishedDate} />
      </div>

      <Heading tag={headingTag} classNames="mb-2 text-md md:text-xl">
        <Link
          href={`/posts/${slug}`}
          className="hover:underline focus:outline-none before:absolute before:inset-0 before:z-0"
        >
          {title}
        </Link>
      </Heading>
      <p className="text-md leading-relaxed mb-4 relative line-clamp-3">
        {shortDescription}
      </p>
    </div>
  );
}

export default function MoreRecipes({
  moreRecipes,
  cols = 3,
  headingTag = "h3",
  title,
}: {
  moreRecipes: PostFieldsFragment[];
  cols?: number;
  headingTag?: HeadingTags;
  title?: string;
}) {
  const gridColsMap: Record<number, string> = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
  };

  const mdColsClass = gridColsMap[cols] || gridColsMap[3];

  return (
    <div className="bg-[#fafafa] border-t py-5">
      <div className="container mx-auto px-5">
        {title && (
          <Header
            tag={headingTag}
            classNames="text-4xl font-bold tracking-tighter leading-tight mb-8"
          >
            {title}
          </Header>
        )}
        <div className={`grid grid-cols-1 ${mdColsClass} py-5 md:gap-3 mb-10`}>
          {moreRecipes.map((recipe) => (
            <RecipePreview
              headingTag={headingTag}
              key={recipe.slug}
              recipe={recipe}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { draftMode } from "next/headers";
import { Metadata } from "next";

import { getLandingPage, getPaginatedPosts } from "@/lib/api";
import {
  PostFieldsFragmentDoc,
  LandingPageFieldsFragmentDoc,
  PostFieldsFragment,
} from "@/generated/graphql";
import { useFragment } from "@/generated/fragment-masking";
import { Markdown } from "@/lib/markdown";
import { getMetadata } from "@/helpers/getMetaData";

import MoreRecipes from "./components/MoreRecipes";
import Header from "./components/Header";

export async function generateMetadata(): Promise<Metadata> {
  const { isEnabled } = await draftMode();
  const maskedLanding = await getLandingPage(isEnabled);

  const landing = useFragment(LandingPageFieldsFragmentDoc, maskedLanding);

  return getMetadata(landing?.seoFields, landing?.internalName);
}

export default async function Page() {
  const { isEnabled } = await draftMode();
  const maskedLanding = await getLandingPage(isEnabled);
  const landing = useFragment(LandingPageFieldsFragmentDoc, maskedLanding);

  if (!landing) {
    return (
      <div className="container mx-auto px-5 mt-16">
        <p className="text-lg mb-4">No landing page content found.</p>
        <Link
          href="/recipes"
          className="underline hover:text-success duration-200 transition-colors"
        >
          View all recipes →
        </Link>
      </div>
    );
  }

  const { posts } = await getPaginatedPosts(1, 3, isEnabled);

  const post = posts.reduce<PostFieldsFragment[]>((acc, maskedPost) => {
    const post = maskedPost
      ? useFragment(PostFieldsFragmentDoc, maskedPost)
      : null;
    if (post) {
      acc.push(post);
    }
    return acc;
  }, []);

  return (
    <>
      <Header tag="h1" showLink>
        <div className="group">
          <span className="-rotate-3 origin-bottom-left group-hover:animate-rock -mb-[14px] block">
            Kompott
          </span>
          <span>kitchen.</span>
        </div>
      </Header>
      <div className="container mx-auto px-5">
        <section className="mb-20">
          <div className="max-w-[75ch] mb-3">
            <Markdown content={landing.ingress} />
          </div>
        </section>
      </div>

      <MoreRecipes moreRecipes={post} />
    </>
  );
}

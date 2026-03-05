import { Metadata } from "next";

import { FragmentType, useFragment } from "@/generated";
import {
  SeoFieldsFragmentDoc,
  ImageFieldsFragmentDoc,
} from "@/generated/graphql";

import { DEFAULT_TITLE, DEFAULT_DESCRIPTION } from "../app/const/strings";

export function getMetadata(
  maskedSeoFields: FragmentType<typeof SeoFieldsFragmentDoc> | null | undefined,
  fallbackTitle?: string | null,
  fallbackDescription?: string | null,
): Metadata {
  const defaultTitle = fallbackTitle ?? DEFAULT_TITLE;
  const defaultDescription = fallbackDescription ?? DEFAULT_DESCRIPTION;

  if (!maskedSeoFields) {
    return {
      title: defaultTitle,
      description: defaultDescription,
    };
  }

  const seo = useFragment(SeoFieldsFragmentDoc, maskedSeoFields);

  const maskedOgImage = seo.shareImagesCollection?.items?.[0];
  const ogImage = maskedOgImage
    ? useFragment(ImageFieldsFragmentDoc, maskedOgImage)
    : null;

  const finalTitle = seo.pageTitle ?? defaultTitle;
  const finalDescription = seo.pageDescription ?? defaultDescription;

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: {
      canonical: seo.canonicalUrl,
    },
    robots: {
      index: !seo.noindex,
      follow: !seo.nofollow,
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      images: ogImage?.url ? [{ url: ogImage.url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: ogImage?.url ? [{ url: ogImage.url }] : [],
    },
  };
}

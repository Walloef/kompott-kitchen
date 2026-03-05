"use client";

import Image, { ImageProps } from "next/image";

import { FragmentType, useFragment } from "@/generated/fragment-masking";
import { ImageFieldsFragmentDoc } from "@/generated/graphql";

interface ContentfulImageProps extends Omit<ImageProps, "src" | "alt"> {
  image?: FragmentType<typeof ImageFieldsFragmentDoc> | null;
  src?: string;
  alt?: string;
}

const contentfulLoader = ({ src, width, quality }: any) => {
  return `${src}?w=${width}&q=${quality || 75}&fm=webp`;
};

export default function ContentfulImage({
  image: maskedImage,
  src,
  alt,
  width,
  height,
  fill,
  ...props
}: ContentfulImageProps) {
  const image = useFragment(ImageFieldsFragmentDoc, maskedImage);

  const imageUrl = src || image?.url;

  if (!imageUrl) return null;

  return (
    <Image
      loader={contentfulLoader}
      src={imageUrl}
      alt={alt ?? image?.description ?? ""}
      width={fill ? undefined : (width ?? image?.width ?? 0)}
      height={fill ? undefined : (height ?? image?.height ?? 0)}
      fill={fill}
      {...props}
    />
  );
}

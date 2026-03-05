import { ReactNode } from "react";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS } from "@contentful/rich-text-types";
import ContentfulImage from "@/lib/contentful-image";
import { useFragment } from "@/generated/fragment-masking";
import {
  ImageFieldsFragmentDoc,
  RichImageFieldsFragmentDoc,
  YoutubeVideoFieldsFragmentDoc,
} from "@/generated/graphql";

interface MarkdownProps {
  content?: {
    json: any;
    links?: any;
  } | null;
}

function RichTextAsset({ id, assets }: { id: string; assets?: Array<any> }) {
  const validAssets = (assets ?? []).filter((asset) => asset !== null);
  const unmaskedAssets = useFragment(ImageFieldsFragmentDoc, validAssets);
  const asset = unmaskedAssets?.find((a) => a?.sys?.id === id);

  if (asset?.url) {
    return (
      <div className="relative w-full aspect-video my-8">
        <ContentfulImage
          src={asset.url}
          alt={asset.description ?? ""}
          fill
          className="object-cover rounded-lg"
        />
      </div>
    );
  }
  return null;
}

function RichTextEntry({ id, entries }: { id: string; entries?: Array<any> }) {
  const rawEntry = (entries ?? []).find((e) => e?.sys?.id === id);

  if (rawEntry?.__typename === "ComponentRichImage") {
    const entry = useFragment(RichImageFieldsFragmentDoc, rawEntry);

    if (entry?.image) {
      return (
        <div className="my-10 w-full flex flex-col items-center">
          <div className="relative w-full aspect-video">
            <ContentfulImage
              image={entry.image}
              alt={entry.caption ?? entry.internalName ?? ""}
              fill
              className="object-cover rounded-lg shadow-md"
            />
          </div>
          {entry.caption && (
            <p className="text-sm text-gray-500 mt-3 text-center italic">
              {entry.caption}
            </p>
          )}
        </div>
      );
    }
  }
  if (rawEntry?.__typename === "ComponentYoutubeVideo") {
    const entry = useFragment(YoutubeVideoFieldsFragmentDoc, rawEntry);

    if (entry?.youtubeUrl) {
      const videoIdMatch = entry.youtubeUrl.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/,
      );
      const videoId = videoIdMatch ? videoIdMatch[1] : null;

      if (!videoId) return <p className="text-red-500">Invalid YouTube URL</p>;

      return (
        <div
          className={`my-10 flex flex-col items-center ${entry.fullWidth ? "w-full" : "max-w-3xl mx-auto"}`}
        >
          <div className="relative w-full aspect-video overflow-hidden rounded-lg shadow-lg">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={entry.internalName ?? "YouTube video player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          {entry.caption && (
            <p className="text-sm text-gray-500 mt-3 text-center italic">
              {entry.caption}
            </p>
          )}
        </div>
      );
    }
  }

  return null;
}

export function Markdown({ content }: MarkdownProps) {
  if (!content?.json) return null;

  return documentToReactComponents(content.json, {
    renderMark: {
      [MARKS.BOLD]: (text: ReactNode) => {
        const boldClasses =
          "font-bold text-3xl leading-snug tracking-tight md:text-4xl lg:text-5xl block";

        if (typeof text === "string" && text.startsWith("##")) {
          const cleanText = text.replace("##", "");
          if (cleanText.includes(",")) {
            const [firstPart, ...rest] = cleanText.split(",");
            const secondPart = rest.join(",");
            return (
              <b className={boldClasses}>
                {firstPart},
                <br />
                {secondPart}
              </b>
            );
          }
          return <b className={boldClasses}>{cleanText}</b>;
        }

        return <b className={boldClasses}>{text}</b>;
      },
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (_node, children) => (
        <p className="mb-4">{children}</p>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => (
        <RichTextAsset
          id={node.data.target.sys.id}
          assets={content.links?.assets?.block}
        />
      ),
      [BLOCKS.EMBEDDED_ENTRY]: (node: any) => (
        <RichTextEntry
          id={node.data.target.sys.id}
          entries={content.links?.entries?.block}
        />
      ),
    },
  });
}

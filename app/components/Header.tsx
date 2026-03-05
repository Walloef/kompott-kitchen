import { ReactNode } from "react";
import Link from "next/link";

import { HeadingTags } from "@/@types/global";

import Heading from "./Heading";

const Header = ({
  children,
  showLink,
  tag = "h2",
  classNames,
}: {
  children: ReactNode;
  showLink?: boolean;
  tag?: HeadingTags;
  classNames?: string;
}) => {
  return (
    <header
      className={`container flex flex-wrap items-end justify-between gap-4 mx-auto mt-16 mb-24 px-5 ${classNames ?? ""}`}
    >
      <Heading
        tag={tag}
        classNames="flex flex-col gap-x-2 leading-tight tracking-tight"
      >
        {children}
      </Heading>

      {showLink && (
        <Link href="/recipes" className="text-lg underline">
          View all recipes →
        </Link>
      )}
    </header>
  );
};

export default Header;

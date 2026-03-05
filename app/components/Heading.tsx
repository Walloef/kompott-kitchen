import { ReactNode } from "react";

import { HeadingTags } from "@/@types/global";

type HeadingProps = {
  children: ReactNode;
  tag: HeadingTags;
  classNames?: string;
};

const Heading = ({ children, tag: Tag, classNames }: HeadingProps) => {
  const fontSizeClasses = {
    h1: "text-5xl md:text-7xl",
    h2: "text-4xl md:text-6xl",
    h3: "text-3xl md:text-5xl",
    h4: "text-2xl md:text-4xl",
    h5: "text-xl md:text-3xl",
    h6: "text-lg md:text-2xl",
  };

  return (
    <Tag
      className={`${fontSizeClasses[Tag]} text-main font-bold ${classNames ?? ""}`}
    >
      {children}
    </Tag>
  );
};

export default Heading;

interface SocialImage {
  src: string;
  alt: string;
}

interface SharedMetadata {
  title: string;
  description?: string;
  image?: SocialImage;
  robots?: "noindex";
}

export type PageMetadata =
  | (SharedMetadata & {
      kind: "page";
    })
  | (SharedMetadata & {
      kind: "article";
      description: string;
      image: SocialImage;
      pubDate: Date;
      updatedDate?: Date;
      tags?: string[];
      wordCount?: number;
    });

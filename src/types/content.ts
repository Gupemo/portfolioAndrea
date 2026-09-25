export type ContentType = "illustration" | "picture";
export type Locale = "es" | "en";

export type PortfolioItem = {
  id: number;
  type: ContentType;
  image: string;
  createdAt: string;
  title: string;
  description: string;
};

export type EditablePortfolioItem = PortfolioItem & {
  watermarkType: "none" | "text" | "signature";
  watermarkPosition: "top-left" | "top-right" | "center" | "bottom-left" | "bottom-right";
  translations: Record<Locale, { title: string; description: string }>;
};

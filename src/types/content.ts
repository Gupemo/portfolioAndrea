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

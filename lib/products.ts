export type Product = {
  id: string;
  name: string;
  volume: string;
  description: string;
  image_url: string;
  sort_order: number;
  created_at: string;
};

export type ProductInput = {
  name: string;
  volume: string;
  description: string;
  image_url: string;
  sort_order: number;
};

export interface Product {
  id: string;
  sku: string;
  name: string;
  tagline?: string;
  slug: string;
  price: number;
  originalPrice?: number;
  availableSizes?: string[];
  image: string;
  images: string[];
  category: string;
  stock?: number;
  fabric?: string;
  color?: string;
  isNew?: boolean;
  isTrending?: boolean;
  isBestSelling?: boolean;
  description?: string;
  rating?: number;
  isVariant?: boolean;
  colorVariants?: any[];
  noCareInstructions?: boolean;
}

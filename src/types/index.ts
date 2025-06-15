
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  sizes: {
    P: number;
    M: number;
    G: number;
    GG: number;
    XG: number;
    XGG: number;
  };
  createdAt: Date;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  size: keyof Product['sizes'];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  royaltyPercent?: number;
  royaltyAmount?: number;
  createdAt: Date;
}

export type SizeType = keyof Product['sizes'];

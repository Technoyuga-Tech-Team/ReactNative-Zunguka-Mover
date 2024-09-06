import { LoadingState } from "./global.types";
import { UserData } from "./user.types";
export interface ProductState {
  loading: LoadingState;
}
// Product Listing props
export interface ProductsProps {
  message: string;
  status: number;
  data: GetProductData;
}
export interface GetProductData {
  data: ProductDataProps[];
  totalRecords: number;
  totalPages: number;
  currentPage: string;
}
export interface ProductDataProps {
  id: number;
  sale_price: number;
  user_id: number;
  title: string;
  category_id: string;
  status: string;
  added_at: string;
  created_at: string;
  images: productImage[];
  category: productCategory[];
  brand: brandInfo;
  color: string;
  condition_of_item: string;
  is_delivery_button: boolean;
}
export interface productImage {
  item_id: number;
  image: string;
}
interface productCategory {
  name: number;
}
interface brandInfo {
  id: number;
  name: string;
  icon: string;
}
// product details props

export interface ProductsDetailsProps {
  message: string;
  status: number;
  data: ProductDetailsDataProps;
}

export interface sellerDetailsProps {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  profile_image: string;
  phone_number: string;
}

interface image {
  image: string;
  item_id: number;
}

export enum PRODUCT_STATUS_DRAFT {
  DRAFT = "Draft",
  ACTIVE = "Active",
}

export interface similarDataProps {
  added_at: string;
  created_at: string;
  id: number;
  images: image[];
  is_like: false;
  sale_price: number;
  title: string;
  user_id: number;
}

export interface ProductDetailsDataProps {
  id: number;
  user_id: number;
  category_id: string;
  title: string;
  address: string;
  city: string;
  description: string;
  actual_price: string;
  sale_price: number;
  status: string;
  image: string;
  created_at: string;
  updated_at: string;
  location: string;
  latitude: string;
  longitude: string;
  condition_of_item: string;
  brand_id: number;
  color: string;
  size: string;
  is_like: boolean;
  mode_of_transport: string;
  category: productCategory[];
  added_at: string;
  images: productImage[];
  user: sellerDetailsProps;
  brand: brandInfo;
  likes_count: number;
  sector: string;
  district: string;
  similar_products: similarDataProps[];
}

export interface GetPurchasedHistoryProps {
  message: string;
  status: number;
  data: {
    data: GetProductDetailsDataProps[];
    totalRecords: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface GetProductDetailsDataProps {
  id: number;
  user_id: number;
  category_id: number;
  sub_category_id: number;
  title: string;
  address: string;
  city: string;
  description: string;
  actual_price: number;
  sale_price: number;
  payment_terms: string;
  deposit_percentage: number;
  status: string;
  image: string;
  created_at: string;
  updated_at: string;
  location: string;
  latitude: string;
  longitude: string;
  images: productImagesProps[];
  category: CategoriesDataProps;
  sub_category: SubCategoriesDataProps;
  is_like: boolean;
  order: {
    id: number;
    item_id: number;
    transaction_type: string;
  }[];
  is_mover_booked: number;
  user: UserData;
}

export interface productImagesProps {
  id: number;
  user_id: number;
  item_id: number;
  image: string;
  created_at: string;
  updated_at: string;
}

export type CategoriesDataProps = {
  created_at: string;
  icon: string;
  id: number;
  parent_id: string;
  updated_at: string;
  name: string;
  title: string;
  key: string;
};

export type SubCategoriesDataProps = {
  created_at: string;
  icon: string;
  id: number;
  name: string;
  parent_id: string;
  updated_at: string;
  title: string;
  key: string;
};

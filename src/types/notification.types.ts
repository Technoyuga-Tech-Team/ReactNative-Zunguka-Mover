import { LoadingState } from "./global.types";
import { UserData } from "./user.types";

export interface NotificationStatusState {
  loading: LoadingState;
}

export interface GetNotificationDataProps {
  message: string;
  status: number;
  data: GetNotificationData;
}

export interface GetNotificationData {
  data: GetNotificationDataList[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
}

export interface GetNotificationDataList {
  id: number;
  user_id: number;
  type: string;
  buyer_seller_id: number;
  mover_id: number;
  reference_id: number;
  order_id: number;
  item_id: number;
  chat_id: number;
  message: string;
  is_read: number;
  status: number;
  created_at: string;
  updated_at: string;
  user: UserData;
  buyer_seller: UserData;
  rating_id: number;
  // "mover":null,
  // "item":{
  //    "id":1,
  //    "user_id":49,
  //    "category_id":1,
  //    "sub_category_id":2,
  //    "title":"mobile",
  //    "address":"test",
  //    "city":"surat",
  //    "description":"asbdvanbsd",
  //    "actual_price":100,
  //    "sale_price":50,
  //    "payment_terms":"full_payment",
  //    "deposit_percentage":0,
  //    "status":"Active",
  //    "image":null,
  //    "created_at":"2023-10-25T04:10:21.000000Z",
  //    "updated_at":"2023-10-25T04:10:21.000000Z",
  //    "location":null,
  //    "latitude":null,
  //    "longitude":null,
  //    "is_like":false
  // },
  // "order":null
}

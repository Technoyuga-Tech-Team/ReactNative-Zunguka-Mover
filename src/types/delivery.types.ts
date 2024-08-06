export interface DeliveryFormProps {
  itmeName: string;
  size: string;
  pickupAddress: string;
  deliveryAddress: string;
  receiverName: string;
  date: string;
  time: string;
}

export interface DeliveryDetailsResponse {
  status: number;
  data: DeliveryDetailsData;
  message: string;
}

export interface DeliveryDetailsData {
  id: number;
  mover_id: number;
  item_name: string;
  receiver_name: string;
  item_size: string;
  pickup_point_address: string;
  pickup_point_lat: string;
  pickup_point_lng: string;
  delivery_point_address: string;
  delivery_point_lat: string;
  delivery_point_lng: string;
  package_delivery_date: string;
  package_delivery_time: string;
  price: number;
  status: string;
  createdAt: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  phone_number: string;
  vehicle_type: string;
  city: string;
  rate: number;
  otp: number;
  avg_rate: number;
}

import { LoadingState } from "./global.types";

export enum UserRoleType {
  BUYER_SELLER = 0,
  MOVER = 1,
}

export type UserData = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number: string;
  social_type: string;
  social_id: string;
  is_social: number;
  email_verified_at: string;
  profile_image: string;
  otp: string;
  otp_expired_at: string;
  is_verified: number;
  card_number: string;
  card_type: string;
  card_cvv: string;
  card_expiry: string;
  card_holder_name: string;
  is_card: number;
  push_notification: number;
  new_message: number;
  new_items: number;
  purchase_item: number;
  created_at: string;
  updated_at: string;
  acc_verified: number;
  iso: string;
  type: string;
  is_profile_completed: number;
  is_mover_setup_profile_done: number;
  step: number;
  mover_setup_step: number;
  profile_percentage: number;
  address: string;
  insurance_number: string;
  insurance_copies: [];
  address_proofs: [];
  license_number: string;
  license_copies: [];
  vehicle_type: string;
  city: string;
  state: string;
  rate: number;
  avg_rate: number;
  total_user_rate: number;
  device_type: string;
  device_token: string;
  fcm_token: string;
  customer_id: string;
  latitude: string;
  longitude: string;
  is_blocked_by_admin: number;
  online: number;
  stripe_account_id: string;
  apple_secret: string;
  stripe_enabled: number;
  house_images: string;
  street_address_1: string;
  street_address_2: string;
  country: string;
  zip_code: string;
  kyc_documents: string;
  id_type: null;
  is_kyc_verified_by_admin: number;
  selfie_image: string;
};

export interface getUserData {
  message: string;
  status: number;
  user: UserData;
}

export interface GetUserDataProps {
  data: getUserData;
}

export interface UserProfileState {
  loading: LoadingState;
}

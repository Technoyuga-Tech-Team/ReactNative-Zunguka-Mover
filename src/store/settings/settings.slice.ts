import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingsStateProps } from "../../types/settings.types";
import { UserData } from "../../types/user.types";

const initialState: SettingsStateProps = {
  isDark: true,
  userData: {
    id: 0,
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone_number: "",
    social_type: "",
    social_id: "",
    is_social: 0,
    email_verified_at: "",
    profile_image: "",
    otp: "",
    otp_expired_at: "",
    is_verified: 0,
    card_number: "",
    card_type: "",
    card_cvv: "",
    card_expiry: "",
    card_holder_name: "",
    is_card: 0,
    push_notification: 0,
    new_message: 0,
    new_items: 0,
    purchase_item: 0,
    created_at: "",
    updated_at: "",
    acc_verified: 0,
    iso: "",
    type: "",
    is_profile_completed: 0,
    step: 0,
    profile_percentage: 0,
    address: "",
    insurance_number: "",
    insurance_copies: "",
    address_proofs: "",
    license_number: "",
    license_copies: "",
    vehicle_type: "",
    city: "",
    rate: 0,
    avg_rate: 0,
    total_user_rate: 0,
    device_type: "",
    device_token: "",
    fcm_token: "",
    customer_id: "",
    latitude: "",
    longitude: "",
    is_blocked_by_admin: 0,
    online: 0,
    stripe_account_id: "",
    apple_secret: "",
    stripe_enabled: 0,
    house_images: "",
    street_address_1: "",
    street_address_2: "",
    country: "",
    zip_code: "",
    kyc_documents: "",
    id_type: null,
    is_kyc_verified_by_admin: 0,
    selfie_image: "",
    is_selfie_uploaded: 0,
  },
  errorFromSocial: false,
  address: "",
};

const settings = createSlice({
  name: "settings",
  initialState,
  reducers: {
    isDarkMode: (
      state: SettingsStateProps,
      { payload }: PayloadAction<boolean>
    ) => {
      state.isDark = payload;
    },
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
    },
    setErrorFromSocial: (state, action: PayloadAction<boolean>) => {
      state.errorFromSocial = action.payload;
    },
    saveAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
  },
});

export const { isDarkMode, setUserData, setErrorFromSocial, saveAddress } =
  settings.actions;

export default settings.reducer;

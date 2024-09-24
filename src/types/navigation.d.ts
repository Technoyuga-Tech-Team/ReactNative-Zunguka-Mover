import { RouteProp } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

export type AppRoutes = {
  Onboard: undefined;
  Splash: undefined;
  Authentication: undefined;
  Dashboard: undefined;
  AddKyc: undefined;
  Home: undefined;
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  ResetPassword: { phone?: string; email?: string };
  SavedItems: undefined;
  PurchasedHistory: undefined;
  Messaging: undefined;
  Chatroom: { receiver_id: string; product_id: string };
  ProductDetails: undefined;
  TransactionHistory: undefined;
  TransactionDetails: undefined;
  NotificationSetting: undefined;
  ProductFilter: undefined;
  Notification: undefined;
  AllDeals: undefined;
  AllCategories: undefined;
  ModeOfDelivery: undefined;
  ModeOfPayment: undefined;
  CardDetails: undefined;
  AddCard: undefined;
  DeliveryDetails: undefined;
  DeliveryCompleteAndRateDriver: undefined;
  SelectMover: undefined;
  PackageInfo: undefined;
  ConfirmPackageInfo: undefined;
  MoverHistory: undefined;
  ConfirmSelfPickup: undefined;
  CategoryProduct: undefined;
  RequestToMover: undefined;
  PaymentToMover: undefined;
  VisitProfile: { is_rating: number };
  JobHistory: undefined;
  TakeSelfie: { fromflow?: boolean };
  PayoutHistory: undefined;
  ReviewAndRating: undefined;
  Alert: undefined;
  AdminVerification: undefined;
  Withdraw: { earning: string };
  PackageDetails: {
    package_details_id: string;
    pickupLatLng: { lat: number; lng: number };
    destinationLatLng: { lat: number; lng: number };
    product_id?: string;
    canStartJob: boolean;
    isJobStarted: boolean;
    canEndJob: boolean;
    buyerSellerId: string;
    seller_id: string;
  };
  DeliveryDetails1: {
    package_details_id: string;
    from?: string;
    fromHome?: string;
  };
};

export type MoverRoute = {
  MoverAuthentication: undefined;
  MoverDashboard: undefined;
  Home: undefined;
  Earnings: undefined;
  ReviewAndRating: undefined;
  PackageDetails: {
    package_details_id: string;
    pickupLatLng: { lat: number; lng: number };
    destinationLatLng: { lat: number; lng: number };
    canStartJob: boolean;
    product_id?: string;
    isJobStarted: boolean;
    canEndJob: boolean;
    buyerSellerId: string;
    seller_id: string;
  };
  DeliveryDetails: undefined;
  DeliveryDetails1: {
    package_details_id: string;
    from?: string;
    fromHome?: string;
  };
  Withdraw: { earning: string };
  PayoutHistory: undefined;
  Chatroom: { receiver_id: string; product_id: string };
  Inbox: undefined;
  Notification: undefined;
};

export type MoverAuthenticationRoutes = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  EnterOTP: { phone?: string; email?: string; fromForgotPassword?: boolean };
  ChangePassword: undefined;
  Mainstack: undefined;
  Dashboard: undefined;
  Authentication: undefined;
  SetupProfile1: undefined;
  SetupProfile2: undefined;
  SetupProfile3: undefined;
  SetupProfile4: undefined;
  SetupProfile5: undefined;
  SetupProfile6: undefined;
  SetupProfile7: undefined;
  ResetPassword: { phone?: string; email?: string };
  ChangePassword: undefined;
  PackageInfo: undefined;
  ConfirmPackageInfo: undefined;
};

export type AuthenticationRoutes = {
  Onboard: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  EnterOTP: {
    phone?: string;
    email?: string;
    type: "forget_password" | "otp_verification";
  };
  ChangePassword: undefined;
  SetupProfile1: undefined;
  SetupProfile2: undefined;
  SetupProfile3: undefined;
  SetupProfile4: undefined;
  SetupProfile5: undefined;
  SetupProfile6: undefined;
  SetupProfile7: undefined;
  Mainstack: undefined;
  Dashboard: undefined;
  Authentication: undefined;
  AddKyc: undefined;
  ResetPassword: { phone?: string; email?: string };
  ChangePassword: undefined;
  TakeSelfie: { fromflow?: boolean };
};

export type BottomRoutes = {
  Home: undefined;
  Earnings: undefined;
  Package: undefined;
  Alert: undefined;
  Profile: undefined;
};

export type MoverBottomRoutes = {
  HomeMover: undefined;
  Earnings: undefined;
  Package: undefined;
  Notification: undefined;
  Profile: undefined;
};

export type TopRoutes = {
  OpenItems: undefined;
  ClosedItems: undefined;
  ProductDetails: { itemId: number };
};

export type TopPackageRoutes = {
  UpcomingPackages: undefined;
  OngoingPackages: undefined;
  CompletedPackages: undefined;
  ProductDetails: { itemId: number };
};

export type HomeRoutes = {
  MoverAuthentication: undefined;
  MoverDashboard: undefined;
  HomeMover: undefined;
  Earnings: undefined;
  ReviewAndRating: undefined;
  PackageDetails: {
    package_details_id: string;
    pickupLatLng: { lat: number; lng: number };
    destinationLatLng: { lat: number; lng: number };
    product_id?: string;
    canStartJob: boolean;
    isJobStarted: boolean;
    canEndJob: boolean;
    buyerSellerId: string;
    seller_id: string;
  };
  DeliveryDetails: undefined;
  DeliveryDetails1: { package_details_id: string; from?: string };
  Withdraw: { earning: string };
  PayoutHistory: undefined;
  Chatroom: { receiver_id: string; product_id: string };
  CompletedPackages: undefined;
  OngoingPackages: undefined;
  UpcomingPackages: undefined;
  Inbox: undefined;
  Profile: undefined;
  Notification: undefined;
  DeliveryCompleteAndRateDriver: undefined;
  RequestToMover: undefined;
  Messaging: undefined;
  TransactionHistory: undefined;
  EditProfile: undefined;
  AdminVerification: undefined;
};

export type SellAnItemRoutes = {
  SellAnItem: undefined;
  ListAnother: {
    productImage: string;
    description: string;
    productCategory: string;
    address: string;
    sellingPrice: string;
  };
};

export type SearchRoutes = {
  Search1: { userType: string; category_ids?: number };
  Search2: { searchVal: string; userType: string };
  ProductDetails: { itemId: number };
  ProductFilter: {
    onGoBack: ({
      category_ids: string,
      min_price: number,
      max_price: number,
      payment_terms: string,
      city: string,
      state: string,
      sort: string,
    }) => void;
  };
  DeliveryDetails: undefined;
};

export interface MainNavigationProps<RouteName extends keyof AppRoutes> {
  navigation: NativeStackNavigationProp<AppRoutes, "Splash">;
  route: RouteProp<AppRoutes, RouteName>;
}

export interface AuthNavigationProps<
  RouteName extends keyof AuthenticationRoutes
> {
  navigation: NativeStackNavigationProp<AuthenticationRoutes, RouteName>;
  route: RouteProp<AuthenticationRoutes, RouteName>;
}

export interface HomeNavigationProps<RouteName extends keyof HomeRoutes> {
  navigation: NativeStackNavigationProp<HomeRoutes, RouteName>;
  route: RouteProp<HomeRoutes, RouteName>;
}
export interface MoverHomeNavigationProps<RouteName extends keyof MoverRoute> {
  navigation: NativeStackNavigationProp<MoverRoute, RouteName>;
  route: RouteProp<MoverRoute, RouteName>;
}
export interface SellAnItemNavigationProps<
  RouteName extends keyof SellAnItemRoutes
> {
  navigation: NativeStackNavigationProp<SellAnItemRoutes, RouteName>;
  route: RouteProp<SellAnItemRoutes, RouteName>;
}

export interface SearchNavigationProps<RouteName extends keyof SearchRoutes> {
  navigation: NativeStackNavigationProp<SearchRoutes, RouteName>;
  route: RouteProp<SearchRoutes, RouteName>;
}
export interface MyFrontStoreNavigationProps<
  RouteName extends keyof TopRoutes
> {
  navigation: NativeStackNavigationProp<TopRoutes, RouteName>;
  route: RouteProp<TopRoutes, RouteName>;
}

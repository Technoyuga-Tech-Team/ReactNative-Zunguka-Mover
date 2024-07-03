import {RouteProp} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

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
  ResetPassword: undefined;
  SavedItems: undefined;
  PurchasedHistory: undefined;
  Messaging: undefined;
  Chatroom: undefined;
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
  DeliveryDetails1: undefined;
  MoverHistory: undefined;
  ConfirmSelfPickup: undefined;
  CategoryProduct: undefined;
  RequestToMover: undefined;
  PaymentToMover: undefined;
  VisitProfile: {is_rating: number};
  JobHistory: undefined;
};

export type MoverRoute = {
  MoverAuthentication: undefined;
  MoverDashboard: undefined;
  HomeMover: undefined;
  Earnings: undefined;
  ReviewAndRating: undefined;
  PackageDetails: {
    package_details_id: string;
    pickupLatLng: {lat: number; lng: number};
    destinationLatLng: {lat: number; lng: number};
    canStartJob: boolean;
    canEndJob: boolean;
    buyerSellerId: string;
  };
  DeliveryDetails: undefined;
  DeliveryDetails1: {package_details_id: string; from?: string};
  Withdraw: {earning: string};
  PayoutHistory: undefined;
  Chatroom: {receiver_id: string};
};

export type MoverAuthenticationRoutes = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  EnterOTP: {phone?: string; email?: string; fromForgotPassword?: boolean};
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
  ResetPassword: {phone?: string; email?: string};
  ChangePassword: undefined;
  PackageInfo: undefined;
  ConfirmPackageInfo: undefined;
};

export type AuthenticationRoutes = {
  Onboard: undefined;
  SelectRoll: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  EnterOTP: {
    phone?: string;
    email?: string;
    type: 'forget_password' | 'otp_verification';
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
  ResetPassword: {phone?: string; email?: string};
  ChangePassword: undefined;
};

export type BottomRoutes = {
  Home: undefined;
  Earnings: undefined;
  Package: undefined;
  Inbox: undefined;
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
  ProductDetails: {itemId: number};
};

export type TopPackageRoutes = {
  UpcomingPackages: undefined;
  OngoingPackages: undefined;
  CompletedPackages: undefined;
  ProductDetails: {itemId: number};
};

export type HomeRoutes = {
  Home: undefined;
  HomeMover: undefined;
  Search: {
    screen: Search1;
    params: {userType: string; category_ids?: number};
  };
  Search1: {userType: string; category_ids?: number};
  Add: undefined;
  Storefront: undefined;
  Profile: undefined;
  EditProfile: undefined;
  VisitProfile: {item: any};
  SavedItems: undefined;
  PurchasedHistory: undefined;
  Messaging: undefined;
  Chatroom: {receiver_id: number};
  ChangePassword: undefined;
  ProductDetails: {itemId: number};
  TransactionHistory: undefined;
  TransactionDetails: {item: GetProductDetailsDataProps};
  NotificationSetting: undefined;
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
  Notification: undefined;
  AllDeals: undefined;
  ModeOfPayment: undefined;
  CardDetails: {from: string; package_details_id?: string};
  AddCard: undefined;
  ModeOfDelivery: undefined;
  DeliveryDetails: undefined;
  DeliveryCompleteAndRateDriver: {
    user_id: string;
    package_details_id: string;
  };
  AllCategories: undefined;
  UpcomingPackages: undefined;
  OngoingPackages: undefined;
  CompletedPackages: undefined;
  ReviewAndRating: undefined;
  PackageDetails: undefined;
  DeliveryDetails1: {package_details_id: string; from?: string};
  SelectMover: undefined;
  MoverHistory: undefined;
  Withdraw: {earning: string};
  Earnings: undefined;
  ConfirmSelfPickup: undefined;
  RequestToMover: undefined;
  JobHistory: undefined;
  PaymentToMover: {
    pickup_Address: string;
    delivery_Address: string;
    price: string;
    item_name: string;
    package_details_id: string;
  };
  CategoryProduct: {
    userType: string;
    category_ids?: number;
    categoryName?: string;
  };
  PackageInfo: {mover_id?: number} | undefined;
  ConfirmPackageInfo: {
    itmeName: string;
    size: string;
    pickupAddress: string;
    deliveryAddress: string;
    receiverName: string;
    date: string;
    time: string;
    pickupLatlng: {lat: number; lng: number};
    deliveryLatlng: {lat: number; lng: number};
  };
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
  Search1: {userType: string; category_ids?: number};
  Search2: {searchVal: string; userType: string};
  ProductDetails: {itemId: number};
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
  navigation: NativeStackNavigationProp<AppRoutes, 'Splash'>;
  route: RouteProp<AppRoutes, RouteName>;
}

export interface AuthNavigationProps<
  RouteName extends keyof AuthenticationRoutes,
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
  RouteName extends keyof SellAnItemRoutes,
> {
  navigation: NativeStackNavigationProp<SellAnItemRoutes, RouteName>;
  route: RouteProp<SellAnItemRoutes, RouteName>;
}

export interface SearchNavigationProps<RouteName extends keyof SearchRoutes> {
  navigation: NativeStackNavigationProp<SearchRoutes, RouteName>;
  route: RouteProp<SearchRoutes, RouteName>;
}
export interface MyFrontStoreNavigationProps<
  RouteName extends keyof TopRoutes,
> {
  navigation: NativeStackNavigationProp<TopRoutes, RouteName>;
  route: RouteProp<TopRoutes, RouteName>;
}

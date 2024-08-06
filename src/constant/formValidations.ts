// @ts-nocheck

import { CountryCode } from "react-native-country-picker-modal";
import * as Yup from "yup";
import "yup-phone-lite";
import valid from "card-validator";

export const NO_SPECIAL_CHAR = /^(\d|\w)+$/;

const Password_error =
  "Password must be a combination of capital letters, small letters, number and a non alphanumeric character";

const no_specialChar_space_allow =
  "Special characters and space are not allowed.";

// Login screen
export const LoginScreenSchema = (countryCode: CountryCode) => {
  return Yup.object().shape({
    phoneNumber: Yup.string()
      .trim()
      .phone(countryCode, "Please enter a valid phone number")
      .required("Phone is required"),
    password: Yup.string().trim().required("Password is required"),
  });
};

// Signup screen

export const SignupScreenSchema = (countryCode: CountryCode) => {
  return Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    username: Yup.string().trim().required("Username is required"),
    email: Yup.string()
      .trim()
      .email("Invalid email address")
      .required("Email is required"),

    phoneNumber: Yup.string()
      .trim()
      .phone(countryCode, "Please enter a valid phone number")
      .required("Phone is required"),

    createPassword: Yup.string()
      .trim()
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        Password_error
      )
      .required("Create password is required"),
    confirmPassword: Yup.string()
      .trim()
      .required("Confirm password is required")
      .oneOf(
        [Yup.ref("createPassword")],
        "Confirm password must match with create password"
      ),
  });
};

export const EditProfileScreenSchema = (countryCode: CountryCode) => {
  return Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .trim()
      .email("Invalid email address")
      .required("Email is required"),

    phoneNumber: Yup.string()
      .trim()
      .phone(countryCode, "Please enter a valid phone number")
      .required("Phone is required"),
  });
};

// OTP screen
export const OTPScreenSchema = Yup.object().shape({
  otp: Yup.string()
    .trim()
    .test("len", "Must be 6 characters", (val) => val?.length == 6)
    .required("OTP is required"),
});

export const ForgotPasswordScreenSchema = (countryCode: CountryCode) => {
  return Yup.object().shape({
    phoneNumber: Yup.string()
      .trim()
      .phone(countryCode, "Please enter a valid phone number")
      .required("Phone is required"),
  });
};

// ResetPassword screen
export const ResetPasswordScreenSchema = Yup.object().shape({
  password: Yup.string()
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      Password_error
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .trim()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Confirm password must match with Password"),
});

// ChangePassword screen
export const ChangePasswordScreenSchema = Yup.object().shape({
  currentPassword: Yup.string().trim().required("Current password is required"),
  password: Yup.string()
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      Password_error
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .trim()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Confirm password must match with Password"),
});

// Delivery form

export const DeliveryScreenSchema = Yup.object().shape({
  itmeName: Yup.string().trim().required("Item name is required"),
  pickupAddress: Yup.string().trim().required("Pickup address is required"),
  deliveryAddress: Yup.string().trim().required("Delivery address is required"),
  receiverName: Yup.string().trim().required("Receiver name is required"),
  date: Yup.string().trim().required("Date is required"),
  time: Yup.string().trim().required("Time is required"),
});

export const isRequiredFields = (val: string) => {
  if (!val) {
    return false;
  }
  return true;
};

// add card Form

export const AddCardScreenSchema = Yup.object().shape({
  cardName: Yup.string().trim().required("Name on card is required"),
  cardNumber: Yup.string()
    .trim()
    .test(
      "test-number", // this is used internally by yup
      "Card number is invalid", //validation message
      (value) => valid.number(value).isValid
    ) // return true false based on validation
    .required("Card number is required"),
  expiryDate: Yup.string()
    .trim()
    .test(
      "test-credit-card-expiration-date",
      "Invalid Expiration Date has past",
      (expirationDate) => {
        if (!expirationDate) {
          return false;
        }

        const today = new Date();
        const monthToday = today.getMonth() + 1;
        const yearToday = today.getFullYear().toString().substr(-2);

        const [expMonth, expYear] = expirationDate.split("/");

        if (Number(expYear) < Number(yearToday)) {
          return false;
        } else if (
          Number(expMonth) < monthToday &&
          Number(expYear) <= Number(yearToday)
        ) {
          return false;
        }

        return true;
      }
    )
    .test(
      "test-credit-card-expiration-date",
      "Invalid Month",
      (expirationDate) => {
        if (!expirationDate) {
          return false;
        }
        const today = new Date().getFullYear().toString().substr(-2);

        const [expMonth] = expirationDate.split("/");

        if (Number(expMonth) > 12) {
          return false;
        }

        return true;
      }
    )
    .matches(/([0-9]{2})\/([0-9]{2})/, "Not a valid expiration date. ex: MM/YY")
    .required("Expiration date is required"),
  cvv: Yup.string()
    .trim()
    .required()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(3, "Must be exactly 3 digits")
    .max(4, "Must be exactly 4 digits")
    .required("Cvv is required"),
});

// // Delivery form

export const SetupProfile2ScreenSchema = Yup.object().shape({
  address: Yup.string().trim().required("Address is required"),
});
export const SetupProfile3ScreenSchema = Yup.object().shape({
  license: Yup.string()
    .trim()
    .required("License is required")
    .test("noSpecialChars", no_specialChar_space_allow, (value) =>
      NO_SPECIAL_CHAR.test(value)
    ),
});
export const SetupProfile4ScreenSchema = Yup.object().shape({
  insurance: Yup.string()
    .trim()
    .required("Insurance is required")
    .test("noSpecialChars", no_specialChar_space_allow, (value) =>
      NO_SPECIAL_CHAR.test(value)
    ),
});
export const SetupProfile7ScreenSchema = Yup.object().shape({
  rate: Yup.number()
    .required("Rate is required")
    .moreThan(0, "Rate should be greter then 0")
    .test("noSpecialChars", no_specialChar_space_allow, (value) =>
      NO_SPECIAL_CHAR.test(value)
    ),
});

// Add Address
export const AddAddressScreenSchema = (gpsAddressHave: number) => {
  return Yup.object().shape({
    gpsAddress: Yup.string().required("Address is required"),
    streetAddress: Yup.string().required("StreetAddress is required"),
    streetAddress1: Yup.string().required("StreetAddress1 is required"),
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
    zipcode: Yup.string().required("Zipcode is required"),
  });
};

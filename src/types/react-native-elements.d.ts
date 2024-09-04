// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FullTheme } from "react-native-elements";

type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> };

declare module "react-native-elements/dist/config/colors" {
  export interface Colors {
    primary: string;
    primaryVibrant: string;
    transparent: string;
    background: string;
    textColor: string;
    buttonText: string;
    borderButtonColor: string;
    textPrimary: string;
    textSecondary: string;
    primaryText: string;
    secondaryText: string;
    iconColor: string;
    primaryLight: string;
    lightGrey: string;
    pinkDark: string;
    overlay: string;
    primaryLightest: string;
    purple: string;
    border: string;
    aqua: string;
    lightBg: string;
    unselectedIconColor: string;
    red: string;
    grey11: string;
    yellowStar: string;
    golden: string;
    blackTrans: string;
    primaryLight: string;
    primaryLightest: string;
    greyed2Color: string;
    greyed: string;
  }
}

declare module "react-native-elements" {
  export interface Sizing {
    fs10: number;
    fs11: number;
    fs12: number;
    fs13: number;
    fs14: number;
    fs15: number;
    fs16: number;
    fs17: number;
    fs18: number;
    fs19: number;
    fs20: number;
    fs21: number;
    fs22: number;
    fs23: number;
    fs24: number;
    fs25: number;
    fs26: number;
    fs27: number;
    fs28: number;
    fs29: number;
    fs30: number;
  }

  export interface FontFamily {
    light: string;
    regular: string;
    medium: string;
    bold: string;
  }

  export interface FullTheme {
    spacing: Sizing;
    borderRadii: Sizing;
    fontSize: Sizing;
    fontFamily: FontFamily;
  }
}

import { CommonActions } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StatusBar, Text, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import CustomButton from "../../components/ui/CustomButton";
import ProfileAndName from "../../components/ui/Profile/ProfileAndName";
import ProfileItem from "../../components/ui/Profile/ProfileItem";
import LogoutPopup from "../../components/ui/popups/LogoutPopup";
import CreditcardIcon from "../../components/ui/svg/CreditcardIcon";
import DocslistIcon from "../../components/ui/svg/DocslistIcon";
import InfocircleIcon from "../../components/ui/svg/InfocircleIcon";
import LogoutIcon from "../../components/ui/svg/LogoutIcon";
import MoneybillsIcon from "../../components/ui/svg/MoneybillsIcon";
import ProfileIcon from "../../components/ui/svg/ProfileIcon";
import StarOutlineIcon from "../../components/ui/svg/StarOutlineIcon";
import { SCREEN_WIDTH, USER_DATA, secureStoreKeys } from "../../constant";
import { Route } from "../../constant/navigationConstants";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { selectUserData } from "../../store/settings/settings.selectors";
import { LoadingState, ThemeProps } from "../../types/global.types";
import { HomeNavigationProps } from "../../types/navigation";
import Scale from "../../utils/Scale";
import { setData } from "../../utils/asyncStorage";
import { logout } from "../../store/authentication/authentication.thunks";
import DeleteIcon from "../../components/ui/svg/DeleteIcon";
import ChatIcon from "../../components/ui/svg/ChatIcon";
import { deleteAccount } from "../../store/userprofile/userprofile.thunk";
import { setUserData } from "../../store/settings/settings.slice";
import { selectUserProfileLoading } from "../../store/userprofile/userprofile.selectors";
import ContactUsIcon from "../../components/ui/svg/ContactUsIcon";

const Profile: React.FC<HomeNavigationProps<Route.navProfile>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const userData = useSelector(selectUserData);
  const userLoading = useSelector(selectUserProfileLoading);

  console.log("userData", userData);

  const [visible, setVisible] = useState(false);
  const [title1, setTitle1] = useState("");
  const [title2, setTitle2] = useState("");
  const [title3, setTitle3] = useState("");

  const [popupType, setPopupType] = useState(1);

  const [profilePicture, setProfilePicture] = useState<string>(
    userData?.profile_image
  );

  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", async () => {
      setProfilePicture(userData?.profile_image);
    });

    return () => {
      unsubscribe();
    };
  }, [userData]);

  const togglePopup = () => {
    setVisible(!visible);
  };
  const onPressLogout = async () => {
    setVisible(false);
    dispatch(logout());
    await setData(secureStoreKeys.JWT_TOKEN, null);
    await setData(USER_DATA, null);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: Route.navAuthentication }],
      })
    );
  };

  const deleteYourAccount = async () => {
    try {
      const result = await dispatch(deleteAccount({}));
      if (deleteAccount.fulfilled.match(result)) {
        if (result.payload?.status === 1) {
          console.log("response deleteAccount - - - ", result.payload);
          setVisible(false);
          await setData(secureStoreKeys.JWT_TOKEN, null);
          await setData(USER_DATA, null);
          // @ts-ignore
          dispatch(setUserData({}));
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: Route.navAuthentication }],
            })
          );
        }
      } else {
        console.log("errror deleteAccount --->", result.payload);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const onPressLogoutPopup = () => {
    setPopupType(1);
    setTitle1("Log Out?");
    setTitle2("Are you sure you want to log out from Zunguka?");
    setTitle3("Yes, Log Out");
    setVisible(true);
  };
  const onPressDeleteAccount = () => {
    setPopupType(0);

    setTitle1("Delete Account?");
    setTitle2("Are you sure you want to delete this account?");
    setTitle3("Yes, Delete");
    setVisible(true);
  };
  const onPressMyProfile = () => {
    navigation.navigate(Route.navEditProfile);
  };
  const onPressMessages = () => {
    navigation.navigate(Route.navMessaging);
  };
  const onPressTransactionHistroy = () => {
    navigation.navigate(Route.navTransactionHistory);
  };

  const onPressReviewsAndRating = () => {
    navigation.navigate(Route.navReviewAndRating);
  };

  const onPressContactUs = () => {
    navigation.navigate(Route.navContactUs);
  };

  const Profile = profilePicture;
  return (
    <View style={style.container}>
      <StatusBar
        backgroundColor={theme.colors?.white}
        barStyle={"dark-content"}
      />
      <Text style={style.txtProfile}>Profile</Text>
      <View style={style.profileCont}>
        <ProfileAndName
          name={`${userData?.first_name} ${
            userData?.last_name !== null ? userData?.last_name : ""
          }`}
          email={userData?.email}
          profileImage={Profile}
        />
      </View>
      <KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={style.scrollCont}
      >
        <ProfileItem
          name="My Profile"
          icon={<ProfileIcon color={theme.colors?.primary} />}
          onPress={onPressMyProfile}
        />
        <ProfileItem
          name="Messeges"
          icon={<ChatIcon color={theme.colors?.primary} />}
          onPress={onPressMessages}
        />
        {/* <ProfileItem
          name="Card Details"
          icon={<CreditcardIcon color={theme.colors?.primary} />}
          onPress={onPressCardDetails}
        /> */}
        <ProfileItem
          name="Reviews and Rating"
          icon={
            <StarOutlineIcon
              color={theme.colors?.primary}
              height={22}
              width={22}
            />
          }
          onPress={onPressReviewsAndRating}
        />
        <ProfileItem
          name="Transaction History"
          icon={<MoneybillsIcon color={theme.colors?.primary} />}
          onPress={onPressTransactionHistroy}
        />
        <ProfileItem
          name="About Us"
          icon={<InfocircleIcon color={theme.colors?.primary} />}
        />
        <ProfileItem
          name="Terms and Conditions"
          icon={<DocslistIcon color={theme.colors?.primary} />}
        />
        <ProfileItem
          name="Contact Us"
          icon={<ContactUsIcon color={theme.colors?.primary} />}
          onPress={onPressContactUs}
        />
      </KeyboardAwareScrollView>
      <View
        style={{
          marginHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 10,
        }}
      >
        <CustomButton
          onPress={onPressDeleteAccount}
          title={"Delete Account"}
          buttonWidth="half"
          width={(SCREEN_WIDTH - 50) / 2}
          variant="secondary"
          type="outline"
          borderColor={theme?.colors?.red}
          titleStyle={style.txtTitleStyle}
          icon={
            <DeleteIcon
              height={18}
              width={18}
              color={theme.colors?.red}
              style={{ marginRight: 5 }}
            />
          }
        />
        <CustomButton
          onPress={onPressLogoutPopup}
          title={"Logout"}
          buttonWidth="half"
          width={(SCREEN_WIDTH - 50) / 2}
          variant="secondary"
          type="outline"
          borderColor={theme?.colors?.red}
          titleStyle={style.txtTitleStyle}
          icon={
            <LogoutIcon color={theme.colors?.red} style={{ marginRight: 5 }} />
          }
        />

        {/* <CustomButton
          onPress={onPressLogoutPopup}
          title={"Logout"}
          buttonWidth="full"
          type="clear"
          icon={
            <LogoutIcon color={theme.colors?.red} style={{ marginRight: 5 }} />
          }
          containerStyle={style.btnLogout}
          buttonStyle={style.btnLogout1}
          titleStyle={style.txtTitleStyle}
        /> */}
      </View>
      <LogoutPopup
        title1={title1}
        title2={title2}
        title3={title3}
        visiblePopup={visible}
        loading={userLoading === LoadingState.CREATE}
        togglePopup={togglePopup}
        onPressLogout={() => {
          if (popupType == 1) {
            onPressLogout();
          } else {
            deleteYourAccount();
          }
        }}
      />
    </View>
  );
};

export default Profile;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.background,
    paddingTop: props.insets.top,
    paddingBottom: props.insets.bottom + 80,
  },
  scrollCont: {
    flexGrow: 1,
  },
  profileCont: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  btnLogout: {
    backgroundColor: theme.colors?.white,
    width: "100%",
    height: Scale(56),
    borderRadius: Scale(56 / 2),
    borderColor: theme.colors?.red,
    borderWidth: 1,
  },
  btnLogout1: {
    width: "100%",
    height: Scale(56),
    borderRadius: Scale(56 / 2),
    alignItems: "center",
    justifyContent: "center",
  },
  txtTitleStyle: {
    fontSize: theme.fontSize?.fs15,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.red,
  },
  bottomButton: {
    marginHorizontal: 20,
    position: "absolute",
    alignSelf: "center",
    bottom: 10,
    width: SCREEN_WIDTH - 40,
  },
  txtProfile: {
    fontSize: theme.fontSize?.fs20,
    fontFamily: theme.fontFamily?.bold,
    color: theme.colors?.black,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 20,
  },
}));

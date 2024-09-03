import { CommonActions } from "@react-navigation/native";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { KeyboardAvoidingView, Text, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import PrevNextCont from "../../../components/PrevNextCont";
import SetupProfileHeader from "../../../components/SetupProfileHeader";
import { CustomTxtInput } from "../../../components/ui/CustomTextInput";
import Loading from "../../../components/ui/Loading";
import { SetupProfile7ScreenSchema } from "../../../constant/formValidations";
import { Route } from "../../../constant/navigationConstants";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useMeQuery } from "../../../hooks/useMeQuery";
import { selectUserProfileLoading } from "../../../store/userprofile/userprofile.selectors";
import { userSetupProfile } from "../../../store/userprofile/userprofile.thunk";
import { LoadingState, ThemeProps } from "../../../types/global.types";
import { AuthNavigationProps } from "../../../types/navigation";
import { SetupProfile7FormProps } from "../../../types/setupProfile.types";
import { UserRoleType } from "../../../types/user.types";
import { RWF } from "../../../constant";

const SetupProfile7: React.FC<AuthNavigationProps<Route.navSetupProfile7>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { refetch } = useMeQuery({ enabled: false });

  const loading = useSelector(selectUserProfileLoading);

  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", async () => {
      refetch().then((currentUser) => {
        if (currentUser?.data?.user) {
          setFieldValue("rate", currentUser?.data?.user?.rate);
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onPressPrev = () => {
    navigation.goBack();
  };

  const {
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
    isValid,
    handleSubmit,
    setFieldValue,
  } = useFormik<SetupProfile7FormProps>({
    validationSchema: SetupProfile7ScreenSchema,
    initialValues: { rate: "" },
    onSubmit: async ({ rate }) => {
      const formData = new FormData();

      formData.append("rate", rate);
      formData.append("step", 7);
      formData.append("type", UserRoleType.MOVER);

      const result = await dispatch(
        userSetupProfile({
          formData: formData,
        })
      );
      if (userSetupProfile.fulfilled.match(result)) {
        if (result.payload?.data) {
          if (result.payload?.data?.mover_setup_step == 7) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: Route.navDashboard,
                  },
                ],
              })
            );
          }
        }
      } else {
        console.log("errror userSetupProfile --->", result.payload);
      }
    },
  });

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={style.container}
    >
      {loading === LoadingState.CREATE && <Loading />}
      <SetupProfileHeader title={"Rate"} percent={10} />
      <KeyboardAvoidingView behavior="padding" style={style.innerCont}>
        <CustomTxtInput
          icon={
            <View style={style.rfCont}>
              <Text style={style.txtrf}>{RWF}</Text>
            </View>
          }
          textInputTitle="Rate Per KM"
          placeholder="Enter your rate"
          keyboardType={"number-pad"}
          onChangeText={handleChange("rate")}
          onBlur={handleBlur("rate")}
          value={values.rate}
          error={errors.rate}
          touched={touched.rate}
          returnKeyType="next"
          returnKeyLabel="next"
        />
      </KeyboardAvoidingView>
      <PrevNextCont onPressNext={handleSubmit} onPressPrev={onPressPrev} />
    </KeyboardAwareScrollView>
  );
};

export default SetupProfile7;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flexGrow: 1,
    paddingTop: props.insets.top,
    backgroundColor: theme.colors?.background,
  },
  innerCont: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  txtrf: {
    color: theme.colors?.white,
    fontFamily: theme.fontFamily?.bold,
    fontSize: theme.fontSize?.fs10,
  },
  rfCont: {
    height: 25,
    width: 25,
    borderRadius: 20,
    backgroundColor: theme?.colors?.black,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginRight: 5,
  },
}));

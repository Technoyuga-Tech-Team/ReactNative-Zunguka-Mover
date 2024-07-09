import { useFormik } from "formik";
import React, { useEffect } from "react";
import { View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AuthNavigationProps } from "../../../types/navigation";
import { Route } from "../../../constant/navigationConstants";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useMeQuery } from "../../../hooks/useMeQuery";
import { useSelector } from "react-redux";
import { selectUserProfileLoading } from "../../../store/userprofile/userprofile.selectors";
import { SetupProfile7FormProps } from "../../../types/setupProfile.types";
import { SetupProfile7ScreenSchema } from "../../../constant/formValidations";
import { userSetupProfile } from "../../../store/userprofile/userprofile.thunk";
import { CommonActions } from "@react-navigation/native";
import { LoadingState, ThemeProps } from "../../../types/global.types";
import Loading from "../../../components/ui/Loading";
import SetupProfileHeader from "../../../components/SetupProfileHeader";
import { CustomTxtInput } from "../../../components/ui/CustomTextInput";
import DollerCircleIcon from "../../../components/ui/svg/DollerCircleIcon";
import PrevNextCont from "../../../components/PrevNextCont";
import { UserRoleType } from "../../../types/user.types";

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
          setFieldValue(
            "rate",
            currentUser?.data?.user?.rate as unknown as string
          );
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
      <View style={style.innerCont}>
        <CustomTxtInput
          icon={
            <DollerCircleIcon
              height={20}
              width={20}
              color={theme.colors?.black}
              style={{ marginRight: 5 }}
            />
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
      </View>
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
}));

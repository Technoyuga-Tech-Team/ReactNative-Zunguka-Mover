import { useFormik } from "formik";
import React from "react";
import { TextInput, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import CustomButton from "../components/ui/CustomButton";
import CustomHeader from "../components/ui/CustomHeader";
import { CustomTxtInput } from "../components/ui/CustomTextInput";
import { MAX_CHAR_LENGTH } from "../constant";
import { ContactUsScreenSchema } from "../constant/formValidations";
import { Route } from "../constant/navigationConstants";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { setSuccess } from "../store/global/global.slice";
import { selectUserProfileLoading } from "../store/userprofile/userprofile.selectors";
import { userContactUs } from "../store/userprofile/userprofile.thunk";
import { ContactUsFormProps } from "../types/authentication.types";
import { LoadingState, ThemeProps } from "../types/global.types";
import { HomeNavigationProps } from "../types/navigation";
import Scale from "../utils/Scale";

const ContactUs: React.FC<HomeNavigationProps<Route.navContactUs>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const subjectRef = React.useRef<TextInput>(null);
  const messageRef = React.useRef<TextInput>(null);

  const userLoading = useSelector(selectUserProfileLoading);

  const {
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
    isValid,
    handleSubmit,
    setFieldValue,
  } = useFormik<ContactUsFormProps>({
    validationSchema: ContactUsScreenSchema,
    initialValues: {
      email: "",
      subject: "",
      message: "",
    },
    validateOnChange: true,
    onSubmit: async ({ email, subject, message }) => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("subject", subject);
      formData.append("message", message);
      const result = await dispatch(userContactUs({ formData }));
      if (userContactUs.fulfilled.match(result)) {
        if (result.payload.status === 1) {
          dispatch(setSuccess(result.payload.message));
          setFieldValue("email", "");
          setFieldValue("subject", "");
          setFieldValue("message", "");
          navigation.goBack();
        }
      } else {
        console.log("errror userContactUs --->", result.payload);
      }
    },
  });

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps={"handled"}
      contentContainerStyle={style.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <CustomHeader title="Contact Us" />
      <View style={style.txtInCont}>
        <CustomTxtInput
          // ref={emaiRef}
          placeholder="Email Address"
          returnKeyType="next"
          returnKeyLabel="next"
          keyboardType={"email-address"}
          onChangeText={handleChange("email")}
          onBlur={handleBlur("email")}
          value={values.email}
          error={errors.email}
          touched={touched.email}
          onSubmitEditing={() => subjectRef.current?.focus()}
        />
        <CustomTxtInput
          ref={subjectRef}
          placeholder="Subject"
          returnKeyType="next"
          returnKeyLabel="next"
          keyboardType={"default"}
          maxLength={MAX_CHAR_LENGTH}
          onChangeText={handleChange("subject")}
          onBlur={handleBlur("subject")}
          value={values.subject}
          error={errors.subject}
          touched={touched.subject}
          onSubmitEditing={() => messageRef.current?.focus()}
        />

        <CustomTxtInput
          ref={messageRef}
          placeholder={`Message`}
          returnKeyType="next"
          returnKeyLabel="next"
          keyboardType={"default"}
          textInputStyle={style.txtDesc}
          style={style.textInput}
          multiline={true}
          textAlignVertical="top"
          maxLength={200}
          onChangeText={handleChange("message")}
          onBlur={handleBlur("message")}
          value={values.message}
          error={errors.message}
          touched={touched.message}
          onSubmitEditing={() => {}}
          // extraPeddingLeft={true}
        />
      </View>
      <CustomButton
        onPress={() => handleSubmit()}
        title={"Submit"}
        buttonWidth="full"
        variant="primary"
        type="solid"
        disabled={userLoading === LoadingState.CREATE}
        loading={userLoading === LoadingState.CREATE}
      />
    </KeyboardAwareScrollView>
  );
};

export default ContactUs;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors?.background,
    paddingTop: props.insets.top,
    paddingBottom: props.insets.bottom + 10,
  },
  txtDesc: {
    height: Scale(150),
    // backgroundColor: theme?.colors?.textInputFieldBg,
    paddingHorizontal: 10,
    paddingTop: 3,
    borderRadius: 8,
    // marginHorizontal: 20,
    borderWidth: 1,
    borderColor: theme?.colors?.secondaryText,
  },
  textInput: {
    height: 140,
    width: "100%",
    color: theme.colors?.textPrimary,
    fontFamily: theme.fontFamily?.regular,
    fontSize: theme.fontSize?.fs15,
    lineHeight: 20,
  },
  txtInCont: {
    marginTop: 10,
    marginHorizontal: 20,
    flex: 1,
  },
}));

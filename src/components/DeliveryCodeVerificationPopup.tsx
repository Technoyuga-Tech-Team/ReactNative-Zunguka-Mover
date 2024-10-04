import React, { useEffect } from "react";
import { Keyboard, Modal, Text, TouchableOpacity, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useFormik } from "formik";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { OTPFormProps } from "../types/authentication.types";
import { OTPScreenSchema } from "../constant/formValidations";
import {
  approveRejectMoverRequeste,
  verifyOTPAndEndJob,
} from "../store/MoverBooking/moverBooking.thunk";
import SmoothOtpInput from "./SmoothOtpInput";
import Scale from "../utils/Scale";
import CustomButton from "./ui/CustomButton";
import { ThemeProps } from "../types/global.types";
import { notifyMessage } from "../utils/notifyMessage";

interface DeliveryCodeVerificationPopupProps {
  visiblePopup: boolean;
  togglePopup: () => void;
  onStartJob: () => void;
  goBack?: () => void;
  package_details_id: string;
  isLoading?: boolean;
  jobType: string;
}

const DeliveryCodeVerificationPopup: React.FC<
  DeliveryCodeVerificationPopupProps
> = ({
  visiblePopup,
  togglePopup,
  onStartJob,
  package_details_id,
  isLoading,
  goBack,
  jobType,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyle({ insets });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const {
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
    isValid,
    setFieldValue,
    handleSubmit,
  } = useFormik<OTPFormProps>({
    validationSchema: OTPScreenSchema,
    initialValues: { otp: "" },
    onSubmit: async ({ otp }) => {
      console.log("package_details_id", package_details_id);
      console.log("jobType", jobType);
      if (jobType == "start") {
        try {
          const result = await dispatch(
            approveRejectMoverRequeste({
              package_details_id: Number(package_details_id),
              status: "startjob",
              pickup_otp: otp,
            })
          );
          if (approveRejectMoverRequeste.fulfilled.match(result)) {
            if (result.payload.status == 1) {
              console.log("data Start job --->", result.payload);
              notifyMessage("Job started!");
              onStartJob();
              togglePopup();
              setFieldValue("otp", "");
            }
          } else {
            console.log("errror Start job --->", result.payload);
          }
        } catch (error) {
          console.log("catch err", error);
        }
      } else {
        const result = await dispatch(
          verifyOTPAndEndJob({
            package_details_id,
            otp,
            status: "endjob",
          })
        );
        if (verifyOTPAndEndJob.fulfilled.match(result)) {
          if (result.payload.status == 1) {
            togglePopup();
            goBack && goBack();
          }
        } else {
          console.log("errror verifyOTPAndEndJob --->", result.payload);
        }
      }
    },
  });

  useEffect(() => {
    if (values.otp) {
      if (values.otp.length === 6) {
        Keyboard.dismiss();
        handleSubmit();
      }
    }
  }, [values.otp]);

  return (
    <Modal
      visible={visiblePopup}
      onRequestClose={togglePopup}
      style={style.modalCont}
      transparent={true}
      animationType="slide"
      statusBarTranslucent={true}
    >
      <View style={style.container}>
        <TouchableOpacity
          onPress={togglePopup}
          activeOpacity={1}
          style={{ flex: 0.3 }}
        />
        <View style={style.innerCont}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={{ paddingHorizontal: 20, flex: 1 }}>
              <Text style={style.txtTitle}>
                {jobType == "start"
                  ? "Pickup Code Verification"
                  : "Delivery Code Verification"}
              </Text>
              <Text style={style.txtDesc}>
                Please ask the customer for the 6-digit delivery code and enter
                it below to verify the delivery.
              </Text>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  paddingTop: 20,
                }}
              >
                <SmoothOtpInput
                  animated={false}
                  cellSize={Scale(50)}
                  cellSpacing={10}
                  onChangeText={handleChange("otp")}
                  onTextChange={handleChange("otp")}
                  value={values.otp}
                  error={errors.otp}
                  touched={touched.otp}
                  codeLength={6}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
          <View style={style.bottomView}>
            <CustomButton
              onPress={() => {
                handleSubmit();
              }}
              title={jobType == "start" ? "Start Delivery" : "Confirm Delivery"}
              buttonWidth="full"
              variant="primary"
              type="solid"
              disabled={!isValid || isLoading}
              loading={isLoading}
            />
            <TouchableOpacity
              onPress={togglePopup}
              activeOpacity={0.8}
              style={style.btnCancel}
            >
              <Text style={style.txtBtn}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeliveryCodeVerificationPopup;

const useStyle = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.overlay,
  },
  innerCont: {
    flex: 1,
    backgroundColor: theme.colors?.white,
    borderTopLeftRadius: Scale(24),
    borderTopRightRadius: Scale(24),
  },
  modalCont: {
    backgroundColor: "transparent",
  },
  topCont: {
    height: Scale(35),
    borderTopLeftRadius: Scale(8),
    borderTopRightRadius: Scale(8),
    backgroundColor: theme.colors?.black,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  txtTitle: {
    fontSize: theme.fontSize?.fs17,
    fontFamily: theme.fontFamily?.bold,
    color: theme.colors?.black,
    textAlign: "center",
    marginVertical: 30,
  },
  txtDesc: {
    fontSize: theme.fontSize?.fs13,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    textAlign: "center",
  },
  bottomView: {
    paddingBottom: props.insets.bottom + 10,
  },
  btnCancel: {
    height: Scale(50),
    backgroundColor: theme.colors?.transparent,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  txtBtn: {
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.primary,
  },
}));

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { makeStyles, useTheme } from "react-native-elements";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { ThemeProps } from "../../../types/global.types";
import Scale from "../../../utils/Scale";
import RatingBox from "../../RatingBox";
import { selectMoverInfo } from "../../../store/settings/settings.selectors";
import MoverItem from "../../Mover/MoverItem";
import { CustomTxtInput } from "../CustomTextInput";
import CustomButton from "../CustomButton";

interface RatingPopupProps {
  visiblePopup: boolean;
  togglePopup: () => void;
  isLoading: boolean;
  onPressConfirmSendReview: (rate: number, comment: string) => void;
}

const RatingPopup: React.FC<RatingPopupProps> = ({
  visiblePopup,
  togglePopup,
  onPressConfirmSendReview,
  isLoading,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyle({ insets });
  const { theme } = useTheme();

  const moverItem = useSelector(selectMoverInfo);
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    setCurrentRating(0);
    setComment("");
  }, []);

  const handleRatingChange = (newRating: number) => {
    setCurrentRating(newRating);
  };

  const onChangeComment = (val: string) => {
    setComment(val);
  };

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
          style={{ flex: 0.5 }}
        />
        <KeyboardAwareScrollView contentContainerStyle={style.innerCont}>
          <Text style={style.txtTitle}>Rate the service</Text>
          <Text style={style.txtTitle1}>
            Let us know your feedback about the service of the mover
          </Text>
          {/* {isLoading ? (
            <ActivityIndicator color={theme.colors?.primary} />
          ) : ( */}
          <>{moverItem && <MoverItem item={moverItem} />}</>
          {/* // )} */}
          <RatingBox
            rating={currentRating}
            onRatingChange={handleRatingChange}
          />
          <View style={{ flex: 1 }}>
            <CustomTxtInput
              placeholder="Write your comment"
              returnKeyType="done"
              returnKeyLabel="done"
              keyboardType={"default"}
              textInputStyle={style.txtDesc}
              style={style.textInput}
              multiline={true}
              textAlignVertical="top"
              onChangeText={onChangeComment}
              value={comment}
            />
          </View>
          <View style={{ marginVertical: 10, paddingBottom: insets.bottom }}>
            <CustomButton
              onPress={() => onPressConfirmSendReview(currentRating, comment)}
              title={"Send review"}
              buttonWidth="full"
              variant="primary"
              type="solid"
              disabled={comment == "" || currentRating <= 0 || isLoading}
              loading={isLoading}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
};

export default RatingPopup;

const useStyle = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.overlay,
  },
  innerCont: {
    flexGrow: 1,
    backgroundColor: theme.colors?.white,
    borderTopLeftRadius: Scale(25),
    borderTopRightRadius: Scale(25),
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  modalCont: {
    backgroundColor: "transparent",
  },
  txtTitle: {
    fontSize: theme?.fontSize?.fs17,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.black,
    textAlign: "center",
  },
  txtTitle1: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.secondaryText,
    textAlign: "center",
    lineHeight: 16,
    marginTop: 10,
  },
  txtDesc: {
    height: Scale(123),
    backgroundColor: theme?.colors?.greyed2Color,
    paddingLeft: 10,
    paddingTop: 5,
    borderRadius: 4,
    marginTop: 10,
  },
  textInput: {
    height: Scale(110),
    width: "100%",
    color: theme.colors?.textPrimary,
    fontFamily: theme.fontFamily?.regular,
    fontSize: theme.fontSize?.fs13,
    letterSpacing: -0.08,
  },
}));

import React, { useEffect, useState } from "react";
import { Modal, Text, View } from "react-native";
import CalendarPicker, { ChangedDate } from "react-native-calendar-picker";
import { makeStyles, useTheme } from "react-native-elements";
import Scale from "../../../utils/Scale";
import LeftIcon from "../svg/LeftIcon";
import RightIcon from "../svg/RightIcon";
import { SCREEN_WIDTH } from "../../../constant";
import CustomButton from "../CustomButton";

interface CalenderPopupProps {
  visiblePopup: boolean;
  togglePopup: () => void;
  rangeDate: (startDate: Date, endDate: Date) => void;
}

const CalenderPopup: React.FC<CalenderPopupProps> = ({
  visiblePopup,
  togglePopup,
  rangeDate,
}) => {
  const style = useStyle();
  const { theme } = useTheme();
  const minDate = new Date(2017, 6, 3); // Today
  const maxDate = new Date();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dateSelectionError, setDateSelectionError] = useState<string>("");

  useEffect(() => {
    setDateSelectionError("");
    setStartDate(null);
    setEndDate(null);
  }, []);

  const onDateChange = (date: Date, type: ChangedDate) => {
    if (type === "END_DATE") {
      setDateSelectionError("");
      setEndDate(date);
    } else {
      setDateSelectionError("");
      setStartDate(date);
    }
  };

  const onPressOkay = () => {
    if (startDate == null || endDate == null) {
      setDateSelectionError("please select the start and end date!");
    } else {
      rangeDate(startDate, endDate);
    }
  };

  const onPressCancel = () => {
    setDateSelectionError("");
    setStartDate(null);
    setEndDate(null);
    togglePopup();
  };

  return (
    <Modal
      visible={visiblePopup}
      onRequestClose={togglePopup}
      style={style.modalCont}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={style.container}>
        <View style={style.innerCont}>
          <CalendarPicker
            startFromMonday={true}
            allowRangeSelection={true}
            minDate={minDate}
            maxDate={maxDate}
            todayBackgroundColor={theme.colors?.primaryLight}
            selectedDayColor={theme?.colors?.primaryLight}
            selectedDayTextColor={theme?.colors?.primaryText}
            onDateChange={(date: Date, type: ChangedDate) =>
              onDateChange(date, type)
            }
            previousComponent={<LeftIcon color={theme.colors?.primary} />}
            nextComponent={<RightIcon color={theme.colors?.primary} />}
            textStyle={{ fontSize: theme.fontSize?.fs15 }}
            monthTitleStyle={{ fontFamily: theme.fontFamily?.medium }}
            yearTitleStyle={{ fontFamily: theme.fontFamily?.medium }}
            selectedDayTextStyle={{
              fontSize: theme.fontSize?.fs14,
              color: theme.colors?.primary,
            }}
            width={SCREEN_WIDTH - 40}
          />
          {dateSelectionError && (
            <Text style={style.error}>{dateSelectionError}</Text>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: SCREEN_WIDTH - 60,
              marginTop: 10,
            }}
          >
            <CustomButton
              onPress={onPressCancel}
              title={"Cancel"}
              buttonWidth="half"
              variant="primary"
              type="solid"
              containerStyle={style.btnApply}
              buttonStyle={{ backgroundColor: theme.colors?.pinkDark }}
              titleStyle={style.txtBtnTitle}
            />
            <CustomButton
              onPress={onPressOkay}
              title={"Okay"}
              buttonWidth="half"
              variant="primary"
              type="solid"
              containerStyle={style.btnApply}
              titleStyle={style.txtBtnTitle}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CalenderPopup;

const useStyle = makeStyles((theme) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors?.overlay,
  },
  modalCont: {
    backgroundColor: "transparent",
  },
  innerCont: {
    height: "auto",
    width: SCREEN_WIDTH - 20,
    backgroundColor: theme.colors?.white,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  txtLoginToAnypost: {
    fontSize: theme.fontSize?.fs18,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.black,
    marginTop: 10,
    marginBottom: 20,
  },
  txtLoginToAnypost1: {
    fontSize: theme.fontSize?.fs18,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.primary,
    marginVertical: 20,
  },
  txtLoginToAnypostDesc: {
    fontSize: theme.fontSize?.fs17,
    fontFamily: theme.fontFamily?.medium,
    textAlign: "center",
    color: theme.colors?.secondaryText,
    lineHeight: 20,
    marginTop: 10,
  },
  buttonCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonRightMargin: {
    marginRight: 10,
  },
  buttonLeftMargin: {
    marginLeft: 10,
  },
  iconCont: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btnApply: {
    backgroundColor: theme.colors?.primary,
    width: SCREEN_WIDTH / 2 - 50,
    height: Scale(40),
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  txtBtnTitle: {
    fontSize: theme.fontSize?.fs14,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.white,
  },
  error: {
    marginTop: 5,
    fontSize: theme.fontSize?.fs12,
    color: theme.colors?.error,
  },
}));

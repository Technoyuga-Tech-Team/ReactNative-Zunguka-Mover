import React from 'react';
import {Text, View} from 'react-native';
import {makeStyles, useTheme} from 'react-native-elements';
import SelectDropdown from 'react-native-select-dropdown';
import Scale from '../../utils/Scale';
import DownArrowIcon from '../ui/svg/DownArrowIcon';

interface CustomDropdownProps {
  dropDownWidth?: number;
  topMargin?: number;
  placeHolder: string;
  onFocus?: () => void;
  onSelect: (val: {title: string; key: string; id: string}) => void;
  value: string;
  dropDownData: any;
  error: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  dropDownWidth,
  topMargin,
  placeHolder,
  onFocus,
  onSelect,
  value,
  dropDownData,
  error,
}) => {
  const style = useStyle();
  const {theme} = useTheme();

  const renderDropdownIcon = (selectedItem: any) => {
    return (
      <DownArrowIcon
        color={theme.colors?.black}
        height={10}
        width={10}
        style={{transform: [{rotate: selectedItem ? '180deg' : '-360deg'}]}}
      />
    );
  };
  return (
    <View style={[topMargin ? {marginTop: topMargin} : null]}>
      <SelectDropdown
        data={dropDownData}
        defaultValue={value}
        onSelect={selectedItem => {
          onSelect(selectedItem);
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          // text represented after item is selected
          // if data array is an array of objects then return selectedItem.property to render after item is selected
          return selectedItem.title;
        }}
        rowTextForSelection={(item, index) => {
          // text represented for each item in dropdown
          // if data array is an array of objects then return item.property to represent item in dropdown
          return item.title;
        }}
        dropdownStyle={style.dropdownCont}
        buttonStyle={[
          style.dropdownView,
          dropDownWidth ? {width: dropDownWidth} : null,
        ]}
        onFocus={onFocus}
        defaultButtonText={placeHolder}
        buttonTextStyle={style.btnTxtStyle}
        renderDropdownIcon={renderDropdownIcon}
        rowStyle={style.rowStyle}
        rowTextStyle={style.txtRow}
        selectedRowStyle={{backgroundColor: theme.colors?.lightBg}}
      />
      {error && <Text style={style.error}>{error}</Text>}
    </View>
  );
};

export default CustomDropdown;

const useStyle = makeStyles(theme => ({
  dropdownCont: {
    backgroundColor: theme.colors?.white,
    justifyContent: 'center',
    borderRadius: 4,
    flex: 1,
  },
  dropdownView: {
    height: Scale(50),
    backgroundColor: theme.colors?.white,
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme?.colors?.secondaryText,
    paddingHorizontal: 16,
    width: '100%',
  },
  txtRow: {
    fontSize: theme.fontSize?.fs15,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.textPrimary,
    textAlign: 'left',
    marginLeft: 10,
  },
  btnTxtStyle: {
    fontSize: theme.fontSize?.fs15,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.textPrimary,
    textAlign: 'left',
  },
  error: {
    marginLeft: 4,
    marginTop: 6,
    fontSize: theme.fontSize?.fs12,
    color: theme?.colors?.error,
  },
  rowStyle: {
    height: Scale(40),
    borderBottomWidth: 0,
    paddingLeft: 10,
  },
  txtTextInputTitle: {
    fontSize: theme.fontSize?.fs17,
    fontFamily: theme.fontFamily?.medium,
    color: theme.colors?.iconColor,
    marginBottom: 5,
  },
}));

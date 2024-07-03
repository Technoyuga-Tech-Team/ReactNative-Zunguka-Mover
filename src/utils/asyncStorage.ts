import AsyncStorage from '@react-native-async-storage/async-storage';

const getDarkMode = async () => {
  try {
    const value = await AsyncStorage.getItem('DARK_MODE');

    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    // console.log('get err', e);
  }
};

const setDarkMode = async (isDark: number) => {
  try {
    const jsonValue = JSON.stringify(isDark);
    await AsyncStorage.setItem('DARK_MODE', jsonValue);
  } catch (e) {
    // console.log('set err', e);
  }
};

const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    // console.log('get err', e);
  }
};

const setData = async (key: string, val: any) => {
  try {
    const jsonValue = JSON.stringify(val);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // console.log('set err', e);
  }
};

const deleteData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch {}
};

const setOpenFirstTime = async () => {
  try {
    await AsyncStorage.setItem('FIRST_TIME', JSON.stringify(true));
  } catch (e) {
    // console.log('set err', e);
  }
};

const appAlreadyOpen = async () => {
  try {
    const isFirstTime = await AsyncStorage.getItem('FIRST_TIME');
    if (JSON.parse(`${isFirstTime}`)) {
      return !!JSON.parse(`${isFirstTime}`);
    }
  } catch (e) {
    // console.log('set err', e);
  }

  return false;
};

export {
  getDarkMode,
  setDarkMode,
  getData,
  setData,
  deleteData,
  setOpenFirstTime,
  appAlreadyOpen,
};

import ImagePicker, { Options } from "react-native-image-crop-picker";
import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import Snackbar from "react-native-snackbar";
import { getUrlExtension } from "../utils/index";

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "Zunguka-app Camera Permission",
        message: "Zunguka-app needs access to your camera ",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true; // Permission granted, proceed with camera access
    } else {
      Alert.alert(
        "Permission Not Granted",
        "You need to grant this app permission to use the camera for picture.",
        [
          {
            text: "Cancel",
            onPress: () => {
              Snackbar.show({
                text: "Camera permission denied",
                duration: Snackbar.LENGTH_LONG,
              });
            },
          },
          {
            text: "Grant",
            onPress: () => Linking.openSettings(),
          },
        ]
      );
      return false; // Permission denied, handle accordingly
    }
  } catch (err) {
    console.error("Error requesting camera permission:", err);
    return false; // Handle error, potentially retry or display an error message
  }
};

const getImageFromCamera = async (options = {}) => {
  try {
    const imagesRes = await ImagePicker.openCamera({
      mediaType: "photo",
      ...options,
    });

    const imageObject = {
      name:
        imagesRes.filename ||
        `${imagesRes.modificationDate}.${getUrlExtension(imagesRes.path)}`,
      type: imagesRes.mime,
      uri: imagesRes.path,
    };

    return imageObject; // Resolve the promise with the image object
  } catch (error: any) {
    console.error("Error getting image from camera:", error);

    if (Platform.OS === "ios" && error?.code === "E_NO_CAMERA_PERMISSION") {
      Linking.openURL("app-settings:"); // Open device settings on iOS for permission handling
    }

    // Re-throw the error for potential handling in the calling component
    throw error;
  }
};

const getImageFromGallary = async (options: Options = {}) => {
  try {
    const imagesRes = await ImagePicker.openPicker({
      mediaType: "photo",
      ...options,
    });

    if (options.multiple) {
      if (!imagesRes || !imagesRes.length) {
        // Handle no images selected scenario (optional)
        return [];
      }

      const imageObjects =
        imagesRes &&
        imagesRes?.map(
          (image: {
            filename: any;
            modificationDate: any;
            path: string;
            mime: any;
          }) => ({
            name:
              image.filename ||
              `${image.modificationDate}.${getUrlExtension(image.path)}`,
            type: image.mime,
            uri: image.path,
          })
        );
      return imageObjects; // Resolve the promise with the image object
    } else {
      const imageObject = {
        name:
          imagesRes.filename ||
          `${imagesRes.modificationDate}.${getUrlExtension(imagesRes.path)}`,
        type: imagesRes.mime,
        uri: imagesRes.path,
      };

      return imageObject; // Resolve the promise with the image object
    }
  } catch (error: any) {
    console.error("Error getting image from camera:", error);

    if (Platform.OS === "ios" && error?.code === "E_NO_LIBRARY_PERMISSION") {
      Linking.openURL("app-settings:"); // Open device settings on iOS for permission handling
    }

    // Re-throw the error for potential handling in the calling component
    throw error;
  }
};

export { getImageFromCamera, getImageFromGallary, requestCameraPermission };

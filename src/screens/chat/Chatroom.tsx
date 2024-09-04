import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { makeStyles, useTheme } from "react-native-elements";

import notifee from "@notifee/react-native";
import { useDebounce } from "@uidotdev/usehooks";
import moment from "moment";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { setAdjustPan, setAdjustResize } from "rn-android-keyboard-adjust";
import { Images } from "../../assets/images";
import { AppImage } from "../../components/AppImage/AppImage";
import CloseIcon from "../../components/ui/svg/CloseIcon";
import LeftIcon from "../../components/ui/svg/LeftIcon";
import SearchIcon from "../../components/ui/svg/SearchIcon";
import {
  BASE_URL,
  GOOGLE_MAP_API_KEY,
  HAS_NOTCH,
  HIT_SLOP2,
  SCREEN_WIDTH,
  secureStoreKeys,
} from "../../constant";
import { API } from "../../constant/apiEndpoints";
import { Route } from "../../constant/navigationConstants";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setErrors } from "../../store/global/global.slice";
import { selectUserData } from "../../store/settings/settings.selectors";
import { ThemeProps } from "../../types/global.types";
import {
  HomeNavigationProps,
  MainNavigationProps,
} from "../../types/navigation";
import { getData } from "../../utils/asyncStorage";
import {
  getImageFromCamera,
  getImageFromGallary,
  requestCameraPermission,
} from "../../utils/ImagePickerCameraGallary";
import Scale from "../../utils/Scale";
import { MessageList, receiverDetailsProps } from "../../types/chat.types";
import Geocoder from "react-native-geocoding";
import * as _ from "lodash";
import { getUrlExtension, hasEmail, hasPhone } from "../../utils";
import { socket, socketEvent } from "../../utils/socket";
import CautionIcon from "../../components/ui/svg/CautionIcon";
import SendButtonIcon from "../../components/ui/svg/SendButtonIcon";

const Chatroom: React.FC<MainNavigationProps<Route.navChatroom>> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();

  const InputRef = useRef<TextInput>(null);

  const flatlistRef = useRef<FlatList>(null);
  const dispatch = useAppDispatch();
  const receiver_id = route?.params?.receiver_id;
  const product_id = route?.params?.product_id;
  console.log(" - - receiver_id", receiver_id, "product_id - - ", product_id);
  const userData = useSelector(selectUserData);

  const [messages, setMessages] = useState<MessageList[]>([]);
  const [visibleSearchField, setVisibleSearchField] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [typing, setTyping] = useState<boolean>(false);
  const [searchIndex, setSearchIndex] = useState<number | null>(null);
  const [onlineUserList, setOnlineUserList] = useState<any>([]);
  const [inputHeight, setInputHeight] = useState(0);
  const [search, setSearch] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);

  const [visible, setVisible] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [receiverDetails, setReceiverDetails] =
    useState<receiverDetailsProps>();
  const debouncedFilter = useDebounce(search, 500);

  useEffect(() => {
    Geocoder.init(GOOGLE_MAP_API_KEY); // Initialize geocoder with API key
  }, []);

  useEffect(() => {
    if (onlineUserList && onlineUserList?.length > 0) {
      let val = onlineUserList.some(
        (item: { userId: number }) => item.userId !== userData?.id
      );
      setIsOnline(val);
    } else {
      setIsOnline(false);
    }
  }, [onlineUserList, userData]);

  useEffect(() => {
    notifee.cancelAllNotifications();
    setAdjustResize();
    return () => {
      setAdjustPan();
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      const token = await getData(secureStoreKeys.JWT_TOKEN);
      setToken(token);
    };
    init().then();
  }, []);

  useEffect(() => {
    if (visibleSearchField) {
      InputRef?.current?.focus();
    } else {
      Keyboard.dismiss();
    }
  }, [visibleSearchField]);

  useEffect(() => {
    if (debouncedFilter !== "") {
      // @ts-ignore
      let ind = messages.findIndex((ele) => ele.message === debouncedFilter);
      if (ind !== -1) {
        setSearchIndex(ind);
        flatlistRef?.current?.scrollToIndex({
          index: ind,
          animated: true,
        });
      } else {
        Keyboard.dismiss();
        setTimeout(() => {
          dispatch(
            setErrors({
              message: `There is no "${debouncedFilter}" message found!`,
              status: 0,
              statusCode: null,
            })
          );
        }, 1000);
      }
    }
  }, [debouncedFilter, messages]);

  useEffect(() => {
    if (searchIndex) {
      setTimeout(() => {
        setSearchIndex(null);
      }, 3000);
    }
  }, [searchIndex]);

  useEffect(() => {
    console.log("called");
    getChatMessages(20, 1);
    // setPage(1);
    // refetch().then();
  }, [receiver_id]);

  const togglePopup = () => {
    setVisible(!visible);
  };

  const onPressFromCamera = async () => {
    togglePopup();
    setTimeout(async () => {
      if (Platform.OS === "android") {
        const hasPermission = await requestCameraPermission();
        if (hasPermission) {
          openPickerCameraImage();
        }
      } else {
        openPickerCameraImage();
      }
    }, 100);
  };

  const openPickerCameraImage = async () => {
    try {
      const imageObject = await getImageFromCamera({
        cropping: true,
      });

      const formData = new FormData();
      // Object.entries(imageObject).forEach(([_key, val]) => {
      //   formData.append(`images[0]`, {
      //     name:
      //       val.name ||
      //       `${new Date().getMilliseconds()}.${getUrlExtension(val.uri)}`,
      //     type: `image/${getUrlExtension(val.uri)}`,
      //     uri: Platform.OS === "ios" ? val.uri.replace("file://", "") : val.uri,
      //   });
      // });

      formData.append(`images[0]`, {
        name:
          imageObject.name ||
          `${new Date().getTime()}.${getUrlExtension(imageObject.uri)}`,
        type: imageObject.type,
        uri:
          Platform.OS === "ios"
            ? imageObject.uri.replace("file://", "")
            : imageObject.uri,
      });

      formData.append("receiver_id", receiver_id);
      // formData.append("message", null);
      formData.append("item_id", product_id);
      console.log("formData", JSON.stringify(formData));

      let myUploadedImages: any[] = [];

      // const result = await dispatch(sendTheMessage({ formData: formData }));

      // if (sendTheMessage.fulfilled.match(result)) {
      //   console.log("sendTheMessage result - - - ", result.payload);

      //   if (result?.payload?.status == 1) {
      //     myUploadedImages = result?.payload?.data?.images;
      //   }
      // } else {
      //   console.log("sendTheMessage error - - - ", result.payload);
      // }
      // console.log("myUploadedImages - - - - - = = = = =", myUploadedImages);
      let t = getTime(new Date());
      let obj = {
        receiver_id: receiver_id,
        sender_id: userData?.id,
        // message: null,
        images: myUploadedImages,
        token: token,
        item_id: product_id,
        isApiCall: false,
      };
      console.log("obj", obj);
      socket.emit(socketEvent.MESSAGE, obj);
      setMessages([
        {
          receiver_id: receiver_id,
          sender_id: userData?.id,
          // @ts-ignore
          message: null,
          images: myUploadedImages,
          messageTime: t,
        },
        ...messages,
      ]);
    } catch (error) {
      // Handle errors here if needed (e.g., display a user-friendly message)
      console.error("Error using getImageFromCamera:", error);
    }
  };

  const onPressFromGallary = async () => {
    togglePopup();
    setTimeout(async () => {
      try {
        const imageObject: any[] = await getImageFromGallary({
          multiple: true,
        });
        const formData = new FormData();
        Object.entries(imageObject).forEach(([_key, val]) => {
          formData.append(`images[${_key}]`, {
            name:
              val.name ||
              `${new Date().getMilliseconds()}.${getUrlExtension(val.uri)}`,
            type: `image/${getUrlExtension(val.uri)}`,
            uri:
              Platform.OS === "ios" ? val.uri.replace("file://", "") : val.uri,
          });
        });

        formData.append("receiver_id", receiver_id);
        // formData.append("message", null);
        formData.append("item_id", product_id);
        console.log("formData", JSON.stringify(formData));

        let myUploadedImages: any[] = [];

        // const result = await dispatch(sendTheMessage({ formData: formData }));

        // if (sendTheMessage.fulfilled.match(result)) {
        //   if (result?.payload?.status == 1) {
        //     myUploadedImages = result?.payload?.data?.images;
        //   }
        // } else {
        //   console.log("sendTheMessage error - - - ", result.payload);
        // }
        // console.log("myUploadedImages - - - - - = = = = =", myUploadedImages);
        let t = getTime(new Date());
        let obj = {
          receiver_id: receiver_id,
          sender_id: userData?.id,
          // message: null,
          images: myUploadedImages,
          token: token,
          item_id: product_id,
          isApiCall: false,
        };
        console.log("obj", obj);
        socket.emit(socketEvent.MESSAGE, obj);
        setMessages([
          {
            receiver_id: receiver_id,
            sender_id: userData?.id,
            // @ts-ignore
            message: null,
            images: myUploadedImages,
            messageTime: t,
          },
          ...messages,
        ]);
      } catch (error) {
        // Handle errors here if needed (e.g., display a user-friendly message)
        console.error("Error using getImageFromGallary:", error);
      }
    }, 100);
  };

  const getChatMessages = async (limit: number, page: number) => {
    const token = await getData(secureStoreKeys.JWT_TOKEN);
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}${API.GET_CHAT_ROOM_MESSAGE_LIST}/${receiver_id}/${product_id}/${limit}/${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      // Handle the fetched data here
      if (data.status === 1) {
        setLoading(false);
        if (data && data?.data) {
          setReceiverDetails(data?.data?.receiverDetail);
          setMessages([...messages, ...data?.data?.list]);
          setTotalPage(data?.data?.totalPages);
          setPage(page + 1);
          setLoadMoreLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", async () => {
      if (receiver_id && userData) {
        socket.emit("new-user-add", userData?.id);
        socket.on("get-users", (users) => {
          // console.log("online users - - - - >", users);
          setOnlineUserList(users);
        });
        // socket.emit(
        //   socketEvent.READ_MESSAGE,
        //   `{receiver_id:${receiver_id},sender_id:${userData?.id}}`
        // );
      }
    });

    return () => {
      socket.emit(
        socketEvent.LEAVE_ROOM,
        `{receiver_id:${receiver_id},sender_id:${userData?.id}}`
      );
      socket.emit("offline");
      socket.emit(socketEvent.SHOW_OFFLINE, userData);
      unsubscribe();
    };
  }, [receiver_id, userData]);

  useEffect(() => {
    socket.on(socketEvent.MESSAGE, (newMessage) => {
      let t = getTime(new Date());
      console.log("newMessage - - - - - -- - - ", newMessage);
      if (userData?.id == newMessage?.receiver_id) {
        socket.emit(
          socketEvent.READ_MESSAGE,
          `{receiver_id:${receiver_id},sender_id:${userData?.id}}`
        );
        setMessages([
          {
            receiver_id: newMessage?.receiver_id,
            sender_id: newMessage?.sender_id,
            message: newMessage?.message,
            images: newMessage?.images,
            messageTime: t,
          },
          ...messages,
        ]);
      }
    });
  }, [messages]);

  useEffect(() => {
    socket.on("user_connected", (res) => {
      if (res && res.includes(receiver_id)) {
        setIsOnline(true);
      }
    });
    socket.on(socketEvent.USER_IS_TYPING, (res) => {
      let obj = JSON.parse(res);
      if (obj.user !== userData?.id) {
        setTyping(obj?.typing);
      }
    });
  }, [socket]);

  const onPressBack = () => {
    navigation.goBack();
  };

  const getTime = (date: Date) => {
    var hours = date.getHours();
    var minutes: string | number = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  const sendMessage = async () => {
    let input_message = inputMessage.trim();
    if (input_message === "") {
      return setInputMessage("");
    }

    // const { results } = await Geocoder.from(input_message);
    if (hasEmail(input_message) || hasPhone(input_message)) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return setInputMessage("");
    }

    let t = getTime(new Date());
    let obj = {
      receiver_id: receiver_id,
      sender_id: userData?.id,
      message: input_message,
      token: token,
      item_id: product_id,
      isApiCall: true,
    };
    socket.emit(socketEvent.MESSAGE, obj);
    setMessages([
      {
        receiver_id: receiver_id,
        sender_id: userData?.id,
        // @ts-ignore
        message: input_message,
        messageTime: t,
      },
      ...messages,
    ]);
    setInputMessage("");
  };

  const onPressSearchIcon = () => {
    setVisibleSearchField(!visibleSearchField);
    setSearch("");
  };

  const onChangeText = (text: string) => {
    setSearch(text);
  };

  const onEndReached = () => {
    console.log("page", page);
    console.log("totalPage", totalPage);
    if (page <= totalPage && !loading) {
      setLoadMoreLoading(true);
      getChatMessages(20, page);
    }
  };

  const onPressOpenDoc = () => {
    setVisible(true);
  };

  // console.log("messages", JSON.stringify(messages));

  const receiverProfile =
    receiverDetails?.profile_image || Images.PLACEHOLDER_IMAGE;
  return (
    <View style={style.container}>
      <View style={style.header}>
        <View style={style.firstCont}>
          <TouchableOpacity
            onPress={onPressBack}
            hitSlop={HIT_SLOP2}
            activeOpacity={0.6}
          >
            <LeftIcon color={theme.colors?.black} />
          </TouchableOpacity>
          {!visibleSearchField ? (
            <View style={style.profileCont}>
              <AppImage
                source={receiverProfile}
                style={style.profile}
                resizeMode="cover"
              />
              <View style={style.nameCont}>
                <Text style={style.txtName}>{receiverDetails?.username}</Text>
                <Text style={style.txtStatus}>
                  {typing ? "Typing..." : isOnline ? "Online" : ""}
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={{
                height: Scale(56),
                width: "90%",
              }}
            >
              <TextInput
                ref={InputRef}
                placeholder="search message"
                placeholderTextColor={theme.colors?.secondaryText}
                value={search}
                onChangeText={onChangeText}
                style={{
                  height: Scale(50),
                  marginLeft: 20,
                  borderBottomColor: theme.colors?.borderButtonColor,
                  borderBottomWidth: 1,
                  color: theme.colors?.primaryText,
                }}
              />
            </View>
          )}
        </View>

        <View style={style.secondCont}>
          {!visibleSearchField ? (
            <TouchableOpacity onPress={onPressSearchIcon} activeOpacity={0.8}>
              <SearchIcon color={theme.colors?.black} style={style.icon} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onPressSearchIcon} activeOpacity={0.8}>
              <CloseIcon color="black" />
            </TouchableOpacity>
          )}
          {/* <VerticalDots color={theme.colors?.black} style={style.icon} /> */}
        </View>
      </View>

      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.select({ ios: 0, android: 100 })}
          style={style.innerContainer}
        >
          <View style={{ flex: 1 }}>
            {loadMoreLoading && (
              <ActivityIndicator color={theme?.colors?.primary} />
            )}
            <FlatList
              ref={flatlistRef}
              inverted={true}
              showsVerticalScrollIndicator={false}
              data={messages}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.5}
              keyExtractor={(_item, index) => index.toString()}
              renderItem={({ item, index }) => {
                const isCurrentUser = item.sender_id === userData?.id;
                const isSelected = searchIndex == index;
                const time = moment(item?.created_at).format("h:mm A");
                return (
                  <TouchableWithoutFeedback>
                    <View style={{ marginTop: 6 }}>
                      <View
                        style={{
                          maxWidth: SCREEN_WIDTH * 0.8,
                          alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                        }}
                      >
                        <View
                          style={[
                            style.messageCont,
                            {
                              borderTopLeftRadius: isCurrentUser ? 15 : 0,
                              borderTopRightRadius: isCurrentUser ? 0 : 15,
                              backgroundColor: isSelected
                                ? theme?.colors?.blackTrans
                                : isCurrentUser
                                ? theme.colors?.primary
                                : "#F2F7FB",
                              alignSelf: isCurrentUser
                                ? "flex-end"
                                : "flex-start",
                            },
                          ]}
                        >
                          {item.message && (
                            <Text
                              style={[
                                style.txtMessage,
                                {
                                  color: isCurrentUser
                                    ? theme.colors?.white
                                    : theme.colors?.black,
                                },
                              ]}
                            >
                              {item.message}
                            </Text>
                          )}
                          {item.message == null &&
                            item?.images &&
                            item?.images?.map((img: { image: string }) => {
                              return (
                                <AppImage
                                  source={img.image}
                                  style={{
                                    height: 250,
                                    width: 250,
                                    borderRadius: 10,
                                    marginTop:
                                      item?.images?.length > 1 ? 10 : 0,
                                  }}
                                  resizeMode="cover"
                                />
                              );
                            })}
                        </View>
                        <Text
                          style={[
                            style.txtTime,
                            {
                              alignSelf: isCurrentUser
                                ? "flex-end"
                                : "flex-start",
                              marginLeft: isCurrentUser ? 0 : 10,
                              marginRight: isCurrentUser ? 10 : 0,
                            },
                          ]}
                        >
                          {time}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                );
              }}
            />
          </View>
          {showAlert && (
            <View
              style={{
                height: 50,
                backgroundColor: "#F2F7FB",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingHorizontal: 20,
              }}
            >
              <CautionIcon style={{ marginRight: 20 }} />
              <Text
                style={{
                  fontSize: theme?.fontSize?.fs14,
                  fontFamily: theme?.fontFamily?.regular,
                  color: theme?.colors?.greyed,
                }}
              >
                Providing email, phone number are not allowed.
              </Text>
            </View>
          )}
          <View style={style.bottomCont}>
            <View style={style.messageInputView}>
              <View style={style.inputCont}>
                <TextInput
                  defaultValue={inputMessage}
                  style={[
                    style.messageInput,
                    // { height: Math.max(40, inputHeight) },
                  ]}
                  placeholder="Message"
                  multiline={true}
                  value={inputMessage}
                  textAlignVertical="center"
                  placeholderTextColor={theme.colors?.secondaryText}
                  // onContentSizeChange={(event) =>
                  //   setInputHeight(event.nativeEvent.contentSize.height)
                  // }
                  onChangeText={(text) => {
                    let objTrue = {
                      typing: true,
                      user: userData?.id,
                    };
                    let objFasle = {
                      typing: false,
                      user: userData?.id,
                    };
                    socket.emit(
                      socketEvent.USER_IS_TYPING,
                      JSON.stringify(objTrue)
                    );
                    setInputMessage(text);
                    setTimeout(() => {
                      socket.emit(
                        socketEvent.USER_IS_TYPING,
                        JSON.stringify(objFasle)
                      );
                    }, 2000);
                  }}
                />
                {/* <TouchableOpacity onPress={onPressOpenDoc}>
                  <FilesShareIcon
                    style={{ marginRight: 10 }}
                    hitSlop={HIT_SLOP2}
                  />
                </TouchableOpacity> */}
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "flex-end",
                  height: Scale(50),
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={style.messageSendView}
                  onPress={sendMessage}
                >
                  <SendButtonIcon color={theme.colors?.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      {/* <ImagePickerPopup
        visiblePopup={visible}
        togglePopup={togglePopup}
        onPressFromCamera={onPressFromCamera}
        onPressFromGallary={onPressFromGallary}
      /> */}
    </View>
  );
};

export default Chatroom;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    paddingTop: props.insets.top,
    backgroundColor: theme.colors?.background,
    paddingBottom:
      Platform.OS === "ios"
        ? HAS_NOTCH
          ? props.insets.bottom
          : props.insets.bottom + 10
        : props.insets.bottom + 10,
  },
  firstCont: {
    flexDirection: "row",
    alignItems: "center",
  },
  secondCont: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  profile: {
    height: Scale(56),
    width: Scale(56),
    borderRadius: Scale(56 / 2),
  },
  txtName: {
    fontSize: theme.fontSize?.fs20,
    fontFamily: theme.fontFamily?.bold,
    color: theme.colors?.black,
  },
  txtStatus: {
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.regular,
    color: theme.colors?.black,
    marginTop: 3,
  },
  nameCont: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: 10,
  },
  profileCont: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginLeft: 20,
  },
  icon: {
    marginLeft: 15,
  },
  headerLeft: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  userProfileImage: { height: "100%", aspectRatio: 1, borderRadius: 100 },
  innerContainer: {
    flex: 1,
  },
  messageInputView: {
    display: "flex",
    flexDirection: "row",
    marginHorizontal: 10,
  },
  messageInput: {
    flex: 1,
    minHeight: Scale(37),
    color: theme.colors?.black,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 5,
    paddingVertical: 5,
    paddingTop: Platform.OS === "ios" ? 10 : 10,
    paddingBottom: Platform.OS === "ios" ? 10 : 10,
  },
  messageSendView: {
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    height: Scale(36),
    width: Scale(36),
    borderRadius: Scale(36 / 2),
    backgroundColor: theme?.colors?.primary,
  },
  inputCont: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#F3F6F6",
    minHeight: Scale(40),
    borderRadius: 12,
    paddingLeft: 5,
  },
  bottomCont: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  txtTime: {
    color: theme.colors?.secondaryText,
    fontSize: theme.fontSize?.fs12,
    fontFamily: theme.fontFamily?.medium,
    alignSelf: "flex-end",
    marginTop: 5,
  },
  txtMessage: {
    fontSize: theme.fontSize?.fs16,
    fontFamily: theme.fontFamily?.regular,
  },
  messageCont: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 8,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
}));

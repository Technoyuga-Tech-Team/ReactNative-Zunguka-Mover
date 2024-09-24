import { CommonActions } from "@react-navigation/native";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Animated, FlatList, StatusBar, View, ViewToken } from "react-native";
import RNBootSplash from "react-native-bootsplash";
import { makeStyles, useTheme } from "react-native-elements";
// relative path

import SliderItem from "../../components/Onboard/SliderItem";
import CustomButton from "../../components/ui/CustomButton";
import Paginator from "../../components/ui/Paginator";
import { SLIDER } from "../../constant";
import { Route } from "../../constant/navigationConstants";
import { MainNavigationProps } from "../../types/navigation";
import { createArrayUseNumber } from "../../utils";
import { setOpenFirstTime } from "../../utils/asyncStorage";

const Onboard: React.FC<MainNavigationProps<Route.navOnboard>> = ({
  navigation,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();

  const sliderRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const init = async () => {
      await RNBootSplash.hide();
    };
    init();
    setOpenFirstTime().then();
  }, []);

  const nextSlide = async () => {
    if (currentSlide < SLIDER.length - 1) {
      sliderRef.current?.scrollToIndex({ index: currentSlide + 1 });
    } else {
      sliderRef.current?.scrollToIndex({ index: 0 });
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide().then();
    }, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [nextSlide]);

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const viewableItemChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      setCurrentSlide(viewableItems[0].index as number);
    }
  ).current;

  const onPressLogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: Route.navAuthentication }],
      })
    );
  };
  const onPressSignup = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: Route.navAuthentication,
            state: {
              routes: [
                {
                  name: Route.navSignup,
                },
              ],
            },
          },
        ],
      })
    );
  };

  return (
    <View style={styles.mainCont}>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={theme.colors?.transparent}
        translucent
      />
      <View style={styles.innerCont}>
        <Animated.FlatList
          ref={sliderRef}
          contentContainerStyle={styles.fltCont}
          horizontal={true}
          data={SLIDER}
          pagingEnabled={true}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={viewableItemChanged}
          viewabilityConfig={viewConfig}
          keyExtractor={(_item, index) => index.toString()}
          scrollEventThrottle={32}
          onScroll={Animated.event(
            [
              {
                nativeEvent: { contentOffset: { x: scrollX } },
              },
            ],
            { useNativeDriver: false }
          )}
          renderItem={({ item }) => <SliderItem item={item} />}
        />
        <View style={{ alignItems: "center", marginBottom: 50 }}>
          <Paginator
            data={createArrayUseNumber(SLIDER.length)}
            scrollX={scrollX}
            variant={"secondary"}
          />
        </View>
      </View>

      <CustomButton
        onPress={onPressSignup}
        title={"Create an account"}
        variant="primary"
        buttonWidth="full"
      />
      <CustomButton
        onPress={onPressLogin}
        title={"Log in"}
        type="outline"
        buttonWidth="full"
        marginTop={20}
      />
    </View>
  );
};

export default Onboard;

export const useStyles = makeStyles((theme) => ({
  mainCont: {
    flex: 1,
    paddingBottom: 40,
    backgroundColor: theme?.colors?.background,
  },
  innerCont: { flex: 1 },
  bottomSafeAreaView: {
    flex: 0,
  },
  lgCont: { flex: 1 },
  topSafeAreaView: {
    flex: 0,
    zIndex: 999,
    backgroundColor: theme.colors?.background,
  },
  subContainer: {
    flex: 0.3,
    paddingHorizontal: 20,
  },
  bottomCont: {
    paddingBottom: 16,
  },
  fltCont: { flexGrow: 1 },
}));

import React from "react";
import { FlatList } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeProps } from "../types/global.types";
import PickupItem from "./PickupItem";

interface PickupsListingProps {
  data: any;
  onPress: (item: any) => void;
  fromRequestPage?: boolean;
  isfromMover?: boolean;
  onPressShowDetails?: (item: any) => void;
}

const PickupsListing: React.FC<PickupsListingProps> = ({
  data,
  onPress,
  fromRequestPage = false,
  isfromMover = false,
  onPressShowDetails,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();

  const renderItem = ({ item }: { item: any }) => {
    // return fromRequestPage ? (
    //   <RequestPageItem item={item} onPress={() => onPress(item)} />
    // ) : (
    return (
      <PickupItem
        item={item}
        onPress={() => onPress(item)}
        fromRequestPage={fromRequestPage}
        isfromMover={isfromMover}
        onPressShowDetails={() =>
          onPressShowDetails && onPressShowDetails(item)
        }
      />
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(_item, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={style.scrollCont}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default PickupsListing;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.white,
  },
  scrollCont: { paddingBottom: props.insets.bottom + 200 },
}));

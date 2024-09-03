import React from "react";
import { FlatList } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MoverItem from "./MoverItem";
import { ThemeProps } from "../../types/global.types";
import { UserData } from "../../types/user.types";

interface MoverListingProps {
  moversData: UserData[];
  onPressHire: (item: UserData) => void;
  onEndReached?: () => void;
}

const MoverListing: React.FC<MoverListingProps> = ({
  moversData,
  onPressHire,
  onEndReached,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();

  const renderItem = ({ item }: { item: UserData }) => {
    return <MoverItem item={item} onPressHire={() => onPressHire(item)} />;
  };

  return (
    <FlatList
      data={moversData}
      keyExtractor={(_item, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={style.scrollCont}
      renderItem={renderItem}
      onEndReachedThreshold={0.5}
      onMomentumScrollEnd={onEndReached}
    />
  );
};

export default MoverListing;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  scrollCont: {
    flexGrow: 1,
    paddingHorizontal: 20,
    marginTop: 10,
    paddingBottom: 50,
  },
}));

import React from "react";
import { FlatList, RefreshControlProps, View } from "react-native";
import { makeStyles, useTheme } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PackageItem from "./PackageItem";
import NoDataFound from "../ui/NoDataFound";
import { ActivityIndicator } from "react-native";

interface PackageListProps {
  isCompleted: boolean;
  onPress: (item: string) => void;
  onPressRating: (item: string) => void;
  onEndReached: () => void;
  data: any;
  isLoading: boolean;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  isFromMover?: boolean;
  ListHeaderComponent?: React.JSX.Element;
  fromEarning?: boolean;
}

const PackageList: React.FC<PackageListProps> = ({
  isCompleted,
  onPress,
  onPressRating,
  onEndReached,
  data,
  isLoading,
  refreshControl,
  isFromMover = true,
  ListHeaderComponent,
  fromEarning,
}) => {
  const insets = useSafeAreaInsets();
  const style = useStyles({ insets });
  const { theme } = useTheme();

  const renderItem = ({ item }: { item: any }) => {
    return (
      <PackageItem
        item={item}
        isCompleted={isCompleted}
        fromEarning={fromEarning}
        onPress={() => onPress(item)}
        isFromMover={isFromMover}
        onPressRating={() => onPressRating(item)}
      />
    );
  };

  return (
    <View style={style.scrollCont}>
      {data && data?.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={onEndReached}
          refreshControl={refreshControl}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={() =>
            isLoading && <ActivityIndicator color={theme.colors?.primary} />
          }
        />
      ) : (
        <>
          <NoDataFound title="No record found!" isLoading={isLoading} />
        </>
      )}
    </View>
  );
};

export default PackageList;

const useStyles = makeStyles((theme) => ({
  scrollCont: {
    flex: 1,
    backgroundColor: theme.colors?.background,
    paddingHorizontal: 20,
  },
}));

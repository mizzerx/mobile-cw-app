import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/core';
import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  Vibration,
  View,
} from 'react-native';
import { DB_NAME } from '../../App';
import LoadingOverlay from '../../components/LoadingOverlay';
import MainButton from '../../components/MainButton';
import MainHeaderTitle from '../../components/MainHeaderTitle';
import MainSearchBox from '../../components/MainSearchBox';
import {
  DataType,
  deleteAllData,
  deleteData,
  getData,
} from '../../database/propertyDto';
import { updateLoggedInStatus } from '../../database/userDto';
import { MainRoutes } from '../../routing';
import { MainRouteProp, MainStackNavigationProp } from '../../routing/types';

const HomeScreen = () => {
  const navigation = useNavigation<MainStackNavigationProp<MainRoutes.HOME>>();
  const { username } = useRoute<MainRouteProp<MainRoutes.HOME>>().params;
  const [data, setData] = React.useState<Array<DataType> | null>(null);
  const animatedLefValue = useRef(new Animated.Value(0)).current;
  const animatedRightValue = useRef(new Animated.Value(0)).current;
  const [crrIndex, setCrrIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const leftTranslateX = animatedLefValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  const rightTranslateX = animatedRightValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100],
  });

  const resetAnimation = useCallback(() => {
    Animated.timing(animatedLefValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    Animated.timing(animatedRightValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const onPressLeft = useCallback(() => {
    Animated.timing(animatedLefValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const onPressRight = useCallback(() => {
    Animated.timing(animatedRightValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const onSearch = useCallback(
    (keyword: string) => {
      if (keyword.length === 0) {
        fetchData();
        return;
      }

      const result = data?.filter(item => {
        return item.propertyType.toLowerCase().includes(keyword.toLowerCase());
      });

      if (result) {
        setData(result);
      }
    },
    [data],
  );

  const onDelete = useCallback((id: number) => {
    Alert.alert(
      'Delete Property',
      'Are you sure you want to delete this property?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            setIsLoading(true);
            const result = await deleteData(DB_NAME, id);

            if (result) {
              setIsLoading(false);
              fetchData();
            }
          },
        },
      ],
      { cancelable: false },
    );
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Home',
      headerRight: () => (
        <TouchableHighlight
          underlayColor={'#fff'}
          activeOpacity={0.5}
          onPress={() => {
            Vibration.vibrate(100);
            Alert.alert(
              'Logout Confirmation',
              'When you logout, all data will be removed!',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Confirm',
                  onPress: async () => {
                    setIsLoading(true);
                    await updateLoggedInStatus(username, 0);
                    setIsLoading(false);
                    navigation.goBack();
                    deleteAllData(DB_NAME);
                  },
                },
              ],
            );
          }}>
          <Text style={styles.headerRight}>{'Logout'}</Text>
        </TouchableHighlight>
      ),
      headerBackVisible: false,
    });
  }, [navigation]);

  const fetchData = async () => {
    const res = await getData(DB_NAME);

    if (res.length > 0) {
      setData(res);
    } else {
      setData(null);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const renderItem = ({ item, index }: { item: DataType; index: number }) => {
    return (
      <TouchableHighlight
        activeOpacity={1}
        underlayColor={'#fff'}
        key={index.toString()}
        onPress={() => {
          navigation.navigate(MainRoutes.DETAIL, {
            id: item.id!,
          });
        }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableHighlight
            style={styles.deleteBox}
            onPress={() => {
              resetAnimation();
              item.id && onDelete(item.id);
            }}>
            <Text>{'Delete'}</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.editBox}
            onPress={() => {
              resetAnimation();
              navigation.navigate(MainRoutes.ADD_OR_EDIT, {
                type: 'edit',
                id: item.id?.toString(),
              });
            }}>
            <Text>{'Edit'}</Text>
          </TouchableHighlight>
          <Animated.View
            style={[
              styles.item,
              crrIndex === index && {
                transform: [
                  { translateX: leftTranslateX },
                  { translateX: rightTranslateX },
                ],
              },
            ]}>
            <View>
              <Text style={styles.itemText}>{item.propertyType}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.reporter}>{'Reporter: '}</Text>
                <Text style={styles.reporterText}>{item.reporterName}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.timeText}>{item.dateTime}</Text>
              <View style={styles.priceBox}>
                <Text>{item.monthlyRentPrice}$/month</Text>
              </View>
            </View>
            <TouchableHighlight
              style={[styles.greenHead]}
              onPress={() => {
                setCrrIndex(index);
                onPressLeft();
              }}>
              <View />
            </TouchableHighlight>
            <TouchableHighlight
              style={[styles.redEnd]}
              onPress={() => {
                setCrrIndex(index);
                onPressRight();
              }}>
              <View />
            </TouchableHighlight>
          </Animated.View>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <MainHeaderTitle
          title={'Welcome to RentalZ'}
          subTitle={'Your record rental properties will show below.'}
        />
        <MainSearchBox placeholder={'Search'} onChangeText={onSearch} />
        <ScrollView style={styles.bodyContainer}>
          {data ? (
            data.map((item, index) => renderItem({ item, index }))
          ) : (
            <Text style={styles.noDataText}>
              {'No data found. Please add your first property!'}
            </Text>
          )}
        </ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <MainButton
            buttonText={'Add new property'}
            onPress={() => {
              navigation.navigate(MainRoutes.ADD_OR_EDIT, { type: 'add' });
            }}
            fontSize={14}
          />
          <MainButton
            buttonText={'Delete all properties'}
            backgroundColor={'#ff0000'}
            fontSize={14}
            onPress={() => {
              Alert.alert(
                'Delete All Properties',
                'Are you sure you want to delete all properties?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: async () => {
                      setIsLoading(true);
                      try {
                        await deleteAllData(DB_NAME);
                        setIsLoading(false);
                        fetchData();
                      } catch (error) {
                        Alert.alert(
                          'Error',
                          'Something went wrong. Please try again later.',
                        );
                      }
                    },
                  },
                ],
                { cancelable: false },
              );
            }}
          />
        </View>
      </View>
      <LoadingOverlay visible={isLoading} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  item: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    flex: 1,
  },
  itemText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bodyContainer: {
    flex: 1,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
  },
  headerRight: {
    fontSize: 16,
    color: '#999',
  },
  reporterText: {
    fontSize: 14,
    color: 'blue',
    fontWeight: '500',
  },
  reporter: {
    fontSize: 14,
    color: '#999',
  },
  greenHead: {
    position: 'absolute',
    backgroundColor: '#00a680',
    width: 10,
    height: '100%',
    borderRadius: 8,
  },
  redEnd: {
    position: 'absolute',
    backgroundColor: '#ff0000',
    width: 10,
    height: '100%',
    borderRadius: 8,
    right: 0,
  },
  priceBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginTop: 16,
  },
  timeText: {
    fontSize: 14,
    color: '#999',
    fontWeight: 'bold',
  },
  editBox: {
    backgroundColor: '#00a680',
    padding: 8,
    borderRadius: 8,
    marginTop: 16,
    marginRight: 16,
    position: 'absolute',
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },
  deleteBox: {
    backgroundColor: '#ff0000',
    padding: 8,
    borderRadius: 8,
    marginTop: 16,
    marginRight: 16,
    position: 'absolute',
    right: -16,
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },
});

export default HomeScreen;

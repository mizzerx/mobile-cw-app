import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/core';
import React, { useLayoutEffect } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DB_NAME } from '../../App';
import LoadingOverlay from '../../components/LoadingOverlay';
import MainButton from '../../components/MainButton';
import MainHeaderTitle from '../../components/MainHeaderTitle';
import MainTextInput from '../../components/MainTextInput';
import {
  DataType,
  getOneData,
  updateData,
  updateOneField,
} from '../../database/propertyDto';
import { MainRoutes } from '../../routing';
import { MainRouteProp, MainStackNavigationProp } from '../../routing/types';

const DetailScreen = () => {
  const { id } = useRoute<MainRouteProp<MainRoutes.DETAIL>>().params;
  const navigation =
    useNavigation<MainStackNavigationProp<MainRoutes.DETAIL>>();
  const [data, setData] = React.useState<DataType>({
    propertyType: '',
    bedrooms: '',
    dateTime: '',
    monthlyRentPrice: '',
    reporterName: '',
  });
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchData = async () => {
    try {
      const data = await getOneData(DB_NAME, id);
      setIsLoading(false);

      if (data) {
        setData(data);
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Property details',
    });
  }, [navigation, id]);

  const handleSave = async () => {
    try {
      await updateData(DB_NAME, id, data);
      Alert.alert('Success', 'Update successfully', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const renderItem = (title: string, value: string) => {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value || 'No data'}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <MainHeaderTitle
          title={`Details of Property ${id}`}
          subTitle={'You can add more description at the end of details.'}
        />
        <ScrollView>
          <View style={styles.imageContainer}>
            {data?.image && data.image.length > 0 ? (
              <Image
                source={{
                  uri: data.image,
                }}
                style={styles.image}
              />
            ) : (
              <Text>No image</Text>
            )}
          </View>
          <View>
            {renderItem('Reporter', data?.reporterName!)}
            {renderItem('Properties Type', data?.propertyType!)}
            {renderItem('Monthly Rent Price', data?.monthlyRentPrice!)}
            {renderItem('Bedrooms', data?.bedrooms!)}
            {renderItem('Date&Time', data?.dateTime!)}
            {renderItem('Furniture Types', data?.furnitureTypes!)}
            {renderItem('Notes', data?.notes!)}
            <MainTextInput
              placeholder={'Enter description'}
              label={'Description'}
              multiline={true}
              value={data?.description}
              onChangeText={text => {
                setData({
                  ...data,
                  description: text,
                });
              }}
            />
          </View>
        </ScrollView>
        <MainButton buttonText={'Save'} fontSize={16} onPress={handleSave} />
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
  image: {
    width: '100%',
    height: 200,
  },
  imageContainer: {
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
  },
  item: {
    marginTop: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
  },
  valueContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 8,
  },
});

export default DetailScreen;

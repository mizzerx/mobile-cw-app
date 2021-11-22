import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/core';
import React, { useCallback, useEffect, useLayoutEffect } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { DB_NAME } from '../../App';
import LoadingOverlay from '../../components/LoadingOverlay';
import MainButton from '../../components/MainButton';
import MainHeaderTitle from '../../components/MainHeaderTitle';
import MainTextInput from '../../components/MainTextInput';
import {
  DataType,
  getDataByField,
  insertData,
  updateData,
} from '../../database/propertyDto';
import { MainRoutes } from '../../routing';
import { MainRouteProp, MainStackNavigationProp } from '../../routing/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDateAndTime } from '../../utils';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

const AddOrEditScreen = () => {
  const navigation =
    useNavigation<MainStackNavigationProp<MainRoutes.ADD_OR_EDIT>>();
  const { type, id } = useRoute<MainRouteProp<MainRoutes.ADD_OR_EDIT>>().params;
  const [valid, setValid] = React.useState(false);
  const [data, setData] = React.useState<DataType>({
    propertyType: '',
    bedrooms: '',
    dateTime: '',
    monthlyRentPrice: '',
    reporterName: '',
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [mode, setMode] = React.useState('date');
  const [showPicker, setShowPicker] = React.useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: type === 'add' ? 'Add Property' : 'Edit Property',
    });

    if (type === 'edit') {
      getDataByField(DB_NAME, 'id', id!).then(data => {
        setData({
          ...data[0],
          monthlyRentPrice: data[0].monthlyRentPrice.toString(),
          bedrooms: data[0].bedrooms.toString(),
        });
      });
    }
  }, [navigation]);

  useEffect(() => {
    if (
      data.propertyType &&
      data.bedrooms &&
      data.dateTime &&
      data.monthlyRentPrice &&
      data.reporterName
    ) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [data]);

  const showDatePickerHandler = useCallback((currentMode: 'date' | 'time') => {
    setShowDatePicker(true);
    setMode(currentMode);
  }, []);

  const onSubmit = async () => {
    if (type === 'edit') {
      setIsLoading(true);

      try {
        const result = await updateData(DB_NAME, parseInt(id!), data);
        setIsLoading(false);
        if (result) {
          Alert.alert(
            'Success',
            'Property updated successfully',
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.goBack();
                },
              },
            ],
            { cancelable: false },
          );
        }
      } catch (error) {
        setIsLoading(false);
        Alert.alert(
          'Error',
          'Something went wrong',
          [
            {
              text: 'OK',
              style: 'cancel',
            },
          ],
          { cancelable: false },
        );
      }

      return;
    }

    if (type === 'add') {
      setIsLoading(true);
      const res = await getDataByField(
        DB_NAME,
        'property_type',
        data.propertyType,
      );

      if (res.length > 0) {
        setIsLoading(false);
        Alert.alert(
          `Property ${data.propertyType} is already exists`,
          '',
          [
            {
              text: 'OK',
              style: 'cancel',
            },
          ],
          { cancelable: false },
        );
        return;
      }

      const insertStatus = await insertData(DB_NAME, data);

      if (insertStatus) {
        setIsLoading(false);
        Alert.alert(
          'Success',
          'Inserted Successfully',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
          { cancelable: false },
        );
      } else {
        Alert.alert(
          'Error',
          'Inserted Failed',
          [
            {
              text: 'OK',
              style: 'cancel',
            },
          ],
          { cancelable: false },
        );
      }
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}>
        <MainHeaderTitle
          title={
            type === 'add'
              ? 'Create your new property'
              : 'Update your choosen property'
          }
          subTitle={
            'All fields mark as (*) are required. Otherwise, you can not add or edit your property.'
          }
        />
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <MainTextInput
            placeholder={'e.g. flat, house, etc.'}
            label={'Property type'}
            isRequired
            validRegExp={/^(?!\s*$).+/}
            errorText={'This field is not empty'}
            onChangeText={propertyType => {
              setData({ ...data, propertyType });
            }}
            value={data.propertyType}
          />
          <MainTextInput
            placeholder={'e.g. 1, 2, etc.'}
            label={'Bedrooms'}
            isRequired
            validRegExp={/^([0-9]){1,}$/}
            errorText={'Just enter numeric and\nDo not leave it empty'}
            onChangeText={bedrooms => {
              setData({ ...data, bedrooms });
            }}
            value={data.bedrooms}
            keyboardType={'numeric'}
          />
          <View>
            <MainTextInput
              placeholder={'e.g. 2021/01/01 23:16'}
              label={'Date&Time'}
              isRequired
              validRegExp={/(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2})/}
              errorText={
                'Please follow [YYYY-MM-DD HH:MM] format and\nDo not leave it empty'
              }
              onChangeText={dateTime => {
                setData({ ...data, dateTime });
              }}
              value={data.dateTime}
            />
            <View style={{ flexDirection: 'row' }}>
              {showDatePicker && (
                <DateTimePicker
                  timeZoneOffsetInMinutes={7 * 60}
                  value={date}
                  mode={mode as any}
                  is24Hour={true}
                  display='default'
                  onChange={(event: any, selectedDate: any) => {
                    const currentDate = selectedDate || date;
                    setShowDatePicker(false);
                    setDate(currentDate);
                    setData({
                      ...data,
                      dateTime: formatDateAndTime(currentDate),
                    });
                  }}
                  style={{
                    width: '100%',
                    position: 'absolute',
                    marginRight: 16,
                    right: 0,
                  }}
                />
              )}
              <View style={styles.twoButton}>
                <TouchableHighlight
                  style={styles.outlineButton}
                  onPress={() => {
                    showDatePickerHandler('date');
                    setData({ ...data, dateTime: formatDateAndTime(date) });
                  }}>
                  <Text style={styles.setText}>{'Set Date'}</Text>
                </TouchableHighlight>
                <View style={styles.verticalLine} />
                <TouchableHighlight
                  style={styles.outlineButton}
                  onPress={() => {
                    showDatePickerHandler('time');
                    setData({ ...data, dateTime: formatDateAndTime(date) });
                  }}>
                  <Text style={styles.setText}>{'Set Time'}</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
          <MainTextInput
            placeholder={'e.g. 20000, 500000'}
            label={'Monthly rent price ($/month)'}
            isRequired
            validRegExp={/^[0-9]{1,}$/}
            errorText={'Just enter numeric and\nDo not leave it empty'}
            keyboardType={'numeric'}
            onChangeText={monthlyRentPrice => {
              setData({ ...data, monthlyRentPrice });
            }}
            value={data.monthlyRentPrice}
          />
          <View>
            <MainTextInput
              placeholder={'e.g. Furnished, Unfurnished, etc.'}
              label={'Furniture types'}
              onChangeText={furnitureTypes => {
                setData({ ...data, furnitureTypes });
              }}
              value={data.furnitureTypes}
              onFocus={() => {
                Alert.alert(
                  'Do you want to choose or add manualy',
                  '',
                  [
                    {
                      text: 'Choose',
                      onPress: () => {
                        setShowPicker(true);
                        Keyboard.dismiss();
                      },
                    },
                    {
                      text: 'Add manualy',
                      onPress: () => {
                        setShowPicker(false);
                      },
                    },
                  ],
                  { cancelable: false },
                );
              }}
            />
            {showPicker && (
              <View style={styles.pickerContainer}>
                <Picker
                  style={styles.picker}
                  selectedValue={data.furnitureTypes}
                  onValueChange={value => {
                    setData({ ...data, furnitureTypes: value });
                    setShowPicker(false);
                  }}>
                  <Picker.Item label={'No choice'} value={''} />
                  <Picker.Item label='Furnished' value='furnished' />
                  <Picker.Item label='Unfurnished' value='unfurnished' />
                  <Picker.Item label='Semi-furnished' value='semi-furnished' />
                </Picker>
              </View>
            )}
          </View>
          <MainTextInput
            placeholder={'Add some notes here'}
            label={'Notes'}
            onChangeText={notes => {
              setData({ ...data, notes });
            }}
            value={data.notes}
            multiline
            numberOfLines={10}
            style={{ height: 100 }}
          />
          <MainTextInput
            placeholder={'Enter name of reporter'}
            label={'Reporter name'}
            isRequired
            validRegExp={/^[a-zA-Z]{3,}$/}
            errorText={
              'Just enter alphabets, at least 3 characters and\nDo not leave it empty'
            }
            onChangeText={reporterName => {
              setData({ ...data, reporterName });
            }}
            value={data.reporterName}
          />
          <Text style={styles.label}>{'Image'}</Text>
          <View style={styles.pickImageContainer}>
            <View style={styles.imgPickBtn}>
              <TouchableOpacity
                style={[styles.outlineButton, { height: 50 }]}
                onPress={async () => {
                  const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    aspect: [4, 3],
                    quality: 1,
                  });

                  if (!result.cancelled) {
                    setData({
                      ...data,
                      image: result.uri,
                    });
                  }
                }}>
                <Text style={styles.setText}>{'Pick Image'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.outlineButton,
                  { height: 50, marginTop: 16, backgroundColor: 'red' },
                ]}
                onPress={() => {
                  setData({ ...data, image: '' });
                }}>
                <Text style={styles.setText}>{'Clear Image'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.imgCon}>
              {data.image && data.image.length > 0 ? (
                <Image source={{ uri: data.image }} style={styles.image} />
              ) : (
                <Text>{'No image choosed'}</Text>
              )}
            </View>
          </View>
        </ScrollView>
        <MainButton
          buttonText={'Save'}
          fontSize={16}
          style={valid ? styles.saveColor : styles.disabledButton}
          disabled={!valid}
          onPress={onSubmit}
        />
      </KeyboardAvoidingView>
      <LoadingOverlay visible={isLoading} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveColor: {
    backgroundColor: '#00a680',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  twoButton: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  outlineButton: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#00a680',
  },
  setText: {
    color: '#fff',
  },
  picker: {
    marginLeft: 16,
  },
  pickImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#999',
    marginLeft: 16,
  },
  verticalLine: {
    width: 1,
    height: '100%',
    backgroundColor: '#ccc',
    marginHorizontal: 16,
  },
  imgCon: {
    flex: 1,
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 8,
  },
  imgPickBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 16,
  },
});

export default AddOrEditScreen;

import { useFocusEffect, useNavigation } from '@react-navigation/core';
import React, { useCallback, useLayoutEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoadingOverlay from '../../../components/LoadingOverlay';
import MainButton from '../../../components/MainButton';
import MainTextInput from '../../../components/MainTextInput';
import {
  getAllUsers,
  getOneUser,
  insertUser,
  updateLoggedInStatus,
} from '../../../database/userDto';
import { MainRoutes } from '../../../routing';
import { MainStackNavigationProp } from '../../../routing/types';

const validUsernameRegex = /^[a-zA-Z0-9]+$/;
const validPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

const LoginScreen = () => {
  const navigation = useNavigation<MainStackNavigationProp<MainRoutes.LOGIN>>();
  const insets = useSafeAreaInsets();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      getAllUsers().then(users => {
        if (users.length > 0) {
          users.forEach(user => {
            if (user.isLoggedIn) {
              navigation.navigate(MainRoutes.HOME, { username: user.username });
              return;
            }
          });
        }
      });
    }, [navigation]),
  );

  const handleLogin = async () => {
    if (
      !validUsernameRegex.test(username) &&
      !validPasswordRegex.test(password)
    ) {
      Alert.alert('Error', 'Username and password must follow the requirement');
      return;
    }

    setIsLoading(true);
    try {
      const user = await getOneUser(username);
      setIsLoading(false);

      if (user) {
        await updateLoggedInStatus(username, 1);
        if (user.password === password) {
          navigation.navigate(MainRoutes.HOME, { username });
        } else {
          Alert.alert('Error', 'Invalid password');
          setPassword('');
        }

        return;
      }

      Alert.alert('User not found', 'You may want to register!');
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleRegister = async () => {
    if (
      !validUsernameRegex.test(username) &&
      !validPasswordRegex.test(password)
    ) {
      Alert.alert('Error', 'Username and password must follow the requirement');
      return;
    }

    setIsLoading(true);

    try {
      const user = await getOneUser(username);

      if (!user) {
        await insertUser({ username, password, isLoggedIn: 0 });
        setIsLoading(false);

        Alert.alert('Success', 'You have successfully registered!');
        return;
      }

      Alert.alert('User already exists', 'Please login!');
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>RentalZ</Text>
        </View>
        <View style={styles.bodyContainer}>
          <MainTextInput
            label={'Username'}
            isRequired
            validRegExp={validUsernameRegex}
            errorText={'Username must be alphanumeric'}
            value={username}
            onChangeText={setUsername}
          />
          <MainTextInput
            label={'Password'}
            isRequired
            validRegExp={validPasswordRegex}
            errorText={
              'Password must be at least 6 characters\nand contain at least one letter and one number'
            }
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View
          style={{ width: '100%', paddingHorizontal: 32, paddingVertical: 16 }}>
          <MainButton
            buttonText={'Login'}
            fontSize={16}
            onPress={handleLogin}
          />
          <View style={{ width: '100%' }}>
            <Text style={styles.separateText}>{'OR'}</Text>
          </View>
          <MainButton
            buttonText={'Register now!'}
            fontSize={16}
            backgroundColor={'blue'}
            onPress={handleRegister}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  headerContainer: {
    marginBottom: 16,
  },
  bodyContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  separateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#aaa',
    alignSelf: 'center',
  },
});

export default LoginScreen;

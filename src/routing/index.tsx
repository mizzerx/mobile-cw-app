import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from './types';

export enum MainRoutes {
  HOME = 'HomeScreen',
  ADD_OR_EDIT = 'AddOrEditScreen',
  DETAIL = 'DetailScreen',
  LOGIN = 'LoginScreen',
}

export const MainStack = createNativeStackNavigator<MainStackParamList>();

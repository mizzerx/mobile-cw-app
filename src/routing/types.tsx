import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainRoutes } from '.';

export type MainStackParamList = {
  [MainRoutes.HOME]: { username: string };
  [MainRoutes.ADD_OR_EDIT]: { type: 'add' | 'edit'; id?: string };
  [MainRoutes.DETAIL]: { id: string | number };
  [MainRoutes.LOGIN]: undefined;
};

export type MainStackNavigationProp<
  T extends keyof MainStackParamList = MainRoutes,
> = NativeStackNavigationProp<MainStackParamList, T>;

export type MainRouteProp<T extends keyof MainStackParamList = MainRoutes> =
  RouteProp<MainStackParamList, T>;

import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { createTable } from './database/propertyDto';
import { createUserTable } from './database/userDto';
import { MainRoutes, MainStack } from './routing';
import AddOrEditScreen from './screens/AddOrEditScreen';
import LoginScreen from './screens/AuthenticationScreen/LoginScreen';
import DetailScreen from './screens/DetailScreen';
import HomeScreen from './screens/HomeScreen';

export const DB_NAME = 'rentalz';

const App = () => {
  useEffect(() => {
    createTable(DB_NAME);
    createUserTable();
  }, []);

  return (
    <NavigationContainer>
      <MainStack.Navigator initialRouteName={MainRoutes.LOGIN}>
        <MainStack.Screen name={MainRoutes.LOGIN} component={LoginScreen} />
        <MainStack.Screen name={MainRoutes.HOME} component={HomeScreen} />
        <MainStack.Screen
          name={MainRoutes.ADD_OR_EDIT}
          component={AddOrEditScreen}
        />
        <MainStack.Screen name={MainRoutes.DETAIL} component={DetailScreen} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

export default App;

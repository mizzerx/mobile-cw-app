import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
}

const MainSearchBox: React.FC<Props> = ({
  style,
  containerStyle,
  ...props
}) => {
  return (
    <View style={[styles.searchBoxContainer, containerStyle]}>
      <Ionicons name={'search'} size={20} color={'#000'} />
      <TextInput {...props} style={[styles.textInput, style]} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 16,
  },
});

export default MainSearchBox;

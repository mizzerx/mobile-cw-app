import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableHighlightProps,
} from 'react-native';

interface Props extends TouchableHighlightProps {
  buttonText: string;
  fontSize?: number;
  backgroundColor?: string;
}

const MainButton: React.FC<Props> = props => {
  const { buttonText, fontSize, backgroundColor, ...rest } = props;

  return (
    <TouchableHighlight
      underlayColor={'#999'}
      activeOpacity={0.5}
      style={[
        styles.container,
        { backgroundColor: backgroundColor || 'green' },
      ]}
      {...rest}>
      <Text style={[styles.buttonText, { fontSize: fontSize || 20 }]}>
        {buttonText}
      </Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    padding: 16,
  },
});

export default MainButton;

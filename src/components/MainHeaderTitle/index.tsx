import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  title: string;
  subTitle?: string;
}

const MainHeaderTitle: React.FC<Props> = props => {
  const { title, subTitle } = props;
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      <Text style={styles.headerSubTitle}>{subTitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubTitle: {
    fontSize: 16,
    color: '#999',
  },
  headerContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
  },
});

export default MainHeaderTitle;

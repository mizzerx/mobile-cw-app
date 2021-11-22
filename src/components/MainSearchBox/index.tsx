import React from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  filter?: boolean;
  filterFields?: Array<{
    label: string;
    value: string;
  }>;
  defaultValue?: string;
  onSelect?: (value: string) => void;
}

const MainSearchBox: React.FC<Props> = ({
  style,
  containerStyle,
  filter,
  filterFields,
  onChangeText,
  onSelect,
  defaultValue,
  ...props
}) => {
  const [selectedFilter, setSelectedFilter] = React.useState<string>(
    defaultValue || '',
  );

  const handleOnChangeText = (text: string) => {
    if (filter) {
      onChangeText && onChangeText(text);
      onSelect && onSelect(selectedFilter);
    } else {
      onChangeText && onChangeText(text);
    }
  };

  return (
    <View>
      <View style={[styles.searchBoxContainer, containerStyle]}>
        <Ionicons name={'search'} size={20} color={'#000'} />
        <TextInput
          style={[styles.textInput, style]}
          onChangeText={handleOnChangeText}
          {...props}
        />
      </View>
      {filter && filterFields && (
        <ScrollView contentContainerStyle={{}} horizontal pagingEnabled>
          <View style={styles.filterContainer}>
            {filterFields.map(field => (
              <TouchableOpacity
                key={field.value}
                onPress={() => {
                  setSelectedFilter(field.value);
                  onSelect && onSelect(field.value);
                }}>
                <View style={styles.filterItem}>
                  <Text
                    style={[
                      styles.filterText,
                      selectedFilter === field.value &&
                        styles.filterTextSelected,
                    ]}>
                    {field.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  filterText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterTextSelected: {
    color: '#901',
  },
  filterItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 4,
    padding: 8,
  },
});

export default MainSearchBox;

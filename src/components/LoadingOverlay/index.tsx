import React from 'react';
import { ActivityIndicator, Modal, ModalProps, View } from 'react-native';

interface Props extends ModalProps {}

// Create LoadingOverlay component
const LoadingOverlay: React.FC<Props> = ({ visible, ...props }) => {
  return (
    <Modal animationType='fade' transparent={true} visible={visible} {...props}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size='large' color='#fff' />
      </View>
    </Modal>
  );
};

export default LoadingOverlay;

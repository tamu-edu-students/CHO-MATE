import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Portal, Dialog, Button } from 'react-native-paper';

export default function Popup({ visible, title, dialogue, onPress }) {
  return (
    <Portal>
      <Dialog visible={visible}>
        <Dialog.Title style={styles.errorTitle}>{title}</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.errorText}>{dialogue}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onPress}>Done</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  errorText: {
    fontSize: 20,
  },
  errorTitle: {
    fontSize: 23,
  },
});

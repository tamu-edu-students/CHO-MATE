import React from 'react';
import { StyleSheet, Text } from 'react-native';

import colors from '../config/colors';

export const FormErrorMessage = ({ error, visible, color = colors.danger }) => {
  if (!error || !visible) {
    return null;
  }

  return <Text style={[{ color }, styles.errorText]}>{error}</Text>;
};

const styles = StyleSheet.create({
  errorText: {
    marginLeft: 15,
    fontSize: 16,
    marginVertical: 8,
    fontWeight: '600',
  },
});

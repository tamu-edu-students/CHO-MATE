import { NavigationContainer } from '@react-navigation/native';
//import { StyleSheet } from 'react-native';
import { Provider, DefaultTheme } from 'react-native-paper';

import colors from './app/config/colors';
import MyTabs from './app/navigation/tabs';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.secondary,
  },
};

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    </Provider>
  );
}

/*(const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});*/

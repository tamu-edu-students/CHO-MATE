import { Provider, DefaultTheme } from 'react-native-paper';

import colors from './app/config/colors';
import RootNavigator from './app/navigation/RootNavigator';

const theme = {
  ...DefaultTheme,
  roundness: 25,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.secondary,
  },
};

export default function App() {
  return (
    <Provider theme={theme}>
      <RootNavigator />
    </Provider>
  );
}

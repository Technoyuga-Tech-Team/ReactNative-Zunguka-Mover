// @ts-nocheck
import React from 'react';
import {ThemeProvider} from 'react-native-elements';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryClient, QueryClientProvider} from 'react-query';
import {getTheme} from './src/theme';
import MainNavigator from './src/navigation';
import {Provider} from 'react-redux';
import store from './src/store/store';

const App = () => {
  const [queryClient] = React.useState(() => new QueryClient());
  queryClient.resetQueries();
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ThemeProvider theme={getTheme('light')}>
            <MainNavigator />
          </ThemeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;

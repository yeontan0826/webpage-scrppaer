import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { RecoilRoot } from 'recoil';

import { RootNavigation } from './src/navigations/rootNavigation';
import { RecoilCustomPersist } from './src/components/recoilCustomPersist';

export default function App() {
  return (
    <RecoilRoot>
      <SafeAreaProvider>
        <RecoilCustomPersist>
          <NavigationContainer>
            <RootNavigation />
          </NavigationContainer>
        </RecoilCustomPersist>
      </SafeAreaProvider>
    </RecoilRoot>
  );
}

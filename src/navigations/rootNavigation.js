import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LinkStackNavigation } from './linkStackNavigation';
import { AddLinkScreen } from '../screens/addLinkScreen';

const Stack = createNativeStackNavigator();

export const RootNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="LinkStackNavigation"
      screenOptions={{ presentation: 'containedModal', headerShown: false }}
    >
      <Stack.Screen
        name="LinkStackNavigation"
        component={LinkStackNavigation}
      />
      <Stack.Screen name="AddLinkScreen" component={AddLinkScreen} />
    </Stack.Navigator>
  );
};

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LinkListScreen } from '../screens/linkListScreen';
import { LinkDetailScreen } from '../screens/linkDetailScreen';

const Stack = createNativeStackNavigator();

export const LinkStackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="LinkListScreen"
      screenOptions={{ presentation: 'card', headerShown: false }}
    >
      <Stack.Screen name="LinkListScreen" component={LinkListScreen} />
      <Stack.Screen name="LinkDetailScreen" component={LinkDetailScreen} />
    </Stack.Navigator>
  );
};

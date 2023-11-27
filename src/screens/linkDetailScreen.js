import { useCallback } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Header } from '../components/header/header';
import { Spacer } from '../components/spacer';
import WebView from 'react-native-webview';

export const LinkDetailScreen = () => {
  const navigation = useNavigation();
  const routes = useRoute();

  const onPressBack = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header>
        <Header.Group>
          <Header.Icon name="arrow-back" onPress={onPressBack} />
          <Spacer horizontal space={12} />
          <Header.Title title="LINK DETAIL" />
        </Header.Group>
      </Header>
      <WebView style={{ flex: 1 }} source={{ uri: routes.params.item.link }} />
    </View>
  );
};

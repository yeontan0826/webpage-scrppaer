import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSetRecoilState } from 'recoil';

import { Header } from '../components/header/header';
import { SingleLineInput } from '../components/singleLineInput';
import { Button } from '../components/button';
import { Typography } from '../components/typography';
import { Spacer } from '../components/spacer';
import { atomLinkList } from '../recoil/states/atomLinkList';
import { getOpenGraphData } from '../utils/openGraphTagUtils';
import { RemoteImage } from '../components/remoteImage';
import { getClipboardString } from '../utils/clipboardUtils';
import { Icon } from '../components/icon';

export const AddLinkScreen = () => {
  const navigation = useNavigation();
  const safeAreaInset = useSafeAreaInsets();
  const updateList = useSetRecoilState(atomLinkList);
  const [metaData, setMetaData] = useState(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();

  const onPressClose = useCallback(() => {
    navigation.goBack();
  }, []);

  const onPressSave = useCallback(() => {
    if (url === '') return;

    updateList((prevState) => {
      const currentDate = new Date();
      const newId = () => {
        return `ITEM-${currentDate.getTime()}`;
      };

      const list = [
        {
          id: newId(),
          title: metaData.title,
          image: metaData.image,
          link: url,
          createdAt: currentDate.toISOString(),
        },
      ];

      return {
        list: list.concat(prevState.list),
      };
    });

    setUrl('');
    setMetaData(null);
  }, [url, metaData]);

  const onSubmitEditing = async () => {
    setLoading(true);
    const result = await getOpenGraphData(url);

    setMetaData(result);
    setLoading(false);
  };

  const onGetClipboardString = useCallback(async () => {
    const result = await getClipboardString();
    if (result.startsWith('http://') || result.startsWith('https://')) {
      console.log('onGetClipboardString');
      setUrl(result);
      const ogResult = await getOpenGraphData(result);
      setMetaData({
        title: ogResult.title,
        image: ogResult.image,
        description: ogResult.description,
      });
    }
  }, []);

  useEffect(() => {
    // https://naver.com
    onGetClipboardString();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header>
        <Header.Group>
          <Header.Title title="ADD LINK" />
        </Header.Group>
        <Header.Icon name="close" onPress={onPressClose} />
      </Header>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          paddingTop: 32,
          paddingHorizontal: 24,
        }}
      >
        <View>
          <SingleLineInput
            value={url}
            onChangeText={setUrl}
            placeholder="https://example.com"
            onSubmitEditing={onSubmitEditing}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Button
              onPress={() => {
                setUrl('');
                setMetaData(null);
              }}
            >
              <Icon name="close" color="black" size={20} />
            </Button>
          </View>
        </View>
        {loading ? (
          <>
            <Spacer space={20} />
            <View>
              <Spacer space={(width - 48) * 0.5} />
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  justifyContent: 'center',
                }}
              >
                <ActivityIndicator />
              </View>
            </View>
          </>
        ) : (
          metaData !== null && (
            <>
              <Spacer space={20} />
              <View
                style={{ borderWidth: 1, borderRadius: 4, borderColor: 'gray' }}
              >
                <RemoteImage
                  url={metaData.image}
                  width={width - 48}
                  height={(width - 48) * 0.5}
                />
                <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
                  <Spacer space={10} />
                  <Typography fontSize={20} color="black">
                    {metaData.title}
                  </Typography>
                  <Spacer space={4} />
                  <Typography fontSize={16} color="gray">
                    {metaData.description}
                  </Typography>
                </View>
              </View>
            </>
          )
        )}
      </View>
      <Button onPress={onPressSave}>
        <View
          style={{
            backgroundColor: url === '' || metaData === null ? 'gray' : 'black',
          }}
        >
          <View
            style={{
              height: 52,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography color="white" fontSize={18}>
              저장하기
            </Typography>
          </View>
          <Spacer space={safeAreaInset.bottom} />
        </View>
      </Button>
    </View>
  );
};

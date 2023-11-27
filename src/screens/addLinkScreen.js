import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components/native';

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
      <Container>
        <View>
          <SingleLineInput
            value={url}
            onChangeText={setUrl}
            placeholder="https://example.com"
            onSubmitEditing={onSubmitEditing}
          />
          <CloseButtonWrapper>
            <Button
              onPress={() => {
                setUrl('');
                setMetaData(null);
              }}
            >
              <Icon name="close" color="black" size={20} />
            </Button>
          </CloseButtonWrapper>
        </View>
        {loading ? (
          <>
            <Spacer space={20} />
            <View>
              <Spacer space={(width - 48) * 0.5} />
              <IndicatorWrapper>
                <ActivityIndicator />
              </IndicatorWrapper>
            </View>
          </>
        ) : (
          metaData !== null && (
            <>
              <Spacer space={20} />
              <MetaDataWrapper>
                <RemoteImage
                  url={metaData.image}
                  width={width - 48}
                  height={(width - 48) * 0.5}
                />
                <MetaDataContainer>
                  <Spacer space={10} />
                  <Typography fontSize={20} color="black">
                    {metaData.title}
                  </Typography>
                  <Spacer space={4} />
                  <Typography fontSize={16} color="gray">
                    {metaData.description}
                  </Typography>
                </MetaDataContainer>
              </MetaDataWrapper>
            </>
          )
        )}
      </Container>
      <Button onPress={onPressSave}>
        <ButtonBackground url={url} metaData={metaData}>
          <SaveButtonWrapper>
            <Typography color="white" fontSize={18}>
              저장하기
            </Typography>
          </SaveButtonWrapper>
          <Spacer space={safeAreaInset.bottom} />
        </ButtonBackground>
      </Button>
    </View>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding-top: 32px;
  padding-left: 24px;
  padding-right: 24px;
`;

const CloseButtonWrapper = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  justify-content: center;
  align-items: center;
  border-width: 1px;
`;

const IndicatorWrapper = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: center;
`;

const MetaDataWrapper = styled.View`
  border-width: 1px;
  border-radius: 4px;
  border-color: gray;
`;

const MetaDataContainer = styled.View`
  padding: 8px 12px;
`;

const ButtonBackground = styled.View`
  background-color: ${(props) =>
    props.url === '' || props.metaData === null ? 'gray' : 'black'};
`;

const SaveButtonWrapper = styled.View`
  height: 52px;
  justify-content: center;
  align-items: center;
`;

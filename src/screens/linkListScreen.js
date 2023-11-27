import { useCallback, useMemo } from 'react';
import { Alert, SectionList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components/native';

import { Header } from '../components/header/header';
import { Button } from '../components/button';
import { Typography } from '../components/typography';
import { Spacer } from '../components/spacer';
import { Icon } from '../components/icon';
import { atomLinkList } from '../recoil/states/atomLinkList';

export const LinkListScreen = () => {
  const safeAreaInset = useSafeAreaInsets();
  const navigation = useNavigation();
  const data = useRecoilValue(atomLinkList);
  const removeItem = useSetRecoilState(atomLinkList);

  const onPressListItem = useCallback((item) => {
    navigation.navigate('LinkDetailScreen', { item });
  }, []);

  const onPressAddButton = useCallback(() => {
    navigation.navigate('AddLinkScreen');
  }, []);

  const onLongPressListItem = useCallback((item) => {
    Alert.alert('삭제하시겠습니까?', '', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          removeItem((prevState) => {
            return {
              list: prevState.list.filter(
                (prevItem) => prevItem.id !== item.id
              ),
            };
          });
        },
      },
    ]);
  }, []);

  const sectionData = useMemo(() => {
    const dateList = {};

    const makeDateString = (createdAt) => {
      const dateItem = new Date(createdAt);
      return `${dateItem.getFullYear()}.${
        dateItem.getMonth() + 1
      }.${dateItem.getDate()}`;
    };

    if (!data.list) return [];

    data.list.forEach((item) => {
      const keyName = makeDateString(item.createdAt);
      if (!dateList[keyName]) {
        dateList[keyName] = [item];
      } else {
        dateList[keyName].push(item);
      }
    });

    return Object.keys(dateList).map((item) => {
      return {
        title: item,
        data: dateList[item],
      };
    });
  }, [data.list]);

  const renderSectionHeader = ({ section }) => {
    return (
      <SectionHeaderContainer>
        <Typography color="gray" fontSize={12}>
          {section.title}
        </Typography>
      </SectionHeaderContainer>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <ItemWrapper
        onPress={() => onPressListItem(item)}
        onLongPress={() => onLongPressListItem(item)}
      >
        <View>
          <Typography fontSize={20}>{item.link}</Typography>
          <Spacer space={4} />
          <Typography fontSize={16} color="gray">
            {item.title !== '' ? `${item.title.slice(0, 20)} | ` : ''}
            {new Date(item.createdAt).toLocaleString()}
          </Typography>
        </View>
      </ItemWrapper>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header>
        <Header.Group>
          <Header.Title title="LINK LIST" />
        </Header.Group>
      </Header>

      <SectionList
        style={{ flex: 1 }}
        sections={sectionData}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
      />
      {/* 플로팅 버튼 */}
      <FloatingButtonContainer safeAreaInset={safeAreaInset}>
        <Button onPress={onPressAddButton}>
          <FloatingButtonWrapper>
            <Icon name="add" color="white" size={32} />
          </FloatingButtonWrapper>
        </Button>
      </FloatingButtonContainer>
    </View>
  );
};

const SectionHeaderContainer = styled.View`
  padding: 4px 12px;
  background-color: white;
`;

const ItemWrapper = styled(Button)`
  padding: 12px 24px;
`;

const FloatingButtonContainer = styled.View`
  position: absolute;
  right: 24px;
  bottom: ${(props) => 24 + props.safeAreaInset.bottom};
`;

const FloatingButtonWrapper = styled.View`
  width: 52px;
  height: 52px;
  justify-content: center;
  align-items: center;
  border-radius: 26px;
  background-color: black;
`;

import { useCallback, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { atomLinkList } from '../recoil/states/atomLinkList';
import { getItem } from '../utils/asyncStorageUtils';

export const RecoilCustomPersist = (props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const setList = useSetRecoilState(atomLinkList);

  const loadData = useCallback(async () => {
    const data = await getItem('MAIN/LINK_LIST');

    if (data !== null) {
      setList(data);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) return;

    loadData();
  }, []);

  return <>{isLoaded && props.children}</>;
};

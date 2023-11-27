import { getStringAsync } from 'expo-clipboard';

export const getClipboardString = async () => {
  return await getStringAsync();
};

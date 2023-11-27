import { useState } from 'react';
import { TextInput, View } from 'react-native';

export const SingleLineInput = (props) => {
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={{
        alignSelf: 'stretch',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: focused ? 'black' : 'gray',
      }}
    >
      <TextInput
        style={[props.style, { fontSize: props.fontSize ?? 20 }]}
        autoCorrect={false}
        autoCapitalize="none"
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
        onSubmitEditing={props.onSubmitEditing}
      />
    </View>
  );
};

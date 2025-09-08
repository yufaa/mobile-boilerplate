import { useState, useEffect } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

interface UseKeyboardReturn {
  keyboardShown: boolean;
  keyboardHeight: number;
  keyboardAnimationDuration: number;
}

function useKeyboard(): UseKeyboardReturn {
  const [keyboardShown, setKeyboardShown] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardAnimationDuration, setKeyboardAnimationDuration] = useState(250);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const handleKeyboardShow = (event: KeyboardEvent) => {
      setKeyboardShown(true);
      setKeyboardHeight(event.endCoordinates.height);
      setKeyboardAnimationDuration(event.duration || 250);
    };

    const handleKeyboardHide = (event: KeyboardEvent) => {
      setKeyboardShown(false);
      setKeyboardHeight(0);
      setKeyboardAnimationDuration(event.duration || 250);
    };

    const showSubscription = Keyboard.addListener(showEvent, handleKeyboardShow);
    const hideSubscription = Keyboard.addListener(hideEvent, handleKeyboardHide);

    return () => {
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, []);

  return {
    keyboardShown,
    keyboardHeight,
    keyboardAnimationDuration,
  };
}

export { useKeyboard };
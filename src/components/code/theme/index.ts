import { Extension } from '@codemirror/state';
import { darkTheme } from './dark';
import { lightTheme } from './light';

export const themes: { [key: string]: Extension } = {
  dark: darkTheme,
  light: lightTheme,
};

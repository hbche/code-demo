import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';
import {
  HighlightStyle,
  TagStyle,
  syntaxHighlighting,
} from '@codemirror/language';
import { StyleSpec } from 'style-mod';

export interface CreateThemeOptions {
  /**
   * 主题的继承。确定默认情况下CodeMirror将应用哪些样式。
   */
  theme: Theme;
  /**
   * 设置自定义编辑器的外观，如背景，gutter，选择和其他。
   */
  settings: StyleSpec;
  /**
   * 语法高亮的样式。
   */
  styles: TagStyle[];
}

type Theme = 'light' | 'dark';

export const createTheme = ({
  theme,
  settings = {},
  styles = [],
}: CreateThemeOptions): Extension => {
  const themeOptions: Record<string, StyleSpec> = {
    '.cm-gutters': {},
    ...settings,
  };

  if (settings.fontFamily) {
    themeOptions['&.cm-editor .cm-scroller'] = {
      fontFamily: settings.fontFamily,
    };
  }
  if (settings.gutterBackground) {
    themeOptions['.cm-gutters'].backgroundColor = settings.gutterBackground;
  }
  if (settings.gutterForeground) {
    themeOptions['.cm-gutters'].color = settings.gutterForeground;
  }
  if (settings.gutterBorder) {
    themeOptions['.cm-gutters'].borderRightColor = settings.gutterBorder;
  }

  if (settings.caret) {
    themeOptions['.cm-content'] = {
      caretColor: settings.caret,
    };
    themeOptions['.cm-cursor, .cm-dropCursor'] = {
      borderLeftColor: settings.caret,
    };
  }
  const activeLineGutterStyle: StyleSpec = {};
  if (settings.gutterActiveForeground) {
    activeLineGutterStyle.color = settings.gutterActiveForeground;
  }
  if (settings.lineHighlight) {
    themeOptions['.cm-activeLine'] = {
      backgroundColor: settings.lineHighlight,
    };
    activeLineGutterStyle.backgroundColor = settings.lineHighlight;
  }
  themeOptions['.cm-activeLineGutter'] = activeLineGutterStyle;

  if (settings.selection) {
    themeOptions[
      '&.cm-focused .cm-selectionBackground, & .cm-line::selection, & .cm-selectionLayer .cm-selectionBackground, .cm-content ::selection'
    ] = {
      background: settings.selection + ' !important',
    };
  }
  if (settings.selectionMatch) {
    themeOptions['& .cm-selectionMatch'] = {
      backgroundColor: settings.selectionMatch,
    };
  }
  const themeExtension = EditorView.theme(themeOptions, {
    dark: theme === 'dark',
  });

  const highlightStyle = HighlightStyle.define(styles);
  const extension = [themeExtension, syntaxHighlighting(highlightStyle)];

  return extension;
};

export default createTheme;

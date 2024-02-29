import { tags as t } from '@lezer/highlight';
import { Extension } from '@codemirror/state';
import createTheme, { CreateThemeOptions } from './createTheme';

export const defaultSettingsBasicDark: CreateThemeOptions['settings'] = {
  ['&']: {
    color: '#dee0e3',
    backgroundColor: '#262b30',
  },
  ['& .cm-placeholder']: {
    color: '#ebedf0',
  },
  ['& .cm-lineNumbers']: {
    backgroundColor: '#262b30',
  },
  ['& .cm-lineNumbers .cm-gutterElement']: {
    color: '#b2b8be',
    backgroundColor: '#262b30',
  },
  ['& .cm-selectionBackground']: {
    backgroundColor: '#383f47',
  },
  // 聚焦时选中区域的背景色
  ['&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground']:
    {
      backgroundColor: '#383f47',
    },
  ['& .cm-cursor']: {
    borderColor: '#ffffff',
  },
  ['& .cm-matchingbracket']: {
    color: '#ed3f49',
  },
};

export const basicDarkInit = (
  options?: Partial<CreateThemeOptions>
): Extension => {
  const { theme = 'dark', settings = {}, styles = [] } = options || {};
  return createTheme({
    theme: theme,
    settings: {
      ...defaultSettingsBasicDark,
      ...settings,
    },
    styles: [
      { tag: t.keyword, color: '#ff9e4b' },
      { tag: [t.string], color: '#c473d3' },
      { tag: [t.comment], color: '#46a1ec' },
      // { tag: [t.comment], color: '#434c5e', fontStyle: 'italic' },
      // {
      //   tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
      //   color: '#d08770',
      // },
      // { tag: [t.variableName], color: '#d08770' },
      // { tag: [t.function(t.variableName)], color: '#5e81ac' },
      // { tag: [t.labelName], color: '#81a1c1' },
      // {
      //   tag: [t.color, t.constant(t.name), t.standard(t.name)],
      //   color: '#5e81ac',
      // },
      // { tag: [t.definition(t.name), t.separator], color: '#a3be8c' },
      // { tag: [t.brace], color: '#8fbcbb' },
      // {
      //   tag: [t.annotation],
      //   color: '#d30102',
      // },
      // {
      //   tag: [
      //     t.number,
      //     t.changed,
      //     t.annotation,
      //     t.modifier,
      //     t.self,
      //     t.namespace,
      //   ],
      //   color: '#88c0d0',
      // },
      // {
      //   tag: [t.typeName, t.className],
      //   color: '#ebcb8b',
      // },
      // {
      //   tag: [t.operator, t.operatorKeyword],
      //   color: '#a3be8c',
      // },
      // {
      //   tag: [t.tagName],
      //   color: '#b48ead',
      // },
      // {
      //   tag: [t.squareBracket],
      //   color: '#bf616a',
      // },
      // {
      //   tag: [t.angleBracket],
      //   color: '#d08770',
      // },
      // {
      //   tag: [t.attributeName],
      //   color: '#ebcb8b',
      // },
      // {
      //   tag: [t.regexp],
      //   color: '#5e81ac',
      // },
      // {
      //   tag: [t.quote],
      //   color: '#3b4252',
      // },
      // {
      //   tag: t.link,
      //   color: '#8fbcbb',
      //   textDecoration: 'underline',
      //   textUnderlinePosition: 'under',
      // },
      // {
      //   tag: [t.url, t.escape, t.special(t.string)],
      //   color: '#d08770',
      // },
      // { tag: [t.meta], color: '#88c0d0' },
      // { tag: t.strong, fontWeight: 'bold', color: '#5e81ac' },
      // { tag: t.emphasis, fontStyle: 'italic', color: '#5e81ac' },
      // { tag: t.strikethrough, textDecoration: 'line-through' },
      // { tag: t.heading, fontWeight: 'bold', color: '#5e81ac' },
      // { tag: t.special(t.heading1), fontWeight: 'bold', color: '#5e81ac' },
      // { tag: t.heading1, fontWeight: 'bold', color: '#5e81ac' },
      // {
      //   tag: [t.heading2, t.heading3, t.heading4],
      //   fontWeight: 'bold',
      //   color: '#5e81ac',
      // },
      // {
      //   tag: [t.heading5, t.heading6],
      //   color: '#5e81ac',
      // },
      // { tag: [t.atom, t.bool, t.special(t.variableName)], color: '#d08770' },
      // {
      //   tag: [t.processingInstruction, t.inserted],
      //   color: '#8fbcbb',
      // },
      // {
      //   tag: [t.contentSeparator],
      //   color: '#ebcb8b',
      // },
      // { tag: t.invalid, color: '#434c5e', borderBottom: '1px dotted #d30102' },
      ...styles,
    ],
  });
};

export const darkTheme = basicDarkInit();

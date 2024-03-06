import { tags as t } from '@lezer/highlight';
import { Extension } from '@codemirror/state';
import createTheme, { CreateThemeOptions } from './createTheme';

export const defaultSettingsBasicLight: CreateThemeOptions['settings'] = {
  ['&']: {
    color: '#383f47',
    backgroundColor: '#f2f5f7',
  },
  ['& .cm-placeholder']: {
    color: '#b2b8be',
  },
  ['& .cm-lineNumbers']: {
    backgroundColor: '#ebedf0',
  },
  ['& .cm-lineNumbers .cm-gutterElement']: {
    color: '#7b8794',
    backgroundColor: '#ebedf0',
  },
  ['& .cm-selectionBackground']: {
    backgroundColor: '#dee0e3',
  },
  // 聚焦时选中区域的背景色
  ['&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground']:
    {
      backgroundColor: '#dee0e3',
    },
  ['& .cm-cursor']: {
    borderColor: '#262b30',
  },
  ['& .cm-matchingbracket']: {
    color: '#ed3f49',
  },
};

export const basicLightInit = (
  options?: Partial<CreateThemeOptions>
): Extension => {
  const { theme = 'light', settings = {}, styles = [] } = options || {};
  return createTheme({
    theme: theme,
    settings: {
      ...defaultSettingsBasicLight,
      ...settings,
    },
    styles: [
      { tag: t.keyword, color: '#f27000' },
      { tag: [t.string], color: '#ac4cbd' },
      { tag: [t.comment], color: '#1585e0' },
      {
        tag: [t.tagName],
        color: '#170',
      },
      {
        tag: [t.attributeName],
        color: '#00c',
      },
      { tag: [t.meta], color: '#555' },
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
      //   tag: [t.squareBracket],
      //   color: '#bf616a',
      // },
      // {
      //   tag: [t.angleBracket],
      //   color: '#d08770',
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

export const lightTheme = basicLightInit();

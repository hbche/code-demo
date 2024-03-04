import {
  HighlightStyle,
  LanguageSupport,
  StreamLanguage,
  syntaxHighlighting,
} from '@codemirror/language';
import { simpleMode } from '@codemirror/legacy-modes/mode/simple-mode';
import { Tag } from '@lezer/highlight';

const chordBases = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const chordStartMatches = chordBases.map((chord) => ({
  regex: new RegExp(`\\[${chord}`, 'i'),
  push: chord,
  token: `chord-${chord}`,
}));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chordStates: any = {};
chordBases.forEach((chord) => {
  chordStates[chord] = [
    { regex: /\]/, pop: true, token: `chord-${chord}` },
    { regex: /[^\]]+/, token: `chord-${chord}` },
  ];
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chordProSimpleMode: any = simpleMode({
  start: [
    ...chordStartMatches,
    { regex: /\[/, push: 'chord', token: 'propertyName' },
    { regex: /\{/, push: 'directive', token: 'comment' },
  ],
  chord: [
    { regex: /\]/, pop: true, token: 'propertyName' },
    { regex: /\w+/, token: 'propertyName' },
  ],
  ...chordStates,
  directive: [
    { regex: /\}/, pop: true, token: 'comment' },
    { regex: /[\w\s:]+/, token: 'comment' },
  ],
  languageData: {
    name: 'chordPro',
  },
});

chordProSimpleMode.tokenTable = {};
chordBases.forEach((chord) => {
  chordProSimpleMode.tokenTable[`chord-${chord}`] = Tag.define();
});

const chordProModeLanguage = StreamLanguage.define(chordProSimpleMode);

export const chordProHighlighter = syntaxHighlighting(
  HighlightStyle.define(
    chordBases.map((chord) => ({
      tag: chordProSimpleMode.tokenTable[`chord-${chord}`],
      class: `cm-chord-${chord}`,
    }))
  )
);

const chordProMode = new LanguageSupport(chordProModeLanguage, [
  chordProHighlighter,
]);
export default chordProMode;

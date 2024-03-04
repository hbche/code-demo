import { xml } from '@codemirror/lang-xml';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { json } from '@codemirror/lang-json';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { yaml } from '@codemirror/legacy-modes/mode/yaml';
import { StreamLanguage } from '@codemirror/language';
import chordProMode from './custom/custom.mode';

export const langs = {
  xml: xml(),
  python: python(),
  sql: sql(),
  shell: StreamLanguage.define(shell),
  yaml: StreamLanguage.define(yaml),
  json: json(),
  java: java(),
  javascript: javascript(),
  chordPro: chordProMode,
  // custom: () => {},
};

// 支持的语言名称
export const langNames = Object.keys(langs);

// 支持的语言类型
export type LanguageName = keyof typeof langs;

/** 加载语言 */
export function loadLanguage(name: LanguageName) {
  return langs[name] ? langs[name] : null;
}

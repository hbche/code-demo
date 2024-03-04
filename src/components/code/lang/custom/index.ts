import {
  HighlightStyle,
  LanguageSupport,
  StreamLanguage,
  StringStream,
  syntaxHighlighting,
} from '@codemirror/language';
import { Tag } from '@lezer/highlight';

interface CustomState {
  isMatchStart: boolean;
  isMatchEnd: boolean;
  isMatch: boolean;
}

const tokenTable = {
  'custom-tag': Tag.define(),
  'custom-content': Tag.define(),
};

const customLanguage = (customTags: string[]) => {
  const [startTag, endTag] = customTags;

  const lookAhead = (stream: StringStream, length: number) => {
    for (let i = 0; i < length; i++) {
      stream.next();
    }
  };

  const isMatchTag = (stream: StringStream, tag: string) => {
    const index = stream.string.indexOf(tag, stream.pos);
    if (index > -1) {
      stream.backUp(stream.pos);
      lookAhead(stream, index);
    }
    return index > -1;
  };
  return StreamLanguage.define<CustomState>({
    name: 'custom',
    startState(): CustomState {
      return {
        isMatchStart: false,
        isMatchEnd: false,
        isMatch: false,
      };
    },
    token(stream: StringStream, state: CustomState) {
      if (stream.eatSpace()) return null;

      if (state.isMatchStart) {
        state.isMatchStart = false;
        lookAhead(stream, startTag.length);
        return 'custom-tag';
      }

      if (state.isMatchEnd) {
        state.isMatchEnd = false;
        lookAhead(stream, endTag.length);
        return 'custom-tag';
      }

      if (state.isMatch) {
        if (isMatchTag(stream, endTag)) {
          state.isMatchEnd = true;
        } else {
          stream.skipToEnd();
        }

        if (!stream.eol()) {
          state.isMatch = false;
        }

        return 'custom-content';
      }

      if (isMatchTag(stream, startTag)) {
        state.isMatch = true;
        state.isMatchStart = true;
        return null;
      }

      stream.skipToEnd();
      return null;
    },
    tokenTable: tokenTable,
  });
};

const customHighlighter = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tokenTable['custom-tag'], class: 'custom-tag' },
    {
      tag: tokenTable['custom-content'],
      class: 'custom-content',
    },
  ])
);

const customMode = (customTags: string[]) =>
  new LanguageSupport(customLanguage(customTags), customHighlighter);

export default customMode;

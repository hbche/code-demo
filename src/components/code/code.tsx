import React from 'react';
import {
  EditorView,
  drawSelection,
  gutter,
  lineNumbers,
  placeholder,
} from '@codemirror/view';
import { EditorState, Extension } from '@codemirror/state';
import { history } from '@codemirror/commands';
import { themes } from './theme';
import classNames from 'classnames';
import { LanguageName, langs } from './lang';
import './code.scss';

export interface CodeProps {
  /**
   * @description 自定义类名
   */
  className?: string;
  /**
   * @description 当 mode 为 json 时,自动格式化 json 代码块
   */
  autoFormatJson?: boolean;
  /**
   * @description 代码块展示
   */
  code: string;
  /**
   * @description 是否自动换行
   */
  lineWrap?: boolean;

  /**
   * @description 自定义高亮标签( mode 为 custom 时可传此参数) 不可动态修改
   */
  customTag?: string[];
  /**
   * @description 是否可编辑
   */
  editable?: boolean;
  /**
   * @description 代码起始行
   */
  startLine?: number;
  /**
   * @description 编辑器的宽度，默认占满父元素宽度
   */
  width?: number | string;
  /**
   * @description 编辑器的高度，默认占满父元素高度
   */
  height?: number | string;
  /**
   * @description 代码高亮的语法，可选语言有：custom（自定义扩展语法）、json、xml等，高亮方式可自定义 css
   */
  mode:
    | 'xml'
    | 'python'
    | 'sql'
    | 'custom'
    | 'shell'
    | 'yaml'
    | 'json'
    | 'java'
    | string;
  /**
   * @description 占位文本
   */
  placeholder?: string;
  /**
   * @description 编辑器主题，默认支持 default 和 dark 两种模式，默认为：default 模式
   */
  theme?: 'light' | 'dark' | string | Extension;
  /**
   * @description 自定义配置项，具体配置参考 CodeMirror 的配置项
   */
  configs?: Extension[];
  /**
   * @description 修改输入框的回调
   */
  onChange?: (value: string) => void;
}

/** 公共基础样式 */
const baseStyle = {
  '&': {
    fontFamily: `-apple-system, BlinkMacSystemFont, PingFang SC, Segoe UI, Roboto, Ubuntu, Helvetica Neue, Helvetica,
    Arial, Hiragino Sans GB, Microsoft YaHei UI, Microsoft YaHei, Source Han Sans CN, sans-serif !default`,
    fontSize: '12px',
    lineHeight: '20px',
    border: `1px solid #d1d4d7`,
    borderRadius: '4px',
  },
  '& .cm-scroller': {
    height: '100% !important',
  },
  // 聚焦时的样式
  '&.cm-focused': {
    outline: 'none',
    borderColor: '#0088ce',
    boxShadow: '0 0 0 2px #c5e3fc80',
  },
  '& .cm-selectionBackground': {
    height: '20px',
  },
  '& .cm-cursor': {
    height: '20px',
  },
  // 内容区样式
  '& .cm-content': {
    padding: '12px 0',
  },
  '& .cm-content .cm-line': {
    padding: '0 16px',
    lineHeight: '20px',
    minHeight: '20px',
  },
  '& .cm-gutters': {
    border: 'none',
  },
  // 行数槽位样式
  '& .cm-lineNumbers': {
    // width: '0',
    // color: '#7b8794',
    fontSize: '12px',
    lineHeight: '20px',
    // backgroundColor: '#ebedf0',
  },
  '& .cm-lineNumbers .cm-gutterElement': {
    minWidth: '40px',
    padding: '0 12px',
    lineHeight: '20px',
    textAlign: 'right',
  },
};

/**
 * code 组件
 */
export class Code extends React.Component<CodeProps> {
  private className = 'qtc-code';
  private containerRef = React.createRef<HTMLDivElement>();
  private instance?: EditorView;

  static defaultProps = {
    autoFormatJson: true,
    height: '100%',
    editable: false,
    code: '',
    lineWrap: false,
    startLine: 1,
    theme: 'light',
  };

  get codeInstance(): EditorView | undefined {
    return this.instance;
  }

  constructor(props: CodeProps) {
    super(props);
  }

  componentDidMount(): void {
    if (this.containerRef.current) {
      const {
        code,
        configs = [],
        // customTag,
        editable,
        width = '100%',
        height = '100%',
        lineWrap,
        mode,
        placeholder: placeholderStr = '',
        startLine = 1,
        theme,
      } = this.props;

      const extensions = [
        ...configs,
        history(),
        // editable ? EditorView.editable.of(true) : EditorState.readOnly.of(true),
        editable ? EditorView.editable.of(true) : EditorView.editable.of(false),
        EditorView.baseTheme({
          ...baseStyle,
          '&': {
            width: typeof width === 'number' ? `${width}px` : width,
            height: typeof height === 'number' ? `${height}px` : height,
          },
        }),
        placeholder(placeholderStr),
        lineNumbers({
          // 起始行，CodeMirror6中移除了firstLineNumber配置项，所以需要利用 formatNumber 实现起始行
          formatNumber: (lineNo: number) => {
            const offsetLine = `${Math.abs(lineNo - 1 + startLine)}`;
            return offsetLine;
          },
        }),
        drawSelection({
          // 光标闪烁频率，默认1200
          cursorBlinkRate: 1200,
          // 选中时，是否展示光标。默认为 true 展示
          drawRangeCursor: false,
        }),
        EditorState.allowMultipleSelections.of(true),
        gutter({ class: `${this.className}-gutter` }),
      ];

      const languageParser = langs[mode as LanguageName];
      if (languageParser) {
        extensions.push(languageParser());
      }

      if (lineWrap) {
        extensions.push(EditorView.lineWrapping);
      }

      // if (theme === 'default') {
      //   extensions.push(themes.light);
      // } else
      if (theme) {
        if (typeof theme === 'string') {
          if (themes[theme]) {
            extensions.push(themes[theme]);
          } else {
            // 对于不存在的样式采用默认样式
            extensions.push(themes['light']);
          }
        } else {
          extensions.push(theme);
        }
      } else {
        // 对于不存在的样式采用默认样式
        extensions.push(themes['light']);
      }

      const state = EditorState.create({
        doc: code,
        extensions,
      });

      this.instance = new EditorView({
        parent: this.containerRef.current,
        state,
      });
    }
  }

  render() {
    const {
      className,
      props: { className: styleName },
    } = this;

    return (
      <div className={classNames(className, styleName)}>
        <div className={`${className}-container`} ref={this.containerRef}></div>
      </div>
    );
  }
}

import React from 'react';
import {
  EditorView,
  ViewUpdate,
  drawSelection,
  gutter,
  lineNumbers,
  placeholder,
} from '@codemirror/view';
import {
  Annotation,
  EditorState,
  Extension,
  StateEffect,
} from '@codemirror/state';
import { history } from '@codemirror/commands';
import { themes } from './theme';
import classNames from 'classnames';
import { LanguageName, langs } from './lang';
import './code.scss';
import customMode from './lang/custom';
import { isEqual } from 'lodash';

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
  mode?:
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

interface CodeState {
  view?: EditorView;
  state?: EditorState;
}

/**
 * code 组件
 */
export class Code extends React.Component<CodeProps, CodeState> {
  private className = 'qtc-code';
  private containerRef = React.createRef<HTMLDivElement>();

  static defaultProps = {
    autoFormatJson: true,
    height: '100%',
    width: '100%',
    editable: false,
    code: '',
    mode: 'json',
    lineWrap: false,
    startLine: 1,
    theme: 'light',
  };

  get codeInstance(): EditorView | undefined {
    return this.state.view;
  }

  constructor(props: CodeProps) {
    super(props);
    this.state = {
      view: undefined,
      state: undefined,
    };
  }

  componentDidMount(): void {
    if (this.containerRef.current) {
      const { code, ...restProps } = this.props;
      const extensions = this.getExtensions(restProps);
      const codeState = EditorState.create({
        doc: code,
        extensions,
      });

      this.setState({
        ...this.state,
        view: new EditorView({
          parent: this.containerRef.current,
          state: codeState,
        }),
      });
    }
  }

  componentDidUpdate(prevProps: Readonly<CodeProps>): void {
    if (this.state.view) {
      const { code, ...restProps } = this.props;
      const { code: prevCode, ...prevRestProps } = prevProps;
      if (prevCode !== code) {
        console.log(prevCode, code);
        this.state.view?.dispatch({
          changes: {
            from: 0,
            to: Math.max(prevProps.code.length, code.length),
            insert: code || '',
          },
          annotations: [Annotation.define<boolean>().of(true)],
        });
      }

      if (!isEqual(prevRestProps, restProps)) {
        this.state.view?.dispatch({
          effects: StateEffect.reconfigure.of(this.getExtensions(restProps)),
        });
      }
    }
  }

  componentWillUnmount(): void {
    this.state.view?.destroy?.();
  }

  private getExtensions(props: Omit<CodeProps, 'code'>) {
    const {
      configs = [],
      editable,
      width,
      height,
      lineWrap,
      mode,
      customTag,
      placeholder: placeholderStr = '',
      startLine = 1,
      theme,
      onChange,
    } = props;

    const extensions = [
      ...configs,
      history(),
      editable ? EditorView.editable.of(true) : EditorView.editable.of(false),
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

    if (mode === 'custom') {
      if (customTag) {
        extensions.push(customMode(customTag));
      }
    } else {
      const languageParser = langs[mode as LanguageName];
      if (languageParser) {
        extensions.push(languageParser);
      }
    }

    if (lineWrap) {
      extensions.push(EditorView.lineWrapping);
    }

    const baseTheme = EditorView.baseTheme({
      // ...BASE_STYLE,
      '&': {
        width: typeof width === 'number' ? `${width}px` : width!,
        height: typeof height === 'number' ? `${height}px` : height!,
      },
    });
    extensions.push(baseTheme);
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

    if (onChange) {
      const updateListener = EditorView.updateListener.of((vu: ViewUpdate) => {
        const doc = vu.state.doc;
        const newCode = doc.toString();
        if (
          vu.docChanged &&
          typeof onChange === 'function' &&
          this.props.code !== newCode
        ) {
          console.log(this.props.code, newCode);
          onChange(newCode);
        }
      });
      extensions.push(updateListener);
    }

    return extensions;
  }

  render() {
    const {
      className,
      props: { className: styleName, editable },
    } = this;

    return (
      <div className={classNames(className, styleName)}>
        <div
          className={classNames(`${className}-container`, {
            [`${className}-editable`]: editable,
          })}
          ref={this.containerRef}
        ></div>
      </div>
    );
  }
}

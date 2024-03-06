/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Code } from './code';
import './code-demo.scss';

const codeJson = `
{
  "name": "@qt/design","version": "V1.0.0","created": "2022.01.01"
}`;

type State = {
  theme: string;
  editable: boolean;
};
export default class extends React.Component<any, State> {
  className = 'code-demo';
  state = {
    theme: 'default',
    editable: true,
  };

  handleSelect = (value: string) => {
    this.setState({ ...this.state, theme: value });
  };

  handleEditable = (editable: boolean) => {
    this.setState({ ...this.state, editable });
  };

  render() {
    const { theme, editable } = this.state;
    const options = [
      {
        label: 'default',
        value: 'default',
      },
      {
        label: 'dark',
        value: 'dark',
      },
    ];

    return (
      <div className={`${this.className}`}>
        <div style={{ marginBottom: 8 }}>
          <select
            value={theme}
            onChange={(e: any) => {
              this.handleSelect(e.target.value);
            }}
          >
            {options.map((option: any, index) => {
              return (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </select>
          <input
            type='checkbox'
            name='editable'
            checked={editable}
            onChange={(e: any) => {
              this.handleEditable(e.target.value);
            }}
          />
        </div>
        <Code
          className={`${this.className}-code`}
          // mode='custom'
          // customTag={['<qthighlight--', '--qthighlight>']}
          mode='json'
          code={codeJson}
          editable={editable}
          lineWrap={false}
          theme={theme}
          placeholder='placeholder'
        />
      </div>
    );
  }
}

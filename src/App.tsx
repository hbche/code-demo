import { useState } from 'react';
import './App.css';
import { Code } from './components';

function App() {
  const [code] = useState(`
  {
    "name": "@qt/design",
    "version": "V1.0.0",
    "created": "2022.01.01",
    "test": true
  }
  `);
  return (
    <>
      <Code
        code={''}
        mode={'json'}
        editable={true}
        lineWrap={false}
        // startLine={-2}
        theme={'light'}
        width={400}
        placeholder='请输入代码'
      />
      <Code
        code={code}
        mode={'json'}
        editable={false}
        lineWrap={false}
        theme='light'
        width={400}
      />
      <Code
        code={`
{
  "name": "@qt/design",
  "version": "V1.0.0",
  "created": "2022.01.01",
  "test": true
}
`}
        mode={'json'}
        editable={true}
        lineWrap={false}
        theme='dark'
        placeholder='请输入代码'
        width={400}
      />
    </>
  );
}

export default App;

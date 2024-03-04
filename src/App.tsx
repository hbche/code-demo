import './App.scss';
import { Code } from './components';

function App() {
  return (
    <>
      <Code
        className='code'
        code={`if (x) return 500 {A} [B] {c} [d]`}
        mode={'custom'}
        customTag={['<qthighlight--', '--qthighlight>']}
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

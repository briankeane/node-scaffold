import { useEffect, useRef, useState } from 'react';
import { isValidJSONString } from '../../Helpers/Utils';
import './CodeTextBox.scss';

import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/base16/oceanicnext.css';

hljs.registerLanguage('json', json);

type CodeTextBoxProps = {
  code: string;
  onCodeChange: (code: string) => void;
};
const CodeTextBox = (props: CodeTextBoxProps) => {
  const [jsonIsValid, setJsonIsValid] = useState(isValidJSONString(props.code));
  const nodeRef = useRef(null);

  useEffect(() => {
    if (nodeRef?.current) {
      // TODO: Make this work with typescript
      // const node = nodeRef.current.querySelector('pre code');
      // hljs.highlightBlock(node);
    }
  }, [nodeRef, props.code]);

  useEffect(() => {
    setJsonIsValid(isValidJSONString(props.code));
  }, [props.code]);

  return (
    <div ref={nodeRef}>
      <pre>
        <code
          style={{
            // height: '30px',
            // width: '30px',
            backgroundColor: 'black',
            color: 'white',
          }}
          className='language-json'
          contentEditable={true}
          suppressContentEditableWarning={true}
          autoCorrect='false'
          id='itemsTextArea'
          onBlur={(event: any) => props.onCodeChange(event.target.innerText)}
        >
          {props.code}
        </code>
      </pre>
      {jsonIsValid ? null : (
        <div className='alert alert-danger' role='alert'>
          JSON is not valid!
        </div>
      )}
    </div>
  );
};

export default CodeTextBox;

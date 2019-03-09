import React, {Component} from 'react';
import PropTypes from 'prop-types';
import hljs from "highlight.js";
import hljsDefineSolidity from "highlightjs-solidity";

import "./Stack.scss";

hljsDefineSolidity(hljs);
hljs.initHighlightingOnLoad();

const EXPAND_BY = 5;

class Stack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ref: React.createRef(),
      linesAbove: 5,
      linesBelow: 5,
    }
  }

  expandAbove = () => {
    this.setState({linesAbove: this.state.linesAbove + EXPAND_BY});
  };

  expandBelow = () => {
    this.setState({linesBelow: this.state.linesBelow + EXPAND_BY});
  };

  componentDidMount() {
    hljs.highlightBlock(this.state.ref.current);
  }

  render() {
    const {source, line} = this.props;
    const {linesAbove, linesBelow} = this.state;

    const lineNumbers = [];
    const wrapperStyle = {};
    const codeStyle = {};

    for (let i = line - linesAbove; i <= line + linesBelow; i++) {
      lineNumbers.push({number: i, active: i === line});
    }

    codeStyle.top = `${(line - linesAbove - 1) * -21}px`;
    wrapperStyle.height = `${lineNumbers.length * 21}px`;

    return (
      <div className='StackWrapper'>
        <div className='Stack' style={wrapperStyle}>
          <div className="StackLines">
            {lineNumbers.map(num =>
              <div key={num.number} id={`line-${num.number}`}
                   className={`StackLine ${num.active ? 'active' : ''}`}>{num.number}</div>
            )}
          </div>
          <pre className="StackCode" ref={this.state.ref} style={codeStyle}>
            {source}
          </pre>
        </div>
      </div>
    );
  }
}

Stack.propTypes = {
  source: PropTypes.string.isRequired,
  line: PropTypes.number.isRequired,
};

export default Stack;

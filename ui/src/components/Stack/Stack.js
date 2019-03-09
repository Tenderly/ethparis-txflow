import React, {Component} from 'react';
import PropTypes from 'prop-types';
import hljs from "highlight.js";
import hljsDefineSolidity from "highlightjs-solidity";

import "./Stack.scss";
import Icon from "../Icon/Icon";

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
      expandAboveDisabled: false,
      expandAboveBelow: false,
      numberOfLines: props.source.split("\n").length,
    }
  }

  expandAbove = () => {
    let {linesAbove, expandAboveDisabled} = this.state;
    linesAbove += EXPAND_BY;

    if (this.state.numberOfLines - (this.props.line + linesAbove) <= 1) {
      linesAbove = this.props.line - 1;
      expandAboveDisabled = true;
    }

    this.setState({linesAbove, expandAboveDisabled});
  };

  expandBelow = () => {
    let {linesBelow, expandBelowDisabled} = this.state;
    linesBelow += EXPAND_BY;

    if (this.props.line + linesBelow > this.state.numberOfLines) {
      linesBelow = this.state.numberOfLines - this.props.line - 1;
      expandBelowDisabled = true;
    }

    this.setState({linesBelow, expandBelowDisabled});
  };

  componentDidMount() {
    hljs.highlightBlock(this.state.ref.current);
  }

  render() {
    const {source, line} = this.props;
    const {linesAbove, linesBelow, expandAboveDisabled, expandBelowDisabled} = this.state;

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
        {!expandAboveDisabled && <div onClick={this.expandAbove} className="ExpandCodeButton Above">
          <Icon icon='chevrons-up'/>
        </div>}
        {!expandBelowDisabled && <div onClick={this.expandBelow} className="ExpandCodeButton Below">
          <Icon icon='chevrons-down'/>
        </div>}
      </div>
    );
  }
}

Stack.propTypes = {
  source: PropTypes.string.isRequired,
  line: PropTypes.number.isRequired,
};

export default Stack;

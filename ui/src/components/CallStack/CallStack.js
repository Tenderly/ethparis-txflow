import React, {Component} from 'react';
import PropTypes from 'prop-types';
import StackEntry from "../StackEntry/StackEntry";

import './CallStack.scss';

class CallStack extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {source, frames} = this.props;

    return (
      <div className='CallStack'>
        {frames.map((frame, i) => {
          return <StackEntry key={i} contractName={frame.contractName} level={frame.level} source={source}
                             functionName={frame.functionName} line={frame.line} contractAddress={frame.contractAddress}/>;
        })}
      </div>
    );
  }
}

CallStack.propTypes = {
  source: PropTypes.string.isRequired,
  frames: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CallStack;
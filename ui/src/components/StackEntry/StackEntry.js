import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Stack from "../Stack/Stack";

import "./StackEntry.scss";
import Icon from "../Icon/Icon";

function hashContract(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = Math.imul(31, h) + name.charCodeAt(i) | 0;
  }
  return Math.abs(h) % 4;
}

class StackEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    }
  }

  handleToggle = () => {
    this.setState({open: !this.state.open});
  };

  render() {
    const {open} = this.state;
    const {source, line, contractName, variant, title, level} = this.props;

    const levelStyle = {
      marginLeft: `${level * 28}px`,
    };

    return (
      <div className='StackEntry'>
        <div className='StackEntryHeadingWrapper' onClick={this.handleToggle}>
          <div className={`StackEntryHeading TraceMessageVariant${variant}`} style={levelStyle}>
            <Icon icon="circle" className="PointIcon"/>
            <div className={"TraceMessage"}>{title}<span className="LineNumber">:{line}</span></div>
            <div className="TraceFile">{contractName}.sol</div>
          </div>
        </div>
        {open && <Stack source={source} line={line}/>}
      </div>
    );
  }
}

StackEntry.propTypes = {
  source: PropTypes.string.isRequired,
  contractName: PropTypes.string.isRequired,
  contractAddress: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  line: PropTypes.number.isRequired,
  level: PropTypes.number.isRequired,
  variant: PropTypes.number.isRequired,
};

export default StackEntry;

import React, {Component} from 'react';
import classNames from 'classnames';

import "./Spinner.scss";

export default class Spinner extends Component {
  render() {
    return (
      <div className={classNames("Spinner", this.props.className)}>
        <div className="breeding-rhombus-spinner">
          <div className="rhombus child-1"/>
          <div className="rhombus child-2"/>
          <div className="rhombus child-3"/>
          <div className="rhombus child-4"/>
          <div className="rhombus child-5"/>
          <div className="rhombus child-6"/>
          <div className="rhombus child-7"/>
          <div className="rhombus child-8"/>
          <div className="rhombus big"/>
        </div>
      </div>
    );
  }
}
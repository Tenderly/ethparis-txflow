import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import "./Search.scss";

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tx: '',
      enabled: true,
    };
  }

  handleChange = (event) => {
    event.preventDefault();

    this.setState({tx: event.target.value});
  };

  handleSearch = async (event) => {
    if (event.key !== 'Enter' || !this.state.tx.length) {
      return;
    }

    this.setState({enabled: false});
    await this.props.onSearch(this.state.tx);
    this.setState({enabled: true});
  };

  render() {
    const {tx, enabled} = this.state;

    return (
      <div className={classNames('Search', this.props.className)}>
        <div className='Input'>
          <input disabled={!enabled} id='search' className='InputText' type='text' value={tx}
                 onChange={this.handleChange} onKeyUp={this.handleSearch} placeholder='Tx Hash' autoComplete='off'
                 autoFocus={true}/>
          <label htmlFor="search" className="SearchLabel">Tx Hash</label>
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default Search;
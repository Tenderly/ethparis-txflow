import React, {Component} from 'react';
import './App.scss';
import 'highlight.js/styles/dracula.css';
import CallStack from "./components/CallStack/CallStack";
import Search from "./components/Search/Search";
import Spinner from "./components/Spinner/Spinner";
import classNames from 'classnames';
import TraceService from "./services/trace/TraceService";

import logo from './logo.svg';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frames: undefined,
      loading: false,
      loaded: false,
    };
  }

  async componentDidMount() {
  }

  onSearch = async (tx) => {
    try {
      this.setState({loading: true, loaded: false});
      const frames = await TraceService.getTrace(tx);

      this.setState({
        loading: false,
        frames: frames,
        loaded: true,
      });
    } catch (e) {
      console.error(e);
      this.setState({
        loading: false,
        loaded: false,
        frames: undefined,
      });
    }
  };

  render() {
    const {frames, loading, loaded} = this.state;

    return (
      <div className="App">
        <div className={`TxLogoWrapper ${loaded || loading ? 'loading' : ''}`} style={{
          backgroundImage: `url(${logo})`,
        }}/>
        {(loading || loaded) && <Spinner className={classNames({loading, loaded})}/>}
        <Search className={classNames({MoveUp: loading || (frames && frames.length)})} onSearch={this.onSearch}/>

        {!loading && frames && frames.length && <CallStack frames={frames}/>}
      </div>
    );
  }
}

export default App;

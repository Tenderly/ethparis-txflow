import React, {Component} from 'react';
import './App.scss';
import 'highlight.js/styles/dracula.css';
import CallStack from "./components/CallStack/CallStack";
import Search from "./components/Search/Search";
import Spinner from "./components/Spinner/Spinner";
import classNames from 'classnames';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: require("./services/contract/Counters"),
      frames: undefined,
      loading: false,
      loaded: false,
    };
  }

  async componentDidMount() {
  }

  onSearch = async (tx) => {
    this.setState({loading: true, loaded: false});
    return new Promise((resolve => {
      setTimeout(() => {
        this.setState({
          loading: false,
          frames: require('./frames').default,
          loaded: true,
        });
        resolve();
      }, 1000)
    }));
  };

  render() {
    const {frames, loading, loaded} = this.state;

    return (
      <div className="App">
        {(loading || loaded) && <Spinner className={classNames({loading, loaded})}/>}
        <Search className={classNames({MoveUp: loading || (frames && frames.length)})} onSearch={this.onSearch}/>

        {!loading && frames && frames.length && <CallStack source={this.state.temp} frames={frames}/>}
      </div>
    );
  }
}

export default App;

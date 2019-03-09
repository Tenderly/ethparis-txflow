import React, {Component} from 'react';
import './App.scss';
import 'highlight.js/styles/dracula.css';
import CallStack from "./components/CallStack/CallStack";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: require("./services/contract/Counters"),
    };
  }

  async componentDidMount() {
  }

  render() {
    return (
      <div className="App">
        <CallStack source={this.state.temp} frames={
          [
            {
              contractName: 'Counters',
              functionName: 'getCounter',
              contractAddress: '0x5afe43d905ddedd63064f424c3c8ef9bde130e0e',
              level: 0,
              line: 30,
            },
            {
              contractName: 'Migrations',
              functionName: 'getCounter',
              contractAddress: '0x8fad44777e768a813fa8b5782a0eba4634e5bbf0',
              level: 1,
              line: 30,
            },
            {
              contractName: 'Counters',
              functionName: 'getCounter',
              contractAddress: '0x5afe43d905ddedd63064f424c3c8ef9bde130e0e',
              level: 1,
              line: 30,
            },
            {
              contractName: 'Counters',
              functionName: 'getCounter',
              contractAddress: '0x5afe43d905ddedd63064f424c3c8ef9bde130e0e',
              level: 2,
              line: 30,
            },
            {
              contractName: 'Counters',
              functionName: 'getCounter',
              contractAddress: '0x5afe43d905ddedd63064f424c3c8ef9bde130e0e',
              level: 2,
              line: 30,
            },
            {
              contractName: 'Counters',
              functionName: 'getCounter',
              contractAddress: '0x5afe43d905ddedd63064f424c3c8ef9bde130e0e',
              level: 3,
              line: 30,
            },
            {
              contractName: 'Counters',
              functionName: 'getCounter',
              contractAddress: '0x5afe43d905ddedd63064f424c3c8ef9bde130e0e',
              level: 0,
              line: 30,
            }
          ]
        }/>
      </div>
    );
  }
}

export default App;

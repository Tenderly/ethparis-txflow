import React, {Component} from 'react';
import logo from './logo.svg';
import './App.scss';
import TraceService from "./services/trace/TraceService";
import ContractService from "./services/contract/ContractService";

class App extends Component {
  async componentDidMount() {
    const trace = await TraceService.getTrace('0x1232');
    console.log(trace);
    const contracts = await ContractService.getContracts(['0x1', '0x2']);
    console.log(contracts);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;

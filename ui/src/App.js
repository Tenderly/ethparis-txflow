import React, {Component} from 'react';
import './App.scss';
import 'highlight.js/styles/dracula.css';
import Stack from "./components/Stack/Stack";

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
        <Stack line={30} source={this.state.temp}/>
      </div>
    );
  }
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom/client';
var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);

class App extends React.Component {
  state = {
    page: 0,
    username: "",
    password: "",
    weekDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    weekData: [],
    chartData: {
      isLoading: true,
      animationEnabled: true,
      theme: "light2",
      title: {
        text: ""
      },
      axisY: {
        title: "",
        logarithmic: true
      },
      data: [{
        type: "spline",
        showInLegend: true,
        legendText: "",
        dataPoints: [
          { x: new Date(2001, 0), y: 1615 },
        ]
      }]
    }
  }

  componentDidMount() {

  }

  render() {
    if (this.state.page == 0) {
      return (
        <form method="post" action="/login">
          <input value={this.state.username} onChange={(e) => this.setState({ username: e.target.value })} type="text" name="mysql username" />
          <input value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} type="password" name="mysql password" />
          <input onClick={(e) => this.componentClicked(e)} type="submit" value="View Analytics" />
        </form>
      )
    }
  }

  componentClicked() {
    e.preventDefault();
    fetch(`http://localhost/api/${this.state.username}/${this.state.password}/listall/week`).then((response) => {
      console.log(response.text);
    })
  }
}
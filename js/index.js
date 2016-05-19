"use strict";

/*
  timing
  nextstate calculation
  update state
*/

var DEAD = 0;
var ALIVE = 1;

var SLOW = 1000;
var MEDIUM = 500;
var FAST = 300;

// create 2d array of dead cells.
function create2d(a, b) {
  var matrix = new Array(a);
  for (var i = 0; i < a; i++) {
    matrix[i] = new Array(b);
    for (var j = 0; j < b; j++) {
      // assigned randomly either 0 or 1.
      matrix[i][j] = Math.floor(Math.random() * 2);
    }
  }
  return matrix;
}
// end create2d.

// updates values for next generation
function nextGeneration(current, next) {}

// main window of game.
var GameView = React.createClass({
  displayName: "GameView",

  getInitialState: function getInitialState() {
    // initial default state of game
    return {
      current: create2d(50, 70),
      next: create2d(50, 70),
      size: [50, 70],
      speed: MEDIUM,
      generation: 0,
      isOn: true
    };
  },
  componentDidMount: function componentDidMount() {
    window.setInterval(this.nextState, this.state.speed);
  },
  nextState: function nextState() {
    var next = create2d(50, 70);
    var currentState = this.state;
    var currentProps = this.state.props;
    this.setState({ current: next });
    this.setState(function (currentState, currentProps) {
      return { generation: currentState.generation + 1 };
    });
  },
  render: function render() {
    return React.createElement(
      "div",
      { id: "GameView" },
      React.createElement(TopControls, {
        generation: this.state.generation,
        isOn: this.state.isOn
      }),
      React.createElement(Matrix, { current: this.state.current }),
      React.createElement(BottomControls, {
        size: this.state.size,
        speed: this.state.speed
      })
    )
    // end GameView
    ;
  }
  // end render
});
// end main window of game.

// start/pause/clear options, prop: generation.
var TopControls = React.createClass({
  displayName: "TopControls",

  render: function render() {
    return React.createElement(
      "div",
      { id: "TopControls", className: "controls" },
      React.createElement(
        "ul",
        null,
        React.createElement(
          "li",
          null,
          React.createElement(
            "button",
            null,
            "Start"
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            "button",
            null,
            "Pause"
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            "button",
            null,
            "Clear"
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            "button",
            { disabled: true },
            "Generation: ",
            this.props.generation
          )
        )
      )
    );
  }
  // end render
});
// end of top controls.

// table of cells.
var Matrix = React.createClass({
  displayName: "Matrix",

  render: function render() {
    var rows = [];
    for (var i = 0; i < this.props.current.length; i++) {
      var cells = [];
      for (var j = 0; j < this.props.current[i].length; j++) {
        cells.push(React.createElement(Cell, { state: this.props.current[i][j] }));
      }
      rows.push(React.createElement(CellRow, { cells: cells }));
    }
    return React.createElement(
      "div",
      { id: "Matrix" },
      React.createElement(
        "table",
        null,
        rows
      )
    );
  }
  // end render
});
// end of table.

// row of cells
var CellRow = React.createClass({
  displayName: "CellRow",

  render: function render() {
    return React.createElement(
      "tr",
      null,
      this.props.cells
    );
  }
});
// end of row.

// cell, prop: alive/dead, neigbors...maybe as a sum.
var Cell = React.createClass({
  displayName: "Cell",

  render: function render() {
    var color = this.props.state ? '#90020d' : '#291013';
    var css = { backgroundColor: color };
    return React.createElement(
      "td",
      null,
      React.createElement("div", { style: css })
    );
  }
});
// end of cell.

// controls for size and speed.
var BottomControls = React.createClass({
  displayName: "BottomControls",

  render: function render() {
    return React.createElement(
      "div",
      { id: "BottomControls", className: "controls" },
      React.createElement(
        "ul",
        null,
        React.createElement(
          "li",
          null,
          React.createElement(
            "button",
            { disabled: true },
            "Board Size: "
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            "button",
            null,
            "30x50"
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            "button",
            null,
            "50x70"
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            "button",
            null,
            "80x100"
          )
        )
      ),
      React.createElement(
        "ul",
        null,
        React.createElement(
          "li",
          null,
          React.createElement(
            "button",
            { disabled: true },
            "Speed: "
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            "button",
            null,
            "slow"
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            "button",
            null,
            "medium"
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            "button",
            null,
            "fast"
          )
        )
      )
    );
  }
  // end render
});
// end of bottom controls.

React.render(React.createElement(GameView, null), document.getElementById('matrix'));
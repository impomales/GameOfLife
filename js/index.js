"use strict";

var DEAD = 0;
var ALIVE = 1;

var SLOW = 300;
var MEDIUM = 100;
var FAST = 50;

// create 2d array of cells.
function create2d(a, b) {
  var matrix = new Array(a);
  for (var i = 0; i < a; i++) {
    matrix[i] = new Array(b);
    for (var j = 0; j < b; j++) {
      // assigned randomly either 0 or 1.
      matrix[i][j] = Math.random() < 0.5 ? 1 : 0;
    }
  }
  return matrix;
}
// end create2d.

// sums the neighbors at cell(i, j)
// wraps around if index out of bounds.
function sumNeighbors(current, i, j) {
  var iMinus = i - 1;
  var iPlus = i + 1;
  var jMinus = j - 1;
  var jPlus = j + 1;

  if (iPlus >= current.length) iPlus = 0;
  if (iMinus < 0) iMinus = current.length - 1;
  if (jPlus >= current[i].length) jPlus = 0;
  if (jMinus < 0) jMinus = current[i].length - 1;

  return current[iMinus][jMinus] + current[iMinus][j] + current[iMinus][jPlus] + current[i][jMinus] + current[i][jPlus] + current[iPlus][jMinus] + current[iPlus][j] + current[iPlus][jPlus];
}

// updates values for next generation
function nextGeneration(current) {
  var next = create2d(current.length, current[0].length);
  for (var i = 0; i < current.length; i++) {
    for (var j = 0; j < current[i].length; j++) {
      // get neighbors
      var neighbors = sumNeighbors(current, i, j);
      // sum of neighbors and current[i][j]
      var sum = neighbors + current[i][j];
      // rules for next generation.

      if (sum === 3) next[i][j] = ALIVE;else if (sum === 4) next[i][j] = current[i][j];else next[i][j] = DEAD;

      /*
      if (current[i][j] === ALIVE) {
        if (neighbors < 2 || neighbors > 3)
          next[i][j] = DEAD;
        else next[i][j] = ALIVE;
      } else {
        if (neighbors === 3) next[i][j] = ALIVE;
        else next[i][j] = DEAD;
      }
      */
    }
  }
  return next;
}

// main window of game.
var GameView = React.createClass({
  displayName: "GameView",

  getInitialState: function getInitialState() {
    // initial default state of game
    return {
      current: create2d(50, 70),
      previous: create2d(50, 70),
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
    var next = nextGeneration(this.state.current);
    this.setState(function (previousState, currentProps) {
      return { current: next,
        previous: previousState.current,
        generation: previousState.generation + 1 };
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
      React.createElement(Matrix, { current: this.state.current, prev: this.state.previous }),
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
        cells.push(React.createElement(Cell, {
          state: this.props.current[i][j],
          prev: this.props.prev[i][j] }));
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
    if (this.props.state && this.props.state != this.props.prev) {
      color = '#fb0418';
    }
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
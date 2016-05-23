"use strict";

/*
  user can change speed
*/

var DEAD = 0;
var ALIVE = 1;

var SLOW = 300;
var MEDIUM = 150;
var FAST = 50;

var SMALL = [30, 50];
var MEDIUMsIZE = [50, 70];
var LARGE = [80, 100];

var interval;

//create 2d array of dead cells.
function create2dDead(a, b) {
  var matrix = new Array(a);
  for (var i = 0; i < a; i++) {
    matrix[i] = new Array(b);
    for (var j = 0; j < b; j++) {
      // assigned randomly either 0 or 1.
      matrix[i][j] = 0;
    }
  }
  return matrix;
}
// end create 2d dead.

// create 2d array of random cells.
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
      current: create2d(MEDIUMsIZE[0], MEDIUMsIZE[1]),
      previous: create2d(MEDIUMsIZE[0], MEDIUMsIZE[1]),
      size: MEDIUMsIZE,
      speed: MEDIUM,
      generation: 0,
      isOn: true
    };
  },
  componentDidMount: function componentDidMount() {
    interval = window.setInterval(this.nextState, this.state.speed);
  },
  nextState: function nextState() {
    if (this.state.isOn) {
      var next = nextGeneration(this.state.current);
      this.setState(function (previousState, currentProps) {
        return { current: next,
          previous: previousState.current,
          generation: previousState.generation + 1 };
      });
    }
  },
  handleClick: function handleClick(x, y) {
    this.state.current[x][y] = this.state.current[x][y] ? 0 : 1;
    this.setState();
  },
  startGame: function startGame() {
    if (!this.state.isOn) {
      this.setState({ isOn: true });
    }
  },
  stopGame: function stopGame() {
    if (this.state.isOn) {
      this.setState({ isOn: false });
    }
  },
  clearGame: function clearGame() {
    this.setState(function (previousState, currentProps) {
      return { current: create2dDead(previousState.size[0], previousState.size[1]),
        previous: create2dDead(previousState.size[0], previousState.size[1]),
        generation: 0,
        isOn: false };
    });
  },
  changeSpeed: function changeSpeed(speed) {
    this.setState({ speed: speed }, function () {
      window.clearInterval(interval);
      interval = window.setInterval(this.nextState, speed);
    });
  },
  changeSize: function changeSize(x, y) {
    this.setState(function (previousState, currentProps) {
      return { current: create2d(x, y),
        previous: create2d(x, y),
        size: [x, y],
        generation: 0 };
    });
  },
  render: function render() {
    return React.createElement(
      "div",
      { id: "GameView" },
      React.createElement(TopControls, {
        generation: this.state.generation,
        handleStart: this.startGame,
        handlePause: this.stopGame,
        handleClear: this.clearGame
      }),
      React.createElement(Matrix, { current: this.state.current,
        prev: this.state.previous,
        handleClick: this.handleClick }),
      React.createElement(BottomControls, {
        handleSize: this.changeSize,
        handleSpeed: this.changeSpeed
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

  handleStart: function handleStart(e) {
    e.preventDefault();
    this.props.handleStart();
  },
  handlePause: function handlePause(e) {
    e.preventDefault();
    this.props.handlePause();
  },
  handleClear: function handleClear(e) {
    e.preventDefault();
    this.props.handleClear();
  },
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
            { onClick: this.handleStart },
            "Start"
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            "button",
            { onClick: this.handlePause },
            "Pause"
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            "button",
            { onClick: this.handleClear },
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

  handleClick: function handleClick(x, y) {
    this.props.handleClick(x, y);
  },
  render: function render() {
    var rows = [];
    for (var i = 0; i < this.props.current.length; i++) {
      var cells = [];
      for (var j = 0; j < this.props.current[i].length; j++) {
        cells.push(React.createElement(Cell, {
          state: this.props.current[i][j],
          prev: this.props.prev[i][j],
          handleClick: this.handleClick,
          coords: [i, j],
          key: i * j + j }));
      }
      rows.push(React.createElement(CellRow, { cells: cells, key: i }));
    }
    return React.createElement(
      "div",
      { id: "Matrix" },
      React.createElement(
        "table",
        null,
        React.createElement(
          "tbody",
          null,
          rows
        )
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

  handleClick: function handleClick(e) {
    e.preventDefault();
    this.props.handleClick(this.props.coords[0], this.props.coords[1]);
  },
  render: function render() {
    var color = this.props.state ? '#90020d' : '#291013';
    if (this.props.state && this.props.state != this.props.prev) {
      color = '#fb0418';
    }
    var css = { backgroundColor: color };
    return React.createElement(
      "td",
      null,
      React.createElement("div", { style: css,
        onClick: this.handleClick })
    );
  }
});
// end of cell.

// controls for size and speed.
var BottomControls = React.createClass({
  displayName: "BottomControls",

  handleSize: function handleSize(e) {
    e.preventDefault();
    var size = e.target.value.split('x');
    this.props.handleSize(parseInt(size[0]), parseInt(size[1]));
  },
  handleSpeed: function handleSpeed(e) {
    e.preventDefault();
    this.props.handleSpeed(parseInt(e.target.value));
  },
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
            { onClick: this.handleSize, value: "30x50" },
            "30x50"
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            "button",
            { onClick: this.handleSize, value: "50x70" },
            "50x70"
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            "button",
            { onClick: this.handleSize, value: "80x100" },
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
            { onClick: this.handleSpeed, value: SLOW },
            "slow"
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            "button",
            { onClick: this.handleSpeed, value: MEDIUM },
            "medium"
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            "button",
            { onClick: this.handleSpeed, value: FAST },
            "fast"
          )
        )
      )
    );
  }
  // end render
});
// end of bottom controls.

ReactDOM.render(React.createElement(GameView, null), document.getElementById('matrix'));
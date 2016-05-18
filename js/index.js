"use strict";

/*
  refactor controls into separate components.
  render table based on size
  cell component
  timing
  nextstate calculation
  update state
*/

var DEAD = 0;
var ALIVE = 1;

// create 2d array of dead cells.
function create2d(a, b) {
  var matrix = new Array(a);
  for (var i = 0; i < a; i++) {
    matrix[i] = new Array(b);
    for (var j = 0; j < b; j++) {
      matrix[i][j] = DEAD;
    }
  }
  return matrix;
}
// end create2d.

// initial state of game.
var state = {
  current: create2d(70, 50),
  next: create2d(70, 50),
  size: [70, 50],
  speed: 'medium',
  generation: 0
};

// main window of game.
var GameView = React.createClass({
  displayName: "GameView",

  getInitialState: function getInitialState() {
    return { state: state };
  },
  render: function render() {
    return React.createElement(
      "div",
      { id: "GameView" },
      React.createElement(
        "div",
        { id: "GameView-TopControls", className: "controls" },
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
              "Generation: "
            )
          )
        )
      ),
      React.createElement(
        "div",
        { id: "GameView-Matrix" },
        React.createElement(
          "table",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement("td", null),
            React.createElement("td", null),
            React.createElement("td", null)
          ),
          React.createElement(
            "tr",
            null,
            React.createElement("td", null),
            React.createElement("td", null),
            React.createElement("td", null)
          ),
          React.createElement(
            "tr",
            null,
            React.createElement("td", null),
            React.createElement("td", null),
            React.createElement("td", null)
          )
        )
      ),
      React.createElement(
        "div",
        { id: "GameView-BottomControls", className: "controls" },
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
              "50x30"
            )
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "button",
              null,
              "70x50"
            )
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "button",
              null,
              "100x80"
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
      )
    )
    // end GameView
    ;
  }
  // end render
});
// end main window of game.

React.render(React.createElement(GameView, null), document.getElementById('matrix'));
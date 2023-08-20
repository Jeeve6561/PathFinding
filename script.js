GRAPH = document.getElementById("graph");
ROWS = 12;
COLS = 18;
HEIGHT = GRAPH.clientHeight / ROWS;
WIDTH = GRAPH.clientWidth / COLS;
SETTING = null;
START_SQUARE = null;
END_SQUARE = null;
WALL_SQUARES = {};
NEIGHBORS = {};
START_BUTTON = document.getElementById("start");
END_BUTTON = document.getElementById("end");
WALL_BUTTON = document.getElementById("wall");
DONE_BUTTON = document.getElementById("done");

function MakeGrid(rows, cols) {
  for (let r = 0; r < rows; r++) {
    gridRow = document.createElement("div");
    for (let c = 0; c < cols; c++) {
      cell = document.createElement("div");
      cell.style.height = HEIGHT + "px";
      cell.style.width = WIDTH + "px";
      cell.setAttribute("id", r + "-" + c);
      cell.classList.add("square");
      cell.onmousedown = (event) => {
        SetCellClick(event.target);
      };
      cell.onmouseover = (event) => {
        SetCellDrag(event);
      };
      WALL_SQUARES[cell.id] = "clear";
      gridRow.appendChild(cell);
    }
    gridRow.classList.add("row");
    GRAPH.appendChild(gridRow);
  }
}

function ResetGrid() {
  DoneWithSettings();
  GRAPH.innerHTML = "";
  MakeGrid(ROWS, COLS);
}

function ChangeSetting(type) {
  if (SETTING === "start") {
    START_BUTTON.classList.remove("startpressed");
  } else if (SETTING === "end") {
    END_BUTTON.classList.remove("endpressed");
  } else if (SETTING === "wall") {
    WALL_BUTTON.classList.remove("wallpressed");
  }

  if (type === "start") {
    START_BUTTON.classList.add("startpressed");
  } else if (type === "end") {
    END_BUTTON.classList.add("endpressed");
  } else if (type === "wall") {
    WALL_BUTTON.classList.add("wallpressed");
  }

  SETTING = type;
}

function DoneWithSettings() {
  if (SETTING === "start") {
    START_BUTTON.classList.remove("startpressed");
  } else if (SETTING === "end") {
    END_BUTTON.classList.remove("endpressed");
  } else if (SETTING === "wall") {
    WALL_BUTTON.classList.remove("wallpressed");
  }
  SETTING = null;
}

function SetCellClick(cell) {
  if (SETTING === "start") {
    if (START_SQUARE != null) {
      oldStart = document.getElementById(START_SQUARE);
      oldStart.classList = [];
      oldStart.classList.add("square");
      WALL_SQUARES[START_SQUARE] = "clear";
    }
    START_SQUARE = cell.id;
    cell.classList = [];
    cell.classList.add("startsquare");
    WALL_SQUARES[cell.id] = "start";
  } else if (SETTING === "end") {
    if (END_SQUARE != null) {
      oldEnd = document.getElementById(END_SQUARE);
      oldEnd.classList = [];
      oldEnd.classList.add("square");
      WALL_SQUARES[END_SQUARE] = "clear";
    }
    END_SQUARE = cell.id;
    cell.classList = [];
    cell.classList.add("endsquare");
    WALL_SQUARES[cell.id] = "end";
  } else if (
    SETTING === "wall" &&
    cell.id != START_SQUARE &&
    cell.id != END_SQUARE
  ) {
    cell.classList = [];
    cell.classList.add("wallsquare");
    WALL_SQUARES[cell.id] = "wall";
  }
}

function SetCellDrag(event) {
  if (
    SETTING === "wall" &&
    event.buttons === 1 &&
    event.target.id != START_SQUARE &&
    event.target.id != END_SQUARE
  ) {
    cell = event.target;
    cell.classList.remove("square");
    cell.classList.add("wallsquare");
    WALL_SQUARES[cell.id] = "wall";
  }
}

window.onresize = () => {
  ResetGrid();
};
window.onmousedown = (event) => {
  event.preventDefault();
};
MakeGrid(ROWS, COLS);

function GetNeighbors(cellId) {
  coords = cellId.split("-");
  row = parseInt(coords[0]);
  col = parseInt(coords[1]);

  neighbors = [];
  if (row > 0) {
    neighborId = toString(row - 1) + "-" + toString(col);
    if (WALL_SQUARES[neighborId] != "wall") {
      neighbors.add(neighborId);
    }
  }
  if (row < ROWS - 1) {
    neighborId = toString(row + 1) + "-" + toString(col);
    if (WALL_SQUARES[neighborId] != "wall") {
      neighbors.add(neighborId);
    }
  }
  if (col > 0) {
    neighborId = toString(row) + "-" + toString(col - 1);
    if (WALL_SQUARES[neighborId] != "wall") {
      neighbors.add(neighborId);
    }
  }
  if (col < COLS - 1) {
    neighborId = toString(row) + "-" + toString(col + 1);
    if (WALL_SQUARES[neighborId] != "wall") {
      neighbors.add(neighborId);
    }
  }

  NEIGHBORS[cellId] = neighbors;
}

function GetAllNeighors() {
  WALL_SQUARES.forEach((key, val) => {
    if (val != "wall" && val != "end") {
      GetNeighbors(key);
    }
  });
}


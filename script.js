let lossCount = 0;
let winCount = 0;

function isBomb() {
  //returns true or false
  return Math.floor(Math.random() * 10) === 1;
}

function endGame(result) {

  const tiles = document.querySelectorAll(".tile");

  tiles.forEach((tile) => {
    tile.classList.add("clicked", "ok");
    tile.removeEventListener("click", handleClick);
  });

  if(result === "win") {
    winCount++;
    document.getElementById("wins").innerHTML = winCount;
    document.getElementById("result").innerHTML = "You Won!";
  } else if(result === "lose") {
    lossCount++;
    document.getElementById("losses").innerHTML = lossCount;
    document.getElementById("result").innerHTML = "You Lost!";
  }
  
}

function freeTileCount() {
  const totalTiles = document.querySelectorAll(".tile").length;
  const bombs = document.querySelectorAll(".bomb").length;
  const freeTiles = totalTiles - bombs;
  return freeTiles;
}

document.getElementById('new-game').addEventListener('click', newGame);

//nested loop to create the table grid, tile gets created and added to the grid. randomizer to either create a bomb, or nothing.
//then we select all the tiles and check each ones radius by returning an array of their surrounding tiles.
//We count the amount of surrounding bombs and give it a class of either free or numbered depending on if there are bombs around or not
function newGame() {
  const tableGrid = document.getElementById("table-grid");

  tableGrid.innerHTML = "";
  document.getElementById("result").innerHTML = "";

  let rows = 15;
  let columns = 20;

 tileCount = 1;

  for (let row = 1; row <= rows; row++) {
    for (let col = 1; col <= columns; col++) {
      //if isBomb is true, pass bomb, if not pass nothing
      const bombClass = isBomb() ? " bomb" : "";

      const newTile = `<div id="tile-${tileCount}" class="tile${bombClass}" data-row="${row}" data-column="${col}"></div>`;

      tableGrid.insertAdjacentHTML("beforeend", newTile);

      tileCount++;
    }
  }

  const tiles = document.querySelectorAll(".tile");

  tiles.forEach((tile) => {
    tile.addEventListener("click", handleClick);

    //returns an array of all the surrounding tiles
    const surroundingTiles = checkRadius(tile);

    //counts the amount of bombs are surrounding 
    const bombCount = surroundingTiles.filter((i) =>
      i.classList.contains("bomb")
    ).length;

    if (bombCount === 0 && !tile.classList.contains("bomb")) {
      tile.textContent = "";
      tile.classList.add("free");
    } else if (bombCount > 0 && !tile.classList.contains("bomb")) {
      tile.classList.add("numbered");
      tile.innerHTML = bombCount;
    }
  });
}

newGame();

//This function says if you click on a bomb, endgame, if you click on "numbered" just give the ok class, 
//if you click on "free" then we create an array, put the clicked tile inside, then use a recursive function to keep adding free tiles to it
function handleClick(event) {
  const clickedTile = event.target.closest(".tile");

  if (clickedTile.classList.contains("bomb")) {
    endGame("lose");
    return;
  }

  if (clickedTile.classList.contains("numbered")) {
    clickedTile.classList.add("ok");
  }

  if (clickedTile.classList.contains("free")) {
    const freeTiles = [clickedTile];
    //clicked tile gets put in the array of freetiles


    //it recursively explores neighboring tiles by calling itself with the newly discovered free tiles as parameters.

    function exploreTile(tile) {
      const checkedTiles = checkRadius(tile);
      //Check radius of clicked tile
      checkedTiles.forEach((newFreeTile) => {
        //if freeTiles array doesn't already include the newfreetile
        if (!freeTiles.includes(newFreeTile) && newFreeTile.classList.contains("free")) {
          freeTiles.push(newFreeTile);
          exploreTile(newFreeTile);
          //goes round again with the new free tile as a the parameter, not the clicked one
        }

        if (!freeTiles.includes(newFreeTile) && newFreeTile.classList.contains("numbered") ) { 
            freeTiles.push(newFreeTile);
        }
      });
    }

    exploreTile(clickedTile);

    freeTiles.forEach((freeTile) => {
      freeTile.classList.add("ok");
    });
  }

  const freeAndNumberedTiles = document.querySelectorAll(".ok").length;

  if (freeTileCount() === freeAndNumberedTiles) {
    endGame("win");
  }
}

//parseInt turns string into integer
function checkRadius(i) {
  const row = parseInt(i.getAttribute("data-row"));
  const column = parseInt(i.getAttribute("data-column"));
  const rowAbove = row - 1;
  const rowBelow = row + 1;
  const colLeft = column - 1;
  const colRight = column + 1;

  const tileAbove = document.querySelector(
    `.tile[data-row="${rowAbove}"][data-column="${column}"]`
  );
  const tileBelow = document.querySelector(
    `.tile[data-row="${rowBelow}"][data-column="${column}"]`
  );
  const tileAboveLeft = document.querySelector(
    `.tile[data-row="${rowAbove}"][data-column="${colLeft}"]`
  );
  const tileAboveRight = document.querySelector(
    `.tile[data-row="${rowAbove}"][data-column="${colRight}"]`
  );
  const tileBelowLeft = document.querySelector(
    `.tile[data-row="${rowBelow}"][data-column="${colLeft}"]`
  );
  const tileBelowRight = document.querySelector(
    `.tile[data-row="${rowBelow}"][data-column="${colRight}"]`
  );
  const tileLeft = document.querySelector(
    `.tile[data-row="${row}"][data-column="${colLeft}"]`
  );
  const tileRight = document.querySelector(
    `.tile[data-row="${row}"][data-column="${colRight}"]`
  );

  const surroundingTiles = [
    tileAbove,
    tileBelow,
    tileAboveLeft,
    tileAboveRight,
    tileBelowLeft,
    tileBelowRight,
    tileLeft,
    tileRight,
  ];

  return surroundingTiles.filter((tile) => tile !== null);
  //only return elements that aren't null.
}

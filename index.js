/**
 * Tic-tac-toe Game Implementation
 * This is a simple implementation of the classic Tic-tac-toe game using vanilla JavaScript.
 * The game keeps track of wins for both players and ties.
 */

(() => {
  // ========== CONSTANTS & DOM ELEMENTS ==========

  /**
   * All possible winning combinations in the game
   * Each array represents the indices of squares that form a winning line
   */
  const WIN_CONDITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  /**
   * Object containing all DOM elements needed for the game
   * Collecting them here makes it easier to manage and update the UI
   */
  const elements = {
    squares: document.querySelectorAll(".square"), // All game squares
    statusText: document.querySelector("#statusText"), // Game status message
    restartBtn: document.querySelector("#restartBtn"), // Restart button
    playerXWins: document.querySelector("#playerXWins"), // Player X's win count
    playerOWins: document.querySelector("#playerOWins"), // Player O's win count
    ties: document.querySelector("#ties"), // Number of ties
  };

  // ========== GAME STATE ==========

  /**
   * Object containing all game state information
   * Keeping state in one place makes it easier to track and modify
   */
  const gameState = {
    options: Array(9).fill(""), // Represents the game board (empty strings)
    currentPlayer: "X", // Current player's turn (X or O)
    running: false, // Whether the game is in progress
    stats: {
      // Game statistics
      X: 0, // X's wins
      O: 0, // O's wins
      ties: 0, // Number of ties
    },
  };

  // ========== GAME LOGIC FUNCTIONS ==========

  /**
   * Handles a square being clicked
   * @param {Event} event - The click event
   */
  const squareClicked = (event) => {
    const square = event.target;
    const squareIndex = Array.from(elements.squares).indexOf(square);

    // Ignore click if square is already filled or game is not running
    if (gameState.options[squareIndex] !== "" || !gameState.running) {
      return;
    }

    updateSquare(square, squareIndex);
    checkWinner();
  };

  /**
   * Updates a square with the current player's mark
   * @param {Element} square - The square DOM element
   * @param {number} index - The square's index
   */
  const updateSquare = (square, index) => {
    gameState.options[index] = gameState.currentPlayer;
    square.textContent = gameState.currentPlayer;
    square.classList.add(gameState.currentPlayer.toLowerCase());

    // Add and remove animation class
    square.classList.add("move-animation");
    setTimeout(() => square.classList.remove("move-animation"), 300);
  };

  /**
   * Switches the current player and updates the status display
   */
  const changePlayer = () => {
    gameState.currentPlayer = gameState.currentPlayer === "X" ? "O" : "X";
    elements.statusText.textContent = `Player ${gameState.currentPlayer}'s Turn`;

    // Update status text color based on current player
    elements.statusText.style.color =
      gameState.currentPlayer === "X" ? "#ff61ef" : "#61efff";
  };

  /**
   * Checks if there's a winner or tie after each move
   */
  const checkWinner = () => {
    let roundWon = false;

    // Check each winning condition
    for (const condition of WIN_CONDITIONS) {
      const [a, b, c] = condition;
      const squareA = gameState.options[a];
      const squareB = gameState.options[b];
      const squareC = gameState.options[c];

      // Skip if any square in the condition is empty
      if (squareA === "" || squareB === "" || squareC === "") {
        continue;
      }

      // Check if all squares in the condition have the same mark
      if (squareA === squareB && squareB === squareC) {
        roundWon = true;
        highlightWinningSquares([a, b, c]);
        break;
      }
    }

    if (roundWon) {
      // Handle win
      elements.statusText.textContent = `Player ${gameState.currentPlayer} Wins!`;
      gameState.stats[gameState.currentPlayer]++;
      gameState.running = false;
      updateStats();
    } else if (!gameState.options.includes("")) {
      // Handle tie
      elements.statusText.textContent = `Game Tied!`;
      gameState.stats.ties++;
      gameState.running = false;
      updateStats();
    } else {
      // Game continues
      changePlayer();
    }
  };

  // ========== UI UPDATE FUNCTIONS ==========

  /**
   * Updates the display of win/tie statistics
   */
  const updateStats = () => {
    elements.playerXWins.textContent = `${gameState.stats.X} wins`;
    elements.playerOWins.textContent = `${gameState.stats.O} wins`;
    elements.ties.textContent = gameState.stats.ties;
  };

  /**
   * Highlights the squares that form a winning line
   * @param {number[]} winningSquares - Array of winning square indices
   */
  const highlightWinningSquares = (winningSquares) => {
    winningSquares.forEach((index) => {
      elements.squares[index].classList.add("highlight");
    });
  };

  /**
   * Resets the game board and state for a new game
   */
  const restartGame = () => {
    gameState.currentPlayer = "X";
    gameState.options.fill("");
    gameState.running = true;

    // Reset all squares
    elements.squares.forEach((square) => {
      square.textContent = "";
      square.classList.remove("x", "o", "highlight");
    });

    // Reset status display
    elements.statusText.textContent = `Player X's Turn`;
    elements.statusText.style.color = "#ff61ef";
  };

  // ========== INITIALIZATION ==========

  /**
   * Sets up the game by adding event listeners and starting first game
   */
  const initializeGame = () => {
    // Add click handlers to all squares
    elements.squares.forEach((square) => {
      square.addEventListener("click", squareClicked);
    });

    // Add restart button handler
    elements.restartBtn.addEventListener("click", restartGame);

    // Start the first game
    restartGame();
  };

  // Start the game when the script loads
  initializeGame();
})();

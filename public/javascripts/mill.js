import '/assets/lib/jquery/jquery.min.js';

const commandRoute = 'command';
const gameSelector = '#mill';
const fieldSelector = '.field';
const gameStateSelector = '#game-state';
const errorMessageSelector = '#error-message';
const errorMessageAlertSelector = '#error-message-alert';
const unsetFieldColor = '⚫';

class Mill {
  constructor(channel, player, fields, gameState, currentPlayer) {
    this.fields = fields;
    this.gameState = gameState;
    this.currentPlayer = currentPlayer;
    this.player = player;
    this.from = null;
    this.to = null;
    this.channel = channel;
  }

  play() {
    this.fields.forEach((field) =>
      field.on('click', (e) => {
        if (this.player === this.currentPlayer.split(' ')[0]) {
          this.onTurn(field);
        }
      })
    );
  }

  onTurn(field) {
    this.fields.forEach((field) => {
      field.element.classList.remove('active');
    });
    field.element.classList.add('active');
    if (field.isSet) {
      if (
        this.gameState === 'Removing Pieces' ||
        this.gameState === 'Setting Pieces'
      ) {
        this.to = field.copy();
        this.onSetOrRemove();
      } else {
        if (!this.from) {
          this.from = field.copy();
        } else {
          this.to = field.copy();
          this.onMove();
        }
      }
    } else {
      this.to = field.copy();
      if (this.from) {
        this.onMove();
      } else {
        this.onSetOrRemove();
      }
    }
  }

  updateBoard(board, gameState, currentPlayer, errorMessage) {
    this.fields.forEach((field) => {
      const newField = board.fields.find(
        (f) =>
          f.x + 1 === field.col &&
          f.y + 1 === field.row &&
          f.ring + 1 === field.ring
      );
      field.setColor(newField.color);
    });
    $('#mill .loading-indicator').removeClass('show');
    $('#mill .board').removeClass('non-interactable');
    this.from = null;
    this.to = null;
    this.updateGameState(gameState, currentPlayer);
    this.updateErrorMessage(errorMessage);
  }

  onSetOrRemove() {
    this.channel.send(
      JSON.stringify({
        command: this.to.representation,
      })
    );
    $('#mill .loading-indicator').addClass('show');
    $('#mill .board').addClass('non-interactable');
  }

  onMove() {
    this.channel.send(
      JSON.stringify({
        command: `${this.from.representation} ${this.to.representation}`,
      })
    );
    $('#mill .loading-indicator').addClass('show');
    $('#mill .board').addClass('non-interactable');
  }

  updateGameState(gameState, currentPlayer) {
    this.gameState = gameState;
    this.currentPlayer = currentPlayer;
    $(`${gameStateSelector} h2 pre`).text(
      `${currentPlayer}'s turn: ${gameState}`
    );
  }

  updateErrorMessage(errorMessage) {
    if (errorMessage) {
      $(errorMessageAlertSelector).addClass('show');
      $(errorMessageSelector).text(errorMessage);
      this.from = null;
    } else {
      $(errorMessageAlertSelector).removeClass('show');
    }
  }
}

class Field {
  constructor(col, row, ring, color, element) {
    this.col = col;
    this.row = row;
    this.ring = ring;
    this.color = color;
    this.element = element;
  }

  get isSet() {
    return this.color !== unsetFieldColor;
  }

  get representation() {
    return `${this.col}${this.row}${this.ring}`;
  }

  setColor(color) {
    this.color = color;
    this.element.innerText = color;
  }

  on(event, handler) {
    this.element.addEventListener(event, handler);
  }

  copy() {
    return new Field(
      this.col,
      this.row,
      this.ring,
      this.color,
      this.element
    );
  }
}

function newGame(channel, player) {
  const fields = $(fieldSelector)
    .toArray()
    .map((f) => {
      const coords = f.dataset.coords.split('');
      return new Field(
        Number(coords[0]),
        Number(coords[1]),
        Number(coords[2]),
        f.textContent,
        f
      );
    });
  const gameStateContent = $(gameStateSelector).data();
  const gameState = gameStateContent.gameState;
  const currentPlayer = gameStateContent.currentPlayer;
  return new Mill(channel, player, fields, gameState, currentPlayer);
}

export { newGame };

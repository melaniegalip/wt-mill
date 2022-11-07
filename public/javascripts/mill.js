import '/assets/lib/jquery/jquery.min.js';

const commandRoute = 'command';
const gameSelector = '#mill';
const fieldSelector = '.field';
const gameStateSelector = '#game-state';
const errorMessageSelector = '#error-message';
const errorMessageAlertSelector = '#error-message-alert';
const unsetFieldColor = '⚫';

class Mill {
  constructor(fields, gameState, currentPlayer) {
    this.fields = fields;
    this.gameState = gameState;
    this.currentPlayer = currentPlayer;
    this.from = null;
  }

  play() {
    this.fields.forEach((field) =>
      field.on('click', (e) => this.onTurn(field))
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
        this.onSetOrRemove(field);
      } else {
        if (!this.from) {
          this.from = field;
        } else {
          this.onMove(field);
        }
      }
    } else {
      if (this.from) {
        this.onMove(field);
      } else {
        this.onSetOrRemove(field);
      }
    }
  }

  onSetOrRemove(to) {
    $.getJSON(
      `${commandRoute}/${to.representation}`,
      ({ board, gameState, currentPlayer, errorMessage }) => {
        const newField = board.fields.find(
          (field) =>
            field.x === to.col - 1 &&
            field.y === to.row - 1 &&
            field.ring === to.ring - 1
        );
        to.element.innerText = newField.color;
        this.updateGameState(gameState, currentPlayer);
        this.updateErrorMessage(errorMessage);
      }
    );
  }

  onMove(to) {
    $.getJSON(
      `${commandRoute}/${this.from.representation} ${to.representation}`
    ).done(
      function ({ board, gameState, currentPlayer, errorMessage }) {
        const oldField = board.fields.find(
          (field) =>
            field.x === this.from.col - 1 &&
            field.y === this.from.row - 1 &&
            field.ring === this.from.ring - 1
        );
        this.from.element.innerText = oldField.color;
        const newField = board.fields.find(
          (field) =>
            field.x === to.col - 1 &&
            field.y === to.row - 1 &&
            field.ring === to.ring - 1
        );
        to.element.innerText = newField.color;
        this.updateGameState(gameState, currentPlayer);
        this.updateErrorMessage(errorMessage);
      }.bind({
        from: this.from,
        updateGameState: this.updateGameState,
        updateErrorMessage: this.updateErrorMessage,
      })
    );
    this.from = null;
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

  on(event, handler) {
    this.element.addEventListener(event, handler);
  }
}

function onPlay() {
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
  const game = new Mill(fields, gameState, currentPlayer);
  game.play();
}

function gameLoaded() {
  return !!$(gameSelector).get().length;
}

export { onPlay, gameLoaded };

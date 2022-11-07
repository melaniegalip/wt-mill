import '/assets/lib/jquery/jquery.min.js';

import { commandRoute } from './const.js';

const gameSelector = '#mill';
const fieldSelector = '.field';
const gameStatusSelector = '#game-status';
const unsetFieldColor = '⚫';

class Mill {
  constructor(fields, gameStatus, currentPlayer) {
    this.fields = fields;
    this.gameStatus = gameStatus;
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
        this.gameStatus === 'Removing Pieces' ||
        this.gameStatus === 'Setting Pieces'
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
      this.from = null;
    }
  }

  onSetOrRemove(to) {
    location.replace(`${commandRoute}/${to.representation}`);
  }

  onMove(to) {
    location.replace(
      `${commandRoute}/${this.from.representation} ${to.representation}`
    );
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
        coords[0],
        coords[1],
        coords[2],
        f.textContent,
        f
      );
    });
  const gameStatusContent = $(gameStatusSelector).data();
  const gameStatus = gameStatusContent.gameStatus;
  const currentPlayer = gameStatusContent.currentPlayer;
  const game = new Mill(fields, gameStatus, currentPlayer);
  game.play();
}

const gameLoaded = !!$(gameSelector);

export { onPlay, gameLoaded };

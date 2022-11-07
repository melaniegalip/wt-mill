import { commandRoute } from './const.js';

const gameSelector = '#mill';
const fieldSelector = '.field';
const unsetFieldColor = '⚫';

class Mill {
  constructor(fields) {
    this.fields = fields;
    this.from = null;
  }

  play() {
    this.fields.forEach((field) =>
      field.on('click', (e) => this.onTurn(field))
    );
  }

  onTurn(field) {
    // TODO: take current player and game status into account
    // TODO: show selected fields
    if (field.isSet) {
      if (!this.from) {
        this.from = field;
        // TODO: remove fields
      } else {
        console.error('can not move to set field');
        // TODO: show error message
      }
    } else {
      if (this.from) {
        this.onMove(field);
      } else {
        this.onSet(field);
      }
      this.from = null;
    }
  }

  onSet(to) {
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
  const fieldElements = document.querySelectorAll(fieldSelector);
  const fields = Array.from(fieldElements).map((f) => {
    const coords = f.dataset.coords.split('');
    return new Field(
      coords[0],
      coords[1],
      coords[2],
      f.textContent,
      f
    );
  });
  const game = new Mill(fields);
  game.play();
}

const gameLoaded = !!document.querySelector(gameSelector);

export { onPlay, gameLoaded };

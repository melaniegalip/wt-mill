const unsetFieldColor = '⚫';

class Field {
  constructor({ x, y, ring, color }) {
    this.col = x;
    this.row = y;
    this.ring = ring;
    this.color = color;
  }

  get isSet() {
    return this.color !== unsetFieldColor;
  }

  get representation() {
    return `${this.col + 1}${this.row + 1}${this.ring + 1}`;
  }

  equals(field) {
    return !!field && this.representation === field.representation;
  }

  copy() {
    return new Field(this.col, this.row, this.ring, this.color);
  }
}

export default Field;

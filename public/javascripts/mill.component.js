import Field from './field.js';

const MillPageComponent = {
  data() {
    return {
      from: null,
    };
  },
  props: [
    'playerName',
    'currentPlayer',
    'gameState',
    'board',
    'isLoading',
  ],
  emits: ['onAction'],
  methods: {
    setOrRemove(to) {
      this.$emit('onAction', {
        command: to.representation,
      });
      this.from = null;
    },
    move(to) {
      this.$emit('onAction', {
        command: `${this.from.representation} ${to.representation}`,
      });
      this.from = null;
    },
    getField(col, row, ring) {
      const field = this.board.fields.find(
        (f) => f.x === col && f.y === row && f.ring === ring
      );
      return !field ? field : new Field(field);
    },
    onTurn(field) {
      if (field.isSet) {
        if (
          this.gameState === 'Removing Pieces' ||
          this.gameState === 'Setting Pieces'
        ) {
          this.setOrRemove(field);
        } else {
          if (!this.from) {
            this.from = field;
          } else {
            this.move(field);
          }
        }
      } else {
        if (this.from) {
          this.move(field);
        } else {
          this.setOrRemove(field);
        }
      }
    },
  },
  computed: {
    currentPlayerName() {
      return this.currentPlayer.split(' ')[0];
    },
  },
  template: `
        <div id="mill" :class="{'non-interactable': isLoading}">
      <div
        class="alert alert-light"
        role="alert"
        id="game-state"
      >
        <h2><pre>{{currentPlayer}}'s turn: {{gameState}}</pre></h2>
      </div>
      <div class="board">
        <div v-for="ring in board.size" class="ring" :class="'w-' + ring">
          <div v-for="row in board.size" class="field-row">
            <template v-for="col in board.size">
                <span v-if="getField(col - 1, row - 1, ring - 1)" class="field"
                :class="{active: getField(col - 1, row - 1, ring - 1).equals(from), 'non-interactable': playerName !== currentPlayerName}"
                @click="() => onTurn(getField(col - 1, row - 1, ring - 1))">
                  {{getField(col - 1, row - 1, ring - 1).color}}
                </span>
              </template>
          </div>
        </div>
        <div class="loading-indicator" :class="{show: isLoading}">
            <div></div>
            <div></div>
            <div></div>
        </div>
      </div>
    </div>
      `,
};

export default MillPageComponent;

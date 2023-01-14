const IndexPageComponent = {
  data() {
    return {
      playerName: '',
    };
  },
  props: ['text', 'isLoading'],
  emits: ['playerName'],
  methods: {
    onNewPlayer() {
      this.$emit('playerName', this.playerName);
    },
  },
  template: `
        <div id="home">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Welcome to Mill!</h5>
          <div class="card-text" :class="{'non-interactable': isLoading}">
            <pre>{{text}}</pre>
            <form @submit.prevent="onNewPlayer">
              <div class="mb-3 row">
                <label for="playerName" class="col-sm-2 col-form-label"
                  >Player Name</label
                >
                <div class="col-sm-10">
                  <input
                    type="text"
                    class="form-control"
                    id="playerName"
                    v-model="playerName"
                    min="3"
                    autofocus
                  />
                </div>
              </div>
              <button
                type="submit"
                class="btn btn-primary"
              >
                Continue
              </button>
            </form>
            <div class="loading-indicator" :class="{show: isLoading}">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
      `,
};

export default IndexPageComponent;

<template>
<div id="home">
  <b-card
    footer-bg-variant="white"
    footer-border-variant="white"
    title="Welcome to Mill!"
    style="position:relative;"
  >
    <b-card-text>
      <pre>{{ text }}</pre>
      <div class="loading-indicator" :class="{ show: isLoading }">
       <b-spinner label="Loading..."></b-spinner>
      </div>
    </b-card-text>
    <b-card-footer :class="{ 'non-interactable': isLoading }">
        <b-form  @submit.stop.prevent="onNewPlayer">
      <label for="playerName">Player Name</label>
      <b-form-input v-model="playerName" :state="validation" id="playerName"></b-form-input>
      <b-form-invalid-feedback :state="validation">
        Your Player Name must be 5-12 characters long.
      </b-form-invalid-feedback>
      <b-form-valid-feedback :state="validation">
        Looks Good.
      </b-form-valid-feedback>
     </b-form>
    </b-card-footer>
  </b-card>
</div>
</template>
<script>
export default {
  name: 'HomePage',
  props: {
    text: String,
    isLoading: Boolean
  },
  data() {
    return {
      playerName: '',
    };
  },
  emits: ['playerName'],
  methods: {
    onNewPlayer() {
      if(this.validation) this.$emit('playerName', this.playerName);
    },
  },
  computed: {
      validation() {
        return this.playerName.length > 4 && this.playerName.length < 13
      }
    }
}
</script>
<style lang="scss" scoped>

@import "@/assets/stylesheets/home"
</style>
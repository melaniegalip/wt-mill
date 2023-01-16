<template>
<b-alert
      variant="danger"
      dismissible
      fade
      :show="!!text && showAlert"
      @dismissed="showAlert=false"
    >
    <strong>Warning!</strong> <span id="error-message">{{ text }}</span>
    </b-alert>
</template>
<script>
export default {
  name: 'ErrorComponent',
  data() {
    return {
      showAlert: true
    }
  },
  props: {
    text: String
  }
}
</script>
<style scoped>
</style>
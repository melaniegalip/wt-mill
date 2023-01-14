const ErrorComponent = {
  props: ['text'],
  template: `
        <div id="error-message-alert" class="alert alert-danger fade d-flex align-items-center" :class="{show: !!text}" role="alert">
      <svg
        class="bi flex-shrink-0 me-2"
        width="24"
        height="24"
        role="img"
        aria-label="Danger:"
      >
        <use xlink:href="#exclamation-triangle-fill" />
      </svg>
      <div>
        <strong>Warning!</strong> <span id="error-message">{{text}}</span>
      </div>
    </div>
      `,
};

export default ErrorComponent;

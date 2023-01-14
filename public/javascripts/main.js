import '/assets/lib/bootstrap/js/bootstrap.min.js';
import '/assets/lib/jquery/jquery.min.js';
import { createApp } from '/assets/lib/vue/dist/vue.esm-browser.prod.js';
import AppComponent from './app.component.js';
import IndexPageComponent from './index.component.js';
import ErrorComponent from './error.component.js';
import MillPageComponent from './mill.component.js';

const app = createApp(AppComponent);
app
  .component('IndexPage', IndexPageComponent)
  .component('Error', ErrorComponent)
  .component('MillPage', MillPageComponent)
  .mount('#app');

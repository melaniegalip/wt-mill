import '/assets/lib/bootstrap/js/bootstrap.min.js';

import { gameLoaded, onPlay } from './mill.js';
import { onNewPlayer } from './index.js';

document.addEventListener('DOMContentLoaded', () => {
  if (gameLoaded) {
    onPlay();
  } else {
    onNewPlayer();
  }
});

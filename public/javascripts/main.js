import '/assets/lib/bootstrap/js/bootstrap.min.js';
import '/assets/lib/jquery/jquery.min.js';

import { gameLoaded, onPlay } from './mill.js';
import { onNewPlayer } from './index.js';

$(() => {
  if (gameLoaded) {
    onPlay();
  } else {
    onNewPlayer();
  }
});

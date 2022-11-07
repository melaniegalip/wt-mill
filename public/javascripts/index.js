import '/assets/lib/jquery/jquery.min.js';

import { gameLoaded, onPlay } from './mill.js';

const addPlayerSelector = '#addPlayer';
const playerNameSelector = '#playerName';

function addPlayer() {
  const playerName = $(playerNameSelector).val();
  $.get(playerName, (data) => {
    document.body.innerHTML = data;
    if (gameLoaded()) {
      onPlay();
    } else {
      onNewPlayer();
    }
  });
}

function onNewPlayer() {
  $(addPlayerSelector).click((e) => {
    e.preventDefault();
    addPlayer();
  });
}

export { onNewPlayer };

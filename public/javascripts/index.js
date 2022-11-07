import '/assets/lib/jquery/jquery.min.js';

import { commandRoute } from './const.js';

const addPlayerSelector = '#addPlayer';
const playerNameSelector = '#playerName';

function addPlayer() {
  const playerName = $(playerNameSelector).val();
  location.replace(`${commandRoute}/${playerName}`);
}

function onNewPlayer() {
  $(addPlayerSelector).click((e) => {
    e.preventDefault();
    addPlayer();
  });
}

export { onNewPlayer };

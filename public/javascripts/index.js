import { commandRoute } from './const.js';

const addPlayerSelector = '#addPlayer';
const playerNameSelector = '#playerName';

function addPlayer() {
  const playerName = document.querySelector(playerNameSelector).value;
  location.replace(`${commandRoute}/${playerName}`);
}

function onNewPlayer() {
  document
    .querySelector(addPlayerSelector)
    .addEventListener('click', (e) => {
      e.preventDefault();
      addPlayer();
    });
}

export { onNewPlayer };

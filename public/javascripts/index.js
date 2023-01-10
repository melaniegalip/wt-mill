import '/assets/lib/jquery/jquery.min.js';

const playerRoute = 'player';
const addPlayerSelector = '#addPlayer';
const playerNameSelector = '#playerName';

let player;

function onNewPlayer(channel) {
  $(addPlayerSelector).click((e) => {
    e.preventDefault();
    addPlayer(channel);
  });
}

function addPlayer(channel) {
  player = $(playerNameSelector).val();
  channel.send(
    JSON.stringify({
      playerName: player,
    })
  );
}

export { onNewPlayer, player };

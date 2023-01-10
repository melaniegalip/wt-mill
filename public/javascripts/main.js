import '/assets/lib/bootstrap/js/bootstrap.min.js';
import '/assets/lib/jquery/jquery.min.js';

import { newGame } from './mill.js';
import { onNewPlayer, player } from './index.js';

const channelRoute = document.body.dataset.wsUrl;
const channel = new WebSocket(channelRoute);
let game;

function onChannel() {
  channel.setTimeout;
  channel.onopen = (event) => {
    console.info('Connected to channel', event);
  };

  channel.onclose = (event) => {
    console.info('Disconnected from channel', event);
  };

  channel.onerror = (error) => {
    console.error('An error occured in the channel: ', error);
  };

  channel.onmessage = (e) => {
    if (typeof e.data === 'string') {
      const data = JSON.parse(e.data);
      switch (data.event) {
        case 'WAITING_FOR_SECOND_PLAYER':
          console.log('waiting for second player');
          // TODO: LOADING INDICATOR
          break;
        case 'GAME_INTRODUCTION':
          $('#content').html(data.page);
          onNewPlayer(channel);
          break;
        case 'GAME_STARTED':
          $('#content').html(data.page);
          game = newGame(channel, player);
          game.play();
          break;
        case 'GAME_PLAYING':
          if (!game) return;
          game.updateBoard(
            data.board,
            data.gameState,
            data.currentPlayer,
            data.errorMessage
          );
          break;
        default:
          console.error('Unknown event!');
      }
    }
  };
}

$(() => onChannel());

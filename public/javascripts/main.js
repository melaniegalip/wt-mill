import '/assets/lib/bootstrap/js/bootstrap.min.js';
import '/assets/lib/jquery/jquery.min.js';

import { gameLoaded, onPlay } from './mill.js';
import { onNewPlayer } from './index.js';

const channelRoute = 'ws://localhost:9000/channel';

$(() => {
  if (gameLoaded()) {
    onPlay();
  } else {
    onNewPlayer();
  }
  channel();
});

function channel() {
  const socket = new WebSocket(channelRoute);
  socket.setTimeout;
  socket.onopen = (event) => {
    console.info('Connected to channel', event);
  };

  socket.onclose = (event) => {
    console.info('Disconnected from channel', event);
  };

  socket.onerror = (error) => {
    console.error('An error occured in the channel: ', error);
  };

  socket.onmessage = (e) => {
    if (typeof e.data === 'string') {
      console.log('data received: ', e.data);
    }
  };
}

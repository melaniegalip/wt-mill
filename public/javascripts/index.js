import '/assets/lib/jquery/jquery.min.js';

import { gameLoaded, onPlay } from './mill.js';

const playerNameSelector = '#playerName';
const formSelector = '.needs-validation';

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
  const form = $(formSelector);
  $(playerNameSelector).on('keyup change', (e) => {
    if (!form.get(0).checkValidity()) {
      return;
    }
    form.get(0).classList.add('was-validated');
  });

  form.submit((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!form.get(0).checkValidity()) {
      return;
    }
    addPlayer();
  });
}

export { onNewPlayer };

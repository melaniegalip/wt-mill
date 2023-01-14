const channelRoute = document.body.dataset.wsUrl;
const AppComponent = {
  data() {
    return {
      channel: new WebSocket(channelRoute),
      isLoading: false,
      playerName: '',
      introductionText: '',
      errorMessage: '',
      board: null,
      gameState: '',
      currentPlayer: '',
    };
  },
  created() {
    this.onChannel();
  },
  methods: {
    addPlayer(playerName) {
      this.playerName = playerName;
      this.channel.send(
        JSON.stringify({
          playerName,
        })
      );
    },
    onAction(command) {
      this.isLoading = true;
      this.channel.send(JSON.stringify(command));
    },
    restartChannel() {
      this.isLoading = false;
      this.errorMessage = '';
      this.board = null;
      this.gameState = '';
      this.currentPlayer = '';
      this.playerName = '';
      this.introductionText = '';
      this.channel.close();
      this.channel = new WebSocket(channelRoute);
      this.onChannel();
    },
    onChannel() {
      this.channel.setTimeout;
      this.channel.onopen = (event) => {
        console.info('Connected to channel', event);
      };

      this.channel.onclose = (event) => {
        console.info('Disconnected from channel', event);
      };

      this.channel.onerror = (error) => {
        console.error('An error occured in the channel: ', error);
        this.channel.send(
          JSON.stringify({
            command: 'q',
          })
        );
        restartChannel();
      };

      this.channel.onmessage = (e) => {
        if (typeof e.data === 'string') {
          const data = JSON.parse(e.data);
          console.log('data received', data);
          switch (data.event) {
            case 'GAME_INTRODUCTION':
              this.introductionText = data.introductionText;
              break;
            case 'WAITING_FOR_SECOND_PLAYER':
              this.isLoading = true;
              break;
            case 'GAME_PLAYING':
              this.errorMessage = data.errorMessage;
              this.board = data.board;
              this.gameState = data.gameState;
              this.currentPlayer = data.currentPlayer;
              break;
            case 'GAME_QUIT':
              this.restartChannel();
              break;
            default:
              console.error('Unknown event!');
          }
        }
      };
    },
  },
  template: `
        <Error :text="errorMessage"></Error>
        <IndexPage v-if="!board" :isLoading="isLoading" @playerName="addPlayer" :text="introductionText"></IndexPage>
        <MillPage v-else :currentPlayer="currentPlayer" :playerName="playerName" :board="board" :gameState="gameState" :errorMessage="errorMessage" @onAction="onAction"></MillPage>
      `,
};

export default AppComponent;

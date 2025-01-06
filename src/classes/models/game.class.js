import IntervalManager from '../managers/interval.manager.js';
import {
  createLocationPacket,
  gameStartNotification,
} from '../../utils/notification/game.notification.js';

const MAX_PLAYERS = 4;

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.intervalManager = new IntervalManager();
    this.state = 'waiting'; // 'waiting', 'inProgress'
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error('Game session is full');
    }
    this.users.push(user);

    this.intervalManager.addPlayer(user.id); //핑을 쓸때 바인드 써야함. 마지막은 주기(ms)
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);
    this.intervalManager.removePlayer(userId);

    if (this.users.length < MAX_PLAYERS) {
      this.state = 'waiting';
    }
  }

  startGame() {
    this.state = 'inProgress';
    const startPacket = gameStartNotification(this.id, Date.now());
    console.log(`max latency: ${this.getMaxLatency()}`);

    this.users.forEach((user) => {
      user.socket.write(startPacket);
    });
  }

  getAllLocation() { //이건 위치 동기화 함수임.
    const locationData = this.users.map((user) => {
      const { x, y } = user.calculatePosition();
      return { id: user.id, x, y };
    });
    return createLocationPacket(locationData);
  }
}

export default Game;

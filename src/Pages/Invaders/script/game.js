import Player from '../components/player.svelte';
import Enemy from '../components/enemy.svelte';

export default class Game {
  constructor() {
    this.player = new Player();
    this.enemies = [];
    this.createEnemies();
  }

  createEnemies() {
    for (let i = 0; i < 5; i++) {
      this.enemies.push(new Enemy());
    }
  }
}

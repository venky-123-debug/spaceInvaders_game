<script>
  import { onMount } from "svelte";
  import Player from "./Player.svelte";
  import Enemy from "./Enemy.svelte";
  import Bullet from "./Bullet.svelte";
  import { collides } from "./collisionDetection.js";

  let canvas;
  let ctx;
  let player;
  let bullets = [];
  let enemies = [];

  onMount(() => {
    ctx = canvas.getContext("2d");
    initGame();
    requestAnimationFrame(update);
  });

  function initGame() {
    // Initialize player
    player = new Player(400, 550, 20, 20, "#0099CC", canvas.width);

    // Initialize enemies
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 20; j++) {
        enemies.push(new Enemy(30 + j * 35, 30 + i * 35, 20, 20, "#FF0000"));
      }
    }
  }

  function update() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw player
    player.update();
    player.draw(ctx);

    // Update and draw bullets
    for (let bullet of bullets) {
      bullet.update();
      bullet.draw(ctx);
    }

    // Update and draw enemies
    for (let enemy of enemies) {
      enemy.update();
      enemy.draw(ctx);
    }

    // Check for collisions between bullets and enemies
    for (let i = 0; i < bullets.length; i++) {
      for (let j = 0; j < enemies.length; j++) {
        if (collides(bullets[i], enemies[j])) {
          bullets.splice(i, 1);
          enemies.splice(j, 1);
          break;
        }
      }
    }

    // Check for collisions between player and enemies
    for (let enemy of enemies) {
      if (collides(player, enemy)) {
        // Handle player-enemy collision
        restartGame();
        return;
      }
    }

    requestAnimationFrame(update);
  }

  function restartGame() {
    // Reset game state
    bullets = [];
    enemies = [];
    initGame();
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowLeft") {
      player.moveLeft();
    } else if (event.key === "ArrowRight") {
      player.moveRight();
    } else if (event.key === " ") {
      // Fire bullet
      bullets.push(new Bullet(player.x + 8, player.y, 4, 8, "#FF7800", -5));
    }
  }

  canvas.addEventListener("keydown", handleKeyDown);
</script>

<canvas bind:this={canvas} width="800" height="600" class="border"></canvas>

<style>
  canvas {
    border: 1px solid #ccc;
  }
</style>

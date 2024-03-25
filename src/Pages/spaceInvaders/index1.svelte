<script>
  import { onMount } from "svelte"

  class GameObject {
    constructor(x, y, width, height, color) {
      this.x = x
      this.y = y
      this.width = width
      this.height = height
      this.color = color
    }

    draw(ctx) {
      ctx.fillStyle = this.color
      ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    update(dx, dy) {
      this.x += dx
      this.y += dy
    }

    collidesWith(obj) {
      return this.x < obj.x + obj.width && this.x + this.width > obj.x && this.y < obj.y + obj.height && this.y + this.height > obj.y
    }
  }

  class Bullet extends GameObject {
    constructor(x, y, width, height, color, dy) {
      super(x, y, width, height, color)
      this.dy = dy
    }

    update(x, y) {
      this.y += this.dy
    }
  }

  class SpaceShip extends GameObject {
    constructor(x, y, width, height, color, canvasHeight) {
      super(x, y, width, height, color)
      this.canvasHeight = canvasHeight
      this.bulletWidth = 4
      this.bulletHeight = 8
      this.bulletColor = "#ff7800"
      this.bullets = []
    }

    draw(ctx) {
      super.draw(ctx)
      for (let i = 0; i < this.bullets.length; i++) {
        this.bullets[i].draw(ctx)
        this.bullets[i].update(0, 0)
        if (this.bullets[i].y < 0 || this.bullets[i].y > this.canvasHeight) {
          this.bullets.splice(i, 1)
        }
      }
    }

    shoot(dy) {
      this.bullets.push(new Bullet(this.x + this.width / 2 - this.bulletWidth / 2, this.y - this.bulletHeight, this.bulletWidth, this.bulletHeight, this.bulletColor, dy))
    }
  }

  // Player class
  class Player extends SpaceShip {
    constructor(x, y, width, height, color, canvasHeight, canvasWidth) {
      super(x, y, width, height, color, canvasHeight)
      this.canvasWidth = canvasWidth
    }

    update(dx, dy) {
      super.update(dx, dy)
      if (this.x < 0) {
        this.x = 0
      } else if (this.x + this.width > this.canvasWidth) {
        this.x = this.canvasWidth - this.width
      }
    }
  }

  // Asteroid class
  class Asteroid {
    constructor(x, y, width, height, color, noParts) {
      this.parts = []
      for (let i = 0; i < noParts; i++) {
        for (let j = 0; j < noParts; j++) {
          this.parts.push(new GameObject(x + i * width, y + j * height, width, height, color))
        }
      }
    }

    draw(ctx) {
      for (let i = 0; i < this.parts.length; i++) {
        this.parts[i].draw(ctx)
      }
    }

    collidesWith(obj) {
      for (let i = 0; i < this.parts.length; i++) {
        if (this.parts[i].collidesWith(obj)) {
          return true
        }
      }
      return false
    }

    removeOnCollide(obj) {
      for (let i = 0; i < this.parts.length; i++) {
        if (this.parts[i].collidesWith(obj)) {
          this.parts.splice(i, 1)
          break
        }
      }
    }
  }

  // Game object
  let game = {}

  // Keydown event handler
  function keydown(event) {
    if (event.key === "ArrowLeft" || event.key === "a") {
      game.player.update(-5, 0)
    } else if (event.key === "ArrowRight" || event.key === "d") {
      game.player.update(5, 0)
    } else if (event.key === " ") {
      game.player.shoot(-5)
    }
  }

  // Initialize game
  function initGame() {
    game.canvas = document.getElementById("canvas")
    game.ctx = game.canvas.getContext("2d")
    game.backgroundColor = "#000000"
    game.asteroidsParts = 8
    game.noOfAsteroids = 8
    game.asteroidsSpace = 85
    game.enemiesEachLine = 20
    game.enemyLines = 8
    game.enemySpace = 30
    game.enemyFireRate = 1000
    game.enemyFireTimer = 0
    game.enemyDirection = 1
    game.enemyStep = 5
    game.update = update
    game.keydown = keydown
    game.init = initGame
    game.stop = stop
    game.restart = restart

    game.interval = setInterval(game.update, 1000 / 60)

    game.player = new Player(game.canvas.width / 2 - 50, game.canvas.height - 50, 20, 20, "#49b80d", game.canvas.width)

    game.asteroids = []

    game.enemies = []
    for (let i = 0; i < game.enemyLines; i++) {
      for (let j = 0; j < game.enemiesEachLine; j++) {
        game.enemies.push(new SpaceShip(game.enemySpace + j * game.enemySpace, game.enemySpace + i * game.enemySpace, 20, 20, "#1aa3e8"))
      }
    }
  }

  // Update function
  function update() {
    game.ctx.fillStyle = game.backgroundColor
    game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height)

    game.player.draw(game.ctx)

    for (let i = 0; i < game.asteroids.length; i++) {
      game.asteroids[i].draw(game.ctx)
    }

    for (let i = 0; i < game.enemies.length; i++) {
      game.enemies[i].draw(game.ctx)
      game.enemies[i].update(game.enemyDirection, 0)
    }

    if (!game.enemies.length) {
      game.restart()
    }

    // Continue your update function as
    if (game.enemyDirection == 1) {
      let closestToRightSideEnemy = game.enemies[0]
      for (let i = 1; i < game.enemies.length; i++) {
        if (game.enemies[i].x > closestToRightSideEnemy.x) {
          closestToRightSideEnemy = game.enemies[i]
        }
      }

      if (closestToRightSideEnemy.x + closestToRightSideEnemy.width > game.canvas.width) {
        game.enemyDirection = -1
        for (let i = 0; i < game.enemies.length; i++) {
          game.enemies[i].update(0, game.enemyStep)
        }
      }
    } else if (game.enemyDirection == -1) {
      let closestToLeftSideEnemy = game.enemies[0]
      for (let i = 1; i < game.enemies.length; i++) {
        if (game.enemies[i].x < closestToLeftSideEnemy.x) {
          closestToLeftSideEnemy = game.enemies[i]
        }
      }

      if (closestToLeftSideEnemy.x < 0) {
        game.enemyDirection = 1
        for (let i = 0; i < game.enemies.length; i++) {
          game.enemies[i].update(0, game.enemyStep)
        }
      }
    }

    game.enemyFireTimer += Math.random() * 10
    if (game.enemyFireTimer > game.enemyFireRate) {
      game.enemyFireTimer = 0
      game.enemies[Math.floor(Math.random() * game.enemies.length)].shoot(5)
    }

    for (let i = 0; i < game.player.bullets.length; i++) {
      for (let j = 0; j < game.asteroids.length; j++) {
        if (game.asteroids[j].collidesWith(game.player.bullets[i])) {
          game.asteroids[j].removeOnCollide(game.player.bullets[i])
          game.player.bullets.splice(i, 1)
          break
        }
      }
    }

    for (let i = 0; i < game.enemies.length; i++) {
      for (let j = 0; j < game.enemies[i].bullets.length; j++) {
        for (let k = 0; k < game.asteroids.length; k++) {
          if (game.asteroids[k].collidesWith(game.enemies[i].bullets[j])) {
            game.asteroids[k].removeOnCollide(game.enemies[i].bullets[j])
            game.enemies[i].bullets.splice(j, 1)
            break
          }
        }
      }
    }

    for (let i = 0; i < game.player.bullets.length; i++) {
      for (let j = 0; j < game.enemies.length; j++) {
        if (game.enemies[j].collidesWith(game.player.bullets[i])) {
          game.enemies.splice(j, 1)
          game.player.bullets.splice(i, 1)
          break
        }
      }
    }

    for (let i = 0; i < game.enemies.length; i++) {
      for (let j = 0; j < game.enemies[i].bullets.length; j++) {
        if (game.player.collidesWith(game.enemies[i].bullets[j])) {
          game.restart()
          break
        }
      }
    }

    for (let i = 0; i < game.enemies.length; i++) {
      if (game.enemies[i].y + game.enemies[i].height > game.player.y) {
        game.restart()
        break
      }
    }
  }

  // Stop game loop
  function stop() {
    clearInterval(game.interval)
  }

  // Restart game
  function restart() {
    stop()
    initGame()
  }

  onMount(() => {
    initGame()
  })
</script>

<svelte:window on:keydown|stopPropagation={keydown} />
<div class="flex relative w-screen h-screen m-auto overflow-hidden items-center justify-center">
  <canvas id="canvas" width="800" height="600" />
  <!-- <div bind:this={game.player} class="absolute bottom-10">
    <i class="fa-solid fa-ufo-beam text-5xl text-white" />
  </div> -->
</div>

<script>
  import { onMount, onDestroy, afterUpdate } from "svelte"
  import Player from "./ship.svelte"
  import Enemy from "./villains.svelte"
  import GameOver from "./gameOver.svelte"
  import CanvasScreen from "./canvasScreen.svelte"
  import StartPage from "./startPage.svelte"
  import Boost from "./boost.svelte"
  import Life from "./life.svelte"

  let spaceShip
  let gridWidth = 12
  let gridHeight = 6
  let villainWidth = 3
  let villainHeight = 3
  let intervalTimeOut

  let villains = []
  let enemyBullets = []
  let containerWidth = 0
  let isMove = true
  let isGameOver = false
  let isPlayerWon = false
  let score = 0
  let bulletTimer
  let spaceshipPosition
  let spaceshipPositionY
  let fallCount = 3
  let startPage = true
  let villainColor
  let booster = false
  let boostCount = 3
  let enemyColorArray = ["#ea580c", "#15803d", "#0891b2", "#db2777", "#e11d48"]

  onMount(() => {
    containerWidth = window.innerWidth
    villainColor = enemyColorArray[Math.floor(Math.random() * enemyColorArray.length)]
    if (!startPage) {
      startAction()
    } else {
      if (!isGameOver) {
        fireEnemyBullet()
      }
      initializeVillains()
      startEnemyFireLoop()
      enemyBulletCollision()
    }
  })

  afterUpdate(() => {
    handleBooster()
    if (!startPage || !isGameOver) {
      // let checkIcon = (currentValue) => currentValue == 1

      // console.log(villains.every(checkIcon))
      //}
      moveVillains()
      startAnimation()
      gameOver()
    }
  })

  onDestroy(() => {
    clearTimeout(intervalTimeOut, bulletTimer)
  })

  const handleBooster = () => {
    // if (score > 1000) booster = true
    if (booster) {
      setTimeout(() => {
        booster = false
      }, 5000)
    }
  }

  const gameOver = () => {
    let lastVillainY
    if (!isGameOver) {
      if (villains.length) {
        lastVillainY = villains[villains.length - 1].y
      }
      if (lastVillainY >= 80) {
        isGameOver = true
      }
    }
  }

  const initializeVillains = () => {
    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        villains.push({ x: col * villainWidth, y: row * (villainHeight + 2), icon: 0 })
      }
    }
  }

  const downAliens = async () => {
    try {
      for (let i = 0; i < villains.length; i++) {
        villains[i].y += villainHeight + 2
      }
    } catch (error) {
      console.error(error)
    }
  }

  let villainSpeed = 0
  // let enemyBulletTimer = 0
  const startAction = (e) => {
    startPage = false

    if (e.detail == "Easy") {
      villainSpeed = 0.2
    }
    if (e.detail == "Medium") {
      villainSpeed = 0.4
    }
    if (e.detail == "Hard") {
      {
        villainSpeed = 0.6
      }
    }
  }

  const moveVillains = async () => {
    try {
      // let villainSpeed = 0.2
      if (!isMove) {
        for (let i = 0; i < villains.length; i++) {
          villains[i].x -= villainSpeed
        }
        if (villains[0].x < 0) {
          downAliens()
          isMove = true
        }
      } else {
        for (let i = 0; i < villains.length; i++) {
          villains[i].x += villainSpeed
        }
        if (villains[villains.length - 1].x >= 100) {
          downAliens()
          isMove = false
        }
      }
    } catch (error) {
      clearTimeout(intervalTimeOut)
    }
  }

  const startAnimation = () => {
    // animationFrame = requestAnimationFrame(moveVillains)
  }

  const checkCollisions = (e) => {
    let { bullet, bullets } = e.detail

    let allVillainsDestroyed = true

    for (let j = 0; j < villains.length; j++) {
      let villain = villains[j]

      let bulletLeft = bullet.x
      let bulletTop = bullet.y
      let villainLeft = villain.x
      let villainRight = villain.x + villainWidth
      let villainTop = villain.y
      let villainBottom = villain.y + villainHeight

      if (bulletLeft >= villainLeft && bulletLeft <= villainRight && bulletTop >= villainTop && bulletTop <= villainBottom && villain.icon === 0) {
        // console.log("matched")
        score += 100
        villain.icon = 1
        bullets.splice(bullets.indexOf(bullet), 1)
        break
      }

      if (villain.icon === 0) {
        allVillainsDestroyed = false
      }
    }

    if (allVillainsDestroyed) {
      isPlayerWon = true
    }
  }
  const downEnemyBullets = () => {
    for (let i = 0; i < enemyBullets.length; i++) {
      enemyBullets[i].y += 0.5
    }
  }
  const startEnemyFireLoop = () => {
    intervalTimeOut = setInterval(() => {
      downEnemyBullets()
    }, 15)
  }
  const fireEnemyBullet = () => {
    if (!startPage || !isGameOver || isPlayerWon) {
      let randomVillainIndex
      bulletTimer = setInterval(() => {
        for (let i = 0; i < villains.length; i++) {
          if (villains[i].icon == 0) randomVillainIndex = Math.floor(Math.random() * villains.length)
        }
        let randomVillain = villains[randomVillainIndex]
        let bullet = { x: randomVillain.x, y: randomVillain.y }
        enemyBullets = [...enemyBullets, bullet]
        // console.log({ enemyBullets })
      }, 1500)
    }
  }
  const enemyBulletCollision = () => {
    bulletTimer = setInterval(() => {
      for (let i = 0; i < enemyBullets.length; i++) {
        if (fallCount === 0) {
          isGameOver = true
          clearInterval(bulletTimer)
          return
        }
        let distanceRatio = Math.abs(enemyBullets[i].x / spaceshipPosition)
        let ratioY = Math.abs(enemyBullets[i].y / spaceshipPositionY)
        // console.log({ ratioY })
        if (distanceRatio >= 0.98 && distanceRatio <= 1.12 && ratioY <= 1 && ratioY >= 0.9) {
          enemyBullets = enemyBullets.filter((ene) => ene.x != enemyBullets[i].x)
          if (!booster) fallCount--
        }
      }
    }, 200)
  }

  const gameRestart = () => {
    setTimeout(() => {
      if (isPlayerWon) {
        isPlayerWon = !isPlayerWon
      } else isGameOver = !isGameOver
      villains = []
      initializeVillains()
      fallCount = 3
      boostCount = 3
    }, 50)
    initializeVillains()
  }
  const gameClose = () => {
    window.location.reload()
  }
</script>

{#if startPage}
  <StartPage on:start={startAction} />
{:else}
  <div class="relative h-screen w-screen overflow-hidden">
    {#if isGameOver || isPlayerWon}
      <GameOver {score} bind:isGameOver bind:isPlayerWon on:Close={gameClose} on:click={gameRestart} />
    {/if}

    <CanvasScreen />
    <div class="absolute top-3 left-5 text-2xl text-white">
      <!-- <i class="fa-regular fa-user-alien" /> -->
      Space Adventure
    </div>
    <div class="absolute top-3 right-5 text-2xl text-white">
      Score&nbsp;{score ? score : "000"}
    </div>
    <div class="absolute right-5 bottom-5 flex animate-pulse gap-3 text-2xl text-blue-500">
      {#each Array(fallCount) as arr}
        <Life />
      {/each}
      <span class="text-white">Life</span>
    </div>
    <div class="grid pt-24" style="grid-template-columns: {`repeat(${gridWidth}, 1fr)`}">
      {#each villains as villain}
        <Enemy bind:villain bind:villainColor />
      {/each}
      {#each enemyBullets as bullet}
        <div class="absolute text-xl text-red-500" style="left: {bullet.x}%; top: {bullet.y}%;">
          <!-- <i class="fa-solid fa-cloud-bolt" /> -->
          <i class="fa-solid fa-knife-kitchen -rotate-45" />
        </div>
      {/each}
    </div>
    <Boost bind:booster bind:boostCount />
    <Player
      bind:booster
      bind:spaceShip
      bind:spaceshipPosition
      bind:spaceshipPositionY
      on:shootEnemy={(e) => {
        checkCollisions(e)
      }}
    />
  </div>
{/if}

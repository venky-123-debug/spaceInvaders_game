<script>
  import { onMount } from 'svelte';
  import Game from '../script/game'
  import Player from './Player.svelte';
  import Enemy from './Enemy.svelte';

  let game;
  let player

  onMount(() => {
    game = new Game();
  });
</script>

<div class="relative h-screen flex justify-center items-center">
  <Player {player} />

  {#each game.enemies as enemy}
    <Enemy {enemy} />
  {/each}
</div>

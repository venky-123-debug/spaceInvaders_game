<script>
  export let x;
  export let y;
  export let width;
  export let height;
  export let color;
  export let dy;

  export function update() {
    y += dy;
  }

  export function draw(ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }
</script>

<style>
  /* Styles for Bullet component */
</style>

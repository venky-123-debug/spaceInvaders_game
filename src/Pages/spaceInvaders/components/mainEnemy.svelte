<script>
  export let x;
  export let y;
  export let width;
  export let height;
  export let color;

  export function update() {
    // Logic to update enemy position
  }

  export function draw(ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }
</script>

<style>
  /* Styles for Enemy component */
</style>

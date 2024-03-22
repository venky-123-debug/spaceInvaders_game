<script>
  export let x;
  export let y;
  export let width;
  export let height;
  export let color;
  export let canvasWidth;

  let dx = 0;

  export function moveLeft() {
    dx = -5;
  }

  export function moveRight() {
    dx = 5;
  }

  export function update() {
    x += dx;
    if (x < 0) {
      x = 0;
    } else if (x + width > canvasWidth) {
      x = canvasWidth - width;
    }
    dx = 0;
  }

  export function draw(ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }
</script>

<style>
  /* Styles for Player component */
</style>

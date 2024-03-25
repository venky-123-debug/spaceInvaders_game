<script>
  import Router from "svelte-spa-router"
  import routes from "./routes"
</script>

<Router {routes} />

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  body {
    font-family: 'Press Start 2P';font-size: 10px;
}
</style>

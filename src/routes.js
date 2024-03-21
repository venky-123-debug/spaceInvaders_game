import ErrorCode404 from "./Pages/404/index.svelte"
import Home from "./Pages/Dino/index.svelte"
import Invaders from "./Pages/Invaders/index.svelte"

export default {
  "/":Home,
  "/invaders":Invaders,
  // The catch-all route must always be last
  "*": ErrorCode404,
}

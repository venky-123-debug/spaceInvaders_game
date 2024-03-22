import ErrorCode404 from "./Pages/404/index.svelte"
import Home from "./Pages/Dino/index.svelte"
import Invaders from "./Pages/Invaders/index.svelte"
import spaceInvaders from "./Pages/spaceInvaders/index.svelte"

export default {
  "/":Home,
  "/invaders":Invaders,
  "/spaceInvaders":spaceInvaders,
  // The catch-all route must always be last
  "*": ErrorCode404,
}

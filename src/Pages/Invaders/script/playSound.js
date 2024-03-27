import * as Tone from "tone";

export const initiateEnemySound = async (url) => {
  if (!Tone.context.state === "running") {
    await Tone.start();
  }

  let bulletSound = new Tone.Player({
    url: url,
    autostart: true,
    onload: () => {
      bulletSound.toDestination().start();
    },
  });
};

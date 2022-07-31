import { World } from './src/World/World';

async function main() {
  // Get a reference to the container element
  const container = document.querySelector('#scene-container');

  // 1. Create an instance of the World app
  const world = new World(container);

  // Complete async tasks
  await world.init()

  // 2. Render the scene
  world.start();
}

main().catch((err) => {
  console.log(err)
});

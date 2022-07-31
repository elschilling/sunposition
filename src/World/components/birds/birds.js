import { AnimationMixer, Group } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

async function loadBirds() {
  const gltfLoader = new GLTFLoader()
  const parrotData = await gltfLoader.loadAsync('/assets/models/Parrot.glb')
  const parrot = parrotData.scene;
  const clip = parrotData.animations[0];
  const mixer = new AnimationMixer(parrot)
  const action = mixer.clipAction(clip);
  action.play();
  parrot.tick = (delta) => mixer.update(delta);

  parrot.traverse(n => {
    if (n.isMesh) {
      n.castShadow = true
      n.receiveShadow = true
      }
  })
  parrot.scale.multiplyScalar(0.03)
  parrot.position.set(-10,10,12)
  const parrot2 = parrot.clone()
  parrot2.scale.multiplyScalar(.9)
  parrot2.position.set(-12, 10, 10)
  let mixer2 = new AnimationMixer(parrot2)
  let action2 = mixer2.clipAction(clip)
  action2.play()
  parrot2.tick = (delta) => mixer2.update(delta)

  const parrot3 = parrot.clone()
  parrot3.scale.multiplyScalar(.7)
  parrot3.position.set(-8, 10, 10)
  let mixer3 = new AnimationMixer(parrot3)
  let action3 = mixer3.clipAction(clip)
  action3.play()
  parrot3.tick = (delta) => mixer3.update(delta)


  const araras = new Group()
  araras.add(parrot, parrot2, parrot3)
  araras.position.set(-100, 3, -100)
  araras.rotation.y = Math.PI / 6
  
  return araras
}

export { loadBirds }
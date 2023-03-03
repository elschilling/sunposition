import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { 
  BufferGeometry,
  Float32BufferAttribute,
  CylinderGeometry,
  Mesh,
  MeshStandardMaterial,
  MeshBasicMaterial,
  MathUtils
 } from 'three';

function createBase(params) {
  // Cylinder base
  const geometry = new CylinderGeometry(params.radius-1, params.radius-1, 2, 180);
  const material = new MeshStandardMaterial({ color: 'black' });
  const base = new Mesh(geometry, material);
  base.position.y = params.baseY
  // Direction labels
  const fontLoader = new FontLoader()

  fontLoader.load('fonts/droid_sans_bold.typeface.json', function (font) {
    const fontMaterial = new MeshBasicMaterial({
      color: 'black'
    })
    let textGeometry = new TextGeometry('N', {
      font: font,
      size: 3,
      height: 0.3,
  
    })
    let text = new Mesh(textGeometry, fontMaterial)
    text.rotation.x = - Math.PI/2
    text.rotation.z = - Math.PI/2
    text.position.x = - params.radius - 8
    textGeometry.computeBoundingBox()
    text.position.z = - (textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y) / 2
    base.add(text)
    textGeometry = new TextGeometry('S', { font, size: 3, height: 0.3 })
    text = new Mesh(textGeometry, fontMaterial)
    text.position.x = params.radius + 4
    text.rotation.x = - Math.PI/2
    text.rotation.z = - Math.PI/2
    textGeometry.computeBoundingBox()
    text.position.z = - (textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y) / 2
    base.add(text)
    textGeometry = new TextGeometry('L', { font, size: 3, height: 0.3 })
    text = new Mesh(textGeometry, fontMaterial)
    text.position.z = - params.radius - 6
    text.rotation.x = - Math.PI/2
    textGeometry.computeBoundingBox()
    text.position.x = - (textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y) / 2
    // text.rotation.z = - Math.PI/2
    base.add(text)
    textGeometry = new TextGeometry('O', { font, size: 3, height: 0.3 })
    text = new Mesh(textGeometry, fontMaterial)
    text.position.z = params.radius + 8
    text.rotation.x = - Math.PI/2 
    base.add(text)
  })


  // Directions arrows
  let arrowVertices = [
    -5, 0, 0,
    0, 0, 10,
    0, 0, -10
  ]
  const arrowGeometry = new BufferGeometry()
  // const arrowMaterial = new MeshBasicMaterial({ color: 'black' })
  arrowGeometry.setAttribute('position', new Float32BufferAttribute(arrowVertices, 3))
  const arrowN = new Mesh(arrowGeometry, material)
  arrowN.position.x = - params.radius + 2
  const arrowS = arrowN.clone()
  arrowS.rotation.y = Math.PI
  arrowS.position.x = params.radius - 2
  const arrowL = arrowN.clone()
  arrowL.rotation.y = - Math.PI/2
  arrowL.position.z = - params.radius + 2
  arrowL.position.x = 0
  const arrowO = arrowL.clone()
  arrowO.rotation.y = Math.PI/2
  arrowO.position.z = params.radius - 2
  arrowO.position.x = 0

  base.add(arrowN, arrowS, arrowL, arrowO)

  const radiansPerSecond = MathUtils.degToRad(1)

  base.tick = (delta) => {
    // base.rotation.y += delta * radiansPerSecond
  }

  return base;
}

export { createBase }
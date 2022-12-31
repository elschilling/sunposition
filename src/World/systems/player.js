import { Octree } from 'three/examples/jsm/math/Octree'
import { Capsule } from 'three/examples/jsm/math/Capsule'
import { Vector3 } from 'three'

function createPlayer(camera, geometry) {
  const GRAVITY = 30;
  const STEPS_PER_FRAME = 5;

  const worldOctree = new Octree();
	const playerCollider = new Capsule( new Vector3( 0, 1.35, 15 ), new Vector3( 0, 2.8, 15 ), 0.25 );
  
  const playerVelocity = new Vector3();
  const playerDirection = new Vector3();

  let playerOnFloor = false;
  let mouseTime = 0;

  const keyStates = {};

  document.addEventListener( 'keydown', ( event ) => {

    keyStates[ event.code ] = true;

  } );

  document.addEventListener( 'keyup', ( event ) => {

    keyStates[ event.code ] = false;

  } );

  document.addEventListener( 'mousedown', () => {

    // document.body.requestPointerLock();

    // mouseTime = performance.now();

  } );

  // document.addEventListener( 'mouseup', () => {

  // 	throwBall();

  // } );

  document.body.addEventListener( 'mousemove', ( event ) => {

    if ( document.pointerLockElement === document.body ) {

      camera.rotation.y -= event.movementX / 500;
      camera.rotation.x -= event.movementY / 500;

    }

  } );

  function playerCollisions() {

    const result = worldOctree.capsuleIntersect( playerCollider );

    playerOnFloor = false;

    if ( result ) {

      playerOnFloor = result.normal.y > 0;

      if ( ! playerOnFloor ) {

        playerVelocity.addScaledVector( result.normal, - result.normal.dot( playerVelocity ) );

      }

      playerCollider.translate( result.normal.multiplyScalar( result.depth ) );

    }

  }

  function updatePlayer( deltaTime ) {

    let damping = Math.exp( - 4 * deltaTime ) - 1;

    if ( ! playerOnFloor ) {

      playerVelocity.y -= GRAVITY * deltaTime;

      // small air resistance
      damping *= 0.1;

    }

    playerVelocity.addScaledVector( playerVelocity, damping );

    const deltaPosition = playerVelocity.clone().multiplyScalar( deltaTime );
    playerCollider.translate( deltaPosition );

    playerCollisions();

    camera.position.copy( playerCollider.end );

  }

  function getForwardVector() {

    camera.getWorldDirection( playerDirection );
    playerDirection.y = 0;
    playerDirection.normalize();

    return playerDirection;

  }

  function getSideVector() {

    camera.getWorldDirection( playerDirection );
    playerDirection.y = 0;
    playerDirection.normalize();
    playerDirection.cross( camera.up );

    return playerDirection;

  }

  function controls( deltaTime ) {

    // gives a bit of air control
    const speedDelta = deltaTime * ( playerOnFloor ? 25 : 8 );

    if ( keyStates[ 'KeyW' ] ) {

      playerVelocity.add( getForwardVector().multiplyScalar( speedDelta ) );
      document.body.requestPointerLock();
    }

    if ( keyStates[ 'KeyS' ] ) {

      playerVelocity.add( getForwardVector().multiplyScalar( - speedDelta ) );
      document.body.requestPointerLock();

    }

    if ( keyStates[ 'KeyA' ] ) {

      playerVelocity.add( getSideVector().multiplyScalar( - speedDelta ) );
      document.body.requestPointerLock();

    }

    if ( keyStates[ 'KeyD' ] ) {

      playerVelocity.add( getSideVector().multiplyScalar( speedDelta ) );
      document.body.requestPointerLock();

    }

    if ( playerOnFloor ) {

      if ( keyStates[ 'Space' ] ) {

        playerVelocity.y = 15;

      }

    }

  }
  worldOctree.fromGraphNode(geometry)

  function teleportPlayerIfOob() {

    if ( camera.position.y <= - 25 ) {

      playerCollider.start.set( 0, 1.35, 15 );
      playerCollider.end.set( 0, 2.8, 15 );
      playerCollider.radius = 0.35;
      camera.position.copy( playerCollider.end );
      camera.rotation.set( 0, 0, 0 );

    }

  }

  playerCollider.tick = (delta) => {
    for ( let i = 0; i < STEPS_PER_FRAME; i ++ ) {
      const deltaTime = Math.min( 0.05, delta) / STEPS_PER_FRAME 
      controls( deltaTime );

      updatePlayer( deltaTime );

      // updateSpheres( deltaTime );

      teleportPlayerIfOob();

    }

  }

  return playerCollider

}

export { createPlayer }
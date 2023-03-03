import { getPosition } from 'suncalc'
import { BufferGeometry, DoubleSide, Float32BufferAttribute, Group, LineBasicMaterial, LineDashedMaterial, LineLoop, MathUtils, Mesh, MeshBasicMaterial } from 'three'

class SunPath {
  constructor(params, sunSphere, sunLight, base) {
    this.params = params
    this.date = new Date('2022-01-01T07:00:00')
    this.date = new Date().setHours(params.hour)
    this.date = new Date(this.date).setMonth(params.month - 1)
    this.timeText = document.querySelector('.time')
    this.sunLight = sunLight
    this.sunPathLight = new Group()
    this.sphereLight = new Group()
    this.sphereLight.add(sunSphere, sunLight)
    this.sunPathLight.add(this.sphereLight, base)
    this.drawSunDayPath()
    this.drawSunSurface()
    this.drawAnalemmas()
    this.updateSunPosition()
    this.updateNorth()
  }

  getSunPosition(date) {
    let sunPosition = getPosition(date, this.params.latitude, this.params.longitude)
    let x = this.params.radius * (Math.cos(sunPosition.altitude)) * (Math.cos(sunPosition.azimuth))
    let z = this.params.radius * (Math.cos(sunPosition.altitude)) * (Math.sin(sunPosition.azimuth))
    let y = this.params.radius * (Math.sin(sunPosition.altitude))
    return { x, y, z }
  }

  drawAnalemmas() {
    if (this.params.showAnalemmas) {
      let analemmaPath = this.sunPathLight.getObjectByName('analemmaPath')
      this.sunPathLight.remove(analemmaPath)
      let analemmas = new Group()
      for (let h = 7; h < 18; h++) {
        let vertices = []
        let from = new Date(2022,0,1)
        let to = new Date(2023,0,1)
        for (let d = from; d < to; d.setDate(d.getDate() + 1)) {
          let date = new Date(d).setHours(h)
          let sunPosition = this.getSunPosition(date)
          vertices.push(sunPosition.x, sunPosition.y, sunPosition.z)
        }
        let geometry = new BufferGeometry()
        let analemmaMaterial = new LineDashedMaterial({
          color: 'yellow',
          linewidth: 1,
          scale: 10,
          dashSize: 6,
          gapSize: 3,
          transparent: true,
          opacity: 0.7
        })
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
        let analemma = new LineLoop(geometry, analemmaMaterial)
        analemma.computeLineDistances()
        analemmas.add(analemma)
        analemmas.name = 'analemmaPath'
      }
      this.sunPathLight.add(analemmas)
    } else {
      let analemmaPath = this.sunPathLight.getObjectByName('analemmaPath')
      this.sunPathLight.remove(analemmaPath)
    }
  }

  drawSunSurface() {
    if (this.params.showSunSurface) {
      let sunSurface = this.sunPathLight.getObjectByName('sunSurface')
      this.sunPathLight.remove(sunSurface)
      let vertices = []
      for (let m = 0; m < 6; m++) {
        let date = new Date('2022-01-01T00:00:00')
        for (let h = 0; h < 24; h++) {
          date = new Date(date).setMonth(m)
          date = new Date(date).setHours(h)
          let sunPosition = this.getSunPosition(date)
          vertices.push(sunPosition.x, sunPosition.y, sunPosition.z)
          date = new Date(date).setHours(h+1)
          let sunPosition2 = this.getSunPosition(date)
          vertices.push(sunPosition2.x, sunPosition2.y, sunPosition2.z)
          date = new Date(date).setMonth(m+1)
          date = new Date(date).setHours(h)
          let sunPosition3 = this.getSunPosition(date)
          vertices.push(sunPosition3.x, sunPosition3.y, sunPosition3.z)
          vertices.push(sunPosition3.x, sunPosition3.y, sunPosition3.z)
          vertices.push(sunPosition2.x, sunPosition2.y, sunPosition2.z)
          date = new Date(date).setHours(h+1)
          let sunPosition4 = this.getSunPosition(date)
          vertices.push(sunPosition4.x, sunPosition4.y, sunPosition4.z)
        }
      }
      let surfaceGeometry = new BufferGeometry()
      let surfaceMaterial = new MeshBasicMaterial({
        color: 'yellow',
        side: DoubleSide,
        transparent: true,
        opacity: 0.1
      })
      surfaceGeometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
      let surfaceMesh = new Mesh(surfaceGeometry, surfaceMaterial)
      surfaceMesh.name = 'sunSurface'
      this.sunPathLight.add(surfaceMesh)
    } else {
      let sunSurface = this.sunPathLight.getObjectByName('sunSurface')
      this.sunPathLight.remove(sunSurface)
    }
  }

  updateHour() {
    this.date = new Date(this.date).setHours(this.params.hour)
    this.date = new Date(this.date).setMinutes(this.params.minute)
    this.updateSunPosition()
  }

  updateMonth() {
    this.date = new Date(this.date).setHours(this.params.hour)
    this.date = new Date(this.date).setDate(this.params.day)
    this.date = new Date(this.date).setMonth(this.params.month - 1)
    this.updateSunPosition()
    this.drawSunDayPath()
  }

  updateNorth() {
    this.sunPathLight.rotation.y = MathUtils.degToRad(this.params.northOffset)
  }

  updateLocation() {
    this.drawSunDayPath()
    this.drawSunSurface()
    this.drawAnalemmas()
    this.updateSunPosition()
  }

  updateSunPosition() {
    let sunPosition = this.getSunPosition(this.date)
    this.sphereLight.position.set(sunPosition.x, sunPosition.y, sunPosition.z)
    this.sunLight.lookAt(0,0,0)
  }

  drawSunDayPath() {
    if (this.params.showSunDayPath) {
      let dayPath = this.sunPathLight.getObjectByName('dayPath')
      this.sunPathLight.remove(dayPath)
      let pathMaterial = new LineBasicMaterial({
        color: 'red',
        linewidth: 5,
        transparent: true,
        opacity: 0.5
      })
      let geometry = new BufferGeometry()
      let positions = []
      for (let h = 0; h < 24; h++) {
        let date = new Date(this.date).setHours(h)
        let sunPosition = this.getSunPosition(date)
        positions.push(sunPosition.x, sunPosition.y, sunPosition.z)
      }
      geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
      let path = new LineLoop(geometry, pathMaterial)
      path.name = 'dayPath'
      this.sunPathLight.add(path)
    } else {
      let dayPath = this.sunPathLight.getObjectByName('dayPath')
      this.sunPathLight.remove(dayPath)
    }
  }

  tick(delta) {
    let date = new Date(this.date)
    // this.timeText.innerHTML = 'Hora: ' + date.getHours() + ':' + date.getMinutes() + ' - Data: ' + date.getDate() + '/' + month
    if (this.params.animateTime) {
      let time = new Date(this.date).getTime()
      this.date = new Date(this.date).setTime(time + delta * 1000 * this.params.timeSpeed)
      this.params.minute = new Date(this.date).getMinutes()
      this.params.hour = new Date(this.date).getHours()
      this.params.day = new Date(this.date).getDate()
      this.params.month = new Date(this.date).getMonth()
      this.updateSunPosition()
      this.drawSunDayPath()
    }
  }
}

export { SunPath }
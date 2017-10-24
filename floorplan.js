/* BEGIN customize values here */

var minPos = {
  x: -0.3,
  z: -1
}
var maxPos = {
  x: -1,
  z: 18.7
}
/* END customize values here */

var cameraIcon = document.querySelector('#floorplan-camera-icon')
var cameraIconSize = cameraIcon.offsetWidth
var floorplanWrapper = document.querySelector('#floorplan-wrapper')
var floorplanWidth = floorplanWrapper.offsetWidth
var floorplanHeight = floorplanWrapper.offsetHeight
floorplanWrapper.setAttribute("style", "width:"+floorplanWidth+"px")

var cam = document.querySelector('[camera]')
var halfCameraIconSize = Math.floor(0.5 * cameraIconSize)

var dx=Math.abs(minPos.x-maxPos.x)
var dy=Math.abs(minPos.z-maxPos.z)

var diagonal=Math.sqrt( dx*dx + dy*dy )
var ratio = floorplanHeight/floorplanWidth
var a = (diagonal*ratio)/Math.sqrt(ratio*ratio + 1)
var b=a/ratio
var alpha=Math.asin(a/diagonal)
var minPosV= new THREE.Vector2( minPos.x, minPos.z )
var maxPosV= new THREE.Vector2( maxPos.x, maxPos.z )
var diagonalV=maxPosV.clone().setLength(b).rotateAround( new THREE.Vector2(0,0), -alpha )
var corner=minPosV.clone().add(diagonalV);
var side=minPosV.clone().sub(corner)
var angle=Math.atan2(side.y,side.x)

console.log({dx:dx, dy:dy, diagonal:diagonal, ratio:ratio,
  alpha:alpha,
  a:a, b:b, diagonalV:diagonalV, corner:corner,
  angle:angle/(2.0*Math.PI)*360.0
})

maxPosR=maxPosV.clone().rotateAround(new THREE.Vector2(0,0), -angle)
minPosR=minPosV.clone().rotateAround(new THREE.Vector2(0,0), -angle)


function updateMap() {
  var vCam = new THREE.Vector2( cam.getAttribute('position').x, cam.getAttribute('position').z )
  var vCamR = vCam.clone().rotateAround(new THREE.Vector2(0,0), -angle)
  var x2d = (vCamR.x-minPosR.x)/(1.0*maxPosR.x)
  var y2d = (vCamR.y-minPosR.y)/(1.0*maxPosR.y)
  console.log(x2d+","+y2d)

  var playerRotation = 90 - cam.getAttribute('rotation').y + angle/(2.0*Math.PI)*360;
  var css = ""
  css = css + "top:" + (y2d * floorplanHeight - halfCameraIconSize) + "px;left:" + (x2d * floorplanWidth - halfCameraIconSize) + "px;"
  css = css + "transform:rotate(" + playerRotation + "deg)"
  cameraIcon.setAttribute("style", css)
}
updateMap()
cam.addEventListener('componentchanged', function(evt) {
  if (evt.detail.name !== 'position' && evt.detail.name !== 'rotation') {
    return;
  }
  updateMap()
})

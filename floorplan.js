 /* BEGIN customize values here */
var cameraIconSize=50
var floorplanWidth=250
var angle
var minPos = {x: 0, z: -2}
var maxPos = {x: -11, z: 16}
var cameraIcon=document.querySelector('#floorplan-camera-icon')
var floorplanWrapper=document.querySelector('#floorplan-wrapper')
/* END customize values here */

var cam = document.querySelector('[camera]')
var halfCameraIconSize=Math.floor(0.5*cameraIconSize)
floorplanWrapper.setAttribute("style", "width:"+floorplanWidth+"px")

if (minPos.x>maxPos.x){
  if (minPos.z>maxPos.z){
    angle=270
  } else {
    angle=0
  }
} else {
  if (minPos.z>maxPos.z){
    angle=180
  } else {
    angle=90
  }
}

if (minPos.x>maxPos.x){
  var temp = minPos.x
  minPos.x = maxPos.x
  maxPos.x = temp
}
if (minPos.z>maxPos.z){
  var temp = minPos.z
  minPos.z = maxPos.z
  maxPos.z = temp
}

var sceneXSize= Math.abs( maxPos.x - minPos.x )
var sceneZSize= Math.abs( maxPos.z - minPos.z )

var sizeRatio;
if (angle == 90 || angle == 270) {
    sizeRatio = 1.0 * sceneZSize / sceneXSize
} else {
    sizeRatio = 1.0 * sceneXSize / sceneZSize
}
var floorplanHeight = sizeRatio * floorplanWidth

function rotateCoordinates(x,z,angle){
  if (angle==0) {
    return [z,1-x]
  } else if (angle==90) {
    return [x,z]
  } else if (angle==180) {
    return [1-z,x]
  } else if (angle==270) {
    return [1-x,1-z]
  } else {
    console.log("weird angle given");
  }
}

function updateMap() {
  var x3d = ((cam.getAttribute('position').x)-minPos.x) / sceneXSize
  var z3d = ((cam.getAttribute('position').z)-minPos.z) / sceneZSize
  coords2d=rotateCoordinates(x3d,z3d,angle)
  var x2d=coords2d[0];
  var y2d=coords2d[1];
  var playerRotation = angle-90-cam.getAttribute('rotation').y;
  var css="width:"+cameraIconSize+"px;height:"+cameraIconSize+"px;"
  css=css+"top:"+(y2d*floorplanHeight-halfCameraIconSize)+"px;left:"+(x2d*floorplanWidth-halfCameraIconSize)+"px;"
  css=css+"transform:rotate("+playerRotation+"deg)"
  cameraIcon.setAttribute("style", css)
}

updateMap()

cam.addEventListener('componentchanged', function (evt) {
  if (evt.detail.name !== 'position' && evt.detail.name !== 'rotation') { return; }
  updateMap()
})

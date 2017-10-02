 /* BEGIN customize values here */
var cameraIconSize=50
var floorplanWidth=250
var angle=0
var minPos = {x: 6, z: -14}
var maxPos = {x: -9, z: 9.5}
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
var floorplanHeight=1.0*sceneXSize/sceneZSize*floorplanWidth

function transform3dTo2d([x,z],angle){
  angle=angle/180.0*Math.PI
  var pixelCoords = [ z * Math.cos(angle) + Math.sin(angle) * x, x * Math.cos(angle-Math.PI) + Math.sin(angle) * z ];
  pixelCoords.forEach(function(v, i){
    if (v<0){    pixelCoords[i]+=1;   }
  })
  return pixelCoords;
}

function updateMap() {
  var x = (parseFloat(cam.getAttribute('position').x)-minPos.x) / sceneXSize
  var z = (parseFloat(cam.getAttribute('position').z)-minPos.z) / sceneZSize
  
  pixelX=transform3dTo2d([x,z],angle)[0]
  pixelY=transform3dTo2d([x,z],angle)[1]
  var playerRotation = angle-90-cam.getAttribute('rotation').y; 
  var css="width:"+cameraIconSize+"px;height:"+cameraIconSize+"px;"
  css=css+"top:"+(pixelY*floorplanHeight-halfCameraIconSize)+"px;left:"+(pixelX*floorplanWidth-halfCameraIconSize)+"px;"
  css=css+"transform:rotate("+playerRotation+"deg)"
  cameraIcon.setAttribute("style", css)
}
      
updateMap()

cam.addEventListener('componentchanged', function (evt) {
  if (evt.detail.name !== 'position' && evt.detail.name !== 'rotation') { return; }
  updateMap()
})
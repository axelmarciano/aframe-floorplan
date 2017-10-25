
function initFloorplan(minPos, maxPos){
  document.querySelector('a-scene').addEventListener('loaded', function () {
    var cameraIcon = document.querySelector('#floorplan-camera-icon')
    var cameraIconSize = cameraIcon.offsetWidth
    var floorplan = document.querySelector('img#floorplan')
    var floorplanWidth = floorplan.offsetWidth
    var floorplanHeight = floorplan.offsetHeight
    var cam = document.querySelector('[camera]')
    var halfCameraIconSize = Math.floor(0.5 * cameraIconSize)

    //freeze size of floorplanWrapper
    var floorplanWrapper = document.querySelector('#floorplan-wrapper')
    floorplanWrapper.setAttribute("style", "width:"+floorplanWrapper.offsetWidth+"px;height:"+floorplanWrapper.offsetHeight+"px")

    //vector foo to find angle between minimap and 3d world
    var minPosV= new THREE.Vector2( minPos.x, minPos.z )
    var maxPosV= new THREE.Vector2( maxPos.x, maxPos.z )

    var diagonal=maxPosV.clone().sub(minPosV).length()
    var ratio = floorplanHeight/floorplanWidth
    var a = (diagonal*ratio)/Math.sqrt(ratio*ratio + 1)
    var b=a/ratio
    var alpha=Math.asin(a/diagonal)
    var diagonalV=maxPosV.clone().sub(minPosV).setLength(b).rotateAround( new THREE.Vector2(0,0), -alpha )
    var corner=minPosV.clone().add(diagonalV);
    var side=minPosV.clone().sub(corner)
    var angle=Math.atan(side.y/side.x)                //angle between house and minimap
    var cameraAngleOffset=Math.atan2(side.y,side.x)   //angle for camera icon rotation

    //rotate minPos and maxPos to match minimap
    maxPosR=maxPosV.clone().rotateAround(new THREE.Vector2(0,0), -angle)
    minPosR=minPosV.clone().rotateAround(new THREE.Vector2(0,0), -angle)

    function updateMap() {
      var vCam = new THREE.Vector2( cam.getAttribute('position').x, cam.getAttribute('position').z )

      //rotate camera position to match minimap
      var vCamR = vCam.clone().rotateAround(new THREE.Vector2(0,0), -angle)

      var x2d = (vCamR.x-minPosR.x)/(maxPosR.x-minPosR.x)
      var y2d = (vCamR.y-minPosR.y)/(maxPosR.y-minPosR.y)

      var cameraRotation = 180-cameraAngleOffset/(2.0*Math.PI)*360 - cam.getAttribute('rotation').y;

      //write cameraIcon CSS
      var css = ""
      css = css + "top:" + (Math.round(y2d*100.0)/100.0 * floorplanHeight - halfCameraIconSize) + "px;right:" + ( Math.round((1-x2d)*100.0)/100.0 * floorplanWidth - halfCameraIconSize) + "px;"
      css = css + "transform:rotate(" + (Math.round(cameraRotation*100.0)/100.0) + "deg)"
      cameraIcon.setAttribute("style", css)
    }
    updateMap()
    cam.addEventListener('componentchanged', function(evt) {
      if (evt.detail.name !== 'position' && evt.detail.name !== 'rotation') {
        return;
      }
      updateMap()
    })
  });
}

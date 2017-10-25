# aframe floorplan guide for Medium
This is adjusted language to be used for Medium showcase post.

  1. Create an aframe webapp from your 3d scene, for example on https://appcreator.3d.io/ .
  1. Add the HTML elements for the minimap:
      ```html
        <!-- Floorplan -->
         <div id="floorplan-wrapper" class="overlay">
          <img id="floorplan" src="https://storage.3d.io/SOME ID/FILENAME.jpg">
          <img id="floorplan-camera-icon" src="https://storage.3d.io/0778145f-e104-4a9e-b70d-392f0a5a1444/2017-10-24_14-37-47_m3yr3c/camera-icon.png">
         </div>
       ```
  1. Add some CSS to style the floor plan. Again, do this “outside” the <a-scene> section:
     ```css
      <!--Styling the minimap-->
      <style>
      #floorplan-wrapper {
        user-select: none;
        position: fixed;
        top: 5%;
        right: 5%;
        padding: 0;
        z-index: 1000;
        width: 250px;
        height:250px;
      }

      @media only screen and (max-width: 800px) {
        #floorplan-wrapper {
          width: 100px;
          height: 100px;
        }
      }

      img#floorplan {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        float: right;
      }

      #floorplan-camera-icon {
       width:50px;
       width:50px;
       position: absolute;
       transition-property: right, top;
       transition-duration: 0.5s, 0.5s;
      }
      </style>

     ```
1. Finally, add a script to your App which dynamically positions the location icon on the MiniMap. Again, do this “outside” the <a-scene> section. I usually put these at the bottom, right before </body> and </html> are closed:
   ```html
    <script> 
    
    function initFloorplan(minPos, maxPos){
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

}
    </script>
    <script>
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
      initFloorplan(minPos,maxPos)
    </script>
   ```
2. press ``CTRL+ALT+I`` to launch the aframe inspector
3. create a new entity by hitting the plus sign on the top left
4. find your new entity on the bottom left and select it
5. drag your entity around until it represents ``minPos``, which is the top left corner of your floorplan in the 3d world.  
6. enter the **x** and **z** coordinates of your entity into the ``minPos`` variable
7. repeat for maxPos
8. You're done!

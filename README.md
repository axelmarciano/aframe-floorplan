# aframe floorplan guide
This is a tiny guide on how to make a minimap HTML element in aframe, optionally using [3d.io](https://3d.io) (not required) 

1. Create an aframe webapp from your 3d scene, for example on https://appcreator.3d.io/ .
1. Add the HTML elements for the minimap:
     ```html
      <!-- Floorplan -->
      <div id="floorplan-wrapper" class="overlay">
       <img id="floorplan" src="floorplan.jpg">
       <img id="floorplan-camera-icon" src="camera-icon.png">
      </div>
     ```  
1. Add some CSS to your website to style them. Later, the JS code will write a style attribute into the ``floorplan-camera-icon`` that sets the position of the icon relative to the ``floorplan-container`` in pixels  
     ```css
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

     ```
1. [floorplan.js](https://github.com/mope1/3dio-floorplan-guide/blob/master/floorplan.js) is some basic javascript that listens to movements of the aframe camera and converts them into css code for the floorplan camera icon. Here is a way to embed it into the site:
   ```html
    <script src="floorplan.js"></script>
    <script>
      var minPos = {
        x: -0.3,
        z: -1
      }
      var maxPos = {
        x: -1,
        z: 18.7
      }
      initFloorplan(minPos,maxPos)
    </script>
   ```
   Make sure the contents of ``floorplan.js`` are executed **after** the aframe scene is loaded by placing those two ``<script>`` tags after the ``</a-scene>``.
2. press ``CTRL+ALT+I`` to launch the aframe inspector
3. create a new entity by hitting the plus sign on the top left
4. find your new entity on the bottom left and select it
5. drag your entity around until it represents ``minPos``, which is the top left corner of your floorplan in the 3d world.  
   See picture below:  
   ![](guide.png)
6. enter the **x** and **z** coordinates of your entity into the ``minPos`` variable
7. repeat for maxPos
8. You're done!

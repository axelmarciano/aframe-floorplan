# 3dio-floorplan-guide
This is a tiny guide on how to make a minimap HTML element in aframe

1. Create an aframe webapp from your 3d.io scene on https://appcreator.3d.io/
1. Add the HTML elements for the minimap
  ```
<div id="floorplan-wrapper" class="overlay">
    <div id="floorplan">
      <img src="map.png">
      <img id="floorplan-camera-icon" src="https://cdn.glitch.com/a4457cb3-fb58-43ad-ad8e-d82fa2915817%2FCameraPosition.png?1504103910984">
    </div>
</div>
  ```
1. Add some CSS to your website to style them 
  ```
      #floorplan-wrapper {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        position: fixed;
        top: 50px;
        right: 50px;
        padding: 0;
        z-index: 1000;
      }
      #floorplan {
        position: relative;
        width: 100%;
        padding: 0;
        z-index: 1000;
      }
      #floorplan img {
        width: 100%;
        height: 100%;
      }
      #floorplan-camera-icon {
       position: absolute;
       width:25px;
       height:25px;
       transition-property: left, top;
       transition-duration: 0.5s, 0.5s;
      }

  ```
1. [Here](https://github.com/mope1/3dio-floorplan-guide/blob/master/floorplan.js) is some basic javascript that listens to movements of the aframe camera and converts them into css code for the floorplan camera icon. **Make sure this code is executed after the aframe scene is loaded.**
2. press ``CTRL+ALT+I`` to launch the aframe inspector
3. create a new entity by hitting the plus sign on the top left
4. find your new entity on the bottom left and select it
5. drag your entity around until it represents minPos, see picture below:
![](guide.png)
6. enter the **x** and **z** coordinates of your entity into the minPos variable in the minimap script
7. repeat for maxPos

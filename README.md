# Cross-Platform 2D & 3D Data Visualization
Samples for the Developer Week 2015, Nuremberg

## Presentation
Please find the presentation [on Speaker Deck](https://speakerdeck.com/chliebel/cross-plattform-2d-and-3d-datenvisualisierung-in-javascript-guckst-du).

## SignalR
The SignalR part is hosted in an OWIN self host on Mono on a Raspberry Pi 2 running Raspbian. In order to build the SignalR project without any IDE, please install Mono and call `sh build.sh` in the `signalr` directory. In order to execute the self host, call `sh run.sh`. By default, port 8080 is used.

### Notes
Please make sure that your version of Mono is newer than or equal to 3.6, but less than 4. Mono 4 has some issues with SignalR hosting that are not resolved yet. Instructions on how to install specific versions of Mono using the package manager `apt` [can be found here](http://www.mono-project.com/docs/getting-started/install/linux/#accessing-older-releases).

Please edit the endpoint variables in the `examples.js` source files according to where you host SignalR.

## 2D
The 2D client sample was built using Leaflet, chart.js and the SignalR client library. This sample relies on Leaflet to handle touch properly.

### iOS app
In order to publish the 2D client sample as an iOS app, please install Apache Cordova and execute `sh setup.sh` in the `2d` directory. This will download all dependencies and add the iOS platform. For device deployment, run `sh deploy.sh`.

## 3D
The 3D client sample was built using three.js, tween.js and the SignalR client library. This sample uses the three.js trackball controls that rely on touch events. A touch event polyfill is included in order to support IE 10 on desktop.

### Android app
In order to publish the 3D client sample as an Android app, please install Apache Cordova and execute `sh setup.sh` in the `3d` directory. This will download all dependencies, add the Android platform and install the Crosswalk plugin. For device deployment, run `sh deploy.sh`.

## Further Reading
### Installing Raspbian
* [Raspberry Pi Operating System Images](https://www.raspberrypi.org/downloads/)
* [How to setup Raspbian](https://learn.sparkfun.com/tutorials/setting-up-raspbian-and-doom)

### Installing Mono
* [Install Mono on Linux](http://www.mono-project.com/docs/getting-started/install/linux/)

### Installing Cordova
* [Installing the Cordova CLI](https://cordova.apache.org/docs/en/4.0.0/guide_cli_index.md.html)

### Canvas & Touch Support
* [Canvas documentation (MDN)](https://developer.mozilla.org/de/docs/Web/HTML/Canvas)
* [Enabling cross-platform touch interactions](http://weblogs.thinktecture.com/christian_liebel/2015/05/enabling-cross-platform-touch-interactions-pointer-vs-touch-events.html )

### 2D & requestAnimationFrame
* [Canvas 2D context specification](http://www.w3.org/TR/2dcontext/)
* [requestAnimationFrame documentation (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

### WebGL, three.js & tween.js
* [WebGL Specifications](https://www.khronos.org/registry/webgl/specs/latest/)
* [WebGL Wiki](https://www.khronos.org/webgl/wiki/Main_Page)
* [three.js](http://threejs.org/)
* [tween.js](https://github.com/tweenjs/tween.js/)

## Image Sources
* Earth texture: NASA/Goddard Space Flight Center Scientific Visualization Studio The Blue Marble Next Generation data is courtesy of Reto Stockli (NASA/GSFC) and NASA's Earth Observatory.
* Gummibear picture: [by Ckling](https://commons.wikimedia.org/wiki/File:Gummi_Bears_in_Action_01.JPG), CC by-sa 3.0 Unported

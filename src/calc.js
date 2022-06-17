import LatLon from "https://cdn.jsdelivr.net/npm/geodesy@2.2.1/latlon-spherical.min.js";

export class CalcVR {
  constructor() {
    this.distance = 0;
    this.bearing = 0;
    this.newPosition = [0, 0];
    this.currentPosition = [0, 0];
    this.objectSize = "0, 0, 0";
    this.newDistance = 800;
    this.splitsLat = [];
    this.splitsLon = [];
    this.distanceLat = 0;
    this.distanceLon = 0;
  }

  calcDist(currentPosiArg, targetPosition) {
    const current = new LatLon(currentPosiArg[0], currentPosiArg[1]);
    const target = new LatLon(targetPosition[0], targetPosition[1]);
    this.distance = current.distanceTo(target);
    this.bearing = current.finalBearingTo(target);
    this.currentPosition = currentPosiArg;
  }
  calcBetween(currentPosition, targetPosition){
    this.distanceLat = Math.abs(currentPosition[0]-targetPosition[0])/20;
    this.distanceLon = Math.abs(currentPosition[1]-targetPosition[1])/20;
    for (let t = 0; t < 10; t++) {
      this.splitsLat.push(currentPosition[0] + distanceLat*t);
      this.splitsLon.push(currentPosition[1] + distanceLon*t);
    }
  }

  calcNewPosition(currentPosition, bearing, newTargetToDistance) {
    const current = new LatLon(currentPosition[0], currentPosition[1]);
    const calculatedlced = current.destinationPoint(
      newTargetToDistance,
      bearing
    );
    this.newPosition = [calculatedlced.latitude, calculatedlced.longitude];
  }
  calcSizeDist(distance) {
    if (distance <= 1000 && distance >= 500) {
      this.objectSize = "50 50 50";
      this.newDistance = 800;
    } else if (distance > 1000 && distance <= 8000) {
      this.objectSize = "45 45 45";
      this.newDistance = 800 + distance / 1000;
    } else if (distance > 8000 && distance <= 16000) {
      this.objectSize = "40 40 40";
      this.newDistance = 800 + distance / 1000;
    } else if (distance > 16000 && distance <= 20000) {
      this.objectSize = "30 30 30";
      this.newDistance = 800 + distance / 1000;
    } else if (distance > 20000) {
      this.objectSize = "20 20 20";
      this.newDistance = 800 + distance / 1000;
    }
  }
}

let coordinates = [];

window.onload = async () => {
  console.log("on loaded");
  const res = await fetch("ors-route_1654058631736.json"); //awaitして、ors-routeを撮ってきてresに
  const json = await res.json(); //awaitして、resにjson()を適用させたものをjsonの中に
  const coords = json.routes[0].geometry.coordinates; //jsonのroutesのgeometryのcoordinatesをcoordsに
  coordinates = coords.map((coord) => { //coordsの配列の一つ一つに対してcoordというアロー関数を使ってcoordinatesに
    return {
      name: "test",
      location: {
        lat: coord[1],
        lng: coord[0],
      },
    };
  });
  console.log(coordinates);
  navigator.geolocation.getCurrentPosition(success, error, options);
};

function staticLoadPlaces() {
  return coordinates;
}

function renderPlaces(places, pos) {
  let scene = document.querySelector("a-scene");
  var crd = pos.coords;
  let cal = new CalcVR();

  places.forEach((place) => {
    let latitude = place.location.lat;
    let longitude = place.location.lng;
    let name = place.name;
    let modelName = place.modelName;
    cal.calcBetween([crd.latitude, crd.longitude], [latitude, longitude]);
    cal.calcDist([crd.latitude, crd.longitude], [latitude, longitude]);
    console.log(`heading: ${crd.heading}`);
    cal.calcNewPosition(cal.currentPosition, cal.bearing, cal.newDistance);
    cal.calcSizeDist(cal.distance);

    let model = document.createElement("a-text");
    model.setAttribute("value", `${name}`);
    model.setAttribute("look-at", "[gps-camera]");
    model.setAttribute(
      "gps-entity-place",
      `latitude: ${cal.newPosition[0]}; longitude: ${cal.newPosition[1]};`
    );
    model.setAttribute("scale", `${cal.objectSize}`);
    model.addEventListener("loaded", () => {
      window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
    });
    scene.appendChild(model);

    

    // let model2 = document.createElement("a-box");//for文で10個分表示させるhe
    // model2.setAttribute("material", `color:red`);あ
    // model2.setAttribute(
    //   "gps-entity-place",
    //   `latitude: ${cal.splitsLat[1]}; longitude: ${cal.splitsLon[1]};`
    // );
    // model2.setAttribute("wireframe", "true");
    // model2.setAttribute("scale", `10 10 10`);
    // model2.addEventListener("loaded", () => {
    //   window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
    // });
    // scene.appendChild(model2);

    // let model3 = document.createElement("a-box");//for文で10個分表示させるhe
    // model3.setAttribute("material", `color:blue`);
    // model3.setAttribute(
    //   "gps-entity-place",
    //   `latitude: ${cal.splitsLat[2]}; longitude: ${cal.splitsLon[2]};`
    // );
    // model3.setAttribute("wireframe", "true");
    // model3.setAttribute("scale", `25 25 25`);
    // model3.addEventListener("loaded", () => {
    //   window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
    // });
    // scene.appendChild(model3);
    for (let i = 0; i < 20; i++) {
    //   let mod = eval("model" + i);//iを使ったmodel[i]で被らないようにしようとしている。
      let model2 = document.createElement("a-box");
      model2.setAttribute("material", `color:red`);
      model2.setAttribute(
        "gps-entity-place",
        `latitude: ${cal.splitsLat[i]}; longitude: ${cal.splitsLon[i]};`
      );
      model2.setAttribute("wireframe", "true");
      model2.setAttribute("scale", `${i*5} ${i*5} ${i*5}`);
      model2.addEventListener("loaded", () => {
        window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
      });
      scene.appendChild(model2);
    }
    // let model4 = document.createElement("a-box");//for文で10個分表示させるhe
    // model4.setAttribute("material", `color:red`);
    // model4.setAttribute(
    //   "gps-entity-place",
    //   `latitude: ${cal.splitsLat[3]}; longitude: ${cal.splitsLon[3]};`
    // );
    // model4.setAttribute("scale", `50 50 50`);
    // model4.addEventListener("loaded", () => {
    //   window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
    // });
    // scene.appendChild(model4);
   
  });
}
var options = {
  enableHighAccuracy: true,
  timeout: 50000,
  maximumAge: 0,
};

function success(pos) {
  let places = staticLoadPlaces();
  renderPlaces(places, pos);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  alert("Unable to capture current location.");
}

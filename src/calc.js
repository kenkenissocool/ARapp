import LatLon from "https://cdn.jsdelivr.net/npm/geodesy@2.2.1/latlon-spherical.min.js";

export class CalcVR {
  constructor() {
    this.distance = 0;
    this.bearing = 0;
    this.newPosition = [0, 0];
    this.currentPosition = [0, 0];
    this.objectSize = "0, 0, 0";
    this.newDistance = 800;
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

  // calcBetween(currentPosition, targetPosition){
  //   this.distanceLat = Math.abs(currentPosition[0]-targetPosition[0])/20;
  //   this.distanceLon = Math.abs(currentPosition[1]-targetPosition[1])/20;
  //   for (let t = 0; t < 10; t++) {
  //     this.splitsLat.push(currentPosition[0] + this.distanceLat*t);
  //     this.splitsLon.push(currentPosition[1] + this.distanceLon*t);
  //   }
  // }

  calcNewPosition(currentPosition, bearing, newTargetToDistance) {
    const current = new LatLon(currentPosition[0], currentPosition[1]);
    const calculatedlced = current.destinationPoint(
      newTargetToDistance,
      bearing
    );
    this.newPosition = [calculatedlced.latitude, calculatedlced.longitude];

    this.splitsLat = [];
    this.splitsLon = [];
    this.distanceLat = (currentPosition[0]-this.newPosition[0])/20;
    this.distanceLon = (currentPosition[1]-this.newPosition[1])/20;
    for (let t = 0; t < 20; t++) {
      this.splitsLat.push(currentPosition[0] - this.distanceLat*t);
      this.splitsLon.push(currentPosition[1] - this.distanceLon*t);
    }
  }
  calcSizeDist(distance) {
    if (distance <= 100 && distance >= 0) {
      this.objectSize = "50 50 50";
      //this.newDistance = 800;
      this.newDistance = distance;
    } else if (distance > 100 && distance <= 800) {
      this.objectSize = "45 45 45";
      //this.newDistance = 800 + distance / 1000;
      this.newDistance = distance;
    } else if (distance > 800 && distance <= 1600) {
      this.objectSize = "30 30 30";
      this.newDistance = 800 + distance / 1000;
    } else if (distance > 1600 && distance <= 2000) {
      this.objectSize = "15 15 15";
      this.newDistance = 800 + distance / 1000;
    } else if (distance > 2000) {
      this.objectSize = "5 5 5";
      this.newDistance = 800 + distance / 1000;
    }
  }
}

let coordinates = [];

window.onload = async () => {
  console.log("on loaded");
  const res = await fetch("01.json"); //awaitして、ors-routeを撮ってきてresに
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
  let id = 0;

  places.forEach((place) => {
    let latitude = place.location.lat;
    let longitude = place.location.lng;
    let name = id++;
    
    let modelName = place.modelName;
    //cal.calcBetween([crd.latitude, crd.longitude], [latitude, longitude]);
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

    for (let i = 0; i < 20; i++) {
      let model2 = document.createElement("a-box");
      model2.setAttribute("material", `color:red`);
      model2.setAttribute(
        "gps-entity-place",
        `latitude: ${cal.splitsLat[i]}; longitude: ${cal.splitsLon[i]};`
      );
      // model2.setAttribute("wireframe", "true");
      model2.setAttribute("scale", `${3} ${3} ${3}`);
      model2.addEventListener("loaded", () => {
        window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
      });
      scene.appendChild(model2);
      
    }
    console.log(cal.splitsLat);
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

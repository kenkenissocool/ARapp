import LatLon from "https://cdn.jsdelivr.net/npm/geodesy@2.2.1/latlon-spherical.min.js";

export class CalcVR {
  constructor() {
    this.distance = 0;
    this.bearing = 0;
    this.newPosition = [0, 0];
    this.currentPosition = [0, 0];
    this.objectSize = "0, 0, 0";
    this.newDistance = 800;
  }

  calcDist(currentPosiArg, targetPosition) {
    const current = new LatLon(currentPosiArg[0], currentPosiArg[1]);
    const target = new LatLon(targetPosition[0], targetPosition[1]);
    this.distance = current.distanceTo(target);
    this.bearing = current.finalBearingTo(target);
    this.currentPosition = currentPosiArg;

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
  const res = await fetch("yokohama.geojson"); //awaitして、ors-routeを撮ってきてresに
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

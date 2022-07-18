import LatLon from "https://cdn.jsdelivr.net/npm/geodesy@2.2.1/latlon-spherical.min.js";

export class CalcVR {
  constructor() {
    this.latBetween = 0;
    this.lonBetween = 0;
  }

  connectPoints(lastPosition,target) {
    this.splitsLat = [];
    this.splitsLon = [];
    this.latBetween = (lastPosition[0]-target[0])/15;
    this.lonBetween = (lastPosition[1]-target[1])/15;
    for (let t = 0; t < 15; t++) {
      this.splitsLat.push(lastPosition[0] - this.latBetween*t);
      this.splitsLon.push(lastPosition[1] - this.lonBetween*t);
    }
  }
}

let coordinates = [];

window.onload = async () => {
  console.log("on loaded");
  const res = await fetch("hongaku2.geojson"); //awaitして、ors-routeを撮ってきてresに
  const json = await res.json(); //awaitして、resにjson()を適用させたものをjsonの中に
  const coords = json.features[0].geometry.coordinates; //jsonのroutesのgeometryのcoordinatesをcoordsに
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
  let lastlat = crd.latitude;
  let lastlon = crd.longitude;

  places.forEach((place) => {
    let latitude = place.location.lat;
    let longitude = place.location.lng;
    let name = id++;
    console.log(latitude);

    
    console.log(`heading: ${crd.heading}`);
    cal.connectPoints([lastlat,lastlon], [latitude, longitude]);

    let model = document.createElement("a-text");
    model.setAttribute("value", `${name}`);
    model.setAttribute("look-at", "[gps-camera]");
    model.setAttribute(
      "gps-entity-place",
      `latitude: ${latitude}; longitude: ${longitude};`
    );
    model.setAttribute("scale", `${10} ${10} ${10}`);
    model.addEventListener("loaded", () => {
      window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
    });
    scene.appendChild(model);

    for (let i = 0; i < 15; i++) {
      let model2 = document.createElement("a-box");
      model2.setAttribute("material", `color:red`);
      model2.setAttribute(
        "gps-entity-place",
        `latitude: ${cal.splitsLat[i]}; longitude: ${cal.splitsLon[i]};`
      );
      model2.setAttribute("scale", `${1} ${1} ${1}`);
      model2.addEventListener("loaded", () => {
        window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
      });
      scene.appendChild(model2);
    }

    lastlat = latitude;
    lastlon = longitude;
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
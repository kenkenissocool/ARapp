var myElement = document.getElementById('fire');
let coordinates = [];


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

myElement.addEventListener('click', function(event) {
  console.log('My HTML element was clicked, woot woot!');
  //navigator.geolocation.getCurrentPosition(success, error, options);
});

function staticLoadPlaces() {
  return coordinates;
}

function callAPIOCI(url, pos){
  console.log('APIOCI');

  let lat;
  let lon;
  //var crd = pos.coords;
  let currentlat = 36.110443941860225; //crd.latitude;
  let currentlon = 140.1004002308503; //crd.longitude;
  console.log(currentlat);


  const locationAPI = async(urlz) =>{
    const response = await fetch(urlz,{method : "get"});
    const json = response.json();
    if (response.status == 200){
      return Promise.resolve(json);
    }else{
      return Promise.reject(json.error);
    }
  }

  locationAPI(url)
    .then(function(data){
      return new Promise(function (resolve,reject){
      const jsonObj = JSON.stringify(data);
      const items = data.items;
      lat = items[0]["lat"];
      lon = items[0]["lon"];
      const location = lon +", " + lat;
      console.log(lat);
      console.log(jsonObj);
      document.getElementById("resp").textContent = location ;
      resolve(location);});
    })
    .then(function(value){
      let request = new XMLHttpRequest();
      request.open('POST', "https://api.openrouteservice.org/v2/directions/foot-walking/geojson");
      request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
      request.setRequestHeader('Content-Type', 'application/json');
      request.setRequestHeader('Authorization', '5b3ce3597851110001cf6248a9c8937ac7a74664b0dc317c69d6c058');
      request.onreadystatechange = function () {
        if (this.readyState === 4) {
          console.log('Status:', this.status);
          console.log('Headers:', this.getAllResponseHeaders());
          console.log(this.responseText);
        }
      };
      console.log(value);
      const body = '{"coordinates":[['+ currentlon +', '+ currentlat +'],['+ value + ']]}';
      request.send(body);
      const geoJSON = request.responseText;
      console.log(geoJSON);
      var geoparse = JSON.parse(request.responseText);
      console.log(geoparse);

      //const res = fetch("geojson");
      const geojson = geoparse.json(); //awaitして、resにjson()を適用させたものをjsonの中に
      const coords = geojson.features[0].geometry.coordinates; //jsonのroutesのgeometryのcoordinatesをcoordsに
      coordinates = coords.map((coord) => { //coordsの配列の一つ一つに対してcoordというアロー関数を使ってcoordinatesに
        return {
          name: "test",
          location: {
            lat: coord[1],
            lon: coord[0],
          },
        };
      });
      console.log(coordinates);
    })
    .catch((err) =>{
      console.log(err);
    });
}

function renderPlaces(places, pos) {
  let scene = document.querySelector("a-scene");
  let cal = new CalcVR();
  let id = 0;
  let lastlat = 36.110443941860225;//pos.coords.latitude;
  let lastlon = 140.1004002308503; //pos.coords.longitude;

  places.forEach((place) => {
    let latitude = place.location.lat;
    let longitude = place.location.lon;
    let name = id++;
    console.log(latitude);
    
    //console.log(`heading: ${crd.heading}`);
    cal.connectPoints([lastlat,lastlon], [latitude, longitude]);

    let model = document.createElement("a-text");
    model.setAttribute("value", `${name}`);
    model.setAttribute("look-at", "[gps-camera]");
    model.setAttribute(
      "gps-entity-place",
      `latitude: ${latitude}; longitude: ${longitude};`
    );
    model.setAttribute("scale", `${1} ${1} ${1}`);
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
  console.log(success);
  const urlTemp = "https://g965edebf922493-cojt1.adb.ap-osaka-1.oraclecloudapps.com/ords/admin/tslo/2/";
  const place = document.getElementById("plase").value;
  const URL = urlTemp + place;

  const JN = callAPIOCI(URL, pos);
  let places = staticLoadPlaces();
  renderPlaces(places, pos);
  
  console.log(JN);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  alert("Unable to capture current location.");
}

console.log("JavaScriptを実行しています");
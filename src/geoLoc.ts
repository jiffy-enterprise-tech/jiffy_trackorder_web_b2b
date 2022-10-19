
let id:any;
let target:any;
let options:any;

function success(pos:any) {
    const crd = pos.coords;

  if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
      console.log('Congratulations, you reached the target');
      navigator.geolocation.clearWatch(id);
    }
}

function error(err:any) {
    console.error(`ERROR(${err.code}): ${err.message}`);
}

target = {
    latitude : 0,
    longitude: 0
};

options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
};

id = navigator.geolocation.watchPosition(success, error, options);
export default id;
import { Typography } from '@mui/joy'
import { Container } from '@mui/system'
import { useEffect, useState } from 'react'
import { GoogleMap, DirectionsRenderer, LoadScript, useJsApiLoader, DirectionsService } from '@react-google-maps/api';
import { Marker } from '@react-google-maps/api';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, onSnapshot } from 'firebase/firestore';
import {
  createBrowserRouter,
  RouterProvider,
  Route, useParams
} from "react-router-dom";

import {MdDeliveryDining} from 'react-icons/md'
const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "track/:id",
    element: <Track />,
  },
]);


const containerStyle = {
  width: '600px',
  height: '500px'
};



const firebaseConfig = {
  apiKey: "AIzaSyApfVOAcPyKnWgMlDCQlrlJvDLro2LW4Xo",
  authDomain: "jiffy-7c780.firebaseapp.com",
  projectId: "jiffy-7c780",
  storageBucket: "jiffy-7c780.appspot.com",
  messagingSenderId: "858697568951",
  appId: "1:858697568951:web:c314027e738f1df16db332",
  measurementId: "G-ZMK5HQEQFN",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// onSnapshot(collection(getFirestore(), "location"), (snapshot) => {
//   this.setState({
//     data: snapshot.docs.map((doc) => doc.data()),
//   });
//   console.log("newwwwwwwwwwwwwww", this.state.data);
// });
function App() {



  return (
    <div className="App">
      <RouterProvider router={router} />
      {/* <Container>
        <div >
          <Typography level="h2">Track order</Typography>
          <Typography>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Asperiores error, explicabo, laborum ipsa porro illo, excepturi eius iure veniam ipsam molestias aut exercitationem enim harum perferendis reiciendis nulla laudantium minima!</Typography>
        </div>
        <div>
        <div style={{ height: '100vh', width: '100%' }}>
     
        <LoadScript
        googleMapsApiKey="AIzaSyC2ZOx-oo-2pStKr7U0C25h93J6CHIxMEU"
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >

          <></>
        </GoogleMap>
      </LoadScript>
    </div>
        </div>
      
      </Container> */}


    </div>
  )
}



function Track() {
  const [Data, setData] = useState<any>(null)

  const [Center, setCenter] = useState<any>(null)


  const [CorrLoc, setCorrLoc] = useState({
    lat: 11.1407247,
    lng: 75.964
  })



  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyC2ZOx-oo-2pStKr7U0C25h93J6CHIxMEU" // ,
    // ...otherOptions
  })


  const [Direct, setDirect] = useState<any>(null)



  useEffect(() => {
    onSnapshot(collection(getFirestore(), "location"), (snapshot) => {
      setData(snapshot.docs.find(e => (e.data().customerId == id))?.data());
    });

    navigator.geolocation.watchPosition((w) => { setCorrLoc({ lat: w.coords.latitude, lng: w.coords.longitude }) }, (err) => {
      console.log(err);
    }, {
      enableHighAccuracy: true,
    })
  }, [0])


  useEffect(() => {
    console.log("newwwwwwwwwwwwwww", Data, id);
    if (Data) {
      setCenter({
        lat: Data.latitude,
        lng: Data.longitude
      })
    }
  }, [Data])

  let { id } = useParams()

  return (
    <div>{id}
      long:{CorrLoc.lng}
      lat:{CorrLoc.lat}
      {
        Data && Center && isLoaded &&

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={Center}
          zoom={10}
        >


          <Marker

position={Center} />
          <Marker position={CorrLoc} />
          <DirectionsService
            // required
            options={{ // eslint-disable-line react-perf/jsx-no-new-object-as-prop
              destination: Center,
              origin: CorrLoc,
              ///@ts-ignore
              travelMode: `DRIVING`
            }}
            // required
            callback={(e) => {
              console.log(e);
              if (!e || Direct) {

              } else {

                setDirect(e)
              }

            }}
            // optional
            onLoad={directionsService => {
              console.log('DirectionsService onLoad directionsService: ', directionsService)
            }}
            // optional
            onUnmount={directionsService => {
              console.log('DirectionsService onUnmount directionsService: ', directionsService)
            }}
          />
          {
            Direct && <DirectionsRenderer
              // required
              options={{ // eslint-disable-line react-perf/jsx-no-new-object-as-prop
                directions: Direct
              }}
              // optional
              onLoad={directionsRenderer => {
                console.log('DirectionsRenderer onLoad directionsRenderer: ', directionsRenderer)
              }}
              // optional
              onUnmount={directionsRenderer => {
                console.log('DirectionsRenderer onUnmount directionsRenderer: ', directionsRenderer)
              }}
            />
          }
        </GoogleMap>


      }
    </div>
  )
}

export default App

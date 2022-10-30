import { Stack, Typography, Alert, Box, IconButton, Container, CircularProgress, Divider } from '@mui/joy'

import { useEffect, useState } from 'react'
import { GoogleMap, DirectionsRenderer, LoadScript, useJsApiLoader, DirectionsService } from '@react-google-maps/api';
import { MarkerF } from '@react-google-maps/api';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, onSnapshot, doc, setDoc } from 'firebase/firestore';
import {
  createBrowserRouter,
  RouterProvider,
  Route, useParams
} from "react-router-dom";
import { css } from '@emotion/css'
import { AiFillCloseCircle } from 'react-icons/ai'

import axios from 'axios';
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
  width: 'min(800px,calc(100vw-20px))',
  height: '500px',
  borderRadius: "10px",
  margin: "30px auto"
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


let _CustData=""


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
  let { id } = useParams()


  const [ParcelData, setParcelData] = useState<any>(null)
  const [CustData, setCustData] = useState<any>(null)

  const [Data, setData] = useState<any>(null)

  //const [Center, setCenter] = useState<any>(null)



  const [CorrLoc, setCorrLoc] = useState({
    lat: 11.1407247,
    lng: 75.964
  })
  let Par=ParcelData?.parcel?.[0]

  function getEndLoc() {
    if (!CustData || !ParcelData) return null
    

    let Pickup = Par?.pickup.filter((e: any) => e.pickup_status == "pending")
    let Del = Par?.delivery[0]
    if (Pickup.length > 0) {


      return { lat: Number(Pickup[0].pickup_latitude), lng: Number(Pickup[0].pickup_longitude) }

    } else {
      return { lat: Number(Del.delivery_latitude), lng: Number(Del.delivery_longitude) }
    }
  }



  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyC2ZOx-oo-2pStKr7U0C25h93J6CHIxMEU" // ,
    // ...otherOptions
  })


  const [Direct, setDirect] = useState<any>(null)
  const [UpDirect, setUpDirect] = useState(false)


  useEffect(() => {


    // navigator.geolocation.watchPosition((w) => { setCorrLoc({ lat: w.coords.latitude, lng: w.coords.longitude }) }, (err) => {
    //   console.log(err);
    // }, {
    //   enableHighAccuracy: true,
    // })

    axios.get("https://apis.jiffy.ae/vendor/api/v1/parcel", { params: { _id: id } }).then(({ data }) => {
      if (data.status == "Success") {
        setParcelData(data)
      } else {
        setParcelData({ err: "ERRO" })
      }

    })

  }, [0])


  useEffect(() => {
    // console.log("newwwwwwwwwwwwwww", Data, id);
    // if (Data) {
    //   setCenter({
    //     lat: Data.latitude,
    //     lng: Data.longitude
    //   })
    // }

    if (Par?.customer_id) {
      onSnapshot(collection(getFirestore(), "location"), (snapshot) => {
        let _cusId = ParcelData.parcel[0].customer_id
        setCustData(snapshot.docs.find(e => (e.data().customerId == _cusId, _cusId))?.data());
        setUpDirect(false)
       console.log(snapshot.docs.map(e=>e.data()));
      //  collection(getFirestore(), "location")

      
     
      // console.log(,"qq");
     
      


      });
    } else {
      setCustData({ err: "customer id is not provided" })
    }
  }, [ParcelData])





  return (
    <div className={css`
    background-image:url(https://jiffy.ae/Images/banner.png);
    background-size:contain;
    `}>

      <div className={
        css`
            
            width:100%;
            padding:20px 30px;
            box-sizing: border-box;
            line-height:1;
        `
      }>
        <div>
          <div className={css`
          display:grid;
          grid-template-columns: auto 1fr;

          `}>

            <Typography level="h2">
              Track Order
            </Typography>
            <div className={css`
              width:100%;
              height:5px;
              background:darkblue;
              margin:auto 20px;
              transform:translateY(50%)
            `}>

            </div>
          </div>
        </div>
      </div>

      {/* long:{CorrLoc.lng}
      lat:{CorrLoc.lat}
      <div>
        {JSON.stringify(CustData)}
      </div>
      {CustData?.err && <>{CustData.err}sss</>}
      {loadError&&<div>ere</div>} */}
      {/* {getEndLoc()&&<div>{JSON.stringify(getEndLoc())}</div>} */}
      {Direct?.status == "ZERO_RESULTS" && <Box>
        {/* <Typography color='danger' level='h4'>
          No path found from Origin to Destination
        </Typography> */}


        <Alert sx={{ borderRadius: "0" }} variant='solid'
          startDecorator={

            <AiFillCloseCircle size={20}></AiFillCloseCircle>

          }

          color='danger'>

          No path found from Origin to Destination

        </Alert>
      </Box>}

      <Container>
        {
          isLoaded && CustData?.latitude ?
            <>{(Par?.order_status  !== "Delivered"|| Par?.order_status  !== "Cancelled")&&
              <>
              <Typography sx={{marginTop:"10px"}} color="success" level='h6'>
                Order Status: 
              </Typography>
              <Typography  color="success" level="body1">
                {Par?.order_status}
              </Typography>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={{
                  lat: Number(CustData.latitude),
                  lng: Number(CustData.longitude)
                }}
                zoom={10}
              >

                <MarkerF
                  icon={"/delivery.svg"}
                  position={{
                    lat: Number(CustData.latitude),
                    lng: Number(CustData.longitude)
                  }} />

                <MarkerF
                  icon={{ url:"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png", scale: .1 }}
                  position={{
                    lat: Number(Par?.delivery?.[0].delivery_latitude),
                    lng: Number(Par?.delivery?.[0].delivery_longitude),
                  }} />


                {Par?.pickup
                  .filter((e: any) => e.pickup_status == "pending")
                  .map((e: any) => (

                    <MarkerF
                      key={e.id}
                      onLoad={(_e) => {
                        console.log(e.id);
                      }}
                      icon="/pickup.svg"
                      position={{
                        lat: Number(e.pickup_latitude),
                        lng: Number(e.pickup_longitude)
                      }} />
                  ))}

                {getEndLoc()&& !UpDirect && <DirectionsService
                  
                  options={{ // eslint-disable-line react-perf/jsx-no-new-object-as-prop
                    destination: getEndLoc() || {},
                    origin: {
                      lat: Number(CustData.latitude),
                      lng: Number(CustData.longitude)
                    },
                    ///@ts-ignore
                    travelMode: google.maps.TravelMode.DRIVING
                  }}
                  // required
                  callback={(e) => {
                    //console.log(JSON.stringify(e)==JSON.stringify(Direct),"qq",e,Direct);
                    if (e) {
                      setDirect(e)
                      setUpDirect(true)
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
                />}

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
              </GoogleMap></>}
              {
                Par?.order_status  == "Delivered" &&
                <div  className={css`
                height:80vh;
                display:flex
          `}>
                  <Typography  sx={{ margin: "auto" }} color="success" level='h1'>
                    Order is delivered
                  </Typography>
                </div>
              }
            </>
            : <div className={css`
                height:80vh;
                display:flex
          `}>
              <CircularProgress sx={{ margin: "auto" }} size="lg" />
            </div>




        }
        <Divider></Divider>
     
     
        <div className={css`
        margin:15px;
        background:#DDF1FF;
        padding:15px;
        border-radius:10px;
        color:#02367D;
        
        `}>

          <Typography color="primary" level="h5">
            Pickup Address
          </Typography>
          <Typography level="body2">
            {Par?.pickup_location}
          </Typography>

        </div>
        <div className={css`
        margin:15px;
        background:#DDF1FF;
        padding:15px;
        border-radius:10px;
        color:#02367D;
        
        `}>
          <Typography color="primary" level="h5">
            Delivery Address
          </Typography>
          <Typography level="body2">
            {Par?.delivery_location}
          </Typography>
        </div>

        <Divider></Divider>
        <div className={css`
        margin:15px;

        padding:15px;
        border-radius:10px;
        color:#02367D;
        
        `}>

          <Typography color="primary" level="h5">
            Delivery Status
          </Typography>
          <Typography level="body2">
            {Par?.delivery_status}
          </Typography>
        </div>
      </Container>



    </div>
  )
}

export default App

import React, { useContext, useEffect, useState } from 'react';
import {IonContent, IonHeader, IonPage, IonTabButton, IonTitle, IonToolbar,IonFab,IonFabButton,IonIcon,IonGrid,IonRow,IonImg,IonCol} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import {useMyLocation} from "../useMyLocation";
import './Tab1.css';
import {MyMap} from "../myMap";
import {Photo2, usePhotoGallery} from "../theme/usePhoto";
import {camera} from "ionicons/icons";
import {Marker} from "react-google-maps";

const Tab1: React.FC = () => {
    const [latitude, setLatitude] = useState<number | undefined>(undefined);
    const [longitude, setLongitude] = useState<number | undefined>(undefined);
    const [currLatitude, setCurrLatitude] = useState<number | undefined>(undefined);
    const [currLongitude, setCurrLongitude] = useState<number | undefined>(undefined);
    const [photo,setPhoto]=useState<Photo2 | undefined>(undefined);
    const myLocation = useMyLocation();
    const { takePhoto, loadPhoto, deletePhoto ,photos} = usePhotoGallery();
    const { latitude: lat, longitude: lng } = myLocation.position?.coords || {}
    const takePicture = async () => {
        const photoTaken = await takePhoto(currLatitude,currLongitude);
    }
    useEffect(()=>{
        photos.forEach(photo=>{
            console.log(photo.lat);
        return <Marker position={{
                lat: photo.lat,
                lng: photo.lng,
                map:MyMap
        }}
        />
        })
    },[photos]);
    function change(source: string) {
        return (e: any) => {
            setCurrLatitude(e.latLng.lat());
            setCurrLongitude(e.latLng.lng());
            if(source=="onMarker") {
                setPhoto(photos.find(element => {
                    return element.lat == e.latLng.lat() && element.lng == e.latLng.lat
                }));

                console.log(source, e.latLng.lat(), e.latLng.lng());
            }
        };
    }
    useEffect( () => {
        if(latitude == undefined && longitude == undefined){
            console.log(lng);
            setCurrLatitude(lat);
            setCurrLongitude(lng);
        }else{
            setCurrLatitude(latitude);
            setCurrLongitude(longitude);
        }
    }, [lat, lng, longitude, latitude]);
  return (
    <IonPage>
      <IonContent fullscreen>
          <IonFab horizontal="center">
              <IonFabButton onClick={() => takePicture()}>
                  <IonIcon icon={camera}/>
              </IonFabButton>
          </IonFab>
          {currLatitude && currLongitude &&
          <MyMap
              lat={currLatitude}
              lng={currLongitude}
              onMapClick={change('onMap')}
              onMarkerClick={change('onMarker')}
          />
          }
          <IonGrid>
              <IonRow>

              </IonRow>
              <IonRow>
                  {photos.map((photo, index) => (
                      <IonCol size="6" key={index}>
                          <IonImg src={photo.webviewPath} />
                      </IonCol>
                  ))}
              </IonRow>
          </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;

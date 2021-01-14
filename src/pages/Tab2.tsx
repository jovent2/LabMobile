import React, { useContext, useEffect, useState,useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonImg,IonText,IonModal,IonButton } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import {createAnimation} from "@ionic/core"
import './Tab2.css';

const Tab2: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [time, setTime] = useState(Date.now());
    const text1=useRef<HTMLIonTextElement>(null);
    const text2=useRef<HTMLIonTextElement>(null);
    const text3=useRef<HTMLIonTextElement>(null);
    const text4=useRef<HTMLIonTextElement>(null);
    const text5=useRef<HTMLIonTextElement>(null);
    const [latitude, setLatitude] = useState<number | undefined>(undefined);
    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);
    useEffect(()=> {
        if (text1.current != null) {
            const animation = createAnimation()
                .addElement(text1.current)
                .duration(1000)
                .direction('alternate')
                .iterations(Infinity)
                .keyframes([
                    {offset: 0, transform: 'scale(1)', opacity: '1'},
                    {
                        offset: 1, transform: 'scale(1.5)', opacity: '0.5',color:"red"
                    }
                ]);

            animation.play();
        }
        if(text2.current!=null && text3.current!=null){
            const animationA = createAnimation()
                .addElement(text2.current)
                .direction('alternate')
                .iterations(Infinity)
                .keyframes([
                    {offset: 0, transform: 'scale(1)', opacity: '1'},
                    {
                        offset: 1, transform: 'scale(1.5)', opacity: '0.5',color:"grey"
                    }
                ]);


            const animationB = createAnimation()
                .addElement(text3.current)
                .direction('alternate')
                .iterations(Infinity)
                .keyframes([
                    {offset: 0, transform: 'scale(1)', opacity: '1'},
                    {
                        offset: 1, transform: 'scale(1.5)', opacity: '0.5',color:"blue"
                    }
                ]);

            const parentAnimation = createAnimation()
                .duration(1000)
                .addAnimation([animationA, animationB]);

            parentAnimation.play();

        }
    },[]);
    useEffect(()=>{
        const chained=async ()=>{
            while(true){
        if(text4.current!=null && text5.current!=null) {
            const animationA = createAnimation()
                .addElement(text4.current)
                .fill('none')
                .duration(1000)
                .keyframes([
                    {offset: 0, transform: 'scale(1)', opacity: '1'},
                    {offset: 0.5, transform: 'scale(1.2)', opacity: '0.3'},
                    {offset: 1, transform: 'scale(1)', opacity: '1'}
                ]);
            const animationB = createAnimation()
                .addElement(text5.current)
                .fill('none')
                .duration(1000)
                .keyframes([
                    {offset: 0, transform: 'scale(1)', opacity: '1'},
                    {offset: 0.5, transform: 'scale(1.2)', opacity: '0.3'},
                    {offset: 1, transform: 'scale(1)', opacity: '1'}
                ]);
            await animationA.play();
            await animationB.play();
        }
    }}
        console.log("intra aici")
        chained()
    },[])
    const enterAnimation = (baseEl: any) => {
        const backdropAnimation = createAnimation()
            .addElement(baseEl.querySelector('ion-backdrop')!)
            .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

        const wrapperAnimation = createAnimation()
            .addElement(baseEl.querySelector('.modal-wrapper')!)
            .keyframes([
                {offset: 0, opacity: '0', transform: 'scale(0)'},
                {offset: 1, opacity: '0.99', transform: 'scale(1)'}
            ]);

        return createAnimation()
            .addElement(baseEl)
            .easing('ease-out')
            .duration(500)
            .addAnimation([backdropAnimation, wrapperAnimation]);
    }
    const leaveAnimation = (baseEl: any) => {
        return enterAnimation(baseEl).direction('reverse');
    }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
          <IonText ref={text1}>
             <p> Basic animation
             </p>
          </IonText>
          <IonText ref={text2}>
              <p>Group animation 1
              </p>
          </IonText>
          <IonText ref={text3}>
              <p>
              Group animation 2
              </p>
          </IonText>
          <IonText ref={text4}>
              <p>
                  Chain animation 1
              </p>
          </IonText>
          <IonText ref={text5}>
              <p>
                  Chain animation 2
              </p>
          </IonText>
          <IonModal isOpen={showModal} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
              <p>This is modal content</p>
              <IonButton onClick={() => setShowModal(false)}>Close Modal</IonButton>
          </IonModal>
          <IonButton onClick={() => setShowModal(true)}>Show Modal</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;

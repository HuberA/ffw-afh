import React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import styles from "../components/button.module.css"

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
   
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
   
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
   
  const vapidPublicKey = 'BPKIl4pHeFbSzB9oz3oPlaYI9qww02eBAh2jkRhv6NkZus9k9IppBvv2VhmFYJczCoOEpp8kxtf__IfrzOAHEdg';
  

const description = "Benachrichtigungen von der Feuerwehr Altfraunhofen";

class PushMessage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            bericht: true,
            einsatz: true,
            termin: true,
            serverstateKnown: false,
            subscribe: "not yet",
            serviceWorker: true
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.getSubscribeText = this.getSubscribeText.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.getButtonStyle = this.getButtonStyle.bind(this);
        
    }
    componentDidMount(){
        if(!('serviceWorker' in navigator)){
            this.setState({serviceWorker: false})
            return;
        }
        if(!('PushManager' in window)){
            this.setState({serviceWorker: false})
            return;
        }
        if ('Notification' in window){
            if (Notification.permission === "granted"){
                this.registerPush()
            }
        }
    }

    registerPush(value){

       const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
       let bericht = this.state.bericht;
       let einsatz = this.state.einsatz;
       let termin = this.state.termin;
       // unsubscribe if already subscribed
       if (this.state.subscribe === 'yes'){
           bericht = false
           einsatz = false
           termin = false
       }
       let setValues = this.state.serverstateKnown;
       if (value !== undefined){
         setValues = true;
       }
       navigator.serviceWorker.ready.then((registration)=>
        registration.pushManager.subscribe({
                userVisibleOnly:true,
                applicationServerKey: convertedVapidKey
        })
       .then(subscription=>{
           fetch('/.netlify/functions/hello', {
               method: 'post',
               headers: {
                   'Content-type': 'application/json'
               },
               body: JSON.stringify({
                   subscription,
                   options: {
                       bericht: bericht,
                       einsatz: einsatz,
                       termin: termin,
                       setValues: setValues
                    }
               }),
           }).then(response =>{
               if(!response.ok){
                   throw new Error('Bad status code from server.');
               }
               return response.json();
           })
           .then(responseData =>{
               if (!(responseData.data && responseData.data.success)){
                   throw new Error('Bad response from server.');
               }
               const anything = responseData.data.bericht 
                                || responseData.data.einsatz
                                || responseData.data.termin;
               this.setState({
                   bericht:responseData.data.bericht,
                   einsatz: responseData.data.einsatz,
                   termin: responseData.data.termin,
                   serverstateKnown: true,
                   subscribe: anything? "yes": "not yet"
               });
               if (anything && value !== undefined){
                   const values = [];
                   if (bericht) values.push('Berichte')
                   if (einsatz) values.push('Einsätze')
                   if (termin) values.push('Termine')
                const data ={
                    body: `Ausgewählte Themen: ${values.join(', ')}`,
                    icon: 'icons/icon-48x48.png',
                    badge: 'icons/icon-96x96.png'
                   }
                    this.notification = new Notification("Sie bekommen jetzt Benachrichtigungen!", data);
               }
           });
           
          
       }))

    }

    componentWillUnmount(){
    }
    handleInputChange(event){
        const target = event.target;
        this.setState((state)=>({
            [target.name]: target.checked,
            subscribe: (state.subscribe === "yes")?"updated":state.subscribe
        }));
    }
    getSubscribeText(){
        if (this.state.subscribe === "yes"){
            return "Abmelden"
        }else if (this.state.subscribe === "not yet"){
            return "Abbonnieren"
        }else if (this.state.subscribe === "updated"){
            return "Aktualisieren"
        }else{
            return "Nicht möglich"
        }
    }
    getButtonStyle(){
        if(["not yet", "updated"].indexOf(this.state.subscribe) !== -1){
            return styles.redbtn;
        }else{
            return styles.greybtn;
        }
    }
    subscribe(){
        this.registerPush(this.state.subscribe)
    }
    render(){ return(
    <Layout>
        <Seo title={`Benachrichtigungen - Feuerwehr Altfraunhofen`} 
                 description_short={description}
                 description_long={description} 
                 url="http://feuerwehr-altfraunhofen.de"/>
        <h1>Benachrichtigungen</h1>
        {(this.state.serviceWorker)?<>
        <p>Falls Ihr Browser dies unterstützt können wir Sie informieren, wenn es auf der Seite etwas neues gibt,
            selbst wenn Sie die Website der Feuerwehr Altfraunhofen nicht geöffnet haben.</p>
        <p> Hier können Sie auswählen, bei welchen Ereignissen Sie benachrichtigt werden wollen.</p>
        <form>
            <input type="checkbox" name='bericht' checked={this.state.bericht} onChange={this.handleInputChange}/> Neue Berichte<br/>
            <input type="checkbox" name='einsatz' checked={this.state.einsatz} onChange={this.handleInputChange}/> Neue Einsätze<br/>
            <input type="checkbox" name="termin" checked={this.state.termin} onChange={this.handleInputChange}/> Neue Termine und Terminänderungen<br/>
            <br/>
            <input type="button" className={this.getButtonStyle()}  value={this.getSubscribeText()} onClick={this.subscribe}/>
        </form>
        </>:<>
        <p>Ihr Browser unterstützt leider keine Push Mitteilungen!</p>
        </>}
    </Layout>
    )
    }
}

export default PushMessage

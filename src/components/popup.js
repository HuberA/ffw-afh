import React from "react"
import { css } from "react-emotion"
import styles from "./button.module.css"

class Popup extends React.Component{
    constructor(props){
        super(props);
        this.state = {showPopup: false};

        
    }
    handleClose(){
        //const div = e.target.parentElement.parentElement;
        //  div.style.opacity="0"; 
        //setTimeout(() => { div.style.display = "none";});}}
        
        this.setState(state => ({
            showPopup: !state.showPopup
        }));
    }
    render(){
    
    return(
        <div>
            <div className={styles.redbtn} onClick={(e) => {this.handleClose()}}>
            Kalender Abonnieren
            </div>
        {this.state.showPopup &&
        <div className={css`
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0; 
            right: 0;
            background: #000;
            background: rgb(0, 0, 0, 75%); 
            z-index: 3; }
            .toggle-Modal { cursor: pointer; }
            .is-Hidden { display: none; }
        `}>
        <div className={css`
            background-color: white;
            border: 2px solid #A81C1C;
            color: black;
            opacity: 1;
            transition: opacity 0.6s;
            margin-bottom: 15px;
            position:fixed;
            width: 310px;
            height: 250px;
            padding: 20px;
            top:50%; left: 50%;
            margin-left: -170px;
            margin-top: -120px;
            z-index:1;
            `}>
            <span className={css`
                 margin-left: 15px;
                 color: #A81C1C;
                 font-weight: bold;
                 float: right;
                 font-size: 22px;
                 line-height: 20px;
                 cursor: pointer;
                 transition: 0.3s;
            `} onClick={ (e) => { this.handleClose()} }>&times;</span>  
            <h4 className={css`margin-bottom:10px;`}>Kalender herunterladen und abonnieren</h4>
            <a className={styles.redbtn} href="/ffw.ics">Kalender als ics herunterladen</a>
            <p className={css`margin-bottom:10px;`} >Kopieren Sie die URL und abonnieren Sie sie in ihrem Kalenderprogramm</p>
            <input onFocus={(e) => (e.target.select())} readOnly={true} value={`${window.location.protocol}//${window.location.host}/ffw.ics`} />
        </div>
        </div>}
        </div>
    );
    }
}

export default Popup;
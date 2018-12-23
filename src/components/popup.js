import React from "react"
import { css } from "react-emotion"
import styles from "./button.module.css"
import Dropdown from "./dropdown";

const ExtLink = ( {link, name}) => (
    <a href={link} target="_blank" rel="noopener noreferrer">{name}</a>
)

const PopupItem = (props) => props

class Popup extends React.Component{
    constructor(props){
        super(props);
        this.state = {showPopup: false};

        
    }
    handleClose(groupName){
        this.setState({
            showPopup: groupName
        });
    }
    render(){
        const calMap = new Map(this.props.children.map(child => [child.props.name, child.props.value]))
        const url = calMap.get(this.state.showPopup)
    return(
        <div>
            <Dropdown selected="Kalender Abonnieren" options={this.props.children.map(child => child.props.name)} onClick={(e) => this.handleClose(e)} minWidth={180}/>
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
            <a className={styles.redbtn} href={`/${url}`}>Kalender als ics herunterladen</a>
            <p className={css`margin-bottom:10px;`} >Kopieren Sie die URL und abonnieren Sie sie in ihrem Kalenderprogramm</p>
            <input
                style={{width: "100%", marginBottom: "10px"}} 
                onFocus={(e) => (e.target.select())} readOnly={true} value={`${window.location.protocol}//${window.location.host}/${url}`} />
            <p style={{marginBottom:0}}>
                <ExtLink name="Anleitung für Google Kalender" link="https://support.google.com/calendar/answer/37100?co=GENIE.Platform%3DAndroid&hl=de"/>
            </p>
            <ExtLink name="Anleitung für iOS" link="https://support.apple.com/de-de/HT202361"/>
        </div>
        </div>}
        </div>
    );
    }
}

export {Popup, PopupItem};
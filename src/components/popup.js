import React, { useState } from "react";
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import * as styles from "./button.module.css";
import Dropdown from "./dropdown";
import { feuerwehrRot } from "./layout";

// styles

const darkenMainPageStyle = css`
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
`;
const popupContainerStyle = css`
  background-color: white;
  color: black;
  opacity: 1;
  transition: opacity 0.6s;
  margin-bottom: 15px;
  position: fixed;
  width: 310px;
  padding: 20px;
  top: 50%;
  left: 50%;
  margin-left: -170px;
  margin-top: -120px;
  z-index: 1;
  span {
    margin-left: 15px;
    color: ${feuerwehrRot};
    font-weight: bold;
    float: right;
    font-size: 22px;
    line-height: 20px;
    cursor: pointer;
    transition: 0.3s;
  }
  h3,
  p {
    margin-bottom: 10px;
  }
  input {
    width: 100%;
    margin-bottom: 10px;
  }
`;

const ExtLink = ({ link, name }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    {name}
  </a>
);

const PopupItem = (props) => props;

const Popup = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const calMap = new Map(
    props.children.map((child) => [child.props.name, child.props.value])
  );
  const url = calMap.get(showPopup);
  const closePopup = (v) => setShowPopup();
  return (
    <div>
      <Dropdown
        selected="Kalender Abonnieren"
        options={props.children.map((child) => child.props.name)}
        onClick={(e) => setShowPopup(e)}
        minWidth={"280px"}
      />
      {showPopup && (
        <div css={darkenMainPageStyle} onClick={closePopup}>
          <div css={popupContainerStyle}>
            <span onClick={closePopup}>&times;</span>
            <h3>Kalender herunterladen und abonnieren</h3>
            <a className={styles.redbtn} href={`/${url}`}>
              Kalender als ics herunterladen
            </a>
            <p>
              Oder kopieren Sie die URL und abonnieren Sie sie in ihrem
              Kalenderprogramm
            </p>
            <input
              onFocus={(e) => e.target.select()}
              readOnly={true}
              value={`${window.location.protocol}//${window.location.host}/${url}`}
            />

            <ExtLink
              name="Anleitung für Google Kalender"
              link="https://support.google.com/calendar/answer/37100?co=GENIE.Platform%3DAndroid&hl=de"
            />
            <br />
            <ExtLink
              name="Anleitung für iOS"
              link="https://support.apple.com/de-de/HT202361"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { Popup, PopupItem };

import React, { useState } from "react";
import { Link } from "gatsby";
import logo from "../images/logo-ffw.svg"
import hamburgerMenu from "../images/hamburger_menu.svg"
import { StaticImage } from "gatsby-plugin-image"
import { rhythm } from "../utils/typography"
/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { FaCaretDown } from 'react-icons/fa';

// styles

const logoHeight = 7;
const fontSize = 1.2;
const imagePaddingTop = 0;
const horizontalPadding = 0.5;
const hoverFactor = 1.05;
const feuerwehrRot = "#A81C1C";
const hintergrundFarbe = '#F3F7F4';
const hintergrundSelected = '#ddd';

const maxPageWidth = 800;
const bodyWidth = 1000;

const bottomFlorianHeight = 160;

const pageStyles = css`
    background-color: ${hintergrundFarbe};
`;

const setHeights = css`
    min-height: calc(100vh - ${bottomFlorianHeight + 60}px);
`;

const topPanelStyles = css`
    background-color: #ffffff;
    margin: 0;
    padding-top: 30px;
    padding-bottom: 10px;
    text-align: center;
    @media (max-width: ${maxPageWidth}px){
        display: none;
    }
`;
const topPanelChildStyles = css`
    max-width:${maxPageWidth}px;
    margin: auto;
    text-align: left;
`;
const websiteTitleStyles = css`
    color: ${feuerwehrRot};
    text-decoration: none;
    font-size: 2.5rem;
    margin-left: 8.5rem;
`;
const navigationParentStyle = css`
    position: -webkit-sticky;
    position: sticky;
    z-index: 10;
    top: 0;
    background-color: #ffffffe0;
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    backdrop-filter: saturate(180%) blur(20px);
    @media (max-width: ${maxPageWidth}px){
        position: static;
    }
`;
const mobileNavigationMenuStyle = css`
    position: absolute; 
    right: 10px; 
    width: 60px;
    padding: 10px;
    padding-bottom: 0;
    @media (min-width: ${maxPageWidth}px){
        display: none;
    }
`;
const navigationListStyle = (displayMenu) => {
    const showOnSmallDisplay = displayMenu?`
        @media (max-width: ${maxPageWidth}px){
            display: none;
        }
    `:"";
    return css`
        list-style-type: none;
        font-size: ${fontSize}rem;
        margin: 0 auto;
        max-width: ${maxPageWidth}px;
        padding: 0;
        overflow: hidden;
        .menuItem {
            align-items: center;
            display: inline-block;
            float: center;
            margin-bottom: 0;
            @media (max-width: ${maxPageWidth}px){
               width: 100%;
               align-items: center;
               text-align: center;
            }
        
        ${showOnSmallDisplay}
        }
    `
};
const navigationWappenContainerStyle = css`
    float: left;
    margin-bottom: 0;
    @media (max-width: ${maxPageWidth}px){
        float: none;
}
`;
const navigationWappenStyle = css`
    display:block;
    text-align:center;
    padding: 0 ${horizontalPadding}rem;
    padding-top: ${imagePaddingTop}rem; 
    margin: 0;
    width: 130px;
    transition: 1s;
    img {
        height: ${logoHeight}rem; 
        margin: 0;
        transition: 0.3s;
    }
    img:hover {
        height: ${logoHeight*hoverFactor}rem;
    }
   
`;
const navigationLinkStyles = css`
    :hover {
        color: ${feuerwehrRot};
        background-color: ${hintergrundSelected};
    }
    transition: ease-in-out color 0.15s, ease-in-out background-color 1s;
    background-color: 0xfff;
    display: block;
    color: gray;
    text-decoration: none;
    border: none;
    background: none;
    cursor: pointer;
    outline: none;
    padding: ${(logoHeight * hoverFactor + imagePaddingTop - fontSize)/2}rem ${horizontalPadding}rem;
    width:100%;
    box-sizing: border-box;
    @media (max-width: ${maxPageWidth}px){
        display: flex;
        padding: 1rem ${horizontalPadding}rem;
        float: center;
    }
`;
const navigationItemSelectionStyles = (showDropdown) => showDropdown?css`
    color: ${feuerwehrRot};
    background-color: ${hintergrundSelected};
`:css``;
const navigationSubItemsStyles = (showDropdown) =>css`
    @media (min-width: ${maxPageWidth}px){
        position: absolute;
        min-width: 134px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
    }
    background-color: ${hintergrundSelected};
    padding-left: 8px;
    display: ${showDropdown?'block':'none'};
    a {
        padding: 1rem 0;
        display: block;
        text-align: left;
    }
`;
const mainPanelParentStyles = css`
    background-color: ${hintergrundFarbe};
`;
const mainPanelStyles = css`
    margin: auto;
    max-width: ${bodyWidth}px;
    padding: ${rhythm(2)};
    padding-top: ${rhythm(1.5)};
    overflow: auto;
    @media (max-width: ${maxPageWidth}px){
        padding: ${rhythm(0.5)};
    }
`;
const footerStyles = css`
    background-color: ${hintergrundFarbe};
    text-align: center;
    height: 200px;
    div {
        max-width: ${bodyWidth}px;
        margin: 0 auto;
    }
`;
const footerContentStyles = css`
    float: left;
    margin-bottom: 0;
    width: ${rhythm(8)};
    text-align: center;
    img {
        margin-bottom: 0;
    }
    p {
        margin-bottom: 0;
    }
    small {
        d-block mb-3 text-muted
    }
`;
const bottomLinkStyles = css`
    float: left;
    margin: 20px;
    width: ${rhythm(10)};
    margin-bottom: 0;
    a {
        display: block;
        color: gray;
        text-decoration: none;
    }
`;

// data

const links = [
    {
      name: "Einsätze",
      link: "/einsaetze",
    },
    {
        name: "Berichte",
        link: "/berichte",
    },
    {
        name: "Feuerwehr",
        children: [
            {
                "name": "Mannschaft",
                "link": "/mannschaft",
            },
            {
                "name": "Ausrüstung",
                "link": "/ausruestung",
            }
        ],
    },
    {
        name: "Jugendfeuerwehr",
        link: "/jugendfeuerwehr",
    },
    {
        name: "Verein",
        link: "/verein",
    },
    {
        name: "Kalender",
        link: "/kalender",
    }
];

const bottomLinks = [
    {
        name: "Impressum",
        link: "/impressum",
    },
    {
        name: "Datenschutz",
        link: "/datenschutz",
    },
    {
        name: "Anfahrt",
        link: "/anfahrt",
    },
    {
        name: "Werde Mitglied!",
        link: "/neumitglied",
    }
];

const endWithSlash = (text) => text.endsWith("/")?text:`${text}/`;

// markup
function LayoutComponent (props) {
    const [showMenu, setShowMenu] = useState(true);
    //const [onTop, setOnTop] = useState(0);
    const [shownDropdown, setShownDropdown] = useState(null);
    return (
        <main css={pageStyles}>
            <div css={setHeights}>
                <div css={topPanelStyles}>
                    <div css={topPanelChildStyles}>
                        <Link to="/" css={websiteTitleStyles}>Freiwillige Feuerwehr Altfraunhofen</Link>
                    </div>
                </div>
                <div css={navigationParentStyle}>
                    <div css={mobileNavigationMenuStyle} onClick={()=>setShowMenu(!showMenu)}>
                        <img src={hamburgerMenu} alt=""/>
                    </div>
                    <div css={navigationListStyle(showMenu)}>
                        <div css={navigationWappenContainerStyle}>
                            <Link css={navigationWappenStyle} to="/">
                                <img src={logo} alt="Wappen Feuerwehr"/>
                            </Link>
                        </div>
                        {links.map(link => (link.children)?(
                            <div key = {link.link} className="menuItem" css={navigationItemSelectionStyles(shownDropdown === link.name)} onMouseOver={() => setShownDropdown(link.name)} onMouseOut={() => setShownDropdown(null)}>
                                <button css={navigationLinkStyles}>
                                        {link.name} <FaCaretDown/>
                                </button>
                                <div css={navigationSubItemsStyles(shownDropdown === link.name)}>
                                    {link.children.map(childLink => (
                                        <Link css={navigationLinkStyles} to={childLink.link}>{childLink.name}</Link>
                                    ))}
                                </div>
                            </div>
                        ):(
                            <div className="menuItem">
                                <Link css={navigationLinkStyles} key={link.link} to={endWithSlash(link.link)}>{link.name}</Link>
                            </div>
                        ))}

                    </div>
                </div>
                <div css={mainPanelParentStyles}>
                    <div css={mainPanelStyles}>
                            {props.children}
                    </div>
                </div>
            </div>
            <footer css={footerStyles}>
                <div>
                    <div css={footerContentStyles}>
                        <StaticImage src="../images/florian_grau.jpg" alt="Florian" placeholder="tracedSVG" tracedSVGOptions={{color: feuerwehrRot, background:hintergrundFarbe}} height={bottomFlorianHeight} />
                        <p/>
                        <small>&copy; Freiwillige Feuerwehr Altfraunhofen 2018-{new Date().getFullYear()}</small>
                    </div>
                    {bottomLinks.map(link => (
                        <div key={link.link} css={bottomLinkStyles}>
                            <Link to={link.link}>{link.name}</Link>
                        </div>
                    ))}
                </div>
            </footer>
        </main>
    )
}

export {LayoutComponent, hintergrundFarbe, feuerwehrRot}
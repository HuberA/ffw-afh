import React from "react"
import { css } from "react-emotion"
import { StaticQuery, Link, graphql } from "gatsby"
import logo from "../images/logo-ffw.svg"
import hamburgerMenu from "../images/hamburger_menu.svg"
import Img from "gatsby-image"
import { rhythm } from "../utils/typography"
import styles from "./button.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'

const downIcon = <FontAwesomeIcon icon={faCaretDown} />

const logoHeight = 7;
const fontSize = 1.2;
const imagePaddingTop = 0;
const horizontalPadding = 0.5;
const hoverFactor = 1.05;
const feuerwehrRot = "#A81C1C";
const hintergrundFarbe = '#F3F7F4';
const hintergrundSelected = '#ddd';

const maxPageWidth = 800;

const _navbarLinkCss = css`
display: block;
color: gray;
text-decoration: none;
border: none;
background: none;
cursor: pointer;
outline: none;
padding: ${(logoHeight * hoverFactor + imagePaddingTop - fontSize)/2}rem ${horizontalPadding}rem;
width:100%;
@media (max-width: ${maxPageWidth}px){
    display: flex;
    padding: 1rem ${horizontalPadding}rem;
    text-align: center;
    float: center;
}
`
const activeCss = css`
background-color: ${hintergrundSelected};
color: black;
`

const navbarLinkCss = css(
    {
    ':hover': {
        color: feuerwehrRot,
        'background-color': '#fff'
    },
    'transition': ['ease-in-out color 0.15s', 'ease-in-out background-color 1s'],

    },
    _navbarLinkCss
)
const activeNavbarLinkCss = css(
    {
    ':hover': {
        color: feuerwehrRot,
    },
    'transition': ['ease-in-out color 0.15s', 'ease-in-out background-color 1s'],

    },
    _navbarLinkCss,
    activeCss
)
const navbarSubCss = css(
    activeNavbarLinkCss,
    css(`padding: 1rem 0;`)
)

const BottomLink = props => (
    <div className={css`
        float: left;
        margin: 20px;
        width: ${rhythm(10)};
        margin-bottom: 0;
        `}>
          <Link className={css`
            display: block;
            color: gray;
            text-decoration: none;
            `}
            to={props.to}>{props.text}</Link>
    </div>
)

const dontDisplayOnSmall = css`
@media (max-width: ${maxPageWidth}px){
    display: none;
}
`
const navbarLiCss = css`
float: left;
margin-bottom: 0;

@media (max-width: ${maxPageWidth}px){
    float: none;
}
`
const NavbarSubItem = props => (
    <Link className={navbarSubCss} to={props.to}>{props.name}</Link>
)

const NavbarItem = props => {
    const displayThisMenu = props.visible && dontDisplayOnSmall
    if(props.children){
        const showDropdown = props.shownDropdown === props.name;
        const displayStyle = showDropdown? 'block': 'none'; 
        const linkCss = showDropdown? activeNavbarLinkCss: navbarLinkCss;
        return(
            <div className={`${navbarLiCss} ${displayThisMenu}`}
                onMouseOver={() => props.handleDropdown(props.name)}
                onMouseOut={() => props.handleDropdown(null)}>
                <div>
            <button className={linkCss} onClick={() => props.handleDropdown(props.name)}>
               <>{props.name} </>
                {downIcon}
            </button>
            </div>
            <div className={css`
                @media (min-width: ${maxPageWidth}px){
                    position: absolute;
                    min-width: 130px;
                    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                    z-index: 1;
                }
                background-color: ${hintergrundSelected};
                padding-left: 8px;
            `} style={{display: displayStyle}}>
              {props.children}  
            </div>
            </div>
        )
    }else
    return(
    <div className={`${navbarLiCss} ${displayThisMenu}`}
    >
    <Link className={navbarLinkCss} to={props.link}>{props.name}</Link>
    </div>
);}



class Layout extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showMenu: true,
            onTop: true,
            shownDropdown: null
        };

        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleDropdown = this.handleDropdown.bind(this);
    }
    handleMenuClick(){
        this.setState(state => ({
            showMenu: !state.showMenu
        }));
    }
    scrollFunction(){
        const top = document.body.scrollTop > 20 || document.documentElement.scrollTop > 20
        if(this.state.onTop === top){
            this.setState(state => ({
                onTop: !top
            }))
        }
    }
    topFunction(){
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    componentDidMount(){
        window.onscroll = () => this.scrollFunction()

    }
    handleDropdown(name){
        
        this.setState((state, props) => { 
            const newShown = state.shownDropdown === name? null : name;
            return {shownDropdown: name};
        });
    }
    render(){
      return (
  <StaticQuery
   query={graphql`
    query {
        site {
            siteMetadata {
                title
            }
        }
        image_florian: imageSharp(original: {src: {regex: "/.*/florian-.*/"}}){
            original{
              src
            }
        }
        image_florian_grau: imageSharp(original: {src: {regex: "/.*/florian_grau-.*/"}}) {
            fixed(height: 150
                traceSVG: { background: "#f2f8f3", color: "#A81C1C" }
                ){
                ...GatsbyImageSharpFixed_tracedSVG
            }
        }
        
          
    }
   `
  }
  render = {data => (
    <div>
    <div className={css`min-height: calc(100vh - 210px); background-color: ${hintergrundFarbe};`}>
    <div className={css`
        background-color: #ffffffe0;
        margin: 0;
        padding-top: 30px;
        padding-bottom: 10px;
        text-align center;
    `+ ' ' + dontDisplayOnSmall}>
        <Link to="/" className={css`
        color: ${feuerwehrRot};
        text-decoration: none;
        font-size: 2.5rem
        `}>{data.site.siteMetadata.title}</Link>
    </div>
    <div className={css`
    position: -webkit-sticky;
    position: sticky;
    z-index: 1;
    top: 0;
    background-color: #ffffffe0;
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    backdrop-filter: saturate(180%) blur(20px);

    @media (max-width: ${maxPageWidth}px){
        position: static;

    }
    `}
    >
    <div className={css`
     position: absolute; 
     right: 10px; 
     width: 60px;
     padding: 10px;
     padding-bottom: 0;

     @media (min-width: ${maxPageWidth}px){
         display: none;
     }
    `} onClick={this.handleMenuClick}>
    <img src={hamburgerMenu} alt=""/>
    </div>
    <div className={css`
        list-style-type: none;
        font-size: ${fontSize}rem;
        margin: 0 auto;
        max-width: ${maxPageWidth}px;
        padding: 0;
        overflow: hidden;

        
    `}
    >
        <div className={css`
            float: left;
            margin-bottom: 0;

            @media (max-width: ${maxPageWidth}px){
                float: none;
            }
        `}
        >
            <Link className={css (
                {
                    'img:hover':{
                        height: `${logoHeight * hoverFactor}rem`,
                    },
                }
                ,css`
                display:block;
                text-align:center;
                padding: 0 ${horizontalPadding}rem;
                padding-top: ${imagePaddingTop}rem; 
                margin: 0;
                width: 130px;
                transition: 1s;
           `)}
            to="/">
                <img src={logo} alt="logo feuerwehr" className={css`height: ${logoHeight}rem; margin: 0;transition: 0.3s;`}></img>
            </Link>
        </div>
            <NavbarItem name="Einsätze" link="/einsaetze/" visible={this.state.showMenu}/>
            <NavbarItem name="Berichte" link="/berichte/" visible={this.state.showMenu}/>
            <NavbarItem name="Feuerwehr" visible={this.state.showMenu} shownDropdown={this.state.shownDropdown} handleDropdown={this.handleDropdown}>
                <NavbarSubItem to="/mannschaft" name="Mannschaft"/>
                <NavbarSubItem to="/ausruestung" name="Ausrüstung" />
            </NavbarItem>
            <NavbarItem name="Jugendfeuerwehr" link="/jugendfeuerwehr/" visible={this.state.showMenu}/>
            <NavbarItem name="Verein" link="/verein/" visible={this.state.showMenu}/>
            <NavbarItem name="Kalender" link="/kalender/" visible={this.state.showMenu}/>
    </div>
    </div>
    <div className={css`
    background-color: ${hintergrundFarbe};
    `}
    >
    <div className={css`
    margin: auto;
    max-width: 1000px;
    padding: ${rhythm(2)};
    padding-top: ${rhythm(1.5)};
    overflow: auto;
    @media (max-width: ${maxPageWidth}px){
        padding: ${rhythm(0.5)};
    }
    `} 
    >
        {this.props.children}
        </div>
        </div>
    </div>   
    <footer className={css`
            background-color: ${hintergrundFarbe};
            text-align: center;
            height: 200px;
        `}>
        <div className={css`
            max-width: 1000px;
            margin: 0 auto;
        `}>
      <div className={css`
        float: left;
        margin-bottom: 0;
        width: ${rhythm(8)};
        text-align: center;
      `}>
        <Img fixed={data.image_florian_grau.fixed} alt="florian" className={css`margin-bottom: 0;`}/>
        <p className={css`margin-bottom: 0;`}/>
        <small className="d-block mb-3 text-muted">&copy; Freiwillige Feuerwehr Altfraunhofen 2018</small>
      </div>
      <BottomLink to="/impressum" text="Impressum" />
      <BottomLink to="/datenschutz" text="Datenschutz" />
      <BottomLink to="/anfahrt" text="Anfahrt" />
      <BottomLink to="/neumitglied" text="Werde Mitglied!"/>
      {!this.state.onTop && 
        <button className={styles.redbtnbtn} onClick={() => this.topFunction()} title="Gehe Hoch">Hoch</button>}
      </div>
</footer> 
    
 
    </div>
  )}
  />
);
    }
}

export default Layout;
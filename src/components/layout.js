import React from "react"
import { css } from "react-emotion"
import { StaticQuery, Link, graphql } from "gatsby"
import logo from "../images/logo-ffw.svg"
import hamburgerMenu from "../images/hamburger_menu.svg"
import Img from "gatsby-image"
import { rhythm } from "../utils/typography"
import styles from "./button.module.css"

const logoHeight = 7;
const fontSize = 1.2;
const imagePaddingTop = 0;
const horizontalPadding = 0.5;
const hoverFactor = 1.05;
const feuerwehrRot = "#A81C1C";
const hintergrundFarbe = '#F3F7F4'

const maxPageWidth = 800;

const navbarLinkCss = css`
display: block;
color: gray;
text-decoration: none;
padding: ${(logoHeight * hoverFactor + imagePaddingTop - fontSize)/2}rem ${horizontalPadding}rem;

@media (max-width: ${maxPageWidth}px){
    display: flex;
    padding: 1rem ${horizontalPadding}rem;
    text-align: center;
    float: center;
}
`

const BottomLink = props => (
    <div className={css`
        float: left;
        margin: 20px;
        width: ${rhythm(8)};
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

const NavbarItem = props => {
    const displayThisMenu = props.visible && dontDisplayOnSmall
    return(
    <li className={`${navbarLiCss} ${displayThisMenu}`}
    >
    <Link className={css(
        {
        ':hover': {
            color: feuerwehrRot,
            'background-color': '#fff'
        },
        'transition': ['ease-in-out color 0.15s', 'ease-in-out background-color 1s'],

        },
        navbarLinkCss
    )} to={props.link}>{props.name}</Link>
    </li>
);}



class Layout extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showMenu: true,
            onTop: true
        };

        this.handleMenuClick = this.handleMenuClick.bind(this);
    }
    handleMenuClick(){
        console.log('handle menu called: ', this.state)
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
    render(){
      console.log('state:', this.state, 'display value: ',(this.state.showMenu)?'display: none;':'')
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
    <ul className={css`
        list-style-type: none;
        font-size: ${fontSize}rem;
        margin: 0 auto;
        max-width: ${maxPageWidth}px;
        padding: 0;
        overflow: hidden;

        
    `}
    >
        <li className={css`
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
        </li>
            {/*<NavbarItem name="Aktuelles" link="/" />*/}
            <NavbarItem name="Einsätze" link="/einsaetze/" visible={this.state.showMenu}/>
            <NavbarItem name="Berichte" link="/berichte/" visible={this.state.showMenu}/>
            <NavbarItem name="Feuerwehr" link="/feuerwehr/" visible={this.state.showMenu} />
            <NavbarItem name="Jugendfeuerwehr" link="/jugendfeuerwehr/" visible={this.state.showMenu}/>
            <NavbarItem name="Verein" link="/verein/" visible={this.state.showMenu}/>
            <NavbarItem name="Kalender" link="/kalender/" visible={this.state.showMenu}/>
    </ul>
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
        text-align: left;
      `}>
        <Img fixed={data.image_florian_grau.fixed} alt="florian" className={css`margin-bottom: 0;`}/>
        <p className={css`margin-bottom: 0;`}/>
        <small className="d-block mb-3 text-muted">&copy; Freiwillige Feuerwehr Altfraunhofen 2018</small>
      </div>
      <BottomLink to="/impressum" text="Impressum" />
      <BottomLink to="/datenschutz" text="Datenschutz" />
      <BottomLink to="/anfahrt" text="Anfahrt" />
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
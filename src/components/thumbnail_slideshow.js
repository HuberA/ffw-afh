import React from "react"
import Img from "gatsby-image"
import styles from "./thumbnail_slideshow.module.css"
import Hammer from "react-hammerjs"


class Slideshow extends React.Component{
    constructor(props){
      super(props);
      this.state = {
          slideIndex: 0
      };
    }
    plusSlides(n) {
        const l = this.props.images.length
        this.setState(state => ({slideIndex: (this.state.slideIndex+n+l)%l}));
    }
    currentSlide(n) {
        this.setState({slideIndex: n});
    }
    handleSwipe(a){
            this.plusSlides(-Math.sign(a.deltaX))
    
    }
    render(){
        const images = this.props.images.filter(i => i !== null)
        if (images.length === 1)
            return <Img fluid={images[0].fluid} backgroundColor="#A81C1C"/>
        else if(images.length > 0) 
        return(
            <div className={styles.container}>
            {images.map((image, index) =>{ 
                return (
                <div className={styles.mySlides} style={{display:(index===this.state.slideIndex)?'block':'none'}} key={index}>
                <div className={styles.numbertext}>{index+1} / {images.length}</div>
                <Hammer onSwipe={(a) => this.handleSwipe(a)}>
                <img src={image.fluid.src} alt={image.title} style={{display: "block", marginLeft: "auto", marginRight: "auto"}}/>
                </Hammer>
              </div>
            )})}
              
            <div className={styles.prev} onClick={(e) => this.plusSlides(-1)}>❮</div>
            <div className={styles.next} onClick={(e) => this.plusSlides(1)}>❯</div>
          
            {images[this.state.slideIndex].title && <div className={styles.captioncontainer}>
              <p id="caption">{images[this.state.slideIndex].title}</p>
            </div>}
          
            <div className={styles.row}>
            {images.map((img, index) => { return (
                <div className={styles.column} key={index} onClick={(e) => this.currentSlide(index)}>
                    <Img 
                    className={`${styles.demo} ${styles.cursor} ${(this.state.slideIndex === index)?styles.active:''}`}
                    fluid={img.thumb}
                    alt={img.title}/>
                </div>
            )})}
            </div>
          </div>
        )
        return null
      }
}

export default Slideshow
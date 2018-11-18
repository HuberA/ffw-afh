import React from "react"
import Img from "gatsby-image"
import styles from "./thumbnail_slideshow.module.css"

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
    render(){
        console.log('images:', this.props.images)
        if (this.props.images.length == 1)
            return <Img fluid={this.props.images[0].fluid} backgroundColor="#A81C1C"/>
        else if(this.props.images.length > 0) 
        return(
            <div className={styles.container}>
            {this.props.images.map((image, index) =>{ 
                return (
                <div className={styles.mySlides} style={{display:(index===this.state.slideIndex)?'block':'none'}} key={index}>
                <div className={styles.numbertext}>{index+1} / {this.props.images.length}</div>
                <img src={image.fluid.src} alt={image.title} style={{display: "block", marginLeft: "auto", marginRight: "auto"}}/>
              </div>
            )})}
              
            <div className={styles.prev} onClick={(e) => this.plusSlides(-1)}>❮</div>
            <div className={styles.next} onClick={(e) => this.plusSlides(1)}>❯</div>
          
            {this.props.images[this.state.slideIndex].title && <div className={styles.captioncontainer}>
              <p id="caption">{this.props.images[this.state.slideIndex].title}</p>
            </div>}
          
            <div className={styles.row}>
            {this.props.images.map((img, index) => { return (
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
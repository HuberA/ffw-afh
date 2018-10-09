import React from "react"
import {Helmet} from "react-helmet"
import scriptjs from "scriptjs"
import fwhaus from "../images/fwhaus_icon.svg"
import Points from "../map/points"

const coreUrl = "https://js.api.here.com/v3/3.0/mapsjs-core.js"

const appId = process.env.APP_ID || process.env.GATSBY_APP_ID
const appCode = process.env.APP_CODE || process.env.GATSBY_APP_CODE

if (!appId || !appCode){
  console.error("did not find app ID")
}

const urls = [
  "https://js.api.here.com/v3/3.0/mapsjs-service.js",
  "https://js.api.here.com/v3/3.0/mapsjs-ui.js",
  "https://js.api.here.com/v3/3.0/mapsjs-mapevents.js"
]

class Map extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isLoaded: false,
      summary: null
    };
    this.lat = 0
    this.lng = 0
    this.mapObjects = []
  }
  drawMap(){
    if (!this.platform){
      this.platform = new window.H.service.Platform({
        app_id: appId,
        app_code: appCode,
        useHTTPS: true
      });
      const pixelRatio = window.devicePixelRatio || 1;
      const defaultLayers = this.platform.createDefaultLayers({
        tileSize: pixelRatio === 1 ? 256 : 512,
        ppi: pixelRatio === 1 ? undefined : 320
      });
          
      this.map = new this.H.Map(
        document.getElementById('map'),
        defaultLayers.normal.map, {
          pixelRatio: pixelRatio,
          center: {lat:48.449863, lng:12.177390},
          zoom: 13
        });
      this.map.setBaseLayer(defaultLayers.satellite.map);
          
      //const behavior = new this.H.mapevents.Behavior(new this.H.mapevents.MapEvents(this.map));
          
      this.ui = this.H.ui.UI.createDefault(this.map, defaultLayers, 'de-DE');
    }else{
      this.map.removeObjects(this.mapObjects)
      this.mapObjects = []
    }
    if (this.props.lat && this.props.lng){
      this.calculateRouteFromAtoB()
    }else{
      this.addFWHausIcon();
      this.addEinsatzbereich();  
      const behavior = new this.H.mapevents.Behavior(new this.H.mapevents.MapEvents(this.map));
    }
  }
  calculateRouteFromAtoB () {
    const router = this.platform.getRoutingService(),
    routeRequestParams = {
        mode: 'fastest;car',
        representation: 'display',
        routeattributes : 'waypoints,summary,shape,legs',
        maneuverattributes: 'direction,action',
        waypoint0: '48.449870,12.177397', // Feuerwehrhaus
        waypoint1: `${this.props.lat},${this.props.lng}`  // Ziel
    };
  
    router.calculateRoute(
      routeRequestParams,
      (result) => this.onSuccess(result),
      this.onError
    );
  }
  onSuccess(result) {
    const route = result.response.route[0];
    this.addRouteShapeToMap(route);
    this.addSummaryToPanel(route.summary);
    this.addFWHausIcon();
    this.addEndPoint({lat:this.props.lat, lng: this.props.lng})
  }
  onError(error) {
    console.error('error while routing', error)
  }
  addRouteShapeToMap(route){
    const strip = new this.H.geo.Strip(),
      routeShape = route.shape;
  
    routeShape.forEach(function(point) {
      var parts = point.split(',');
      strip.pushLatLngAlt(parts[0], parts[1]);
    });
  
    const polyline = new this.H.map.Polyline(strip, {
      style: {
        lineWidth: 4,
        strokeColor: 'rgba(168, 28, 28, 0.7)'
      }
    });
    // Add the polyline to the map
    this.map.addObject(polyline);
    this.mapObjects.push(polyline);
    // And zoom to its bounding rectangle
    this.map.setViewBounds(polyline.getBounds(), true);
  }
  addFWHausIcon(){
    const icon = new this.H.map.Icon(fwhaus, {anchor: {x:25, y:23.6}});
    const marker = new this.H.map.Marker(
      {lat: 48.449870, lng: 12.177397},
      {icon: icon});
    marker.instruction = 'test instruction';
    this.map.addObject(marker)
  }
  addEndPoint(point){
    const svgMarkup = '<svg width="18" height="18" ' +
    'xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="8" cy="8" r="8" ' +
      'fill="#A81C1C" stroke="white" stroke-width="1"  />' +
    '</svg>',
    dotIcon = new this.H.map.Icon(svgMarkup, {anchor: {x:8, y:8}});
    const marker = new this.H.map.Marker(
      point,
      {icon: dotIcon}
    );
    this.map.addObject(marker)
    this.mapObjects.push(marker)
  }
  addSummaryToPanel(summary){
    const text = `Anfahrtsweg: ${summary.distance/1000}km`
    this.setState({summary: text})
  }
  addEinsatzbereich() {
    const lineString = new this.H.geo.LineString(
        Points,
        'values lat lng alt'
    );
    const polygon = new this.H.map.Polygon(lineString, {
          style: {
            fillColor: 'rgba(168, 28, 28, 0.5)',
            strokeColor: '#829',
            lineWidth: 0
          }
        })
      this.map.addObject(polygon);
      this.map.setViewBounds(polygon.getBounds(), true);
  }
  componentDidMount(){
    if(!window.H || ! window.H.service){
      scriptjs(coreUrl, () =>{
        scriptjs(urls, () =>{
          this.H = window.H
          this.setState({isLoaded: true})
        })
      })
    }else{
      this.H = window.H
      this.setState({isLoaded: true})
    }
  }
  componentDidUpdate(){
    if(this.state.isLoaded && (this.lat !== this.props.lat || this.lng !== this.props.lng)){
      this.lat = this.props.lat;
      this.lng = this.props.lng;
      this.drawMap()
    } 
  }
  componentWillUnmount(){
  }
  render(){
    return(
      <div>
        <Helmet>
            <link rel="stylesheet" type="text/css" href="https://js.api.here.com/v3/3.0/mapsjs-ui.css?dp-version=1533195059" />
        </Helmet>
        <div id="map" style={{width: "100%", height: "500px", background: "#A81C1C"}} />
        {this.state.summary &&
        <p>{this.state.summary}</p>
        }
      </div>
    )
  }
}
export default Map

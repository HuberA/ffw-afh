import React from "react";
import { Helmet } from "react-helmet";
import scriptjs from "scriptjs";
import { feuerwehrRot } from "./layout";
import fwhaus from "../images/fwhaus_icon.svg";
import Points from "../data/points";

const coreUrl = "https://js.api.here.com/v3/3.1/mapsjs-core.js";

const appId = process.env.APP_ID || process.env.GATSBY_APP_ID;
const appCode = process.env.APP_CODE || process.env.GATSBY_APP_CODE;

if (!appId || !appCode) {
  console.error("did not find app ID");
}

const urls = [

  "https://js.api.here.com/v3/3.1/mapsjs-service.js",
  "https://js.api.here.com/v3/3.1/mapsjs-ui.js",
  "https://js.api.here.com/v3/3.1/mapsjs-mapevents.js",
];

// data

const fwHausLat = 48.449863;
const fwHausLng = 12.17739;
const fwHausCoords = { lat: fwHausLat, lng: fwHausLng };

// markup

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      summary: null,
    };
    this.lat = 0;
    this.lng = 0;
    this.mapObjects = [];
  }
  drawMap() {
    if (!this.platform) {
      this.platform = new window.H.service.Platform({
        apikey: appCode,
      });
      const pixelRatio = window.devicePixelRatio || 1;
      const defaultLayers = this.platform.createDefaultLayers({
        tileSize: pixelRatio === 1 ? 256 : 512,
        ppi: pixelRatio === 1 ? undefined : 320,
      });

      // Create a map using the vector map layer (normal.day)
      this.map = new this.H.Map(
        document.getElementById("map"),
        defaultLayers.vector.normal.map,  // Use the vector map instead of satellite
        {
          pixelRatio: pixelRatio,
          center: fwHausCoords,
          zoom: 13,
        }
      );

      // Set the base layer to vector map (normal.day)
      this.map.setBaseLayer(defaultLayers.vector.normal.map);  // Using the vector base layer

      this.ui = this.H.ui.UI.createDefault(this.map, defaultLayers, "de-DE");
    } else {
      this.map.removeObjects(this.mapObjects);
      this.mapObjects = [];
    }
    
    if (this.props.lat && this.props.lng) {
      this.calculateRouteFromAtoB();
    } else {
      const fwHausIcon = new this.H.map.Icon(fwhaus, { anchor: { x: 25, y: 23.6 } });
      const fwHausMarker = new this.H.map.Marker(
        fwHausCoords,
        { icon: fwHausIcon }
      );
      const einsatzbereich = this.addEinsatzbereich();
      const group = new this.H.map.Group();
      group.addObjects([einsatzbereich, fwHausMarker]);
      // Add the group to the map
      this.map.addObject(group);
      new this.H.mapevents.Behavior(new this.H.mapevents.MapEvents(this.map));
    }
}


  calculateRouteFromAtoB() {
    const router = this.platform.getRoutingService(null, 8);
    const routeRequestParams = {
      routingMode: "fast",
      transportMode: 'car',
      origin: `${fwHausLat},${fwHausLng}`, // Feuerwehrhaus
      destination: `${this.props.lat},${this.props.lng}`,
      return: 'polyline',
    };

    router.calculateRoute(
      routeRequestParams,
      (result) => this.onSuccess(result),
      this.onError
    );
  }
  onSuccess(result) {
    if (result.routes.length < 1) {
      console.warn('routing was not successful');
      return;
    }
    // const lineStrings = [];
    const route = result.routes[0];
    const lineStrings = [];
    route.sections.forEach((section) => {
      lineStrings.push(this.H.geo.LineString.fromFlexiblePolyline(section.polyline));
    })
    const multiLineString = new this.H.geo.MultiLineString(lineStrings);

    const routeLine = new this.H.map.Polyline(multiLineString, {
      style: {
        strokeColor: "rgba(168, 28, 28, 0.7)",
        lineWidth: 4
      }
    });
    const fwHausIcon = new this.H.map.Icon(fwhaus, { anchor: { x: 25, y: 23.6 } });
    const startMarker = new this.H.map.Marker(
      fwHausCoords,
      { icon: fwHausIcon }
    );
    const svgMarkup =
      '<svg width="18" height="18" ' +
      'xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="8" cy="8" r="8" ' +
      `fill="${feuerwehrRot}" stroke="white" stroke-width="1"  />` +
      "</svg>",
      dotIcon = new this.H.map.Icon(svgMarkup, { anchor: { x: 8, y: 8 } });
    const endMarker = new this.H.map.Marker({ lat: this.props.lat, lng: this.props.lng }, { icon: dotIcon });

    const group = new this.H.map.Group();
    group.addObjects([routeLine, startMarker, endMarker]);
    // Add the group to the map
    this.map.addObject(group);

    // Set the map viewport to make the entire route visible:
    let bounds = group.getBoundingBox();
    bounds.x -= 0.002;
    bounds.da += 0.002;
    bounds.ha -= 0.002;
    bounds.ga += 0.002;
    this.map.getViewModel().setLookAtData({
      bounds: bounds
    });

  }
  onError(error) {
    console.error("error while routing", error);
  }

  addEinsatzbereich() {
    const lineString = new this.H.geo.LineString(Points, "values lat lng alt");
    const polygon = new this.H.map.Polygon(lineString, {
      style: {
        fillColor: "rgba(168, 28, 28, 0.5)",
        strokeColor: "#829",
        lineWidth: 0,
      },
    });
    return polygon;
  }
  componentDidMount() {
    if (!window.H || !window.H.service) {
      scriptjs(coreUrl, () => {
        scriptjs(urls, () => {
          this.H = window.H;
          this.setState({ isLoaded: true });
        });
      });
    } else {
      this.H = window.H;
      this.setState({ isLoaded: true });
    }
  }
  componentDidUpdate() {
    if (
      this.state.isLoaded &&
      (this.lat !== this.props.lat || this.lng !== this.props.lng)
    ) {
      this.lat = this.props.lat;
      this.lng = this.props.lng;
      this.drawMap();
    }
  }
  componentWillUnmount() { }
  render() {
    return (
      <div>
        <Helmet>
          <link
            rel="stylesheet"
            type="text/css"
            href="https://js.api.here.com/v3/3.0/mapsjs-ui.css?dp-version=1533195059"
          />
        </Helmet>
        <div
          id="map"
          style={{ width: "100%", height: "500px", background: feuerwehrRot }}
        />
        {this.state.summary && <p>{this.state.summary}</p>}
      </div>
    );
  }
}
export default Map;

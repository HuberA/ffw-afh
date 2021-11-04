import * as React from "react";
import { graphql, useStaticQuery, Link } from "gatsby";
import { LayoutComponent } from "../components/layout";
import MapComponent from "../components/map";
import Seo from "../components/seo";

const description = "Anfahrt zur Feuerwehr Altfraunhofen";

const AnfahrtPage = () => (
  <LayoutComponent>
    <Seo title={`Anfahrt - Feuerwehr Altfraunhofen`} 
                 description_short={description}
                 description_long={description} 
                 url="http://feuerwehr-altfraunhofen.de"/>
    <h1>Anfahrt</h1>
    <p>
      Freiwillige Feuerwehr Altfrauhofen e.V.
      <br />
      Geisenhausener Straße 23
      <br />
      84169 Altfraunhofen
    </p>
    <MapComponent />
  </LayoutComponent>
);

export default AnfahrtPage;

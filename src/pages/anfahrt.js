import React from "react"
import Layout from "../components/layout"
import Map from "../components/map"
import Seo from "../components/seo"

const description = "Anfahrt zur Feuerwehr Altfraunhofen"

export default () =>(
    <Layout>
        <Seo title={`Anfahrt - Feuerwehr Altfraunhofen`} 
                 description_short={description}
                 description_long={description} 
                 url="http://feuerwehr-altfraunhofen.de"/>
        <h1>Anfahrt</h1>
        <p>Freiwillige Feuerwehr Altfrauhofen e.V.<br/>
            Geisenhausener Straße 23<br/>
            84169 Altfraunhofen</p>
        <Map einsatzgebiet={true}></Map>
    </Layout>
)
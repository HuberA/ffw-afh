import React from "react"
import Layout from "../components/layout"
import Map from "../components/map"
export default () =>(
    <Layout>
        <h1>Anfahrt</h1>
        <p>Freiwillige Feuerwehr Altfrauhofen e.V.<br/>
            Geisenhausener Straße 23<br/>
            84169 Altfraunhofen</p>
        <Map einsatzgebiet={true}></Map>
    </Layout>
)
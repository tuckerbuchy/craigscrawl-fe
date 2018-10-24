import React from "react";
import ReactDOM from "react-dom";
import { Map, TileLayer } from 'react-leaflet'

const position = [49.282, -123.1207]
const MyMap = () => {
  return <Map
          style={{height: "100vh"}}
          center={position}
          zoom={13}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" />
        </Map>
};

ReactDOM.render(<MyMap />, document.getElementById("map"));

import React, {Component} from "react";
import ReactDOM from "react-dom";
import { Map, TileLayer, GeoJSON } from 'react-leaflet'

import vancouver from './vancouver'

const position = [49.282, -123.1207]
const doThing = () => {
	console.log("WAT");
}
export default class MyMap extends Component {
	onClickGeo() {
    	console.log("CLICKEd");
	};
	render() {
	  return <Map
	          style={{height: "100vh"}}
	          onClick={ this.onClickGeo }
	          center={position}
	          zoom={13}>
	          <TileLayer
		        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
	            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" />
	          <GeoJSON data={vancouver} />
	        </Map>
	};

}


ReactDOM.render(<MyMap />, document.getElementById("map"));

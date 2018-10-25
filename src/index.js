import React, {Component} from "react";
import ReactDOM from "react-dom";
import { Map, TileLayer, GeoJSON, L } from 'react-leaflet'

import vancouver from './vancouver'

const position = [49.26, -123.1207]
const doThing = () => {
	console.log("WAT");
}
export default class MyMap extends Component {
	onEachFeature(feature, layer) {
	  	const func = (e)=>{console.log("Click")};
	    
	  	layer.on({
	    	click: func
	    });
	  };
	render() {
	  return <Map
	  		  // touchZoom={false}
	  		  // minZoom={12}
	  		  // maxZoom={12}
	  		  // zoomControl={false}
	  		  // scrollWheelZoom={false}
	          style={{height: "100vh"}}
	          center={position}
	          zoom={12} >
	          <TileLayer
		        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
	            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" />
	          <GeoJSON 
	            key={Math.random()}
	          	data={vancouver} 
                onEachFeature={this.onEachFeature.bind(this)}
	          	/>
	        </Map>
	};

}


ReactDOM.render(<MyMap />, document.getElementById("map"));

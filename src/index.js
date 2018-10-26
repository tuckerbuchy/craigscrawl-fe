import React, {Component} from "react";
import ReactDOM from "react-dom";
import { Map, TileLayer, GeoJSON, L } from 'react-leaflet'

import vancouver from './vancouver'

const position = [49.26, -123.1207]
export default class MyMap extends Component {
	clickFeature(event) {
		const layer = event.target;
		layer.setStyle({color: 'green'});
	}
	onEachFeature(feature, layer) {
	  	console.log(layer);
	  	layer.setStyle({color: 'purple'});
	    
	  	layer.on({
	    	click: this.clickFeature
	    });
	  };
	render() {
	  return <Map
	  		  touchZoom={false}
	  		  minZoom={12}
	  		  maxZoom={12}
	  		  zoomControl={false}
	  		  scrollWheelZoom={false}
	          style={{height: "100vh"}}
	          center={position}
	          zoom={12} >
	          <TileLayer
		        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
	            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" />
	          <GeoJSON 
	            key={Math.random()}
	          	data={vancouver} 
	          	color='red'
                onEachFeature={this.onEachFeature.bind(this)}
	          	/>
	        </Map>
	};

}


ReactDOM.render(<MyMap />, document.getElementById("map"));

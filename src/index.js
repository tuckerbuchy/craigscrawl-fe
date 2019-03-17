import L from 'leaflet';
import * as heat from 'leaflet.heat'
import * as d3 from "d3";
import './styles/map.css';
import vancouver from './vancouver';

const { getListings, getListingsMeanRent } = require('./services/listings');

// GLOBALS
// TODO: Probably bad, its a global.
var geoJsonVan = null;
const ZOOM = 12;

function clickFeature(event) {
  // Reset the style back to 'unselected'.
  geoJsonVan.eachLayer((layer) => {
    layer.setStyle({color: 'purple'});
  });

  const layer = event.target;
  layer.setStyle({color: 'green'});
}

async function onEachFeature(feature, layer) {
  const neighborhoodName = feature.properties.name;

  const rent = await getListingsMeanRent(neighborhoodName);

  layer.setStyle({color: 'purple'});
  layer.bindPopup(`<h1> ${feature.properties.name} </h1> avg rent: ${rent}`);
  
  layer.on({
    click: clickFeature
  });
};

function addListingMarkers(listings, map) {
  listings.forEach((l) => {
    const lat = l['lat'];
    const lon = l['lon'];
    if (lat && lon){
      const marker = L.marker([lat, lon]).addTo(map); 
      marker.bindPopup(
        `<b>${l['title']}</b><br> neighborhood: ${l['neighborhood']}`
      ).openPopup();
    }
  });
}

function configureMap(listings) {
  const map = L.map('mapid', {
    zoomControl: true,
    zoom: ZOOM, 
    minZoom: ZOOM, 
    // maxZoom: ZOOM,
    scrollWheelZoom: true,
    touchZoom: true,

  }).setView([49.26, -123.1207], ZOOM);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // getHeatLayer(listings).addTo(map);
  getGeoJsonLayer().addTo(map);
  addListingMarkers(listings, map)

  return map;
}

function getHeatLayer(listings) {
  let filteredListings = removeListingOutliers(listings);
  let maxPrice = 0;
  let heatMapListings = filteredListings.map( (l) => {
    let price = l['price'];
    if (price > maxPrice) maxPrice = price;
    return [l['lat'], l['lon'], price]
  });
  return L.heatLayer(heatMapListings, {blur: 15, max: maxPrice});
}

function getGeoJsonLayer() {
  return L.geoJSON(vancouver,  {
      onEachFeature: onEachFeature
  });
}

function removeListingOutliers(listings) {
  let sortedListings = listings.sort(function(l1, l2){return l1['price'] - l2['price']});
  let low = Math.round(sortedListings.length * 0.025);
  let high = sortedListings.length - low;
  return sortedListings.slice(low,high);
}

getListings().then(configureMap);

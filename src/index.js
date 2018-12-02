import L from 'leaflet';
import './styles/map.css';
import vancouver from './vancouver';
const { getListings } = require('./services/listings');

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

function onEachFeature(feature, layer) {
  layer.setStyle({color: 'purple'});
  layer.bindPopup('<h1>'+feature.properties.name+'</h1>');
  
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
    }
  });
}

function configureMap(listings) {

  const map = L.map('mapid', {
    zoomControl: false,
    zoom: ZOOM, 
    minZoom: ZOOM, 
    maxZoom: ZOOM,
    scrollWheelZoom: false,
    touchZoom: false,

  }).setView([49.26, -123.1207], ZOOM);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  geoJsonVan = L.geoJSON(vancouver,  {
      onEachFeature: onEachFeature
  });

  geoJsonVan.addTo(map);
  
  addListingMarkers(listings, map)

  return map;
}

const listings = getListings();
const listingsSub = listings.slice(0, 100);
const map = configureMap(listingsSub);


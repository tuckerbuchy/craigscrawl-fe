import L from 'leaflet';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as heat from 'leaflet.heat'
import * as d3 from "d3";
import './styles/map.css';
import vancouver from './vancouver';


const { getListings, getAverageRents } = require('./services/listings');

// GLOBALS
var geoJsonVan = {};
const ZOOM = 12;

function clickFeature(event) {
  geoJsonVan.eachLayer((layer) => {
    layer.setStyle({color: 'purple'});
  });

  const layer = event.target;
  layer.setStyle({color: 'green'});
}

function getMaxRent(averageRents) {
  return Math.max(...averageRents.map(x => x.AVERAGE_RENT));
}

function getAverageRent(neighborhoodName) {
  return averageRents.find(x => {
    return x['neighborhood'] == neighborhoodName;
  }).AVERAGE_RENT;
}

function updateGeojsonFeatures() {
  // const maxRent = getMaxRent(averageRents);
  console.log(geoJsonVan);

  Object.values(geoJsonVan._layers).forEach((layer) => {
    layer.setStyle({color: 'blue'});
  })
  return false;
}

function onEachFeature(feature, layer) {
  const neighborhoodName = feature.properties.name;
  const rent = 0;

  layer.setStyle({color: 'purple'});
  layer.bindPopup(`<h5> ${feature.properties.name} </h5> avg rent: ${rent}`);
  
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

function configureMap(listingsInfo) {
  // let listings = listingsInfo.listings;
  // TODO: note this is a global..
  // averageRents = listingsInfo.averageRents;

  const map = L.map('mapid', {
    zoomControl: true,
    zoom: ZOOM, 
    minZoom: ZOOM, 
    maxZoom: ZOOM,
    scrollWheelZoom: true,
    touchZoom: true,

  }).setView([49.26, -123.1207], ZOOM);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // getHeatLayer(listings).addTo(map);
  getGeoJsonLayer().addTo(map);
  // addListingMarkers(listings, map)

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
  geoJsonVan = L.geoJSON(vancouver,  {
      onEachFeature: onEachFeature
  });
  return geoJsonVan;
}

function removeListingOutliers(listings) {
  let sortedListings = listings.sort(function(l1, l2){return l1['price'] - l2['price']});
  let low = Math.round(sortedListings.length * 0.025);
  let high = sortedListings.length - low;
  return sortedListings.slice(low,high);
}

async function getListingInformation() {
  // let average = await getAverageRents();
  return {
    averageRents: {}//average
  }
}

function setUpExploreForm() {
  document.querySelector('#explore-form').addEventListener('submit', updateGeojsonFeatures);
}

setUpExploreForm();
getListingInformation().then(configureMap);

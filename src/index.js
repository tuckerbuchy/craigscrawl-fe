import L from 'leaflet';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as heat from 'leaflet.heat'
import * as d3 from "d3";
import './styles/index.css';
import './styles/map.css';
import vancouver from './vancouver';

const { getListings, getAverageRents } = require('./services/listings');

var geoJsonVan = {};
const ZOOM = 12;

function clickFeature(event) {
  geoJsonVan.eachLayer((layer) => {
    layer.setStyle({color: 'grey'});
  });

  const layer = event.target;
  layer.setStyle({color: 'green'});
}

function getMaxRent(averageRents) {
  return Math.max(...averageRents.map(x => x.averageRent));
}

function getNumberOfListings(averageRents) {
  let numRecords = averageRents.map(x => parseInt(x.numberRecords)).filter( x => !Number.isNaN(x) );
  return numRecords.reduce((a,b) => a + b, 0);
}

function findNeighborhoodStats(averageRents, neighborhoodName) {
  return averageRents.find(x => {
    return x['neighborhood'] == neighborhoodName;
  });
}

function setButtonLoading() {
  console.log("loading!");
  document.querySelector('#explore-button').setAttribute('disabled', true);
  document.querySelector('#explore-button').setAttribute('aria-disabled', true);
  document.querySelector('#explore-button').setAttribute('hidden', 'true');
  document.querySelector('#explore-button-spinner').removeAttribute('hidden');
}

function setButtonNormal() {
  console.log("normal!");
  document.querySelector('#explore-button').removeAttribute('disabled');
  document.querySelector('#explore-button').removeAttribute('aria-disabled');
  document.querySelector('#explore-button').removeAttribute('hidden');
  document.querySelector('#explore-button-spinner').setAttribute('hidden', 'true');
}

function getFormValues() {
  let formValues = {};
  let type = null;
  let minFt2 = null; 
  let maxFt2 = null;

  if (type = document.getElementById('rental-type').value) {
    formValues['type'] = type;
  }
  if (minFt2 = document.getElementById('min-bedrooms').value) {
    formValues['minBedrooms'] = minFt2;
  }
  if (maxFt2 = document.getElementById('max-bedrooms').value) {
    formValues['maxBedrooms'] = maxFt2;
  }
  if (minFt2 = document.getElementById('min-ft2').value) {
    formValues['minFt2'] = minFt2;
  }
  if (maxFt2 = document.getElementById('max-ft2').value) {
    formValues['maxFt2'] = maxFt2;
  }

  formValues['dogs'] = document.getElementById('dogs').checked;
  formValues['cats'] = document.getElementById('cats').checked;

  return formValues;
}

function getColor(avgRent, maxRent) {
  const v = avgRent / maxRent;
  console.log(v);
  return v > 0.8  ? '#d7191c' :
         v > 0.6  ? '#fdae61' :
         v > 0.4  ? '#ffffbf' :
         v > 0.2  ? '#a6d96a' :
                    '#1a9641' ;

}

async function updateMap() {
  // Get form values
  const formValues = getFormValues();
  console.log(formValues);
  // Call API
  const averageRents = await getAverageRents(formValues);

  // Find max rent
  const maxRent = getMaxRent(averageRents);
  const totalNumberRecords = getNumberOfListings(averageRents);

  document.querySelector('#number-of-listings').textContent = totalNumberRecords;
  document.querySelector('#number-of-listings-container').removeAttribute('hidden');

  Object.values(geoJsonVan._layers).forEach((layer) => {
    const neighborhoodName = layer.feature.properties.name;
    const neighborhoodStats = findNeighborhoodStats(averageRents, neighborhoodName);
    if (neighborhoodStats) {
      const rent = parseInt(neighborhoodStats.averageRent);
      const count = neighborhoodStats.numberRecords;
      layer.setStyle({color: getColor(rent, maxRent)});
      layer.bindPopup(`<h5> ${neighborhoodName} </h5> Average Rent: $${rent} Count: ${count}`);
    } else {
      layer.setStyle({color: 'grey'});
      layer.bindPopup(`Not enough data.`);
    }
  });

  return false;
}

function onEachFeature(feature, layer) {
  layer.setStyle({color: 'grey'});
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

function configureMap() {
  const map = L.map('mapid', {
    zoomControl: true,
    zoom: ZOOM, 
    minZoom: ZOOM, 
    maxZoom: ZOOM,
    scrollWheelZoom: true,
    touchZoom: true,

  }).setView([49.26, -123.1207], ZOOM);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  getGeoJsonLayer().addTo(map);

  return map;
}

function getGeoJsonLayer() {
  geoJsonVan = L.geoJSON(vancouver,  {
      onEachFeature: onEachFeature
  });
  return geoJsonVan;
}

function setUpExploreForm() {
  document.querySelector('#explore-button').addEventListener('click', async () => {
    setButtonLoading();
    await updateMap();
    setButtonNormal();
  });
}

setUpExploreForm();
configureMap();

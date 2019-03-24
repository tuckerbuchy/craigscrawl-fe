import * as d3 from "d3";
import axios from 'axios';

import listings from'./samples';
import config from '../config/local';

function getListings(neighborhood) {
  return axios.get('http://localhost:3000/listings').then((results) => {
    return results.data;
  });
}

function getAverageRents(type, minBedrooms, maxBedrooms, minFt2, maxFt2, dogs, cats) {
  let data = sessionStorage.getItem('averageRent');

  if (data === null) {
    return axios.get('http://localhost:3000/averageRent').then((results) => {
      console.log("Nothing in cache for 'averageRent', querying.")
      let data = JSON.stringify(results.data["Items"]);
      sessionStorage.setItem('averageRent', data);
      return JSON.parse(data);
    });
  }
  console.log("found in cache.")
  return JSON.parse(data);
}

module.exports = {
    getListings,
    getAverageRents
};

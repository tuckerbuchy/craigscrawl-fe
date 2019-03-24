import * as d3 from "d3";
import axios from 'axios';
import $ from 'jquery';

import listings from'./samples';
import config from '../config/local';

function getListings(neighborhood) {
  return axios.get(config['listingsApi']['url'] + '/listings').then((results) => {
    return results.data;
  });
}

function getAverageRents(queryParams) {
  let endpoint = config['listingsApi']['url'] + '/averageRent';
  let params = $.param(queryParams);
  if (params) {
    endpoint += '?'
    endpoint += params;
  }
  return axios.get(endpoint).then((results) => {
    let data = JSON.stringify(results.data["Items"]);
    console.log(data);
    return JSON.parse(data);
  });
}

module.exports = {
    getListings,
    getAverageRents
};

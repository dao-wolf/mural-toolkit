// src/api/mural.js
const axios = require('axios');
const { delay } = require('../utils');
require('dotenv').config();

const BASE_URL = 'https://app.mural.co/api/public';
const MURAL_API_VERSION = 'v1';
const { MURAL_API_KEY } = process.env;
const DELAY_MS = 5000; // Delay in milliseconds

const fetchAllMurals = async (workspaceId) => {
  let next = '';
  let allMurals = [];
  try {
    do {
      let options = {
        method: 'get',
        url: `${BASE_URL}/${MURAL_API_VERSION}/workspaces/${workspaceId}/murals?next=${next}`,
        headers: {
          'Authorization': `Bearer ${MURAL_API_KEY}`, // Assuming the API key is stored in an environment variable
        },
      };
      const response = await axios(options);
      const pageData = response.data;
      const muralsInPage = pageData.value;
      console.log(`Number of murals fetched in this page: ${muralsInPage.length}`);// Log the count of items in the current page

      if (!pageData && !Array.isArray(muralsInPage) || muralsInPage.length === 0) throw new Error('No murals data found to export.');
      allMurals = allMurals.concat(pageData.value);
      // next = pageData.next || ''; // Update the 'next' parameter
    } while (next); // Continue until there's no 'next' value
    return allMurals;
  } catch (error) {
    console.error('Error fetching murals from workspace:', error);
    throw error;
  }
};

const getExportIdForMuralToPDF = async (muralId) => {
  const options = {
    method: 'post',
    url: `${BASE_URL}/${MURAL_API_VERSION}/murals/${muralId}/export`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MURAL_API_KEY}`,
    },
    data: JSON.stringify({downloadFormat: 'pdf'})
  };

  try {
    const response = await axios(options);
    
    const xRateLimitReset = response.headers['x-ratelimit-reset'];
    const xRateLimitRemaining = response.headers['x-ratelimit-remaining'];
    
    const { exportId } = response.data.value; // Extract the export ID from the response
    return { xRateLimitReset: xRateLimitReset, xRateLimitRemaining: xRateLimitRemaining, exportId: exportId };
  } catch (error) {
    console.error('Failed to getExportIdForMuralToPDF from Mural API:', error.message);
    return error;
  }
};

const getExportDownloadUrl = async (muralId, exportId) => {
  const options = {
    method: 'get',
    url: `${BASE_URL}/${MURAL_API_VERSION}/murals/${muralId}/exports/${exportId}`,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${MURAL_API_KEY}`, // Assuming the API key is stored in an environment variable
    },
  };

  try {
    const response = await axios(options);
    const xRateLimitReset = response.headers['x-ratelimit-reset'];
    const xRateLimitRemaining = response.headers['x-ratelimit-remaining'];
    const url = response.data.value.url
    return { xRateLimitReset: xRateLimitReset, xRateLimitRemaining: xRateLimitRemaining, exportDownloadUrl: url };
  } catch (error) {
    console.error('Failed to getExportDownloadUrl from Mural API:', options.url, error.message);
    return error;
  }
};

module.exports = {
  fetchAllMurals,
  getExportIdForMuralToPDF,
  getExportDownloadUrl
};
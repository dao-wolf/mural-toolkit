// src/api/mural.js
const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'https://app.mural.co/api/public';
const MURAL_API_VERSION = 'v1';
const { MURAL_API_KEY } = process.env;

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
      
      next = pageData.next || ''; // Update the 'next' parameter
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
    return response.data;
  } catch (error) {
    console.error('Error exporting mural to PDF:', error.message);
    throw error;
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
    return response.data; // This should contain the download URL
  } catch (error) {
    console.error('Error fetching export download URL:', error.message);
    throw error; // Rethrow the error to be handled by the caller
  }
};

module.exports = {
  fetchAllMurals,
  getExportIdForMuralToPDF,
  getExportDownloadUrl
};
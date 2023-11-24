// src/api/mural.js
const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'https://app.mural.co/api/public';
const MURAL_API_VERSION = 'v1';

const fetchAllMurals = async (workspaceId) => {
  let next = '';
  let allMurals = [];
  try {
    do {
      const response = await axios.get(`${BASE_URL}/${MURAL_API_VERSION}/workspaces/${workspaceId}/murals?next=${next}`, {
        headers: { 'Authorization': `Bearer ${process.env.MURAL_API_KEY}` }
      });

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

module.exports = {
  fetchAllMurals
};
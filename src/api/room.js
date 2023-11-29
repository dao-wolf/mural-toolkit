// src/api/mural.js
const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'https://app.mural.co/api/public';
const MURAL_API_VERSION = 'v1';

const getRoomInfo = async (roomId) => {
  if (!roomId) {
    throw new Error('Room ID is required to fetch room info.');
  }

  try {
    const response = await axios.get(`${BASE_URL}/${MURAL_API_VERSION}/rooms/${roomId}`, {
      headers: { 'Authorization': `Bearer ${process.env.MURAL_API_KEY}` }
    });

    if (!response.data || !response.data.value) {
      throw new Error('Invalid response structure from API');
    }

    return response.data.value;
  } catch (error) {
    console.error('Error fetching room info:', error);
    // Additional error handling can be added here if needed
    throw error; // Re-throwing the error to be handled by the caller
  }
};

module.exports = {
  getRoomInfo
};
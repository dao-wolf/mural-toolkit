// src/api/mural.js
const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'https://app.mural.co/api/public';
const MURAL_API_VERSION = 'v1';

const getRoomInfo = async (roomId) => {
  try {
        const response = await axios.get(`${BASE_URL}/${MURAL_API_VERSION}/rooms/${roomId}`, {
          headers: { 'Authorization': `Bearer ${process.env.MURAL_API_KEY}` }
        });

        const roomData = response.data;
        if (!roomData && typeof roomData != 'object') throw new Error('No murals data found to export.');
        return roomData;
  } catch (error) {
    console.error('Error fetching room data:', error);
    throw error;
  }
};

module.exports = {
  getRoomInfo
};
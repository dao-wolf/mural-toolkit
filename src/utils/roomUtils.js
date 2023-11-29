// src/utils/roomUtils.js
const { getRoomInfo } = require('../api/room');
const delay = require('./generalUtils').delay;  // Assuming delay is in generalUtils.js

const CHUNK_SIZE = 10; // Adjust as needed
const DELAY_MS = 1000; // Delay in milliseconds

const fetchRoomNames = async (uniqueRoomIds) => {
  const roomNameMap = {};

  for (let i = 0; i < uniqueRoomIds.length; i += CHUNK_SIZE) {
    const roomIdsChunk = uniqueRoomIds.slice(i, i + CHUNK_SIZE);
    const roomInfos = await Promise.all(roomIdsChunk.map(id => getRoomInfo(id)));
    
    roomInfos.forEach(roomInfo => {
      roomNameMap[roomInfo.id] = roomInfo.name || 'Unknown Room';
    });

    await delay(DELAY_MS); // Wait before processing the next chunk
  }

  return roomNameMap;
};

module.exports = {
  fetchRoomNames
};

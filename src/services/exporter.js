// src/services/exporter.js
const fs = require('fs');
const { fetchAllMurals } = require('../api/mural');
const { getRoomInfo } = require('../api/room');
const { sanitizeString, formatDate, convertToCSV, delay, fetchRoomNames } = require('../utils');

const headers = ['Board Link', 'Board Title', 'Author Firstname', 'Author Lastname', 'authorId', 'createdOn', 'boardId', 'roomId', 'Room name', 'status', 'updatedOn', 'workspaceId'];

const mapMuralToCsvRow = (mural) => {
  const {
    _canvasLink = '',
    title = '',
    createdBy = {},
    createdOn = '',
    id = '',
    roomId = '',
    roomName = '',
    status = '',
    updatedOn = '',
    workspaceId = ''
  } = mural;

  const { firstName = '', lastName = '', id: createdById = '' } = createdBy;

  return [
    sanitizeString(_canvasLink),
    sanitizeString(title),
    sanitizeString(firstName),
    sanitizeString(lastName),
    sanitizeString(createdById),
    sanitizeString(formatDate(createdOn)),
    sanitizeString(id),
    roomId.toString(),
    sanitizeString(roomName),
    sanitizeString(status),
    sanitizeString(formatDate(updatedOn)),
    sanitizeString(workspaceId)
  ];
};

const exportMuralsWithRoomInfo = async (workspaceId) => {
  try {
    const murals = await fetchAllMurals(workspaceId);
    const uniqueRoomIds = [...new Set(murals.map(mural => mural.roomId))];
    
    const roomNameMap = await fetchRoomNames(uniqueRoomIds);

    const muralsWithRoomName = murals.map(mural => ({
      ...mural,
      roomName: roomNameMap[mural.roomId]
    }));

    const csvData = convertToCSV(muralsWithRoomName, headers, mapMuralToCsvRow);
    const filePath = 'exports/murals_with_room_info.csv';
    fs.writeFileSync(filePath, csvData);
    console.log(`Exported murals with room info to ${filePath}`);
  } catch (error) {
    console.error('Error exporting murals:', error);
  }
};

const exportMurals = async (workspaceId) => {
  try {
    const murals = await fetchAllMurals(workspaceId);
    const csvData = convertToCSV(murals, headers, mapMuralToCsvRow);
    const filePath = `exports/room_${workspaceId}_murals.csv`;
    fs.writeFileSync(filePath, csvData);
    console.log(`Exported murals for room ${workspaceId} to ${filePath}`);
  } catch (error) {
    console.error('Error exporting murals:', error.message);
  }
};

module.exports = {
  exportMurals, exportMuralsWithRoomInfo
};

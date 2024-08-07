// src/services/exporter.js
const path = require('path');
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

const generateMuralWithRoomInfoCSV = async (workspaceId) => {
  const filePath = 'exports/murals_with_room_info.csv';
  try {
    const murals = await fetchAllMurals(workspaceId);
    const uniqueRoomIds = [...new Set(murals.map(mural => mural.roomId))];
    
    const roomNameMap = await fetchRoomNames(uniqueRoomIds);

    const muralsWithRoomName = murals.map(mural => ({
      ...mural,
      roomName: roomNameMap[mural.roomId]
    }));

    const csvData = convertToCSV(muralsWithRoomName, headers, mapMuralToCsvRow);
    fs.writeFileSync(filePath, csvData);
    console.log(`Exported murals with room info to ${filePath}`);
  } catch (error) {
    console.error('Error exporting murals:', error);
  }
};

const exportMurals = async (workspaceId) => {
  const filePath = `exports/room_${workspaceId}_murals.csv`;
  try {
    const murals = await fetchAllMurals(workspaceId);
    const csvData = convertToCSV(murals, headers, mapMuralToCsvRow);
    fs.writeFileSync(filePath, csvData);
    console.log(`Exported murals for room ${workspaceId} to ${filePath}`);
  } catch (error) {
    console.error('Error exporting murals:', error.message);
  }
};

const exportDownloadUrlsToCSV = (workspaceId, exportDownloadData) => {
  const filePath = path.join(__dirname, `../../exports/download_${workspaceId}_murals.csv`);
  
  const headers = 'Workspace ID, Mural ID, Download URL\n';
  const csvData = exportDownloadData.map(data => `${workspaceId},${data.muralId},${data.url}`).join('\n');

  try {
    fs.writeFileSync(filePath, headers + csvData);
  } catch (error) {
    console.error('Error saving export download URLs to CSV file:', error.message);
  }
};

module.exports = {
  generateMuralWithRoomInfoCSV, exportMurals, exportDownloadUrlsToCSV
};

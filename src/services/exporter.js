// src/services/exporter.js
const fs = require('fs');
const { fetchAllMurals } = require('../api/mural');

const sanitizeString = (str) => {
  return typeof str === 'string' ? `"${str.replace(/"/g, '""')}"` : '""';
};

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
};

const convertToCSV = (data) => {
  // Define the header
  const header = 'Board Link, Board Title, Author Firstname, Author Lastname, authorId, createdOn, boardId, roomId, status, updatedOn, workspaceId';
  const rows = data.map(item => {
    const {
      _canvasLink = '',
      title = '',
      createdBy = {},
      createdOn = '',
      id = '',
      roomId = '',
      status = '',
      updatedOn = '',
      workspaceId = ''
    } = item;

    const { firstName = '', lastName = '', id: createdById = '' } = createdBy;

    return [
      sanitizeString(_canvasLink),
      sanitizeString(title),
      sanitizeString(firstName),
      sanitizeString(lastName),
      sanitizeString(createdById),
      sanitizeString(formatDate(createdOn)),
      sanitizeString(id),
      roomId,
      sanitizeString(status),
      sanitizeString(formatDate(updatedOn)),
      sanitizeString(workspaceId)
    ].join(',');
  });
  return [header, ...rows].join('\n');
};

const exportMurals = async (workspaceId) => {
  try {
    const murals = await fetchAllMurals(workspaceId);
    const csvData = convertToCSV(murals);
    const filePath = `exports/room_${workspaceId}_murals.csv`;
    fs.writeFileSync(filePath, csvData);
    console.log(`Exported murals for room ${workspaceId} to ${filePath}`);
  } catch (error) {
    console.error('Error exporting murals:', error.message);
  }
};

module.exports = {
  exportMurals
};

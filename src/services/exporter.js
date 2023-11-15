// src/services/exporter.js
const fs = require('fs');
const { fetchAllMurals } = require('../api/mural');

const exportMurals = async (workspaceId) => {
  try {
    const murals = await fetchAllMurals(workspaceId);
    const dataToExport = JSON.stringify(murals, null, 2);
    fs.writeFileSync(`exports/room_${workspaceId}_murals.json`, dataToExport);
    console.log(`Exported murals for room ${workspaceId}`);
  } catch (error) {
    console.error('Error exporting murals:', error);
  }
};

module.exports = {
  exportMurals
};

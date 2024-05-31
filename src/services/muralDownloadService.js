// src/services/muralDownloadService.js
const { fetchAllMurals } = require('../api/mural');
const { getExportIdForMuralToPDF, getExportDownloadUrl } = require('../api/mural');
const { executeWithRateLimit } = require('../api/apiRateLimitUtils');
const { exportDownloadUrlsToCSV } = require('./exporter');
const { downloadFile } = require('../utils/downloadFile');
const path = require('path');
const fs = require('fs');
const { delay } = require('../utils');

let RATE_LIMIT_RESET = 60; // Default reset time in seconds
let RATE_LIMIT_REMAINING = 25; // Default remaining requests

const updateRateLimits = (xRateLimitReset, xRateLimitRemaining) => {
  RATE_LIMIT_RESET = parseInt(xRateLimitReset) || RATE_LIMIT_RESET;
  RATE_LIMIT_REMAINING = parseInt(xRateLimitRemaining) || RATE_LIMIT_REMAINING;
}

const createGetExportIdActions = (murals) => {
  return murals.map(mural => async () => {
    const { xRateLimitReset, xRateLimitRemaining, exportId } = await getExportIdForMuralToPDF(mural.id);
    updateRateLimits(xRateLimitReset, xRateLimitRemaining);
    console.log('createGetExportIdActions response:', mural.id, exportId);
    return exportId;
  });
}

const createFetchDownloadDataActions = (murals, exportIds) => {
  return murals.map((mural, index) => async () => {
    let exportId = exportIds[index];
    const { xRateLimitReset, xRateLimitRemaining, exportDownloadUrl } = await getExportDownloadUrl(mural.id, exportId)
    const downloadUrl = exportDownloadUrl || mural._canvasLink;
    const downloadData = { muralId: mural.id, url: downloadUrl };
    updateRateLimits(xRateLimitReset, xRateLimitRemaining);
    console.log('createFetchDownloadUrlActions response:', downloadData);
    return downloadData;
  });
}

const createDownloadActions = (murals, downloadUrls) => {
  return murals.map((mural, index) => async () => {
    if (downloadUrls[index]) {
      const safeName = mural.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = `${safeName}-${mural.id}.pdf`;
      const filePath = path.join(__dirname, '../../exports', fileName);
      await downloadFile(downloadUrls[index], filePath);
      return filePath;
    }
    return null;
  });
}

const fetchDownloadUrlsToCSV = async (workspaceId) => {
  try {
    const murals = await fetchAllMurals(workspaceId);
    
    // Creating actions for getting export IDs
    const getExportIdActions = createGetExportIdActions(murals);
    const exportIds = await executeWithRateLimit(getExportIdActions, RATE_LIMIT_RESET, RATE_LIMIT_REMAINING);
    console.log('Export IDs:', exportIds.length);
    
    await delay(5000);

    // Prepare actions for fetching download URLs with rate limiting
    const fetchDownloadDataActions = createFetchDownloadDataActions(murals, exportIds);
    const downloadData = await executeWithRateLimit(fetchDownloadDataActions, RATE_LIMIT_RESET, RATE_LIMIT_REMAINING);
    console.log('Download Url:', Object.keys(downloadData).length);
    // Export all download URLs at once to a CSV
    exportDownloadUrlsToCSV(workspaceId, downloadData);

    return {murals, downloadUrls: downloadData};

  } catch (error) {
    console.error('Failed to fetch download URLs and export to CSV:', error);
  }
};

const downloadMuralBoards = async (murals, downloadUrls) => {
  try {
       // Create actions for downloading each exported PDF
       const downloadActions = createDownloadActions(murals, downloadUrls);
       const downloadedFiles = await executeWithRateLimit(downloadActions, RATE_LIMIT_RESET, RATE_LIMIT_REMAINING);
       console.log('Downloaded Files:', downloadedFiles.length);
       
       // let downloadData = [];
       // Create actions for downloading each exported PDF
       // for (let i = 0; i < murals.length; i++) {
       //   const mural = murals[i];
       //   const downloadUrl = downloadUrls[i];
         
       //   if (!downloadUrl) {
       //     throw new Error(`Download URL not found for mural ${mural.id}`);
       //   }
   
       //   downloadData.push({ muralId: mural.id, url: downloadUrl });
         
       //   const safeName = mural.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
       //   const fileName = `${safeName}-${mural.id}.pdf`;
       //   const downloadPath = path.join(__dirname, '../../exports', fileName);
         
       //   await downloadFile(downloadUrl, downloadPath);
       //   await delay(5000);
       //   console.log(`Downloaded: ${fileName}`);
       // }
   
  
  } catch (error) {
    console.error('Failed to download mural board:', error);
  }
}

module.exports = { fetchDownloadUrlsToCSV, downloadMuralBoards };

// src/services/muralDownloadService.js
const { fetchAllMurals } = require('../api/mural');
const { getExportIdForMuralToPDF, getExportDownloadUrl } = require('../api/mural');
const { executeWithRateLimit } = require('../api/apiRateLimitUtils');
const { exportDownloadUrls } = require('./exporter');
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
    return exportId;
  });
}

const createFetchDownloadUrlActions = (murals, exportIds) => {
  return murals.map((mural, index) => async () => {
    const { xRateLimitReset, xRateLimitRemaining, exportDownloadUrl } = await getExportDownloadUrl(mural.id, exportIds[index])
    updateRateLimits(xRateLimitReset, xRateLimitRemaining);
    return exportDownloadUrl;
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
    const fetchDownloadUrlActions = createFetchDownloadUrlActions(murals, exportIds);
    const downloadUrls = await executeWithRateLimit(fetchDownloadUrlActions, RATE_LIMIT_RESET, RATE_LIMIT_REMAINING);
    console.log('Download Url:', downloadUrls.length);

    // Some murals may not be able to return download URLs so we need to add them to the CSV to deal with manually
    // we should proceed with the download of the murals that have a download URL

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

    // Export all download URLs at once to a CSV
    // exportDownloadUrls(workspaceId, downloadData);

  } catch (error) {
    console.error('Failed to fetch download URLs and export to CSV:', error);
  }
};

module.exports = { fetchDownloadUrlsToCSV };

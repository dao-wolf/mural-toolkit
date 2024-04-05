// src/services/muralDownloadService.js
const { fetchAllMurals } = require('../api/mural');
const { getExportIdForMuralToPDF, getExportDownloadUrl } = require('../api/mural');
const { executeWithRateLimit } = require('../api/apiRateLimitUtils');
const { downloadFile } = require('../utils/downloadFile');

const CHUNK_SIZE = 10; // Adjust as needed
const DELAY_MS = 1000; // Delay in milliseconds

const exportMuralsToPDFAndFetchDownloadUrls = async (workspaceId) => {
  try {
    const murals = await fetchAllMurals(workspaceId);
    
    // Creating actions for getting export IDs
    const getExportIdActions = murals.map(mural => () => getExportIdForMuralToPDF(mural.boardId));
    // console.log(getExportIdActions);
    // const exportIds = await executeWithRateLimit(getExportIdActions, CHUNK_SIZE, DELAY_MS);
    // console.log('Export IDs:', exportIds);
    
    // Create actions for downloading each exported PDF
    // const downloadActions = murals.map((mural, index) => async () => {
    //   const { downloadUrl } = await getExportDownloadUrl(mural.id, exportIds[index]);
    //   if (downloadUrl) {
    //     // Use the mural name in the filename, ensure it's filesystem-safe
    //     const safeName = mural.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    //     const fileName = `${safeName}-${mural.id}.pdf`;
    //     const downloadPath = path.join(__dirname, '../downloads', fileName);
    //     await downloadFile(downloadUrl, downloadPath);
    //     console.log(`Downloaded: ${fileName}`);
    //     return { muralId: mural.id, fileName, downloadPath };
    //   }
    //   throw new Error(`Download URL not found for mural ${mural.id}`);
    // });

    // Execute download actions with rate limiting
    // const downloadedFiles = await executeWithRateLimit(downloadActions, 10, 1000);
    // Process downloadedFiles as needed
    
  } catch (error) {
    console.error('Failed to export murals and fetch download URLs:', error);
  }
};

module.exports = { exportMuralsToPDFAndFetchDownloadUrls };

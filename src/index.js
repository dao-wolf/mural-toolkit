// src/index.js
const { generateMuralWithRoomInfoCSV } = require('./services/exporter');
const { fetchDownloadUrlsToCSV } = require('./services/muralDownloadService');

const main = async () => {
  try {
    const {QMETRIC_WS_ID} = process.env;
    // await generateMuralWithRoomInfoCSV(QMETRIC_WS_ID);
    await fetchDownloadUrlsToCSV(QMETRIC_WS_ID);
  } catch (err) {
    console.error('Application failed:', err.message);
    console.error('Stack trace:', err.stack);
    // Log any other relevant information here
  }
};

main();
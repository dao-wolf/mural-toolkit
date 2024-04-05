// src/index.js
const { exportMuralsWithRoomInfo } = require('./services/exporter');
const { exportMuralsToPDFAndFetchDownloadUrls } = require('./services/muralDownloadService');

const main = async () => {
  const {QMETRIC_WS_ID} = process.env;
  // await exportMuralsWithRoomInfo(QMETRIC_WS_ID);
  await exportMuralsToPDFAndFetchDownloadUrls(QMETRIC_WS_ID);
};

main().catch(err => {
  console.error('Application failed:', err);
});

// src/index.js
const { exportMuralsWithRoomInfo } = require('./services/exporter');

const main = async () => {
  const {QMETRIC_WS_ID} = process.env;
  await exportMuralsWithRoomInfo(QMETRIC_WS_ID);
};

main().catch(err => {
  console.error('Application failed:', err);
});

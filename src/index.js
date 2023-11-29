// src/index.js
const { exportMuralsWithRoomInfo } = require('./services/exporter');

const main = async () => {
  const workspaceId = process.env.QMETRIC_WS_ID; // Replace with actual Room ID
  await exportMuralsWithRoomInfo(workspaceId);
};

main().catch(err => {
  console.error('Application failed:', err);
});

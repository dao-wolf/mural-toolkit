// src/index.js
const { exportMurals } = require('./services/exporter');

const main = async () => {
  const workspaceId = process.env.QMETRIC_WS_ID; // Replace with actual Room ID
  await exportMurals(workspaceId);
};

main().catch(err => {
  console.error('Application failed:', err);
});

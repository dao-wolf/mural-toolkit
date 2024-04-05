const fs = require('fs');
const path = require('path');
const axios = require('axios');

const downloadFile = async (url, downloadPath) => {
  try {
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(downloadPath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading file:', error.message);
    throw error;
  }
};

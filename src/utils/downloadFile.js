const fs = require('fs');
const axios = require('axios');

const downloadFile = async (url, downloadPath, maxRetries = 3) => {
  try {
    if (!url) {
      console.log('Download URL not found, skipping download. URL:', url);
      return;
    }

    let retryCount = 0;
    let success = false;

    while (retryCount < maxRetries && !success) {
      try {
        const response = await axios({
          method: 'get',
          url: url,
          responseType: 'stream',
        });

        const writer = fs.createWriteStream(downloadPath);

        response.data.pipe(writer);

        if (response.status !== 200) {
          console.log('Unexpected API response:', response.data);
          throw new Error('API did not return a successful status.');
        }

        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        success = true;
      } catch (error) {
        console.error('Error downloading file:', error.message);
        retryCount++;
      }
    }

    if (!success) {
      throw new Error('Failed to download file after maximum retries.');
    }
  } catch (error) {
    console.error('Error downloading file:', error.message);
    throw error;
  }
};

module.exports = { downloadFile };

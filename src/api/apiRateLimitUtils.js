// src/api/apiRateLimitUtils.js
const { delay } = require('../utils/generalUtils');

/**
 * Executes a list of actions with rate limiting.
 * @param {Function[]} actions - An array of functions that return promises.
 * @param {number} chunkSize - The number of actions to execute concurrently.
 * @param {number} delayMs - The delay in milliseconds between each chunk.
 * @returns {Promise<*>} - A promise that resolves with the results of the actions.
 */

const executeWithRateLimit = async (actions, chunkSize, delayMs) => {
    const results = [];
    for (let i = 0; i < actions.length; i += chunkSize) {
        const chunk = actions.slice(i, i + chunkSize);
        const responses = await Promise.all(chunk.map(action => action()));
        results.push(...responses);
        await delay(delayMs);
    }
    return results;
};

module.exports = { executeWithRateLimit };
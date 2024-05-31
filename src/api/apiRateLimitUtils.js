// src/api/apiRateLimitUtils.js
const { delay } = require('../utils/generalUtils');

/**
 * Executes a list of actions with rate limiting.
 * @param {Function[]} actions - An array of functions that return promises.
 * @param {number} chunkSize - The number of actions to execute concurrently.
 * @param {number} delayMs - The delay in milliseconds between each chunk.
 * @returns {Promise<*>} - A promise that resolves with the results of the actions.
 */

// const executeWithRateLimit = async (actions, chunkSize, delayMs) => {
//     const results = [];
//     for (let i = 0; i < actions.length; i += chunkSize) {
//         console.log(`Executing actions ${i} to ${Math.min(i + chunkSize, actions.length)} with delay of ${delayMs} ms.`);
//         const chunk = actions.slice(i, i + chunkSize);
//         const responses = await Promise.all(chunk.map(action => action()));
//         results.push(...responses);
//         await delay(delayMs);
//     }

//     return results;
// };

const executeWithRateLimit = async (actions, rateLimitReset, rateLimitRemaining) => {
    const results = [];
    for (const action of actions) {
        const result = await action();
        results.push(result);
        
        // Calculate the time until reset in seconds
        const currentTime = Math.floor(Date.now() / 1000);
        const secondsUntilReset = rateLimitReset - currentTime;
    
        // Calculate delay duration in milliseconds
        const delayDuration = (secondsUntilReset / rateLimitRemaining) * 1000;
        console.log(`Rate limit reset in ${secondsUntilReset} seconds. Delaying each action by ${delayDuration} ms. \n`);

        await delay(delayDuration);
    }
    return results;
};


module.exports = { executeWithRateLimit };
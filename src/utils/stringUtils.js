const sanitizeString = (str) => {
  return typeof str === 'string' ? `"${str.replace(/"/g, '""')}"` : '""';
};

module.exports = {
  sanitizeString
};
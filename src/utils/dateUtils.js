const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
};

module.exports = {  
  formatDate
};
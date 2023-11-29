const convertToCSV = (data, headers, rowMapper) => {
  if (!Array.isArray(data)) {
    throw new Error('Data for CSV conversion is not an array.');
  }

  if (typeof rowMapper !== 'function') {
    throw new Error('rowMapper must be a function.');
  }

  const headerRow = headers.join(',');
  const rows = data.map(item => rowMapper(item).join(','));

  return [headerRow, ...rows].join('\n');
};


module.exports = {
  convertToCSV
};
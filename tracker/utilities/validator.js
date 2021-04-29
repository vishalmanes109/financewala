// USER AND PROFILE  VALIDATION

const DataCleaning = (data) => {
  return data.replace(/\s+/g, " ").trim();
};

const isValidAmount = (data) => {
  return data > 0;
};

module.exports = {
  DataCleaning,
  isValidAmount,
};

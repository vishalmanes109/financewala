// USER AND PROFILE  VALIDATION

const DataCleaning = (data) => {
  return data.replace(/\s+/g, " ").trim();
};

module.exports = {
  isValidEmail,
  isValidPassword,
  DataCleaning,
};

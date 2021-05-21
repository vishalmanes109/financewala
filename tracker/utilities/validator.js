// USER AND PROFILE  VALIDATION

const cleaning = (data) => {
  return data.replace(/\s+/g, " ").trim();
};

const isValidAmount = (data) => {
  return data > 0;
};

const isValidString = (string) => {
  if (!string) return false;
  return string.length > 0;
};
module.exports = {
  cleaning,
  isValidAmount,
  isValidString,
};

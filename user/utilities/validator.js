const emailRegex =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
const passwordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

// USER AND PROFILE  VALIDATION

const DataCleaning = (data) => {
  return data.replace(/\s+/g, " ").trim();
};
const isValidString = (string) => {
  if (!string) return false;
  return string.length > 0;
};
const isValidEmail = (email) => {
  if (!email) {
    return false;
  }

  if (email.length > 200) {
    return false;
  }

  let valid = emailRegex.test(email);
  if (!valid) {
    return false;
  }
  let parts = email.split("@");
  if (parts[0].length > 64) {
    return false;
  }

  let domainParts = parts[1].split(".");
  if (
    domainParts.some(function (part) {
      return part.length > 63;
    })
  ) {
    return false;
  }
  return true;
};

const isValidPassword = (password) => {
  if (password.match(passwordRegex) == null) {
    return false;
  }
  return true;
};

module.exports = {
  isValidEmail,
  isValidPassword,
  DataCleaning,
  isValidString,
};

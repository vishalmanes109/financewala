const {
  createUser,
  getUser,
  isUserNameAvailable,
  deleteUser,
  updateUser,
  login,
  getUserById,
} = require("./user.service");
// import the hashing functions from bcrypt
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
// import sign method of jsw lib fro generating token on login
const { sign } = require("jsonwebtoken");
const { DataCleaning } = require("../utilities/validator");

module.exports = {
  isUserNameAvailable: async (req, res) => {
    let userName = req.params.username;
    // data cleaning : remove all the white spaces
    userName = DataCleaning(userName);
    // console.log(userName);
    let result = await isUserNameAvailable(userName);
    if (result.name) {
      return res.status(500).json({
        success: 0,
        message: "Error in sql",
      });
    }
    if (result.rowCount > 0) {
      return res.status(200).json({
        success: 1,
        message: "username is not avaliable",
        available: false,
      });
    }
    return res.status(200).json({
      success: 1,
      message: "user name available",
      available: true,
    });
  },
  createUser: async (req, res) => {
    let userData = req.body;
    // console.log(userData);

    // removeing all the white spaces in name
    userData.name = DataCleaning(userData.name);
    const salt = genSaltSync(10);

    userData.password = hashSync(userData.password, salt);

    let result = await createUser(userData);
    // console.log(result.code);
    if (result.code === 23505)
      return res.status(500).json({
        success: 0,
        message: "User already present",
        result,
      });
    if (result.name)
      return res.status(500).json({
        success: 0,
        message: "Error in query",
        result,
      });
    if (result.rowCount > 0)
      return res.status(200).json({
        success: 1,
        message: "user added!",
      });
    return res.status(500).json({
      success: 0,
      message: "error while creating user!",
      result,
    });
  },
  login: async (req, res) => {
    let userData = req.body;
    userName = DataCleaning(userData.name);
    let result = await login(userName);
    if (result.name)
      return res.status(500).json({
        success: 0,
        message: "error in query",
      });
    if (result.rowCount == 0)
      return res.status(200).json({
        success: 0,
        message: "Invalid username / password",
      });
    if (result.rowCount > 0) {
      const validate = await compareSync(
        userData.password,
        result.rows[0].password
      );
      if (validate) {
        result.rows[0].password = undefined;
        const jsontoken = await sign(
          { result: result.rows[0] },
          process.env.JWT_KEY || "secrete",
          {
            expiresIn: "72h",
          }
        );
        return res.status(200).json({
          success: 1,
          message: "login successfully",
          token: jsontoken,
          result: result.rows,
        });
      } else {
        return res.status(500).json({
          success: 0,
          data: "Invalid username / password!",
        });
      }
    }
  },
  getUsers: async (req, res) => {
    let result = await getUser();
    if (result.name)
      return res.status(500).json({
        success: 0,
        message: "Error in query",
        result,
      });
    if (result.rowCount > 0)
      return res.status(200).json({
        success: 1,
        message: "user data!",
        result: result.rows,
      });
    return res.status(500).json({
      success: 0,
      message: "no user found",
      // result,
    });
  },
  getUserById: async (req, res) => {
    let userId = req.params.userid;
    let result = await getUserById(userId);
    if (result.name)
      return res.status(500).json({
        success: 0,
        message: "error in query!",
      });
    if (result.rowCount > 0)
      return res.status(200).json({
        success: 1,
        result: result.rows,
      });
    return res.status(500).json({
      success: 1,
      message: "user not found ",
    });
  },
  deleteUser: async (req, res) => {
    let userId = req.params.id;
    let result = await deleteUser(userId);
    if (result.name)
      return res.status(500).json({
        success: 0,
        message: "Error in query",
      });
    if (result.rowCount > 0)
      return res.status(200).json({
        success: 1,
        message: "user deleted!",
      });
    return res.status(500).json({
      success: 0,
      message: "user does not exist",
    });
  },
  updateUser: async (req, res) => {
    let userData = req.body;
    if (userData.attribute === "password") {
      const salt = genSaltSync(10);

      userData.password = hashSync(userData.password, salt);
    }
    let result = await updateUser(userData);
    if (result.name)
      return res.status(500).json({
        success: 0,
        message: "error is query!",
      });
    if (result.rowCount > 0)
      return res.status(200).json({
        success: 1,
        message: "user updated!",
      });
    return res.status(500).json({
      success: 0,
      message: "user does not exist",
    });
  },
};
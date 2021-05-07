const { saveDataInDB } = require("./eventbus.service");

module.exports = {
  addMetaData: async (req, res) => {
    // send data to the stats
    let metadata = req.body;
    console.log("metadata: from controller", metadata);

    let result = await saveDataInDB(metadata);
    if (result.error) {
      return res.status(500).json({
        success: 0,
        message: "insertion failed!",
      });
    } else {
      return res.status(200).json({
        success: 1,
        message: "insertion successful",
        res,
      });
    }
  },
};

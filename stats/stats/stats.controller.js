const {
  addTransacionMetaData,
  deleteTransacionMetaData,
  updateTransacionMetaData,
  getPieChart,
  getHeatMap,
  getBarGraph,
  addBulkTransMetaData,
  getLineGraph,
} = require("./stats.service");

module.exports = {
  manageMissedData: async (data) => {
    // console.log("irssn stats :", dataList);

    // sql query wants id parameter but service send us transaction_id so add id attribute to data
    let result = null;

    if (data.body.trans_type === "ADD") {
      // add missing data
      console.log("adding");
      result = await addTransacionMetaData(data.body);
      console.log(result);
    } else if (data.body.trans_type === "UPDATE") {
      console.log("updating");
      result = await updateTransacionMetaData(data.body);
      console.log(result);
    } else if (data.body.trans_type === "DELETE") {
      // delete bulk meta data
      console.log("deleting");

      result = await deleteTransacionMetaData(data.transaction_id);
      console.log(result);
    }

    if (result && result.rowCount > 0) {
      return {
        _id: data._id,
        transaction_id: data.body.id || data.body.transaction_id,
        trans_type: data.body.trans_type,
        success: 1,
      };
    } else
      return {
        _id: data._id,
        transaction_id: data.body.id || data.body.transaction_id,
        trans_type: data.body.trans_type,
        success: 0,
      };
  },
  addTransactionMetaData: async (req, res) => {
    let transactionMetaData = req.body;
    console.log("in stats :", transactionMetaData);

    // return res.status(200).json({ success: 1 });
    try {
      let result = await addTransacionMetaData(transactionMetaData);
      if (result.name) {
        return res.status(500).json({
          success: 0,
          message: "Error in query",
        });
      }
      if (result.rowCount > 0) {
        console.log("metadata added in stats ");
        return res.status(200).json({
          success: 1,
          message: "Meta data added!",
        });
      }
      return res.status(400).json({
        success: 0,
        message: "Invalid data",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Server error",
        err,
      });
    }
  },
  deleteTransactionMetaData: async (req, res) => {
    let { transaction_id } = req.params;
    console.log("from stats controller deleting data of", transaction_id);

    // return res.status(200).json({ success: 1 });
    try {
      let result = await deleteTransacionMetaData(transaction_id);
      if (result.name) {
        return res.status(500).json({
          success: 0,
          message: "Error in query",
        });
      }
      if (result.rowCount > 0) {
        console.log("metadata deleted in stats");
        return res.status(200).json({
          success: 1,
          message: "Meta data deleted!",
        });
      }
      return res.status(400).json({
        success: 0,
        message: "Invalid transaction_id",
      });
    } catch (err) {
      return res.status(500).json({
        success: 0,
        message: "Server error",
        err,
      });
    }
  },
  updateTransactionMetaData: async (req, res) => {
    let transactionMetaData = req.body;
    console.log(transactionMetaData);

    // return res.status(200).json({ success: 1 });
    try {
      let result = await updateTransacionMetaData(transactionMetaData);
      if (result.name) {
        return res.status(500).json({
          success: 0,
          message: "Error in query",
        });
      }
      if (result.rowCount > 0) {
        console.log("meatda updated in stats");
        return res.status(200).json({
          success: 1,
          message: "Meta data updated!",
        });
      }
      return res.status(400).json({
        success: 0,
        message: "Invalid data",
      });
    } catch (err) {
      return res.status(500).json({
        success: 0,
        message: "Server Error",
        err,
      });
    }
  },
  getDifferentCharts: async (req, res) => {
    let { user_id, chart, filter } = req.query;
    // let { chart } = req.body.params;
    console.log(user_id, chart, filter);
    let result;
    try {
      if (chart === "pie") result = await getPieChart(user_id, filter);
      else if (chart === "heatmap") result = await getHeatMap(user_id, filter);
      else if (chart === "bar") result = await getBarGraph(user_id, filter);
      else if (chart === "line") result = await getLineGraph(user_id, filter);
      else
        return res
          .status(401)
          .json({ success: 1, message: "please pass valid graph" });

      if (result.name) {
        return res.status(500).json({
          success: 0,
          message: "Error in query",
        });
      }
      if (result.rowCount > 0) {
        return res.status(200).json({
          success: 1,
          result: result.rows,
        });
      }
      return res.status(401).json({
        success: 0,
        message: "Invalid user_id",
      });
    } catch (err) {
      return res.status(500).json({ success: 0, message: "server error" });
    }
  },
};

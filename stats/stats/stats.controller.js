const {
  addTransacionMetaData,
  deleteTransacionMetaData,
  updateTransacionMetaData,
  getPieChart,
  getHeatMap,
  getBarGraph,
} = require("./stats.service");

module.exports = {
  addMissedData: async (dataList) => {
    console.log("in stats :", dataList);

    return 1;
    // let result = await addTransacionMetaData(transactionMetaData);
    // if (result.name) {
    //   return res.status(500).json({
    //     success: 0,
    //     message: "Error in query",
    //   });
    // }
    // if (result.rowCount > 0) {
    //   return res.status(200).json({
    //     success: 1,
    //     message: "Meta data added!",
    //   });

    // }
    // return res.status(400).json({
    //   success: 0,
    //   message: "Invalid data",
    // });
  },

  addTransactionMetaData: async (req, res) => {
    let transactionMetaData = req.body;
    console.log("in stats :", transactionMetaData);

    return res.status(200).json({ success: 1 });
    // let result = await addTransacionMetaData(transactionMetaData);
    // if (result.name) {
    //   return res.status(500).json({
    //     success: 0,
    //     message: "Error in query",
    //   });
    // }
    // if (result.rowCount > 0) {
    //   return res.status(200).json({
    //     success: 1,
    //     message: "Meta data added!",
    //   });

    // }
    // return res.status(400).json({
    //   success: 0,
    //   message: "Invalid data",
    // });
  },

  deleteTransactionMetaData: async (req, res) => {
    let { transaction_metadata_id } = req.body.params;
    console.log(transaction_metadata_id);

    return res.status(200).json({ success: 1 });

    // let result = await deleteTransacionMetaData(transaction_metadata_id);
    // if (result.name) {
    //   return res.status(500).json({
    //     success: 0,
    //     message: "Error in query",
    //   });
    // }
    // if (result.rowCount > 0) {
    //   return res.status(200).json({
    //     success: 1,
    //     message: "Meta data deleted!",
    //   });
    // }
    // return res.status(400).json({
    //   success: 0,
    //   message: "Invalid transaction_metadata_id",
    // });
  },
  updateTransactionMetaData: async (req, res) => {
    let transactionMetaData = req.body;
    console.log(transactionMetaData);

    return res.status(200).json({ success: 1 });

    // let result = await updateTransacionMetaData(transactionMetaData);
    // if (result.name) {
    //   return res.status(500).json({
    //     success: 0,
    //     message: "Error in query",
    //   });
    // }
    // if (result.rowCount > 0) {
    //   return res.status(200).json({
    //     success: 1,
    //     message: "Meta data updated!",
    //   });
    // }
    // return res.status(400).json({
    //   success: 0,
    //   message: "Invalid data",
    // });
  },

  getDifferentCharts: async (req, res) => {
    let { user_id } = req.body.params;
    let { chart } = req.body.params;
    let result;
    if (chart === "pie") result = await getPieChart(user_id);
    else if (result === "heatmap") result = await getHeatMap(user_id);
    else if (result === "bar") result = await getBarGraph(user_id);

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
    return res.status(400).json({
      success: 0,
      message: "Invalid user_id",
    });
  },
};

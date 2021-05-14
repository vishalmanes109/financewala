const {
  addTransacionMetaData,
  deleteTransacionMetaData,
  updateTransacionMetaData,
  getPieChart,
  getHeatMap,
  getBarGraph,
  addBulkTransMetaData,
} = require("./stats.service");

module.exports = {
  manageMissedData: async (dataList) => {
    console.log("in stats :", dataList);

    let resultArray = [];
    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i].body.trans_type === "DELETE") {
        // delete bulk meta data
        // await resultArray.push(await addBulkTransMetaData(dataList[i]));
      } else if (dataList[i].body.trans_type === "ADD") {
        // add missing data
        // await resultArray.push(await addBulkTransMetaData(dataList[i]));
      } else if (dataList[i].body.trans_type === "UPDATE") {
        // add missing data
        // await resultArray.push(await addBulkTransMetaData(dataList[i]));
      }
    }
    console.log("resultaArray", resultArray);
    if (resultArray.includes(0)) return 0;
    else return 1;
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

    return res.status(200).json({ success: 1 });
    // try {
    //   let result = await deleteTransacionMetaData(transaction_id);
    //   if (result.name) {
    //     return res.status(500).json({
    //       success: 0,
    //       message: "Error in query",
    //     });
    //   }
    //   if (result.rowCount > 0) {
    //     return res.status(200).json({
    //       success: 1,
    //       message: "Meta data deleted!",
    //     });
    //   }
    //   return res.status(400).json({
    //     success: 0,
    //     message: "Invalid transaction_id",
    //   });
    // } catch (err) {
    //   return res.status(500).json({
    //     success: 0,
    //     message: "Server error",
    //     err,
    //   });
    // }
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
    } catch (err) {
      return res.status(500).json({ success: 0, message: "server error" });
    }
  },
};

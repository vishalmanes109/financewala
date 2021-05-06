module.exports = {
  addMetaData: async (req, res) => {
    // send data to the stats
    let metadata = req.body;
    console.log("metadata: from controller", metadata);
    // fetch.post();
    return res.json({ id: 1 });
  },
};

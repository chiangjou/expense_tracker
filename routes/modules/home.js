const express = require("express")
const router = express.Router()
const Record = require("../../models/record")

// Home
router.get("/", (req, res) => {
  const userId = req.user._id
  Record.find({ userId })
    .lean()
    .sort({ _id: "asc" })   // 根據 _id 升冪排序
    .then(records => res.render("index", { records }))
    .catch(error => console.error(error))
})

module.exports = router
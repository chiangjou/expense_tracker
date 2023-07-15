const express = require("express")
const router = express.Router()
const Record = require("../../models/record")
const moment = require("moment")
const record = require("../../models/record")

// Home
router.get("/", async (req, res) => {
  const userId = req.user._id

  try {
    const records = await Record.find({ userId }).populate("categoryId").lean()
    const data = records.map(record => {
      const { _id, name, date, amount } = record

      // 日期格式轉換
      const formatDate = moment.utc(date).format("YYYY/MM/DD")
      return {
        _id,
        name,
        date: formatDate,
        amount,
        icon: record.categoryId.icon
      }
    })

    // 計算總金額
    const totalAmount = data.reduce(((accumulator, item) => {
      return accumulator + item.amount
    }), 0)

    res.render("index", { records: data, totalAmount })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
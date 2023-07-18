const express = require("express")
const router = express.Router()
const Record = require("../../models/record")
const Category = require("../../models/category")
const category = require("../../models/category")

router.get("/", (req, res) => {
  const userId = req.user._id
  Category.find()
    .lean()
    .then(categories => {
      Record.find({ userId })
        // populate 要以使用 Schema.Types.ObjectId 的欄位名稱
        .populate("categoryId")
        .lean()
        .sort({ date: "desc" })
        .then(records => {
          let totalAmount = 0

          records.map((record) => {
            // 計算花費總額
            totalAmount += record.amount
          })
          res.render("index", { categories, records, totalAmount })
        })
    })
})


router.post("/", (req, res) => {
  const userId = req.user._id
  const categoryID = req.body.categoryId

  Record.find({ userId, categoryId: categoryID })
    .populate("categoryId")
    .lean()
    .sort({ date: "desc" })
    .then((records) => {
      let totalAmount = 0;

      records.forEach((record) => {
        totalAmount += record.amount
        
        if (record.categoryId._id.toString() === categoryID) {
          record.categoryId["isChoosed"] = true
        } else {
          record.categoryId["isChoosed"] = false
        }
      })

      res.render("index", { records, totalAmount })
    })
    .catch((error) => {console.error(error)})
});

module.exports = router
const express = require("express")
const router = express.Router()
const Record = require("../../models/record")
const Category = require("../../models/category")

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

          records.forEach(record => {
            totalAmount += record.amount
          })
          res.render("index", { categories, records, totalAmount })
        })
    })
})

router.post("/", (req, res) => {
  const userId = req.user._id
  const categoryName = req.body.categoryId

  if (!categoryName) {
    return res.redirect("/")
  }

  Record.find({ userId })
    .populate({
      path: "categoryId",
      match: { name: categoryName },   // 使用類別名稱來查詢相應的記錄
      select: "name",   // 只選擇類別的名稱，避免其他數據的回傳
    })
    .lean()
    .sort({ date: "desc" })
    .then(records => {
      let totalAmount = 0;
      records = records.filter(record => record.categoryId !== null);   // 過濾掉未匹配到類別的記錄
      records.forEach(record => {
        totalAmount += record.amount;
        record.categoryId["isChoosed"] = true;
      });

      Category.find()
        .lean()
        .then(categories => {
          res.render("index", { categories, records, totalAmount })
        })
    })
    .catch(error => {console.error(error)})
});


      module.exports = router
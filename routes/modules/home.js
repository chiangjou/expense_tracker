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

          records.map((record) => {
            // 計算花費總額
            totalAmount += record.amount
          })
          res.render("index", { categories, records, totalAmount })
        })
    })
})

router.post("/", (req, res) => {
  // 取出 Select Menu 的值
  const { categoryName } = req.body
  const userId = req.user._id

  // 若沒有選取類別，跳轉回首頁
  if (!categoryName) {
    res.redirect("/")
    // 有選取類別 
  } else {
    Category.find()
      .lean()
      .then(categories => {
        // 將 Select Menu 的 categoryName 給categoryId
        let categoryId = ""

        categories.forEach(category => {
          if (category.name === categoryName) {
            categoryId = category._id
            category["isChoosed"] = true
          }
        })

        Record.find({ categoryId, userId })
          .populate("categoryId")
          .lean()
          .sort({ date: "desc" })
          .then(records => {
            let totalAmount = 0

            records.map((record) => {

              // 計算花費總額
              totalAmount += record.amount
            })
           
            res.render("index", { categories, records, totalAmount, categoryName })
          })
          .catch(error => console.log(error))
      })
      .catch(error => console.log(error))
  }
})

module.exports = router
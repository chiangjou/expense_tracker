const express = require("express")
const router = express.Router()
const Record = require("../../models/record")
const Category = require("../../models/category")

router.get("/", (req, res) => {
  const userId = req.user._id
  // 找出 Category 的資料，存到 categories
  Category.find()
    .lean()
    .then(categories => {
      // 找出 Record 的資料，存到records
      Record.find({ userId })
        // populate 要以使用 Schema.Types.ObjectId 的欄位名稱
        .populate("categoryId")
        .lean()
        .sort({ _id: "desc" })
        .then(records => {
          let totalAmount = 0

          records.map((record, index) => {
            // 判斷該項為奇偶數，並新增屬性到 records
            if (index % 2) {
              records[index]["isEven"] = false
            } else {
              records[index]["isEven"] = true
            }

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
    // 找出 Category 的資料，存到 categories
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

        // 找出 Record 的資料，結果存到 records
        Record.find({ categoryId, userId })
          // populate 要以使用 Schema.Types.ObjectId 的欄位名稱
          .populate("categoryId")
          .lean()
          .sort({ _id: "desc" })
          .then(records => {
            let totalAmount = 0
            // 判斷該項為奇偶數, 並新增屬性到 records
            records.map((record, index) => {
              if (index % 2) {
                records[index]["isEven"] = false
              } else {
                records[index]["isEven"] = true
              }

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
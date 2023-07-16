const express = require("express")
const router = express.Router()
const Record = require("../../models/record")
const Category = require("../../models/category")

// 函式庫
const utilities = {
  ConvertToSlashDate(dashDate) {
    return new Date(dashDate).toLocaleDateString("zh-TW")
  },
  ConvertToDashDate(slashDate) {
    // 1. 取出日期，並將年月日以字串格式分開存入陣列，並以padStart函數補0
    const date = new Date(slashDate)
    const dateArray = [date.getFullYear().toString(10), (date.getMonth() + 1).toString(10).padStart(2, "0"), date.getDate().toString(10).padStart(2, "0")]
    // 2. 重組成字串
    return dateArray.join("-")
  }
}

// Create
router.get("/new", (req, res) => {
  // 找出 Category 的資料，結果存到 categories
  Category.find()
    .lean()
    .then(categories => {
      res.render("new", { categories })
    })
})

router.post("/", (req, res) => {
  const userId = req.user._id
  const { name, date, categoryName, amount } = req.body
  
  // 將日期從 YYYY-MM-DD 轉成 YYYY/MM/DD
  let slashDate = utilities.ConvertToSlashDate(date)

  Category.findOne({ name: categoryName })
    .lean()
    .then(category => {
      // 從 Category 取得 categoryId，再新增資料
      let categoryId = category._id

      Record.create({
        name,
        date: slashDate,
        amount,
        userId,
        categoryId
      })
    })
    .then(() => res.redirect("/"))
    .catch(error => console.log(error))
})

// Update
router.get("/:id", (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  Category.find()
    .lean()
    .then(categories => {
      Record.findOne({ _id, userId })
        .populate("categoryId")
        .lean()
        .then(record => {
          // 將日期從 YYYY-MM-DD
          dashDate = utilities.ConvertToDashDate(record.date)

          categories.map((category, index) => {
            if (category.name === record.categoryId.name) {
              categories[index]["isChoosed"] = true
            }
          })
          res.render("edit", { categories, record, dashDate })
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

router.put("/:id", (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, date, categoryName, amount } = req.body
  let slashDate = utilities.ConvertToSlashDate(date)

  Category.findOne({ name: categoryName })
    .then(category => {
      Record.findOne({ _id, userId })
        .then(record => {
          record.name = name
          record.date = slashDate
          record.amount = amount
          record.categoryId = category._id

          return record.save()
        })
        .then(() => res.redirect("/"))
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

// Delete
router.delete("/:id", (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  
  Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect("/"))
    .catch(error => console.log(error))
})

module.exports = router
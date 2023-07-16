const Category = require("../category")
const db = require("../../config/mongoose")
const seedCategory = require("./category.json")

db.once('open', () => {
  Category.find()
    .then(categories => {
      if (!categories.length) {
        Promise.all(
          seedCategory.map(item => {
            return Category.create({
              name: item.name,
              icon: item.icon
            })
          }))
          .then(() => {
            console.log('Category Seeder is executed')
            process.exit()
          })
      } else {
        console.log('Category Seeder is executed.')
        process.exit()
      }
    })
})
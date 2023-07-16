const Category = require("../category")
const db = require("../../config/mongoose")
const seedCategory = require("./category.json")

db.once("open", () => {
  Category
    .create(seedCategory)
    .then(() => {
      console.log("Category seeder is done!")
      process.exit()
    })
    .catch(error => console.error(error))
})




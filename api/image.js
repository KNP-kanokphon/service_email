const fs = require("fs")
const router = require("express").Router()

router.get("/:id/:type", (req, res) => {
  const id = req.params.id
  const type = req.params.type
  console.log(`${id}.${type}`)
  fs.readFile(`./image/general/${id}.${type}`, function (err, data) {
    if (err) throw err
    else {
      res.writeHead(200, { "Content-Type": "image/jpeg" })
      res.end(data)
    }
  })
})

module.exports = router

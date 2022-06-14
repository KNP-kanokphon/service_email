const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const PORT = 5000
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost')
  res.header('Access-Control-Allow-Methods','POST, GET, PUT, PATCH, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers','Content-Type, Option, Authorization')
  next()
})
app.set('port', process.env.PORT || PORT);

app.get("/test", function (req, res) {
  res.send("test")
})
app.use("/backend/api/email",require("./api/sendEmail"))
app.use("/backend/api/image", require("./api/image"))

app.listen(app.get('port'),() => console.log(`Running At Port : ${PORT}`));
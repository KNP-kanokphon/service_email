const dateFormat = require('date-and-time')
const router = require("express").Router()
const nodemailer = require('nodemailer');
const template = require('../template/template_new');
const config = require('../config/index');
const { createConnection } = require("mysql");
const HttpPost = require('../function/functionGet');
const generator = require('generate-password');
const fs = require('fs');


const now = new Date();
const ipserver = '192.168.31.24';
const host = `http://${ipserver}/dblock/pages/sms/export/ExcelSendemail`;

router.post("/register", async (req, res) => {
  const D1 = dateFormat.format(now, "YYYY-MM-DD");
  const username = req.body.data.username
  const password = req.body.data.password
  const to = req.body.data.sendto;
  const cc = req.body.data.sendcc;

  const sendcc = [];
  for(a = 0; a < cc.length; a++){
    sendcc.push(req.body.data.sendcc[a].to)
  }
  
  const datetime = dateFormat.format(now, "dddd, MMMM,DD h:MM:ss ");
  const detailSubjact = req.body.data.detail.subjact;
  const detail = {
    'server': req.body.data.detail.server,
    'location': req.body.data.detail.location
  }
  if (username === 'admin' && password === '123') {
    const transporter = nodemailer.createTransport(config);
    for (i = 0; i < Object.keys(to).length; i++) {

      const sendto = req.body.data.sendto[i].to;
      const FileName = await HttpPost.HttpPost(host + "/blocklist_report.php?date=" + D1.toString("yyyy-MM-dd") + "&&email=" + sendto);
      FileName2 = FileName.trim()
      FileName2 = FileName.replace('.xlsx', "");

      const Dowloadfile = await HttpPost.Dowloadfile(`${host}/Excelfile/${FileName2}.xlsx`, `${FileName2}.xlsx`);
      const passwordZip = await generator.generate({
        length: 10,
        numbers: true
      });
      if (Dowloadfile) {
        const zipfile = await HttpPost.addFilesFromDirectoryToZip(`${FileName2}`, passwordZip);
        console.log(zipfile)
        if(zipfile === true){
          const Deletefile = await HttpPost.HttpPost(`${host}/blocklist_report.php?filename=${FileName2}`);
          console.log(Deletefile)
        }
      }
      const sendcc = req.body.data.sendcc[i].to;
      const mailOptions = await {
        from: 'osdintra@osd.co.th',
        to: sendto,
        cc: sendcc.toString(),
        send: datetime,
        subject: detailSubjact,
        attachments: [
          {
            filename: `${FileName2}.zip`,
            path: `./zipfile/${FileName2}.zip`
          }
        ],
        html: template._bodyhtmlfrom(detail,passwordZip)
      };

      await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.status(404)
        } else {
          console.log('Email sent: ' + info.response);
          res.send(200).send('Email sent: ' + info.response)
        }
      });
    }
  } else {
    res.status(401).json({ message: 'Invalid Authentication Credentials' });
  }

})

module.exports = router

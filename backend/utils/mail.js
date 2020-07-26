const nodemailer = require("nodemailer")
const moment = require('moment')

const sendMail = async (email, content) => {
  try {
  var transporter =  nodemailer.createTransport({ // config mail server
    service: 'Gmail',
    auth: {
      user: 'stagingimjet@gmail.com',
      pass: 'Imjet@19'
    }
  });
  var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
    from: '37Bank',
    to: email,
    subject: '37Bank Email ' + moment(),
    text: content,
  }
  transporter.sendMail(mainOptions, function(err, info){
    if (err) {
      console.log(err);
    } else {
      console.log('Message sent: ' +  info.response);
    }
  });
  } catch (error) {
    throw error
  }
}


module.exports = {
  SendMail: sendMail
}

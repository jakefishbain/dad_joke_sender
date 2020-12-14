const nodemailer = require('nodemailer');
const axios = require('axios');


const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  secure: true,
  port: 465,
  auth: {
    user: process.env.user,
    pass: process.env.password
  },
});

const mailOptions = {
  from: 'jake@jakefishbain.com',
  bcc: process.env.recipients,
  subject: 'Dad Joke of the Day 👴🏼'
};

const getJoke = async () => {
  res = await axios.get('https://icanhazdadjoke.com/', { headers: {'Accept': 'application/json'}});
  return res.data.joke + "\n\n 🐟";
}

const sendIt = async () => {
  transporter.sendMail({text: await getJoke(), ...mailOptions}, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

sendIt()

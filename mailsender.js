const nodemailer = require('nodemailer');

function checkviamail(email){
  const min = 1000;
  const max = 9999; 
  const otp = Math.floor(Math.random() * (max - min + 1) + min);

    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: 'anonymous.me.sde@gmail.com',
        pass: 'dufg dgmp cgyf vcqv'
      }
    });
    console.log(email)
    // Email data
    const mailOptions = {
      from: 'anonymous.me.sde@gmail.com', 
      to: `${email}`, 
      subject: 'Login OTP',
      text: `Your OTP for tourshare is : ${otp}`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    return otp
}

module.exports = checkviamail;



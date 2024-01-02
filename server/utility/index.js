
const crypto = require('crypto');

function createHMAC(random_otp) {
    const otpString = String(random_otp);
    return crypto.createHmac('sha256', process.env.SESSION).update(otpString).digest('hex');
  }

  module.exports=createHMAC
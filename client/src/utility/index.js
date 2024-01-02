

const CryptoJS = require("crypto-js");



export function createHMAC(random_otp) {
  const otpString = String(random_otp);
  const secretKey = process.env.REACT_APP_SESSION; // Access your secret key from environment variable

  const hmac = CryptoJS.HmacSHA256(otpString, secretKey);
  return hmac.toString(CryptoJS.enc.Hex); // Convert to hex string
}

//require('dotenv').config();
require('dotenv').config()
// import 'dotenv/config'

// configs 변수
const config = {
    port: process.env.PORT,
    mongoURI: process.env.MOGO_URI,
    signKey: process.env.COOKIE_SIGN_KEY
  };


export default  config;
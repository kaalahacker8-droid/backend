const axios = require("axios");

const sendOTP = async (mobile, otp) => {
  const formattedMobile = `91${mobile}`;
  if (process.env.NODE_ENV === "development") {
    console.log(`DEV MODE - OTP for ${mobile}: ${otp}`);
    return { success: true };
  }

  try {
    const url = `https://api.msg91.com/api/v5/otp?mobile=${formattedMobile}&authkey=${process.env.MSG91_AUTH_KEY}&otp=${otp}`;
    const response = await axios.post(url, {}, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("MSG91 Response:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("MSG91 Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

module.exports = sendOTP;

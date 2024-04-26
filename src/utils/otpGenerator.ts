import otpGen from 'otp-gen-agent'

const generateOTP = async () => {
  const otp = await otpGen({length: 4});
  return otp;
}

export default generateOTP;
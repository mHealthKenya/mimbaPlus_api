import * as AfricasTalking from 'africastalking';

export interface SMSProps {
  phoneNumber: string;
  message: string;
}

const credentials = {
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
};

const AT = new AfricasTalking(credentials);

const sms = AT.SMS;

const sendMessage = async ({ phoneNumber, message }: SMSProps) => {
  const options = {
    to: [phoneNumber],
    message,
    from: '33861',
  };

  try {
    console.log('called');
    const sent = await sms.send(options);
    return sent.SMSMessageData;
  } catch (error) {
    console.log('error');
    const statusCode = error?.response?.status;
    const status = error?.response?.statusText;

    return {
      statusCode,
      status,
    };
  }
};

export default sendMessage;

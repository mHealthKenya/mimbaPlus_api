import * as AfricasTalking from 'africastalking';

interface SMSProps {
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
    const sent = await sms.send(options);

    // console.log('sent', sent.SMSMessageData);

    return sent.SMSMessageData;
  } catch (error) {
    console.log('error', error);
  }
};

export default sendMessage;

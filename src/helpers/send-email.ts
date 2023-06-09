import * as sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export class SendEmail {
  constructor(
    private readonly email: string,
    private readonly subject: string,
    private readonly text: string,
    private readonly html?: string,
  ) {}

  async send() {
    const msg = {
      to: this.email, // Change to your recipient
      from: process.env.EMAIL, // Change to your verified sender
      subject: this.subject,
      text: this.text,
      html: this.html,
    };

    await sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

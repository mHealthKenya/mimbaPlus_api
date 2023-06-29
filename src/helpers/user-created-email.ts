import { UserCreatedEvent } from '../users/events/user-created-event';

export const emailBody = (data: UserCreatedEvent) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Welcome to M+!</title>
    <style>
      /* CSS styles */
      body {
        margin: 0;
        padding: 0;
        background-color: #f2f2f2;
      }
      table {
        border-collapse: collapse;
        margin: auto;
      }
      td {
        vertical-align: top;
      }
      h1 {
        font-size: 28px;
        font-weight: bold;
        margin: 0;
        padding: 0;
        text-align: center;
      }
      p {
        font-size: 16px;
        line-height: 1.5;
        margin: 0 0 20px 0;
        padding: 0;
      }
      a {
        color: #0072C6;
        text-decoration: none;
      }
       .button {
        background-color: #0072C6;
        border: none;
        border-radius: 4px;
        color: #ffffff;
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        margin-top: 20px;
        padding: 12px 24px;
        text-align: center;
        text-decoration: none;
        color:#ffffff;
        width: auto;
       }
    </style>
  </head>
  <body>
    <table cellpadding="0" cellspacing="0" width="600">
      <tr>
        <td style="background-color: #ffffff; border-radius: 4px;">
          <!-- Header -->
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td colspan="2" height="20"></td>
            </tr>
            <tr>
              <td colspan="2" align="center">
                <h1>Welcome to M+</h1>
              </td>
            </tr>
            <tr>
              <td colspan="2" height="20"></td>
            </tr>
          </table>
          
          <!-- Body -->
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td colspan="2" height="20"></td>
            </tr>
            <tr>
              <td colspan="2" align="left">
                <p>Hello</p>
                <p>You have been successfully registered to M+! We're excited to have you on board and can't wait to work with you.</p>
                <p>If you have any questions or need assistance getting started, don't hesitate to reach out to us. Our team is always happy to help.</p>

                <p> Your auto generated password is <i>${data.message}</i>. You can continue using this password or change it by clicking on the forgot password link in the login page</p>
                
                <p>Best regards,</p>
                <p><b>World Friends</b> team</p>
              </td>
              
            </tr>
            <tr>
              <td colspan="2" height="20"></td>
            </tr>
          </table>
          
          <!-- Footer -->
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td colspan="2" height="20"></td>
            </tr>
            <tr>
              <td colspan="2" align="center">
                <p>Follow us on social media:</p>
                <a href="[insert link to social media page]">Facebook</a> | <a href="[insert link to social media page]">Twitter</a> | <a href="[insert link to social media page]">Instagram</a>
              </td>
            </tr>
            <tr>
              <td colspan="2" height="20"></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

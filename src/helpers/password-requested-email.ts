import { PasswordResetRequestEvent } from '../users/events/password-requested.event';

export const emailBodyPass = (
  data: PasswordResetRequestEvent,
) => `<!DOCTYPE html>
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
                <h1>Password Reset</h1>
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
                <p>We have received a request to reset the password associated with your account at mPlus</p>
                <p>Your password reset code is <i>${data.code}</i><p/>
                <p>If you did not request a password reset, you can safely ignore this email</p>
                
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

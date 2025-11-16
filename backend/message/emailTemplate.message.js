export const verificationEmailTemplate = (name, verificationCode) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f7;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        h2 {
          color: #333333;
        }
        p {
          color: #555555;
          line-height: 1.5;
        }
        .code {
          display: inline-block;
          padding: 10px 20px;
          margin: 20px 0;
          font-size: 20px;
          font-weight: bold;
          background-color: #f0f0f0;
          border-radius: 6px;
          letter-spacing: 2px;
        }
        .footer {
          font-size: 12px;
          color: #999999;
          margin-top: 20px;
        }
        .button {
          display: inline-block;
          text-decoration: none;
          background-color: #4CAF50;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          margin-top: 20px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Hello ${name},</h2>
        <p>Welcome to <strong>PingMe</strong>! Please use the following code to verify your email address:</p>
        <div class="code">${verificationCode}</div>
        <p>If the above code doesn’t work, click the button below to verify directly:</p>
        <a href="https://your-app.com/verify?code=${verificationCode}" class="button">Verify Email</a>
        <p class="footer">If you did not sign up for PingMe, please ignore this email.</p>
      </div>
    </body>
    </html>
    `;
};

export const welcomeEmailTemplate = (name) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to PingMe</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f7;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        h2 {
          color: #333333;
        }
        p {
          color: #555555;
          line-height: 1.5;
        }
        .button {
          display: inline-block;
          text-decoration: none;
          background-color: #4CAF50;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          margin-top: 20px;
          font-weight: bold;
        }
        .footer {
          font-size: 12px;
          color: #999999;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Welcome, ${name}!</h2>
        <p>We’re thrilled to have you on <strong>PingMe</strong>. Your email has been successfully verified.</p>
        <p>Start exploring our features and enjoy connecting with others!</p>
        <a href="https://your-app.com/login" class="button">Go to Dashboard</a>
        <p class="footer">If you did not sign up for PingMe, please ignore this email.</p>
      </div>
    </body>
    </html>
    `;
};

export const loginEmailTemplate = (name) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Notification</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
      h2 { color: #333; }
      p { color: #555; line-height: 1.5; }
      .button { display: inline-block; text-decoration: none; background-color: #4CAF50; color: white; padding: 12px 24px; border-radius: 6px; margin-top: 20px; font-weight: bold; }
      .footer { font-size: 12px; color: #999; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Hello ${name},</h2>
      <p>You have successfully logged in to <strong>PingMe</strong>.</p>
      <a href="https://your-app.com/login" class="button">Go to Dashboard</a>
      <p class="footer">If you did not log in, please secure your account immediately.</p>
    </div>
  </body>
  </html>
  `;
};

export const forgotPasswordEmailTemplate = (name, verificationCode) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
      h2 { color: #333; }
      p { color: #555; line-height: 1.5; }
      .code { display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 20px; font-weight: bold; background-color: #f0f0f0; border-radius: 6px; letter-spacing: 2px; }
      .button { display: inline-block; text-decoration: none; background-color: #4CAF50; color: white; padding: 12px 24px; border-radius: 6px; margin-top: 20px; font-weight: bold; }
      .footer { font-size: 12px; color: #999; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Hello ${name},</h2>
      <p>We received a request to reset your password for <strong>PingMe</strong>.</p>
      <p>Use the verification code below to reset your password:</p>
      <div class="code">${verificationCode}</div>
      <p>If the above code doesn’t work, click the button below to reset directly:</p>
      <p class="footer">If you did not request a password reset, please ignore this email.</p>
    </div>
  </body>
  </html>
  `;
};

export const passwordResetConfirmationTemplate = (name) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successful</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
      h2 { color: #333; }
      p { color: #555; line-height: 1.5; }
      .button { display: inline-block; text-decoration: none; background-color: #4CAF50; color: white; padding: 12px 24px; border-radius: 6px; margin-top: 20px; font-weight: bold; }
      .footer { font-size: 12px; color: #999; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Hello ${name},</h2>
      <p>Your password for <strong>PingMe</strong> has been successfully reset.</p>
      <p>You can now log in using your new password.</p>
      <a href="https://your-app.com/login" class="button">Go to Login</a>
      <p class="footer">If you did not perform this action, please secure your account immediately.</p>
    </div>
  </body>
  </html>
  `;
};

export const deleteAccountEmailTemplate = (name) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Deleted</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
      h2 { color: #333; }
      p { color: #555; line-height: 1.5; }
      .footer { font-size: 12px; color: #999; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Hello ${name},</h2>
      <p>Your account with <strong>PingMe</strong> has been successfully deleted.</p>
      <p>We’re sorry to see you go. If this was a mistake or you wish to return, you can always sign up again.</p>
      <p class="footer">This is an automated message. Please do not reply.</p>
    </div>
  </body>
  </html>
  `;
};

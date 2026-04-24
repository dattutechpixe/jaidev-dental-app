const sitename = process.env.SITE_NAME;
// console.log(sitename);

exports.conformSignup = (username, securityKey, email) => {
  return `<!DOCTYPE html>
  <html>
  <head>
      <title>Welcome to ${sitename}</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .email-container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              text-align: center;
          }
          .header {
              font-size: 24px;
              font-weight: bold;
              color: #333;
              margin-bottom: 20px;
          }
          .content {
              font-size: 16px;
              color: #555;
              line-height: 1.6;
              margin-bottom: 20px;
          }
          .verify-button {
              display: inline-block;
              background-color: #6a0dad;
              color: #ffffff;
              text-decoration: none;
              padding: 12px 24px;
              font-size: 16px;
              border-radius: 5px;
              font-weight: bold;
          }
          .footer {
              font-size: 14px;
              color: #777;
              margin-top: 20px;
          }
          .footer a {
              color: #6a0dad;
              text-decoration: none;
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="header">${sitename}</div>
          <div class="content">
              <p>Dear ${username},</p>
              <p>Welcome to <strong>${sitename}</strong>! We're excited to have you on board.</p>
              <p>To complete your registration and verify your email address, please click the button below:</p>
              <a href="http://192.168.1.15:5173/verify?verificationKey=${securityKey}&email=${email}" class="verify-button">Verify</a>
              <p>If you didn’t sign up for <strong>${sitename}</strong>, please disregard this email or contact our support team immediately.</p>
          </div>
          <div class="footer">
              <p>Need help? Contact us at <a href="mailto:support@${sitename}.com">support@${sitename}.com</a>.</p>
              <p>© 2025 ${sitename}. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};

exports.sessionExpired = () => {
  return `
 <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Session Expired</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      color: #333;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      text-align: center;
      padding: 20px;
    }

    .container {
      background-color: white;
      padding: 40px 30px;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
      max-width: 400px;
      width: 100%;
    }

    .icon {
      font-size: 60px;
      margin-bottom: 20px;
      color: #ff6b6b;
      animation: pulse 1.5s infinite;
    }

    h1 {
      font-size: 28px;
      margin-bottom: 15px;
      color: #222;
    }

    p {
      font-size: 16px;
      margin-bottom: 25px;
      color: #555;
    }

    .btn {
      display: inline-block;
      padding: 12px 25px;
      background-color: #007BFF;
      color: white;
      border-radius: 6px;
      text-decoration: none;
      transition: background 0.3s ease;
    }

    .btn:hover {
      background-color: #0056b3;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.15);
        opacity: 0.6;
      }
    }

    @media (max-width: 480px) {
      .container {
        padding: 30px 20px;
      }

      h1 {
        font-size: 24px;
      }

      p {
        font-size: 14px;
      }

      .btn {
        font-size: 14px;
        padding: 10px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">&#x23F3;</div>
    <h1>Session Expired</h1>
    <p>Your session has timed out due to inactivity or exceeded time limit.</p>
    <a href="https://patiofy.comfortbikes.in/" class="btn">Go to Homepage</a>
  </div>
</body>
</html>

 `;
};

exports.userNotFound = () => {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>User Not Found</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f0f4f8;
      color: #333;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      background-color: #ffffff;
      padding: 3rem;
      border-radius: 1rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      max-width: 480px;
      width: 100%;
      text-align: center;
      transition: all 0.3s ease;
    }

    .icon {
      font-size: 70px;
      color: #e63946;
      margin-bottom: 1.5rem;
      animation: pulse 1.6s infinite ease-in-out;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 0.75rem;
      color: #1a1a1a;
    }

    p {
      font-size: 1rem;
      color: #555;
      margin-bottom: 2rem;
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 1.8rem;
      background-color: #007bff;
      color: #fff;
      border-radius: 0.5rem;
      text-decoration: none;
      font-size: 1rem;
      transition: background-color 0.3s ease;
    }

    .btn:hover {
      background-color: #0056b3;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.1);
        opacity: 0.7;
      }
    }

    /* Responsive Styling */
    @media (max-width: 768px) {
      .container {
        padding: 2rem;
      }

      .icon {
        font-size: 60px;
      }

      h1 {
        font-size: 1.75rem;
      }

      p {
        font-size: 0.95rem;
      }

      .btn {
        font-size: 0.95rem;
        padding: 0.7rem 1.6rem;
      }
    }

    @media (max-width: 480px) {
      .container {
        padding: 1.5rem;
      }

      .icon {
        font-size: 50px;
      }

      h1 {
        font-size: 1.5rem;
      }

      p {
        font-size: 0.9rem;
      }

      .btn {
        font-size: 0.9rem;
        padding: 0.65rem 1.4rem;
      }
    }

    @media (max-width: 360px) {
      h1 {
        font-size: 1.3rem;
      }

      .btn {
        font-size: 0.85rem;
        padding: 0.6rem 1.2rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">⚠️</div>
    <h1>User Not Found</h1>
    <p>Sorry, the user you're trying to find doesn't exist or may have been removed.</p>
    <a href="https://patiofy.comfortbikes.in/" class="btn">Return to Homepage</a>
  </div>
</body>
</html>

  `;
};

exports.ForgetPassword = (fullname, token) => {
  // Use environment variable for frontend URL
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5174";
  const resetLink = `${frontendUrl}/reset-password?token=${token}`;

  return `<!DOCTYPE html>
<html>
<head>
  <title>Welcome to ${sitename}</title>
  <style>
      body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
      }
      .email-container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
      }
      .header {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
      }
      .content {
          font-size: 16px;
          color: #555;
          line-height: 1.6;
          margin-bottom: 20px;
      }
      .verify-button {
          display: inline-block;
          background-color: #34658C;
          color: #ffffff;
          text-decoration: none;
          padding: 12px 24px;
          font-size: 16px;
          border-radius: 5px;
          font-weight: bold;
      }
      .link-text {
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 5px;
          word-break: break-all;
          font-size: 14px;
          color: #333;
          margin: 15px 0;
      }
      .footer {
          font-size: 14px;
          color: #777;
          margin-top: 20px;
      }
      .footer a {
          color: #34658C;
          text-decoration: none;
      }
  </style>
</head>
<body>
  <div class="email-container">
      <div class="header">${sitename}</div>
      <div class="content">
          <p>Dear ${fullname},</p>
          <p>You requested to reset your password for <strong>${sitename}</strong>.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" class="verify-button">Reset Password</a>
          <p>Or copy and paste this link into your browser:</p>
          <div class="link-text">${resetLink}</div>
          <p><strong>⏰ This link will expire in 15 minutes.</strong></p>
          <p>If you didn't request this password reset, please ignore this email or contact our support team immediately.</p>
      </div>
      <div class="footer">
          <p>Need help? Contact us at <a href="mailto:support@${sitename}.com">support@${sitename}.com</a>.</p>
          <p>© 2025 ${sitename}. All rights reserved.</p>
      </div>
  </div>
</body>
</html>
`;
};

exports.SetNewPassword = (decoded, firstname) => {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Welcome to ${sitename} | Set New Password</title>
  <style>
      body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
      }
      .email-container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
      }
      .header {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
      }
      .content {
          font-size: 16px;
          color: #555;
          line-height: 1.6;
          margin-bottom: 20px;
      }
      .verify-button {
          display: inline-block;
          background-color:rgb(140, 19, 201);
         color: #ffffff;
          text-decoration: none;
          padding: 12px 24px;
          font-size: 16px;
          border-radius: 5px;
          font-weight: bold;
      }
      .footer {
          font-size: 14px;
          color: #777;
          margin-top: 20px;
      }
      .footer a {
          color: #6a0dad;
          text-decoration: none;
      }
  </style>
</head>
<body>
  <div class="email-container">
      <div class="header">${sitename}</div>
      <div class="content">
          <p>Dear ${firstname},</p>
          <p>Welcome to <strong>${sitename}</strong>! We're excited to have you on board.</p>
          <p>If You want to set new password, please click the button below:</p>
          <a href="https://poda.vexoticcars.com/setnewpassword-googleusers?decodedGoogleId=${decoded}" class="verify-button">Create Password</a>
          <p>Once you click the button, you will be redirected to the password reset page where you can set a new password.</p>
           <p>This link will expire in 1 hour. If you didn’t request a password reset, please ignore this email.</p>
          <p>If you didn’t sign up for <strong>${sitename}</strong>, please disregard this email or contact our support team immediately.</p>
      </div>
      <div class="footer">
          <p>Need help? Contact us at <a href="mailto:support@${sitename}.com">support@${sitename}.com</a>.</p>
          <p>© 2025 ${sitename}. All rights reserved.</p>
      </div>
  </div>
</body>
</html>
`;
};

exports.AadminForgetPassword = (fullname, email, role) => {
  return `<!DOCTYPE html>
        <html>
        <head>
          <title>Welcome to ${sitename}</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .email-container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  text-align: center;
              }
              .header {
                  font-size: 24px;
                  font-weight: bold;
                  color: #34658C;
                  margin-bottom: 20px;
              }
              .content {
                  font-size: 16px;
                  color: #333;
                  line-height: 1.6;
                  margin-bottom: 20px;
              }
              .verify-button {
                  display: inline-block;
                  background-color: #34658C;
                  color: #ffffff;
                  text-decoration: none;
                  padding: 12px 24px;
                  font-size: 16px;
                  border-radius: 5px;
                  font-weight: bold;
              }
              .verify-button:hover {
                  background-color: #b88434; /* darker shade on hover */
              }
              .footer {
                  font-size: 14px;
                  color: #777;
                  margin-top: 20px;
              }
              .footer a {
                  color: #34658C;
                  text-decoration: none;
              }
          </style>
        </head>
        <body>
          <div class="email-container">
              <div class="header">${sitename}</div>
              <div class="content">
                  <p>Dear ${fullname},</p>
                  <p>Welcome to <strong>${sitename}</strong>! We're excited to have you on board.</p>
                  <p>If you forget your password and need to reset it, please click the button below </p>
                  <a href="https://jdsadmin.techportfolio.in/reset-password?email=${email}&Role=${role}" class="verify-button">Reset Password</a>
                  <p>If you didn’t sign up for <strong>${sitename}</strong>, please disregard this email or contact our support team immediately.</p>
              </div>
              <div class="footer">
                  <p>Need help? Contact us at <a href="mailto:support@${sitename}.com">support@${sitename}.com</a>.</p>
                  <p>© 2025 ${sitename}. All rights reserved.</p>
              </div>
          </div>
        </body>
        </html>`;
};

// exports.newProductEmailTemplate = (userName, product) => `
//   <!DOCTYPE html>
//   <html>
//   <head>
//     <meta charset="utf-8">
//     <title>New Product Launch!</title>
//     <style>
//       body {
//         font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//         margin: 0;
//         padding: 0;
//         background-color: #f4f4f4;
//       }
//       .email-container {
//         background-color: #ffffff;
//         max-width: 600px;
//         margin: 30px auto;
//         border-radius: 10px;
//         overflow: hidden;
//         box-shadow: 0 2px 6px rgba(0,0,0,0.1);
//       }
//       .header {
//         background-color: #1a73e8;
//         color: white;
//         text-align: center;
//         padding: 20px;
//         font-size: 24px;
//         font-weight: 600;
//       }
//       .content {
//         padding: 25px;
//         text-align: center;
//       }
//       .product-image {
//         width: 100%;
//         max-width: 450px;
//         border-radius: 10px;
//         margin: 0 auto;
//         display: block;
//       }
//       .product-title {
//         font-size: 22px;
//         margin-top: 20px;
//         color: #333;
//         font-weight: 600;
//       }
//       .product-description {
//         color: #555;
//         font-size: 17px;
//         margin-top: 12px;
//         line-height: 1.6;
//       }
//       .price {
//         color: #1a73e8;
//         font-size: 19px;
//         margin-top: 10px;
//         font-weight: bold;
//       }
//       .button {
//         display: inline-block;
//         padding: 14px 28px;
//         background-color: #1a73e8;
//         color: white;
//         text-decoration: none;
//         border-radius: 8px;
//         margin-top: 20px;
//         font-size: 17px;
//         font-weight: 500;
//       }
//       .footer {
//         background-color: #f0f0f0;
//         text-align: center;
//         padding: 15px;
//         font-size: 13px;
//         color: #777;
//       }
//     </style>
//   </head>
//   <body>
//     <div class="email-container">
//       <div class="header">🎉 New Product Released!</div>
//       <div class="content">
//         <p style="font-size:16px;">Hi ${userName || "there"},</p>
//         <p style="font-size:17px;">We’re thrilled to introduce our latest addition to the Skinvida family!</p>

//         <img src="${product.imagesUrl[0]}" alt="${product.productname}" class="product-image" />

//         <div class="product-title">${product.productname}</div>
//         <div class="product-description">${product.abouttheproduct}</div>

//         <a href="https://skinvida.namahavfx.com/Shop" class="button">Buy Now</a>
//       </div>
//       <div class="footer">
//         You’re receiving this email because you subscribed to Skinvida updates.<br>
//         © ${new Date().getFullYear()} Skinvida. All rights reserved.
//       </div>
//     </div>
//   </body>
//   </html>
// `;
// -------------------------------
// NEW BOOKING EMAIL TEMPLATES
// -------------------------------

exports.bookingCreated = (fullname, booking) => {
  const orderDate = new Date(booking.createdAt).toLocaleString();
  const rentalStart = new Date(booking.rentalPeriod.start).toLocaleDateString();
  const rentalEnd = new Date(booking.rentalPeriod.end).toLocaleDateString();

  const productRows = booking.products
    .map(
      (item, index) => `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;">${index + 1}</td>
          <td style="padding:8px;border:1px solid #ddd;">${item.productname}</td>
          <td style="padding:8px;border:1px solid #ddd;">₹${item.productprice}</td>
          <td style="padding:8px;border:1px solid #ddd;">${item.cartquantity}</td>
          <td style="padding:8px;border:1px solid #ddd;">₹${item.shippingcost}</td>
          <td style="padding:8px;border:1px solid #ddd;">₹${item.securityDeposit}</td>
          <td style="padding:8px;border:1px solid #ddd;">
            ${item.rentalValue} ${item.rentalDuration}
          </td>
        </tr>
      `
    )
    .join("");

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f6f6f6;padding:20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:650px;margin:auto;background:#ffffff;border:1px solid #ddd;">
      
      <tr>
        <td style="padding:20px;">
          <h2 style="margin:0;">Hi ${fullname},</h2>
          <p style="margin:10px 0;color:#333;">
            ✅ Your order has been successfully placed!
          </p>
        </td>
      </tr>

      <!-- ORDER DETAILS -->
      <tr>
        <td style="padding:15px;">
          <h3 style="margin-bottom:10px;"> Order Details</h3>
          <table width="100%" style="border-collapse:collapse;">
            <tr><td style="padding:6px;">Order ID</td><td>${booking.orderId}</td></tr>
            <tr><td style="padding:6px;">Order Status</td><td>${booking.status}</td></tr>
            <tr><td style="padding:6px;">Order Date</td><td>${orderDate}</td></tr>
            <tr><td style="padding:6px;">Payment Mode</td><td>${booking.payment.mode}</td></tr>
            <tr><td style="padding:6px;">Payment Status</td><td>${booking.payment.status}</td></tr>
          </table>
        </td>
      </tr>

      <!-- PRODUCT DETAILS -->
      <tr>
        <td style="padding:15px;">
          <h3 style="margin-bottom:10px;"> Product Details</h3>
          <table width="100%" style="border-collapse:collapse;text-align:left;">
            <thead>
              <tr style="background:#f0f0f0;">
                <th style="padding:8px;border:1px solid #ddd;">#</th>
                <th style="padding:8px;border:1px solid #ddd;">Product</th>
                <th style="padding:8px;border:1px solid #ddd;">Price</th>
                <th style="padding:8px;border:1px solid #ddd;">Qty</th>
                <th style="padding:8px;border:1px solid #ddd;">Shipping</th>
                <th style="padding:8px;border:1px solid #ddd;">Deposit</th>
                <th style="padding:8px;border:1px solid #ddd;">Rental</th>
              </tr>
            </thead>
            <tbody>
              ${productRows}
            </tbody>
          </table>
        </td>
      </tr>

      <!-- RENTAL -->
      <tr>
        <td style="padding:15px;">
          <h3> Rental Period</h3>
          <p>From <b>${rentalStart}</b> to <b>${rentalEnd}</b></p>
        </td>
      </tr>

      <!-- ADDRESS -->
      <tr>
        <td style="padding:15px;">
          <h3>🚚 Shipping Address</h3>
          <p style="margin:0;">
            ${booking.shipping_address.fullname}<br/>
            ${booking.shipping_address.streetAddress.join(", ")}<br/>
            ${booking.shipping_address.city}, ${booking.shipping_address.state}<br/>
            ${booking.shipping_address.country} - ${booking.shipping_address.pincode}<br/><br/>
            📞 ${booking.shipping_address.mobilenumber}<br/>
            ✉️ ${booking.shipping_address.emailAddress}
          </p>
        </td>
      </tr>

      <!-- BILL -->
      <tr>
        <td style="padding:15px;background:#fafafa;">
          <h3> Bill Summary</h3>
          <h2 style="margin:5px 0;">Total Amount Payable : ₹${booking.orderamount}</h2>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="padding:20px;text-align:center;font-size:13px;color:#777;">
          If you need any help, feel free to contact our support team.<br/><br/>
          Warm regards,<br/>
          <b>Support Team</b>
        </td>
      </tr>

    </table>
  </div>
  `;
};



// exports.bookingConfirmed = (fullname, booking, paymentExpiryIso) => {
//   const formattedDate = new Date(booking.date).toLocaleString();
//   const formattedExpiry = new Date(paymentExpiryIso).toLocaleString();

//   return `
// Hi ${fullname},

// Your booking has been CONFIRMED.

// Booking ID: ${booking._id}
// Category: ${booking.category}
// Booking Date: ${formattedDate}

// Please complete payment before:
// ${formattedExpiry}

// After payment is completed, no modifications or cancellation are allowed.

// Regards,
// Support Team
// `;
// };

exports.paymentSuccess = (fullname, booking) => {
  const orderDate = new Date(booking.createdAt).toLocaleString();
  const rentalStart = new Date(booking.rentalPeriod.start).toLocaleDateString();
  const rentalEnd = new Date(booking.rentalPeriod.end).toLocaleDateString();

  const productRows = booking.products
    .map(
      (item, index) => `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;">${index + 1}</td>
          <td style="padding:8px;border:1px solid #ddd;">${item.productname}</td>
          <td style="padding:8px;border:1px solid #ddd;">₹${item.productprice}</td>
          <td style="padding:8px;border:1px solid #ddd;">${item.cartquantity}</td>
          <td style="padding:8px;border:1px solid #ddd;">₹${item.shippingcost}</td>
          <td style="padding:8px;border:1px solid #ddd;">₹${item.securityDeposit}</td>
          <td style="padding:8px;border:1px solid #ddd;">
            ${item.rentalValue} ${item.rentalDuration}
          </td>
        </tr>
      `
    )
    .join("");

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f6f6f6;padding:20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:650px;margin:auto;background:#ffffff;border:1px solid #ddd;">
      
      <tr>
        <td style="padding:20px;">
          <h2 style="margin:0;">Hi ${fullname},</h2>
          <p style="margin:10px 0;color:#333;">
            ✅ Your order has been successfully placed!
          </p>
        </td>
      </tr>

      <!-- ORDER DETAILS -->
      <tr>
        <td style="padding:15px;">
          <h3 style="margin-bottom:10px;"> Order Details</h3>
          <table width="100%" style="border-collapse:collapse;">
            <tr><td style="padding:6px;">Order ID</td><td>${booking.orderId}</td></tr>
            <tr><td style="padding:6px;">Order Status</td><td>${booking.status}</td></tr>
            <tr><td style="padding:6px;">Order Date</td><td>${orderDate}</td></tr>
            <tr><td style="padding:6px;">Payment Mode</td><td>${booking.payment.mode}</td></tr>
            <tr><td style="padding:6px;">Payment Status</td><td>${booking.payment.status}</td></tr>
          </table>
        </td>
      </tr>

      <!-- PRODUCT DETAILS -->
      <tr>
        <td style="padding:15px;">
          <h3 style="margin-bottom:10px;"> Product Details</h3>
          <table width="100%" style="border-collapse:collapse;text-align:left;">
            <thead>
              <tr style="background:#f0f0f0;">
                <th style="padding:8px;border:1px solid #ddd;">#</th>
                <th style="padding:8px;border:1px solid #ddd;">Product</th>
                <th style="padding:8px;border:1px solid #ddd;">Price</th>
                <th style="padding:8px;border:1px solid #ddd;">Qty</th>
                <th style="padding:8px;border:1px solid #ddd;">Shipping</th>
                <th style="padding:8px;border:1px solid #ddd;">Deposit</th>
                <th style="padding:8px;border:1px solid #ddd;">Rental</th>
              </tr>
            </thead>
            <tbody>
              ${productRows}
            </tbody>
          </table>
        </td>
      </tr>

      <!-- RENTAL -->
      <tr>
        <td style="padding:15px;">
          <h3> Rental Period</h3>
          <p>From <b>${rentalStart}</b> to <b>${rentalEnd}</b></p>
        </td>
      </tr>

      <!-- ADDRESS -->
      <tr>
        <td style="padding:15px;">
          <h3>🚚 Shipping Address</h3>
          <p style="margin:0;">
            ${booking.shipping_address.fullname}<br/>
            ${booking.shipping_address.streetAddress.join(", ")}<br/>
            ${booking.shipping_address.city}, ${booking.shipping_address.state}<br/>
            ${booking.shipping_address.country} - ${booking.shipping_address.pincode}<br/><br/>
            📞 ${booking.shipping_address.mobilenumber}<br/>
            ✉️ ${booking.shipping_address.emailAddress}
          </p>
        </td>
      </tr>

      <!-- BILL -->
      <tr>
        <td style="padding:15px;background:#fafafa;">
          <h3> Bill Summary</h3>
          <h2 style="margin:5px 0;">Total Amount Payable : ₹${booking.orderamount}</h2>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="padding:20px;text-align:center;font-size:13px;color:#777;">
          If you need any help, feel free to contact our support team.<br/><br/>
          Warm regards,<br/>
          <b>Support Team</b>
        </td>
      </tr>

    </table>
  </div>
  `;
};

exports.bookingCancelled = (fullname, booking) => {
  const orderDate = new Date(booking.createdAt).toLocaleString();

  return `
Hi ${fullname},

Your booking has been CANCELLED.

Booking ID: ${booking.orderId}
Booking Amount : ₹${booking.orderamount}

If any payment was made, a refund will be processed (if applicable).

Regards,
Support Team
`;
};

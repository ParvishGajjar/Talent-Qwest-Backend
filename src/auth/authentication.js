/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
import { query } from "../index";
import { htmlBody } from "./helper";

export const isAuthenticated = (req, res, next) => {
  let token = req.get("Authorization");
  try {
    if (token) {
      // Remove Bearer from string
      token = token.slice(7);
      jwt.verify(token, "nph101", async (err, decoded) => {
        if (err) {
          return res.status(401).json({
            data: false,
            message: "Invalid Token...",
            status: false,
          });
        } else {
          req.decoded = decoded;
          const user = await query(
            `select * from user_info where id=${req.decoded.result.id}`
          );
          if (user[0]) {
            req.user = user;
            next();
          } else {
            return res.status(404).json({
              data: false,
              message: `User not found`,
              status: false,
            });
          }
        }
      });
    } else {
      return res.status(401).json({
        data: false,
        message: "Access Denied! Unauthorized User",
        status: false,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      data: false,
      message: "fail",
      status: false,
    });
  }
};

export const sendEmailVerifyLink = async (body, link) => {
  try {
    var html_body = htmlBody(link);
    var mailOptions = {
      to: body.email,
      subject: "Account Verification Link",
      text: `Link for your account verification is ${link}`,
      html: html_body, // html body
    };
    let result = await wrapedSendMail(mailOptions);
    return result;
  } catch (e) {
    console.log(e);
  }
};

async function wrapedSendMail(mailOptions) {
  return new Promise((resolve) => {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("error is " + error);
        resolve(false); // or use rejcet(false) but then you will have to handle errors
      } else {
        console.log("Email sent: " + info.response);
        resolve(true);
      }
    });
  });
}

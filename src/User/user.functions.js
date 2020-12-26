import { query } from "../index.js";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import { sign } from "jsonwebtoken";
// import { sendEmailOTP } from "../auth/authentication";

export const signup = async (req, res) => {
  const salt = genSaltSync(10);
  const password = hashSync(req.body.password, salt);
  try {
    console.log(req.body.email, req.body.password, password);
    const result = await query(
      `insert into user_info (user_name, email, password) values ('${req.body.username}','${req.body.email}','${password}')`
    );

    if (result.insertId) {
      return res
        .status(200)
        .json({ data: true, message: `Sign Up successful`, status: true });
    } else {
      return res
        .status(400)
        .json({ data: false, message: `Something went wrong`, status: false });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};
// export const signup = async (req, res) => {
//   const salt = genSaltSync(10);
//   const password = hashSync(req.body.password, salt);
//   try {
//     try {
//       await query("begin;");
//       console.log(req.body.email, req.body.password, password);
//       const search = await query(
//         `select * from user_info where email='${req.body.email}' and is_verified=1;`
//       );
//       if (search[0]) {
//         return res
//           .status(400)
//           .json({ data: false, message: `User already exists`, status: false });
//       }
//       const search1 = await query(
//         `select * from user_info where email='${req.body.email}' and is_verified=0;`
//       );
//       var result = [];
//       if (search1[0]) {
//         result = await query(`update user_info user_name='${req.body.username}', password='${password}' 
//         where id=${search1[0].id};`);
//       } else {
//         result = await query(
//           `insert into user_info (user_name, email, password) 
//           values ('${req.body.username}','${req.body.email}','${password}');`
//         );
//       }

//       if (result.insertId || result.affectedRows) {
//         var otp = Math.random();
//         otp = otp * 1000000;
//         otp = parseInt(otp);
//         console.log(otp);
//         const emailSent = sendEmailOTP(req.body, otp);
//         if (!emailSent) {
//           await query(`rollback;`);
//           return res.status(400).json({
//             data: false,
//             message: `Something went wrong`,
//             status: false,
//           });
//         }
//         // var result3 = {
//         //   id: result.insertId,
//         //   email: req.body.email,
//         //   password: undefined,
//         // };
//         // var jsontoken = sign({ result: result3 }, "nph101", {
//         //   expiresIn: "1h",
//         // });
//         // await query(
//         //   `update user_info set token='${jsontoken}' where id = ${result.insertId}`
//         // );
//         await query(`insert into email_verify (user_id,email,otp) values (${result.insertId}
//           ,'${req.body.email}', '${otp}')`);

//         await query("commit;");
//         return res.status(200).json({
//           data: { id: result.insertId },
//           message: `OTP has been sent to your email`,
//           status: true,
//         });
//       } else {
//         await query(`rollback`);
//         return res.status(400).json({
//           data: false,
//           message: `Something went wrong`,
//           status: false,
//         });
//       }
//     } catch (e) {
//       console.log(e);
//       await query(`rollback`);
//       return res.status(400).json({
//         data: false,
//         message: `fail`,
//         status: false,
//       });
//     }
//   } catch (e) {
//     console.log(`Error in rolling back: `, e);
//     return res
//       .status(400)
//       .json({ data: false, message: `fail`, status: false });
//   }
// };

// export const emailVerify = async (req, res) => {
//   try {
//     try {
//       await query(`begin;`);
//       const result = await query(
//         `select * from email_verify where user_id=${req.body.id} and is_used=0 order by timestamp desc limit 1;`
//       );
//       if (!result[0]) {
//         return res.status(404).json({
//           data: false,
//           message: `Something went wrong`,
//           status: false,
//         });
//       }
//       if (result[0].otp == req.body.otp) {
//         await query(
//           `update email_verify set is_used = 1 where id=${result[0].id}`
//         );
//         await query(
//           `update user_info set is_verified = 1 where id=${result[0].user_id}`
//         );
//         let jsontoken = "";
//         jsontoken = sign(
//           {
//             result: {
//               id: result[0].user_id,
//             },
//           },
//           "nph101",
//           {
//             expiresIn: "1h",
//           }
//         );
//         await query(
//           `update user_info set token='${jsontoken}' where id = ${result.insertId}`
//         );
//         await query(`commit;`);
//         return res.status(200).json({
//           data: true,
//           message: `Email Verified`,
//           token: jsontoken,
//           status: true,
//         });
//       } else {
//         return res
//           .status(400)
//           .json({ data: false, message: `Invalid OTP`, status: false });
//       }
//     } catch (e) {
//       console.log(e);
//       await query(`rollback;`);
//       return res
//         .status(400)
//         .json({ data: false, message: `fail`, status: false });
//     }
//   } catch (e) {
//     console.log(`Error rolling back: `, e);
//     return res
//       .status(400)
//       .json({ data: false, message: `fail`, status: false });
//   }
// };

export const login = async (req, res) => {
  const user = await query(
    `select id, email, password from user_info where email='${req.body.email}';`
  );
  console.log(user);
  if (!user[0]) {
    return res
      .status(404)
      .json({ data: false, message: `User not found`, status: true });
  }
  try {
    const passwordCompare = compareSync(req.body.password, user[0].password);
    if (passwordCompare) {
      let jsontoken = "";
      jsontoken = sign({ result: { id: user[0].id } }, "nph101", {
        expiresIn: "2h",
      });
      const updatetoken = query(
        `update user_info set token='${jsontoken}' where id='${user[0].id}'`
      );
      if (!updatetoken) {
        return res.status(400).json({
          data: false,
          message: "something went wrong",
          status: false,
        });
      }
      return res.status(200).json({
        data: true,
        message: "login successfully",
        token: jsontoken,
        status: true,
      });
    } else {
      return res.status(401).json({
        data: false,
        message: "Invalid email or password",
        status: false,
      });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    console.log(req.user);
    const result = await query(`select * from user_info`);
    if (result) {
      return res.status(200).json({
        data: result,
        message: "Data fetch",
        status: true,
      });
    } else {
      return res
        .status(404)
        .json({ data: [], message: `No user found`, status: true });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

// export const pageOne = async (req, res) => {
//   try {
//     const result = await query(`update user_info set firstname = '${req.body.firstname}', lastname = '${req.body.lastname}',
//     phoneno = ${req.body.phoneno}, birthdate='${req.body.dob}', address = '${req.body.address}', country='${req.body.country}'
//     , state = '${req.body.state}', city = '${req.body.city}', usertype = 1 where id=${req.user[0].id}`);
//     if (result.affectedRows) {
//       return res
//         .status(200)
//         .json({ data: true, message: `Data updated`, status: true });
//     } else {
//       return res
//         .status(400)
//         .json({ data: false, message: `Something went wrong`, status: false });
//     }
//   } catch (e) {
//     console.log(e);
//     return res
//       .status(400)
//       .json({ data: false, message: `fail`, status: false });
//   }
// };
import * as jwt from "jsonwebtoken";
import * as _ from "lodash";
import { query } from "../index";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import { localStorage } from "../auth/localstorage";
import {
  sendEmailTemporaryPassword,
  sendEmailVerifyLink,
  sendFeedbackEmail,
} from "../auth/authentication";
import { validateLogin } from "../Validation/validateLogin";
import {
  validateSignUp,
  validateSignUpTwo,
  validateSignUpThree,
  validateSignUpFour,
  validateSignUpFive,
  validateSignUpSix,
  validateSignUpSeven,
  validateSignUpEight,
  validateSignUpNine,
} from "../Validation/validateSignUp";
import { randomString } from "../auth/helper";
import { validateForgetPassword } from "../Validation/validateUpdateProfile";
import { validateEmail } from "../Validation/checkempty";

export const signup = async (req, res) => {
  const { validationError, isValid } = validateSignUp(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError });
  }
  const salt = genSaltSync(10);
  const password = hashSync(req.body.password, salt);
  try {
    try {
      await query("begin;");
      const search = await query(
        `select * from user_info where email='${req.body.email}' and is_verified=1;`
      );
      if (search[0]) {
        return res.status(200).json({
          data: false,
          message: `User with this email id already exists`,
          status: false,
        });
      }
      const search1 = await query(
        `select * from user_info where email='${req.body.email}' and is_verified=0;`
      );
      var result = [];
      if (search1[0]) {
        result = await query(`update user_info set user_name='${req.body.username}', password='${password}'
        where id=${search1[0].id};`);
      } else {
        result = await query(
          `insert into user_info (user_name, email, password)
          values ('${req.body.username}','${req.body.email}','${password}');`
        );
        await query(
          `insert into signup_pages (id, signup_one) values (${result.insertId}, 1)`
        );
      }
      if (result.insertId || result.affectedRows) {
        var jsontoken = "";
        jsontoken = sign(
          {
            result: {
              id: search1[0] ? search1[0].id : result.insertId,
              email: req.body.email,
            },
          },
          "itsme9",
          {
            expiresIn: "1d",
          }
        );
        const emailSent = await sendEmailVerifyLink(
          req.body,
          `http://13.235.170.141:3400/api/user/email-verify/${jsontoken}`
        );
        if (!emailSent) {
          return res.status(400).json({
            data: false,
            message: `Unable to send email. Please try again!`,
            status: false,
          });
        }
        await query(`commit;`);
        return res.status(200).json({
          data: true,
          message: `Verification email has been sent`,
          token: jsontoken,
          status: true,
        });
      }
    } catch (e) {
      console.log(e);
      await query(`rollback;`);
      return res
        .status(400)
        .json({ data: false, message: `fail`, status: false });
    }
  } catch (e) {
    console.log(`Error rolling back: `, e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const emailVerify = async (req, res) => {
  try {
    if (req.params.token) {
      var token = req.params.token;
      jwt.verify(token, "itsme9", async (err, decoded) => {
        if (err) {
          return res.json({
            data: false,
            message: "Invalid Token...",
            status: false,
          });
        } else {
          req.decoded = decoded;
          const check = await query(
            `select is_verified from user_info where id=${req.decoded.result.id}`
          );
          if (check[0].is_verified) {
            return res.send(`<h1> Your email is already verified! </h1>`);
          }
          const user = await query(
            `update user_info set is_verified = 1 where id=${req.decoded.result.id}`
          );
          if (user.affectedRows) {
            return res.send(
              `<h1>Email Verified! Return to Login page to signin</h1>`
            );
          } else {
            return res.send(`<h1>Something went wrong</h1>`);
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
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const resendEmailLink = async (req, res) => {
  let token = req.get("Authorization");
  try {
    if (token) {
      // Remove Bearer from string
      var slicedToken = token.slice(7);
      jwt.verify(slicedToken, "itsme9", async (err, decoded) => {
        if (err) {
          return res.json({
            data: false,
            message: "Invalid Token...",
            status: false,
          });
        } else {
          req.decoded = decoded;
          const emailSent = await sendEmailVerifyLink(
            { id: req.decoded.result.id, email: req.decoded.result.email },
            `http://13.235.170.141:3400/api/user/email-verify/${slicedToken}`
          );
          if (!emailSent) {
            return res.status(400).json({
              data: false,
              message: `Unable to send email. Please try again!`,
              status: false,
            });
          }
          return res.status(200).json({
            data: true,
            message: `Verification email has been sent`,
            token: slicedToken,
            status: true,
          });
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
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const login = async (req, res) => {
  const { validationError, isValid } = validateLogin(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError });
  }
  try {
    const user = await query(
      `select id, email, password, is_verified, usertype from user_info where email='${req.body.email}';`
    );
    if (!user[0]) {
      return res
        .status(404)
        .json({ data: false, message: `User not found`, status: false });
    }
    if (!user[0].is_verified) {
      var jsontoken = "";
      jsontoken = sign(
        { result: { id: user[0].id, email: user[0].email } },
        "itsme9",
        {
          expiresIn: "1d",
        }
      );
      const emailSent = await sendEmailVerifyLink(
        req.body,
        `http://13.235.170.141:3400/api/user/email-verify/${jsontoken}`
      );
      if (!emailSent) {
        return res.status(400).json({
          data: false,
          message: `Unable to send email. Please try again!`,
          status: false,
        });
      }
      await query(`commit;`);
      return res.status(200).json({
        data: true,
        message: `Verification email has been sent`,
        token: jsontoken,
        is_verified: 0,
        status: true,
      });
    }
    const passwordCompare = compareSync(req.body.password, user[0].password);
    if (passwordCompare) {
      let jsontoken = "";
      jsontoken = sign({ result: { id: user[0].id } }, "nph101", {
        expiresIn: "2h",
      });
      const updatetoken = await query(
        `update user_info set token='${jsontoken}' where id='${user[0].id}'`
      );
      if (!updatetoken) {
        return res.status(400).json({
          data: false,
          message: "something went wrong",
          status: false,
        });
      }
      const signupPages = await query(
        `select * from signup_pages where id='${user[0].id}'`
      );
      return res.status(200).json({
        data: true,
        message: "login successfully",
        token: jsontoken,
        is_verified: 1,
        signup_pages: signupPages,
        status: true,
        usertype: user[0].usertype,
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

export const logout = async (req, res) => {
  try {
    const result = await query(
      `update user_info set token='' where id=${req.user[0].id}`
    );
    if (result.affectedRows) {
      if (localStorage.getItem("JobID")) {
        localStorage.removeItem("JobID");
      }
      return res.status(200).json({
        data: true,
        message: "logout successfull",
        status: true,
      });
    } else {
      return res.status(400).json({
        data: false,
        message: "Something went wrong",
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

export const signupTwo = async (req, res) => {
  const { validationError, isValid } = validateSignUpTwo(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError });
  }
  try {
    const result = await query(`update user_info set firstname = '${req.body.firstname}', lastname = '${req.body.lastname}',
    phoneno = ${req.body.phoneno}, birthdate='${req.body.dob}', address = '${req.body.address}', country='${req.body.country}'
    , state = '${req.body.state}', city = '${req.body.city}', usertype = 1 where id=${req.user[0].id}`);
    await query(
      `update signup_pages set signup_two =1 where id=${req.user[0].id};`
    );
    if (result.affectedRows) {
      return res.status(200).json({
        data: true,
        message: `Data updated`,
        status: true,
      });
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

export const signupThree = async (req, res) => {
  const { validationError, isValid } = validateSignUpThree(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError });
  }
  try {
    try {
      await query(`begin;`);

      // Skills

      var findoldskill = await query(
        `select * from user_skill where user_id=${req.user[0].id}`
      );
      if (findoldskill[0]) {
        var olds = findoldskill.map((value) => {
          return value.skill_id;
        });
        var userSkillToDel = _.difference(olds, req.body.skills.old);
        req.body.skills.old = _.difference(req.body.skills.old, olds);

        // Deleting Old Skills if not present in set of selected skills by user
        if (userSkillToDel.length) {
          var deluserstr = `delete from user_skill where user_id=${req.user[0].id} and (skill_id=${userSkillToDel[0]}`;
          userSkillToDel.forEach((value, index) => {
            if (index != 0) {
              deluserstr += ` or skill_id=${value}`;
            }
          });
          deluserstr += `);`;
          await query(deluserstr);
        }
      }

      //Inserting new skills to skill_list
      if (req.body.skills.new.length) {
        var newskill = `insert into skill_list (name) values ("${req.body.skills.new[0]}")`;
        req.body.skills.new.forEach((value, index) => {
          if (index != 0) {
            newskill += `, ("${value}")`;
          }
        });
        const result = await query(newskill);
        req.body.skills.new.forEach(() => {
          req.body.skills.old.push(result.insertId);
          result.insertId += 1;
        });
      }

      // Inserting selected set of skills(if it was not already in the user_skill)
      if (req.body.skills.old.length) {
        var insertskill = `insert into user_skill (user_id, skill_id) values (${req.user[0].id},${req.body.skills.old[0]})`;
        req.body.skills.old.forEach((value, index) => {
          if (index != 0) {
            insertskill += `, (${req.user[0].id},${value})`;
          }
        });
        await query(insertskill);
      }

      // Hobbies

      var findoldhobby = await query(
        `select * from user_hobby where user_id=${req.user[0].id}`
      );
      if (findoldhobby[0]) {
        var oldh = findoldhobby.map((value) => {
          return value.hobby_id;
        });
        var userHobbyToDel = _.difference(oldh, req.body.hobbies.old);
        req.body.hobbies.old = _.difference(req.body.hobbies.old, oldh);

        // Deleting Old Hobbies if not present in set of selected hobbies by user
        if (userHobbyToDel.length) {
          var delhobbystr = `delete from user_hobby where user_id=${req.user[0].id} and (hobby_id=${userHobbyToDel[0]}`;
          userHobbyToDel.forEach((value, index) => {
            if (index != 0) {
              delhobbystr += ` or hobby_id=${value}`;
            }
          });
          delhobbystr += `);`;
          await query(delhobbystr);
        }
      }

      //Inserting new hobbies to hobby_list
      if (req.body.hobbies.new.length) {
        var newhobbies = `insert into hobby_list (name) values ("${req.body.hobbies.new[0]}")`;
        req.body.hobbies.new.forEach((value, index) => {
          if (index != 0) {
            newhobbies += `, ("${value}")`;
          }
        });
        const result2 = await query(newhobbies);
        req.body.hobbies.new.forEach(() => {
          req.body.hobbies.old.push(result2.insertId);
          result2.insertId += 1;
        });
      }

      // Inserting selected set of hobbies(if it was not already in the user_hobby)
      if (req.body.hobbies.old.length) {
        var inserthobby = `insert into user_hobby (user_id, hobby_id) values (${req.user[0].id},${req.body.hobbies.old[0]})`;
        req.body.hobbies.old.forEach((value, index) => {
          if (index != 0) {
            inserthobby += `, (${req.user[0].id},${value})`;
          }
        });
        await query(inserthobby);
      }

      // Languages

      var findoldlanguage = await query(
        `select * from user_language where user_id=${req.user[0].id}`
      );

      if (findoldlanguage[0]) {
        var oldl = findoldlanguage.map((value) => {
          return value.language_id;
        });
        var userLanguageToDel = _.difference(oldl, req.body.languages.old);
        req.body.languages.old = _.difference(req.body.languages.old, oldl);

        // Deleting Old Languages if not present in set of selected languages by user
        if (userLanguageToDel.length) {
          var dellanguagestr = `delete from user_language where user_id=${req.user[0].id} and (language_id=${userLanguageToDel[0]}`;
          userLanguageToDel.forEach((value, index) => {
            if (index != 0) {
              dellanguagestr += ` or language_id=${value}`;
            }
          });
          dellanguagestr += `);`;
          await query(dellanguagestr);
        }
      }

      //Inserting new languages to language_list
      if (req.body.languages.new.length) {
        var newlanguages = `insert into language_list (name) values ("${req.body.languages.new[0]}")`;
        req.body.languages.new.forEach((value, index) => {
          if (index != 0) {
            newlanguages += `, ("${value}")`;
          }
        });
        const result3 = await query(newlanguages);
        req.body.languages.new.forEach(() => {
          req.body.languages.old.push(result3.insertId);
          result3.insertId += 1;
        });
      }

      // Inserting selected set of languages(if it was not already in the user_language)
      if (req.body.languages.old.length) {
        var insertlanguage = `insert into user_language (user_id, language_id) values (${req.user[0].id},${req.body.languages.old[0]})`;
        req.body.languages.old.forEach((value, index) => {
          if (index != 0) {
            insertlanguage += `, (${req.user[0].id},${value})`;
          }
        });
        await query(insertlanguage);
      }

      // Updating signup pages info
      await query(
        `update signup_pages set signup_three =1 where id=${req.user[0].id};`
      );
      await query(`commit;`);
      return res
        .status(200)
        .json({ data: true, message: `Data updated`, status: true });
    } catch (e) {
      console.log(e);
      await query(`rollback;`);
      return res
        .status(400)
        .json({ data: false, message: `Something went wrong`, status: false });
    }
  } catch (e) {
    console.log(`Error rolling back: `, e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const signupFour = async (req, res) => {
  const { validationError, isValid } = validateSignUpFour(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError });
  }
  try {
    try {
      await query(`begin;`);
      await query(`delete from user_profile where user_id=${req.user[0].id}`);
      const result = await query(`insert into user_profile values (${
        req.user[0].id
      }, '${req.body.title}', '${req.body.description}',
    ${req.body.fresher ? 1 : 0},${!req.body.fresher ? req.body.yoe : 0},${
        req.body.fresher ? req.body.has_done_internship : 0
      });`);
      await query(
        `update signup_pages set signup_four =1 where id=${req.user[0].id};`
      );
      if (result.affectedRows) {
        await query(`commit;`);
        return res
          .status(200)
          .json({ data: true, message: `Data updated`, status: true });
      } else {
        await query(`rollback;`);
        return res.status(400).json({
          data: false,
          message: `Something went wrong`,
          status: false,
        });
      }
    } catch (e) {
      console.log(e);
      await query(`rollback;`);
      return res
        .status(400)
        .json({ data: false, message: `fail`, status: false });
    }
  } catch (e) {
    console.log(`Error rolling back: `, e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const signupFive = async (req, res) => {
  const { validationError, isValid } = validateSignUpFive(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError[0] });
  }
  try {
    try {
      await query(`begin`);
      await query(`delete from user_patent where user_id=${req.user[0].id}`);
      if (req.body[0].number) {
        var insertPatent = `insert into user_patent values (${
          req.user[0].id
        },"${req.body[0].number}",
        "${req.body[0].name}","${req.body[0].description}","${
          req.body[0].link ? req.body[0].link : 0
        }")`;
        req.body.forEach((value, index) => {
          if (index != 0 && value.number != "") {
            insertPatent += `, (${req.user[0].id},"${value.number}","${
              value.name
            }","${value.description}","${value.link ? value.link : 0}")`;
          }
        });
        await query(insertPatent);
      }
      await query(
        `update signup_pages set signup_five = 1 where id=${req.user[0].id};`
      );
      await query(`commit;`);
      return res
        .status(200)
        .json({ data: true, message: `Data updated`, status: true });
    } catch (e) {
      console.log(e);
      await query(`rollback;`);
      return res
        .status(400)
        .json({ data: false, message: `fail`, status: false });
    }
  } catch (e) {
    console.log(`Error rolling back: `, e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const signupSix = async (req, res) => {
  const { validationError, isValid } = validateSignUpSix(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError });
  }
  try {
    try {
      await query(`begin;`);
      await query(`delete from user_education where user_id=${req.user[0].id}`);
      if (req.body.qualification.new.length) {
        const newqual = await query(
          `insert into quaalifcation_list (name) values ("${req.body.qualification.new[0]}")`
        );
        await query(
          `insert into user_education values (${req.user[0].id},"${req.body.name}","${req.body.passing_year}",
          ${newqual[0].insertId},"${req.body.cgpa}")`
        );
      } else {
        await query(
          `insert into user_education values (${req.user[0].id},"${req.body.name}","${req.body.passing_year}",
          ${req.body.qualification.old[0]},"${req.body.cgpa}")`
        );
      }
      await query(
        `update signup_pages set signup_six = 1 where id=${req.user[0].id};`
      );
      await query(`commit;`);
      return res
        .status(200)
        .json({ data: true, message: `Data updated`, status: true });
    } catch (e) {
      console.log(e);
      await query(`rollback;`);
      return res
        .status(400)
        .json({ data: false, message: `fail`, status: false });
    }
  } catch (e) {
    console.log(`Error rolling back: `, e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const signupSeven = async (req, res) => {
  const { validationError, isValid } = validateSignUpSeven(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError[0] });
  }
  try {
    try {
      await query(`begin`);
      await query(`delete from user_work where user_id=${req.user[0].id}`);
      if (req.body[0].company_name) {
        var insertWork = `insert into user_work values (${req.user[0].id},"${req.body[0].company_name}","${req.body[0].start_date}",
        "${req.body[0].end_date}","${req.body[0].description}",
        "${req.body[0].contact_name}","${req.body[0].contact_email}","${req.body[0].job_title}","${req.body[0].company_url}")`;
        req.body.forEach((value, index) => {
          if (index != 0 && value.company_name != "") {
            insertWork += `, (${req.user[0].id},"${value.company_name}","${value.start_date}","${value.end_date}",
            "${value.description}","${value.contact_name}","${value.contact_email}","${value.job_title}","${value.company_url}")`;
          }
        });
        await query(insertWork);
      }
      await query(
        `update signup_pages set signup_seven = 1 where id=${req.user[0].id};`
      );
      await query(`commit;`);
      return res
        .status(200)
        .json({ data: true, message: `Data updated`, status: true });
    } catch (e) {
      console.log(e);
      await query(`rollback;`);
      return res
        .status(400)
        .json({ data: false, message: `fail`, status: false });
    }
  } catch (e) {
    console.log(`Error rolling back: `, e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const signupEight = async (req, res) => {
  const { validationError, isValid } = validateSignUpEight(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError[0] });
  }
  try {
    try {
      await query(`begin`);
      await query(
        `delete from user_certification where user_id=${req.user[0].id}`
      );
      if (req.body[0].name) {
        var insertPatent = `insert into user_certification values (${
          req.user[0].id
        },"${req.body[0].name}",
        "${req.body[0].description}","${
          req.body[0].link ? req.body[0].link : 0
        }")`;
        req.body.forEach((value, index) => {
          if (index != 0 && value.name != "") {
            insertPatent += `, (${req.user[0].id},"${value.name}","${
              value.description
            }","${value.link ? value.link : 0}")`;
          }
        });
        await query(insertPatent);
      }
      await query(
        `update signup_pages set signup_eight = 1 where id=${req.user[0].id};`
      );
      await query(`commit;`);
      return res
        .status(200)
        .json({ data: true, message: `Data updated`, status: true });
    } catch (e) {
      console.log(e);
      await query(`rollback;`);
      return res
        .status(400)
        .json({ data: false, message: `fail`, status: false });
    }
  } catch (e) {
    console.log(`Error rolling back: `, e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const signupNine = async (req, res) => {
  const { validationError, isValid } = validateSignUpNine(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError[0] });
  }
  try {
    try {
      await query(`begin`);
      await query(`delete from user_project where user_id=${req.user[0].id}`);
      if (req.body[0].name) {
        var insertProject = `insert into user_project values (${
          req.user[0].id
        },"${req.body[0].name}",
        "${req.body[0].description}","${
          req.body[0].link ? req.body[0].link : 0
        }",${req.body[0].duration},${req.body[0].duration_unit})`;
        req.body.forEach((value, index) => {
          if (index != 0 && value.name != "") {
            insertProject += `, (${req.user[0].id},"${value.name}","${
              value.description
            }","${value.link ? value.link : 0}",${value.duration},${
              value.duration_unit
            })`;
          }
        });
        await query(insertProject);
      }
      await query(
        `update signup_pages set signup_nine = 1 where id=${req.user[0].id};`
      );
      await query(`commit;`);
      return res
        .status(200)
        .json({ data: true, message: `Data updated`, status: true });
    } catch (e) {
      console.log(e);
      await query(`rollback;`);
      return res
        .status(400)
        .json({ data: false, message: `fail`, status: false });
    }
  } catch (e) {
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const forgetPassword = async (req, res) => {
  const { validationError, isValid } = validateForgetPassword(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError });
  }
  try {
    const randomPassword = randomString(10, "#aA!");
    const emailExists = await query(
      `select * from user_info where email="${req.body.email}"`
    );
    if (emailExists[0]) {
      const salt = genSaltSync(10);
      const password = hashSync(randomPassword, salt);
      const result = await query(
        `update user_info set password = "${password}" where id=${emailExists[0].id}`
      );
      if (result.affectedRows) {
        let data = {
          password: randomPassword,
          email: emailExists[0].email,
        };
        await sendEmailTemporaryPassword(data);
        console.log(data);
        return res.status(200).json({
          data: true,
          message: `Temporary password has been sent`,
          status: true,
        });
      } else {
        return res.status(400).json({
          data: false,
          message: `something went wrong`,
          status: false,
        });
      }
    }
    return res.status(400).json({
      data: false,
      message: `Account does not exist`,
      status: false,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const contactUs = async (req, res) => {
  if (!validateEmail(req.body.email)) {
    return res.status(400).json({
      data: false,
      status: false,
      error: "Invalid Email",
    });
  }
  try {
    const data = {
      email: req.body.email,
      feedback: req.body.feedback,
    };
    const result = await sendFeedbackEmail(data);
    if (result) {
      return res.status(200).json({
        data: true,
        message: `Data Sent`,
        status: true,
      });
    }
    return res.status(400).json({
      data: false,
      message: `fail`,
      status: false,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      data: false,
      message: `fail`,
      status: false,
    });
  }
};

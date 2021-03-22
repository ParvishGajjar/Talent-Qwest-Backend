import { query } from "../index";
import * as _ from "lodash";
import moment from "moment";
import {
  basicInformation,
  Location,
  profileData,
  socialMediaDetails,
  validateHobbies,
  validateLanguages,
  validateSkills,
  validateUpdatePassword,
} from "../Validation/validateUpdateProfile";
import {
  validateSignUpThree,
  validateSignUpFive,
  validateSignUpSix,
  validateSignUpSeven,
  validateSignUpEight,
  validateSignUpNine,
} from "../Validation/validateSignUp";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import * as fs from "fs";
import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  AlignmentType,
  Border,
  BorderStyle,
  WidthType,
  TableCellWidth,
  Table,
  TableCell,
  TableRow,
  VerticalAlign,
} from "docx";
import {
  createHeading,
  createSubHeading,
  createContactInfo,
  createRoleText,
  createInstitutionHeader,
  createBullet,
  createInterests,
  createSkillList,
  createHobbyList,
  createLanguageList,
  createPositionDateText,
  createInstitutionRoleText,
  splitParagraphIntoBullets,
} from "../auth/resumebuilding.functions";
import { Buffer } from "buffer";

export const updateBasicInformation = async (req, res) => {
  const { validationError, isValid } = basicInformation(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError });
  }
  try {
    const result = await query(`update user_info set firstname="${req.body.firstname}", lastname="${req.body.lastname}"
   , birthdate="${req.body.dob}", address="${req.body.address}", phoneno="${req.body.phoneno}" where id=${req.user[0].id}`);
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
    return res.status(400).json({
      data: false,
      message: `fail`,
      status: false,
    });
  }
};

export const updateLocation = async (req, res) => {
  const { validationError, isValid } = Location(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError });
  }
  try {
    const result = await query(`update user_info set country="${req.body.country}", state="${req.body.state}",
    city="${req.body.city}" where id=${req.user[0].id}`);
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
    return res.status(400).json({
      data: false,
      message: `fail`,
      status: false,
    });
  }
};

export const updateProfileData = async (req, res) => {
  const { validationError, isValid } = profileData(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError });
  }
  try {
    const result = await query(`update user_profile set title="${req.body.title}", description="${req.body.description}" 
    where user_id=${req.user[0].id}`);
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
    return res.status(400).json({
      data: false,
      message: `fail`,
      status: false,
    });
  }
};

export const updateSkillHobbyLanguage = async (req, res) => {
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

export const updateEducationDetails = async (req, res) => {
  const { validationError, isValid } = validateSignUpSix(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError });
  }
  try {
    try {
      await query(`begin;`);
      if (req.body.qualification.new.length) {
        const newqual = await query(
          `insert into qualifcation_list (name) values ("${req.body.qualification.new[0]}")`
        );
        await query(
          `update user_education set institute_name="${req.body.name}", year_of_passing="${req.body.passing_year}",
          qualification_id=${newqual[0].insertId}, CGPA="${req.body.cgpa}" where user_id=${req.user[0].id}`
        );
      } else {
        await query(
          `update user_education set institute_name="${req.body.name}", year_of_passing="${req.body.passing_year}",
          qualification_id=${req.body.qualification.old[0]}, CGPA="${req.body.cgpa}" where user_id=${req.user[0].id}`
        );
      }
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
export const updateWorkExperience = async (req, res) => {
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
export const updateProjectDetails = async (req, res) => {
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

export const updatePatentDetails = async (req, res) => {
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

export const updateCertificationDetails = async (req, res) => {
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

export const updateSocialMediaDetails = async (req, res) => {
  const { validationError, isValid } = socialMediaDetails(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError[0] });
  }
  try {
    const result = await query(
      `select * from user_socialmedia where user_id=${req.user[0].id}`
    );
    if (result[0]) {
      const result2 = await query(`update user_socialmedia set linkedin="${req.body.linkedin}", github="${req.body.github}",
      dribbble="${req.body.dribbble}", medium="${req.body.medium}", twitter="${req.body.twitter}",
      instagram="${req.body.instagram}" where user_id=${req.user[0].id}`);
      if (result2.affectedRows) {
        return res
          .status(200)
          .json({ data: true, message: `Data updated`, status: true });
      } else {
        return res.status(400).json({
          data: false,
          message: `Something went wrong`,
          status: false,
        });
      }
    } else {
      const result3 = await query(`insert into user_socialmedia values (${req.user[0].id},"${req.body.linkedin}",
        "${req.body.medium}","${req.body.dribbble}","${req.body.github}", "${req.body.instagram}", "${req.body.twitter}")`);
      if (result3.insertId) {
        return res
          .status(200)
          .json({ data: true, message: `Data updated`, status: true });
      } else {
        return res.status(400).json({
          data: false,
          message: `Something went wrong`,
          status: false,
        });
      }
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      data: false,
      message: `fail`,
      status: false,
    });
  }
};

export const updateSkills = async (req, res) => {
  const { validationError, isValid } = validateSkills(req.body);
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

export const updateHobbies = async (req, res) => {
  const { validationError, isValid } = validateHobbies(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError });
  }
  try {
    try {
      await query(`begin;`);

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

export const updateLanguages = async (req, res) => {
  const { validationError, isValid } = validateLanguages(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError });
  }
  try {
    try {
      await query(`begin;`);

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

export const updatePassword = async (req, res) => {
  const { validationError, isValid } = validateUpdatePassword(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError });
  }
  try {
    const passwordCompare = compareSync(
      req.body.password,
      req.user[0].password
    );
    if (passwordCompare) {
      const salt = genSaltSync(10);
      const password = hashSync(req.body.new_password, salt);
      const result = await query(
        `update user_info set password="${password}" where id=${req.user[0].id}`
      );
      if (result.affectedRows) {
        return res.status(200).json({
          data: true,
          message: `Password Updated`,
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
    return res
      .status(200)
      .json({ data: false, message: `Password Invalid`, status: false });
  } catch (e) {
    res.status(400).json({
      data: false,
      message: `fail`,
      status: false,
    });
  }
};

export const generateResume = async (req, res) => {
  try {
    let doc = null;
    if (
      req.body.work_experience.length &&
      req.body.patents.length &&
      req.body.cetification.length &&
      req.body.projects.length
    ) {
      doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: `${req.body.firstname} ${req.body.lastname}`,
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.TITLE,
              }),
              new Paragraph({
                text: `${req.body.title}`,
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_3,
              }),
              new Paragraph({
                text: `DOB: ${moment(req.body.birthdate).format(
                  "DD MMM. YYYY"
                )}`,
                alignment: AlignmentType.CENTER,
              }),
              createContactInfo(req.body.phoneno, req.body.email),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                text: `Address: ${req.body.address}`,
              }),
              new Paragraph({
                text: "\n",
              }),
              new Paragraph({
                text: `${req.body.description}`,
                alignment: AlignmentType.JUSTIFIED,
              }),
              new Paragraph({
                text: "\n",
              }),
              createHeading("Education"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.education
                .map((education) => {
                  const arr = [];
                  arr.push(
                    createInstitutionHeader(
                      education.institute_name,
                      `(${education.year_of_passing})`
                    )
                  );
                  arr.push(
                    createInstitutionRoleText(
                      `${education.name}`,
                      `CGPA: ${education.CGPA}`
                    )
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
              new Paragraph({
                text: "\n",
              }),
              createHeading("Work Experience"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.work_experience
                .map((position) => {
                  const arr = [];
                  let current = false;
                  if (!position.end.length) {
                    current = true;
                  }
                  arr.push(
                    createInstitutionHeader(
                      position.company_name,
                      createPositionDateText(
                        position.start,
                        position.end,
                        current
                      )
                    )
                  );
                  arr.push(createRoleText(position.job_title));

                  const bulletPoints = splitParagraphIntoBullets(
                    position.description
                  );

                  bulletPoints.forEach((bulletPoint) => {
                    arr.push(createBullet(bulletPoint));
                  });
                  arr.push(
                    new Paragraph({
                      text: "\n",
                    })
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
              createHeading("Skills, Interests and Language Proficiency"),
              new Paragraph({
                text: "\n",
              }),
              new Table({
                columnWidths: [3605, 3605, 3205],
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [createSubHeading("Skills")],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createSubHeading("Interests")],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createSubHeading("Language Proficiency")],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [createSkillList(req.body.skills)],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        width: {
                          size: 3505,
                          type: WidthType.DXA,
                        },
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createHobbyList(req.body.hobbies)],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        width: {
                          size: 3505,
                          type: WidthType.DXA,
                        },
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createLanguageList(req.body.languages)],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        width: {
                          size: 3505,
                          type: WidthType.DXA,
                        },
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                    ],
                  }),
                ],
                // width: {
                //   size: ["100%"],
                //   type: [WidthType],
                // },
                tableHeader: true,
              }),
              // createSubHeading("Skills"),
              // createSkillList(req.body.skills),
              // createSubHeading("Interests"),
              // createHobbyList(req.body.hobbies),
              // createSubHeading("Language Proficiency"),
              // createLanguageList(req.body.languages),
              new Paragraph({
                text: "\n",
              }),
              createHeading("Projects"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.projects
                .map((item) => {
                  const arr = [];

                  arr.push(
                    createInstitutionHeader(
                      item.name,
                      `Duration: ${item.duration} ${item.duration_name}`
                    )
                  );
                  // arr.push(createRoleText(position.job_title));

                  const bulletPoints = splitParagraphIntoBullets(
                    item.description
                  );

                  bulletPoints.forEach((bulletPoint) => {
                    arr.push(createBullet(bulletPoint));
                  });
                  arr.push(
                    new Paragraph({
                      text: "\n",
                    })
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
              createHeading("Patents"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.patents
                .map((item) => {
                  const arr = [];

                  arr.push(createInstitutionHeader(item.patent_name, ``));
                  arr.push(
                    createRoleText(`Patent Number: ${item.patent_number}`)
                  );

                  const bulletPoints = splitParagraphIntoBullets(
                    item.patent_description
                  );

                  bulletPoints.forEach((bulletPoint) => {
                    arr.push(createBullet(bulletPoint));
                  });
                  arr.push(
                    new Paragraph({
                      text: "\n",
                    })
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
              createHeading("Certification"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.cetification
                .map((item) => {
                  const arr = [];

                  arr.push(createInstitutionHeader(item.certificate_name, ``));
                  arr.push(createRoleText(`${item.description}`));

                  // const bulletPoints = splitParagraphIntoBullets(
                  //   item.patent_description
                  // );

                  // bulletPoints.forEach((bulletPoint) => {
                  //   arr.push(createBullet(bulletPoint));
                  // });
                  arr.push(
                    new Paragraph({
                      text: "\n",
                    })
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
            ],
          },
        ],
      });
    } else if (
      req.body.patents.length &&
      req.body.cetification.length &&
      req.body.projects.length
    ) {
      doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: `${req.body.firstname} ${req.body.lastname}`,
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.TITLE,
              }),
              new Paragraph({
                text: `${req.body.title}`,
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_3,
              }),
              new Paragraph({
                text: `DOB: ${moment(req.body.birthdate).format(
                  "DD MMM. YYYY"
                )}`,
                alignment: AlignmentType.CENTER,
              }),
              createContactInfo(req.body.phoneno, req.body.email),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                text: `Address: ${req.body.address}`,
              }),
              new Paragraph({
                text: "\n",
              }),
              new Paragraph({
                text: `${req.body.description}`,
                alignment: AlignmentType.JUSTIFIED,
              }),
              new Paragraph({
                text: "\n",
              }),
              createHeading("Education"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.education
                .map((education) => {
                  const arr = [];
                  arr.push(
                    createInstitutionHeader(
                      education.institute_name,
                      `(${education.year_of_passing})`
                    )
                  );
                  arr.push(
                    createInstitutionRoleText(
                      `${education.name}`,
                      `CGPA: ${education.CGPA}`
                    )
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
              new Paragraph({
                text: "\n",
              }),
              createHeading("Skills, Interests and Language Proficiency"),
              new Paragraph({
                text: "\n",
              }),
              new Table({
                columnWidths: [3605, 3605, 3205],
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [createSubHeading("Skills")],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createSubHeading("Interests")],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createSubHeading("Language Proficiency")],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [createSkillList(req.body.skills)],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        width: {
                          size: 3505,
                          type: WidthType.DXA,
                        },
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createHobbyList(req.body.hobbies)],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        width: {
                          size: 3505,
                          type: WidthType.DXA,
                        },
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createLanguageList(req.body.languages)],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        width: {
                          size: 3505,
                          type: WidthType.DXA,
                        },
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                    ],
                  }),
                ],
                // width: {
                //   size: ["100%"],
                //   type: [WidthType],
                // },
                tableHeader: true,
              }),
              // createSubHeading("Skills"),
              // createSkillList(req.body.skills),
              // createSubHeading("Interests"),
              // createHobbyList(req.body.hobbies),
              // createSubHeading("Language Proficiency"),
              // createLanguageList(req.body.languages),
              new Paragraph({
                text: "\n",
              }),
              createHeading("Projects"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.projects
                .map((item) => {
                  const arr = [];

                  arr.push(
                    createInstitutionHeader(
                      item.name,
                      `Duration: ${item.duration} ${item.duration_name}`
                    )
                  );
                  // arr.push(createRoleText(position.job_title));

                  const bulletPoints = splitParagraphIntoBullets(
                    item.description
                  );

                  bulletPoints.forEach((bulletPoint) => {
                    arr.push(createBullet(bulletPoint));
                  });
                  arr.push(
                    new Paragraph({
                      text: "\n",
                    })
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
              createHeading("Patents"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.patents
                .map((item) => {
                  const arr = [];

                  arr.push(createInstitutionHeader(item.patent_name, ``));
                  arr.push(
                    createRoleText(`Patent Number: ${item.patent_number}`)
                  );

                  const bulletPoints = splitParagraphIntoBullets(
                    item.patent_description
                  );

                  bulletPoints.forEach((bulletPoint) => {
                    arr.push(createBullet(bulletPoint));
                  });
                  arr.push(
                    new Paragraph({
                      text: "\n",
                    })
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
              createHeading("Certification"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.cetification
                .map((item) => {
                  const arr = [];

                  arr.push(createInstitutionHeader(item.certificate_name, ``));
                  arr.push(createRoleText(`${item.description}`));

                  // const bulletPoints = splitParagraphIntoBullets(
                  //   item.patent_description
                  // );

                  // bulletPoints.forEach((bulletPoint) => {
                  //   arr.push(createBullet(bulletPoint));
                  // });
                  arr.push(
                    new Paragraph({
                      text: "\n",
                    })
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
            ],
          },
        ],
      });
    } else if (
      req.body.work_experience.length &&
      req.body.cetification.length &&
      req.body.projects.length
    ) {
      doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: `${req.body.firstname} ${req.body.lastname}`,
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.TITLE,
              }),
              new Paragraph({
                text: "\n",
              }),
              new Paragraph({
                text: `DOB: ${moment(req.body.birthdate).format(
                  "DD MMM. YYYY"
                )}`,
                alignment: AlignmentType.CENTER,
              }),
              createContactInfo(req.body.phoneno, req.body.email),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                text: `Address: ${req.body.address}`,
              }),
              new Paragraph({
                text: "\n",
              }),
              new Paragraph({
                text: `${req.body.description}`,
                alignment: AlignmentType.JUSTIFIED,
              }),
              new Paragraph({
                text: "\n",
              }),
              createHeading("Education"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.education
                .map((education) => {
                  const arr = [];
                  arr.push(
                    createInstitutionHeader(
                      education.institute_name,
                      `(${education.year_of_passing})`
                    )
                  );
                  arr.push(
                    createInstitutionRoleText(
                      `${education.name}`,
                      `CGPA: ${education.CGPA}`
                    )
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
              new Paragraph({
                text: "\n",
              }),
              createHeading("Work Experience"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.work_experience
                .map((position) => {
                  const arr = [];
                  let current = false;
                  if (!position.end.length) {
                    current = true;
                  }
                  arr.push(
                    createInstitutionHeader(
                      position.company_name,
                      createPositionDateText(
                        position.start,
                        position.end,
                        current
                      )
                    )
                  );
                  arr.push(createRoleText(position.job_title));

                  const bulletPoints = splitParagraphIntoBullets(
                    position.description
                  );

                  bulletPoints.forEach((bulletPoint) => {
                    arr.push(createBullet(bulletPoint));
                  });
                  arr.push(
                    new Paragraph({
                      text: "\n",
                    })
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
              createHeading("Skills, Interests and Language Proficiency"),
              new Paragraph({
                text: "\n",
              }),
              new Table({
                columnWidths: [3605, 3605, 3205],
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [createSubHeading("Skills")],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createSubHeading("Interests")],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createSubHeading("Language Proficiency")],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [createSkillList(req.body.skills)],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        width: {
                          size: 3505,
                          type: WidthType.DXA,
                        },
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createHobbyList(req.body.hobbies)],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        width: {
                          size: 3505,
                          type: WidthType.DXA,
                        },
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createLanguageList(req.body.languages)],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        width: {
                          size: 3505,
                          type: WidthType.DXA,
                        },
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                    ],
                  }),
                ],
                // width: {
                //   size: ["100%"],
                //   type: [WidthType],
                // },
                tableHeader: true,
              }),
              // createSubHeading("Skills"),
              // createSkillList(req.body.skills),
              // createSubHeading("Interests"),
              // createHobbyList(req.body.hobbies),
              // createSubHeading("Language Proficiency"),
              // createLanguageList(req.body.languages),
              new Paragraph({
                text: "\n",
              }),
              createHeading("Projects"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.projects
                .map((item) => {
                  const arr = [];

                  arr.push(
                    createInstitutionHeader(
                      item.name,
                      `Duration: ${item.duration} ${item.duration_name}`
                    )
                  );
                  // arr.push(createRoleText(position.job_title));

                  const bulletPoints = splitParagraphIntoBullets(
                    item.description
                  );

                  bulletPoints.forEach((bulletPoint) => {
                    arr.push(createBullet(bulletPoint));
                  });
                  arr.push(
                    new Paragraph({
                      text: "\n",
                    })
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
              createHeading("Certification"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.cetification
                .map((item) => {
                  const arr = [];

                  arr.push(createInstitutionHeader(item.certificate_name, ``));
                  arr.push(createRoleText(`${item.description}`));

                  // const bulletPoints = splitParagraphIntoBullets(
                  //   item.patent_description
                  // );

                  // bulletPoints.forEach((bulletPoint) => {
                  //   arr.push(createBullet(bulletPoint));
                  // });
                  arr.push(
                    new Paragraph({
                      text: "\n",
                    })
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
            ],
          },
        ],
      });
    } else if (
      req.body.work_experience.length &&
      req.body.patents.length &&
      req.body.projects.length
    ) {
      doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: `${req.body.firstname} ${req.body.lastname}`,
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.TITLE,
              }),
              new Paragraph({
                text: `${req.body.title}`,
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_3,
              }),
              new Paragraph({
                text: `DOB: ${moment(req.body.birthdate).format(
                  "DD MMM. YYYY"
                )}`,
                alignment: AlignmentType.CENTER,
              }),
              createContactInfo(req.body.phoneno, req.body.email),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                text: `Address: ${req.body.address}`,
              }),
              new Paragraph({
                text: "\n",
              }),
              new Paragraph({
                text: `${req.body.description}`,
                alignment: AlignmentType.JUSTIFIED,
              }),
              new Paragraph({
                text: "\n",
              }),
              createHeading("Education"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.education
                .map((education) => {
                  const arr = [];
                  arr.push(
                    createInstitutionHeader(
                      education.institute_name,
                      `(${education.year_of_passing})`
                    )
                  );
                  arr.push(
                    createInstitutionRoleText(
                      `${education.name}`,
                      `CGPA: ${education.CGPA}`
                    )
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
              new Paragraph({
                text: "\n",
              }),
              createHeading("Work Experience"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.work_experience
                .map((position) => {
                  const arr = [];
                  let current = false;
                  if (!position.end.length) {
                    current = true;
                  }
                  arr.push(
                    createInstitutionHeader(
                      position.company_name,
                      createPositionDateText(
                        position.start,
                        position.end,
                        current
                      )
                    )
                  );
                  arr.push(createRoleText(position.job_title));

                  const bulletPoints = splitParagraphIntoBullets(
                    position.description
                  );

                  bulletPoints.forEach((bulletPoint) => {
                    arr.push(createBullet(bulletPoint));
                  });
                  arr.push(
                    new Paragraph({
                      text: "\n",
                    })
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
              createHeading("Skills, Interests and Language Proficiency"),
              new Paragraph({
                text: "\n",
              }),
              new Table({
                columnWidths: [3605, 3605, 3205],
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [createSubHeading("Skills")],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createSubHeading("Interests")],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createSubHeading("Language Proficiency")],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [createSkillList(req.body.skills)],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        width: {
                          size: 3505,
                          type: WidthType.DXA,
                        },
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createHobbyList(req.body.hobbies)],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        width: {
                          size: 3505,
                          type: WidthType.DXA,
                        },
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createLanguageList(req.body.languages)],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        width: {
                          size: 3505,
                          type: WidthType.DXA,
                        },
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                    ],
                  }),
                ],
                // width: {
                //   size: ["100%"],
                //   type: [WidthType],
                // },
                tableHeader: true,
              }),
              // createSubHeading("Skills"),
              // createSkillList(req.body.skills),
              // createSubHeading("Interests"),
              // createHobbyList(req.body.hobbies),
              // createSubHeading("Language Proficiency"),
              // createLanguageList(req.body.languages),
              new Paragraph({
                text: "\n",
              }),
              createHeading("Projects"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.projects
                .map((item) => {
                  const arr = [];

                  arr.push(
                    createInstitutionHeader(
                      item.name,
                      `Duration: ${item.duration} ${item.duration_name}`
                    )
                  );
                  // arr.push(createRoleText(position.job_title));

                  const bulletPoints = splitParagraphIntoBullets(
                    item.description
                  );

                  bulletPoints.forEach((bulletPoint) => {
                    arr.push(createBullet(bulletPoint));
                  });
                  arr.push(
                    new Paragraph({
                      text: "\n",
                    })
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
              createHeading("Patents"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.patents
                .map((item) => {
                  const arr = [];

                  arr.push(createInstitutionHeader(item.patent_name, ``));
                  arr.push(
                    createRoleText(`Patent Number: ${item.patent_number}`)
                  );

                  const bulletPoints = splitParagraphIntoBullets(
                    item.patent_description
                  );

                  bulletPoints.forEach((bulletPoint) => {
                    arr.push(createBullet(bulletPoint));
                  });
                  arr.push(
                    new Paragraph({
                      text: "\n",
                    })
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
            ],
          },
        ],
      });
    } else if (
      req.body.work_experience.length &&
      req.body.patents.length &&
      req.body.cetification.length
    ) {
      doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: `${req.body.firstname} ${req.body.lastname}`,
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.TITLE,
              }),
              new Paragraph({
                text: `${req.body.title}`,
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_3,
              }),
              new Paragraph({
                text: `DOB: ${moment(req.body.birthdate).format(
                  "DD MMM. YYYY"
                )}`,
                alignment: AlignmentType.CENTER,
              }),
              createContactInfo(req.body.phoneno, req.body.email),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                text: `Address: ${req.body.address}`,
              }),
              new Paragraph({
                text: "\n",
              }),
              new Paragraph({
                text: `${req.body.description}`,
                alignment: AlignmentType.JUSTIFIED,
              }),
              new Paragraph({
                text: "\n",
              }),
              createHeading("Education"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.education
                .map((education) => {
                  const arr = [];
                  arr.push(
                    createInstitutionHeader(
                      education.institute_name,
                      `(${education.year_of_passing})`
                    )
                  );
                  arr.push(
                    createInstitutionRoleText(
                      `${education.name}`,
                      `CGPA: ${education.CGPA}`
                    )
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
              new Paragraph({
                text: "\n",
              }),
              createHeading("Work Experience"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.work_experience
                .map((position) => {
                  const arr = [];
                  let current = false;
                  if (!position.end.length) {
                    current = true;
                  }
                  arr.push(
                    createInstitutionHeader(
                      position.company_name,
                      createPositionDateText(
                        position.start,
                        position.end,
                        current
                      )
                    )
                  );
                  arr.push(createRoleText(position.job_title));

                  const bulletPoints = splitParagraphIntoBullets(
                    position.description
                  );

                  bulletPoints.forEach((bulletPoint) => {
                    arr.push(createBullet(bulletPoint));
                  });
                  arr.push(
                    new Paragraph({
                      text: "\n",
                    })
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
              createHeading("Skills, Interests and Language Proficiency"),
              new Paragraph({
                text: "\n",
              }),
              new Table({
                columnWidths: [3605, 3605, 3205],
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [createSubHeading("Skills")],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createSubHeading("Interests")],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createSubHeading("Language Proficiency")],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [createSkillList(req.body.skills)],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        width: {
                          size: 3505,
                          type: WidthType.DXA,
                        },
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createHobbyList(req.body.hobbies)],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        width: {
                          size: 3505,
                          type: WidthType.DXA,
                        },
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createLanguageList(req.body.languages)],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        width: {
                          size: 3505,
                          type: WidthType.DXA,
                        },
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                    ],
                  }),
                ],
                // width: {
                //   size: ["100%"],
                //   type: [WidthType],
                // },
                tableHeader: true,
              }),
              // createSubHeading("Skills"),
              // createSkillList(req.body.skills),
              // createSubHeading("Interests"),
              // createHobbyList(req.body.hobbies),
              // createSubHeading("Language Proficiency"),
              // createLanguageList(req.body.languages),
              new Paragraph({
                text: "\n",
              }),
              createHeading("Patents"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.patents
                .map((item) => {
                  const arr = [];

                  arr.push(createInstitutionHeader(item.patent_name, ``));
                  arr.push(
                    createRoleText(`Patent Number: ${item.patent_number}`)
                  );

                  const bulletPoints = splitParagraphIntoBullets(
                    item.patent_description
                  );

                  bulletPoints.forEach((bulletPoint) => {
                    arr.push(createBullet(bulletPoint));
                  });
                  arr.push(
                    new Paragraph({
                      text: "\n",
                    })
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
              createHeading("Certification"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.cetification
                .map((item) => {
                  const arr = [];

                  arr.push(createInstitutionHeader(item.certificate_name, ``));
                  arr.push(createRoleText(`${item.description}`));

                  // const bulletPoints = splitParagraphIntoBullets(
                  //   item.patent_description
                  // );

                  // bulletPoints.forEach((bulletPoint) => {
                  //   arr.push(createBullet(bulletPoint));
                  // });
                  arr.push(
                    new Paragraph({
                      text: "\n",
                    })
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
            ],
          },
        ],
      });
    } else {
      doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: `${req.body.firstname} ${req.body.lastname}`,
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.TITLE,
              }),
              new Paragraph({
                text: `${req.body.title}`,
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_3,
              }),
              new Paragraph({
                text: `DOB: ${moment(req.body.birthdate).format(
                  "DD MMM. YYYY"
                )}`,
                alignment: AlignmentType.CENTER,
              }),
              createContactInfo(req.body.phoneno, req.body.email),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                text: `Address: ${req.body.address}`,
              }),
              new Paragraph({
                text: "\n",
              }),
              new Paragraph({
                text: `${req.body.description}`,
                alignment: AlignmentType.JUSTIFIED,
              }),
              new Paragraph({
                text: "\n",
              }),
              createHeading("Education"),
              new Paragraph({
                text: "\n",
              }),
              ...req.body.education
                .map((education) => {
                  const arr = [];
                  arr.push(
                    createInstitutionHeader(
                      education.institute_name,
                      `(${education.year_of_passing})`
                    )
                  );
                  arr.push(
                    createInstitutionRoleText(
                      `${education.name}`,
                      `CGPA: ${education.CGPA}`
                    )
                  );
                  return arr;
                })
                .reduce((prev, curr) => prev.concat(curr), []),
              new Paragraph({
                text: "\n",
              }),
              createHeading("Skills, Interests and Language Proficiency"),
              new Paragraph({
                text: "\n",
              }),
              new Table({
                columnWidths: [3605, 3605, 3205],
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [createSubHeading("Skills")],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createSubHeading("Interests")],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createSubHeading("Language Proficiency")],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [createSkillList(req.body.skills)],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        width: {
                          size: 3505,
                          type: WidthType.DXA,
                        },
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createHobbyList(req.body.hobbies)],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        width: {
                          size: 3505,
                          type: WidthType.DXA,
                        },
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                      new TableCell({
                        children: [createLanguageList(req.body.languages)],
                        alignment: AlignmentType.CENTER,
                        verticalAlign: VerticalAlign.CENTER,
                        width: {
                          size: 3505,
                          type: WidthType.DXA,
                        },
                        borders: {
                          top: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          bottom: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          left: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                          right: {
                            style: BorderStyle.THICK_THIN_MEDIUM_GAP,
                            size: 5,
                            color: "blue",
                          },
                        },
                      }),
                    ],
                  }),
                ],
                // width: {
                //   size: ["100%"],
                //   type: [WidthType],
                // },
                tableHeader: true,
              }),
              // createSubHeading("Skills"),
              // createSkillList(req.body.skills),
              // createSubHeading("Interests"),
              // createHobbyList(req.body.hobbies),
              // createSubHeading("Language Proficiency"),
              // createLanguageList(req.body.languages),
            ],
          },
        ],
      });
    }

    // Packer.toBuffer(doc).then((buffer) => {
    //   fs.writeFileSync(`resume.docx`, buffer);
    // });

    const b64string = await Packer.toBuffer(doc);
    res.setHeader("Content-Disposition", "attachment; filename=resume.docx");
    return res.status(200).send(b64string.toString("base64"));
  } catch (e) {
    console.log(e);
    res.status(400).json({
      data: false,
      message: `fail`,
      status: false,
    });
  }
};

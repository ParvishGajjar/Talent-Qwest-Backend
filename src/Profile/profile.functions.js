import { query } from "../index";
import {
  basicInformation,
  Location,
  profileData,
} from "../Validation/validateUpdateProfile";
import {validateSignUpThree} from '../Validation/validateSignUpThree'

export const updateBasicInformation = async (req, res) => {
  const { validationError, isValid } = basicInformation(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError });
  }
  try {
    const result = await query(`update user_info set firstname=${req.body.firstname}, lastname=${req.body.lastname}
   , dob=${req.body.dob}, address=${req.body.address}, phoneno=${req.body.phoneno} where id=${req.user[0].id}`);
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
    const result = await query(`update user_info set country=${req.body.country}, state=${req.body.state},
    city=${req.body.city} where id=${req.user[0].id}`);
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
    const result = await query(`update user_profile set title=${req.body.title}, description=${req.body.description} 
    where id=${req.user[0].id}`);
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

export const updateFive = async (req, res) => {
  try {
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      data: false,
      message: `fail`,
      status: false,
    });
  }
};
export const updateSix = async (req, res) => {
  try {
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      data: false,
      message: `fail`,
      status: false,
    });
  }
};
export const updateSeven = async (req, res) => {
  try {
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      data: false,
      message: `fail`,
      status: false,
    });
  }
};

export const updateEight = async (req, res) => {
  try {
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      data: false,
      message: `fail`,
      status: false,
    });
  }
};

export const updateNine = async (req, res) => {
  try {
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      data: false,
      message: `fail`,
      status: false,
    });
  }
};

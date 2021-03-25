import { query } from "../index.js";
import { notEmpty } from "../Validation/checkempty.js";
import { split } from "lodash";

// Functiion to fetch all cities.
export const getCity = async (req, res) => {
  try {
    var sid = parseInt(req.params.sid);
    if (notEmpty(sid)) {
      const city = await query(`select * from cities where state_id=${sid};`);
      if (notEmpty(city)) {
        return res.status(200).json({
          data: city,
          message: `Cities fetched`,
          status: true,
        });
      } else {
        const result = await query(`select * from states where id=${sid}`);
        if (result[0].name.length) {
          const result1 = await query(
            `insert into cities (name,state_id) values ("${result[0].name}",${sid})`
          );
          if (result1.insertId) {
            return res.status(200).json({
              data: [
                {
                  id: result1.insertId,
                  name: result[0].name,
                  state_id: sid,
                },
              ],
              message: `City fetched`,
              status: true,
            });
          } else {
            throw `Something went wrong`;
          }
        } else {
          throw `Something went wrong`;
        }
      }
    } else {
      throw "Invalid StateID";
    }
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ data: true, message: `Error: ${err}`, status: true });
  }
};

// Function to fetch all states.
export const getState = async (req, res) => {
  try {
    var cid = parseInt(req.params.cid);
    if (notEmpty(cid)) {
      const state = await query(
        `select * from states where country_id=${cid};`
      );
      if (notEmpty(state)) {
        return res.status(200).json({
          data: state,
          message: `States fetched`,
          status: true,
        });
      } else {
        const result = await query(`select * from countries where id=${cid}`);
        if (result[0].name.length) {
          const result1 = await query(
            `insert into states (name,country_id) values ("${result[0].name}",${cid})`
          );
          if (result1.insertId) {
            return res.status(200).json({
              data: [
                {
                  id: result1.insertId,
                  name: result[0].name,
                  country_id: cid,
                },
              ],
              message: `State fetched`,
              status: true,
            });
          } else {
            throw `Something went wrong`;
          }
        } else {
          throw `Something went wrong`;
        }
      }
    } else {
      throw "Invalid CountryID";
    }
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ data: true, message: `Error: ${err}`, status: true });
  }
};

// Function to fetch all countries.
export const getCountry = async (req, res) => {
  try {
    const country = await query(`select * from countries;`);
    if (notEmpty(country)) {
      return res.status(200).json({
        data: country,
        message: `Countries fetched`,
        status: true,
      });
    } else {
      throw "Couldn't Fetch Countries";
    }
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ data: false, message: `Error: ${err}`, status: false });
  }
};

export const getUserLocation = async (req, res) => {
  try {
    const result = await query(
      `select id,country,state,city from user_info where id=${req.user[0].id};`
    );
    if (notEmpty(result)) {
      console.log(result);
      return res
        .status(200)
        .json({ data: result, message: `Data fetched`, status: true });
    } else {
      throw "Couldn't Search/Find Data";
    }
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ data: false, message: `Error: ${err}`, status: false });
  }
};

export const getSkills = async (req, res) => {
  try {
    const result = await query(`select * from skill_list;`);
    if (result[0]) {
      return res
        .status(200)
        .json({ data: result, message: `Skills fetched`, status: true });
    } else {
      return res
        .status(404)
        .json({ data: [], message: `No skill found`, status: true });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const getServices = async (req, res) => {
  try {
    const result = await query(`select * from service_list;`);
    if (result[0]) {
      return res
        .status(200)
        .json({ data: result, message: `Services fetched`, status: true });
    } else {
      return res
        .status(404)
        .json({ data: [], message: `No service found`, status: true });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const getHobbies = async (req, res) => {
  try {
    const result = await query(`select * from hobby_list;`);
    if (result[0]) {
      return res
        .status(200)
        .json({ data: result, message: `Hobbies fetched`, status: true });
    } else {
      return res
        .status(404)
        .json({ data: [], message: `No hobby found`, status: true });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const getLanguages = async (req, res) => {
  try {
    const result = await query(`select * from language_list;`);
    if (result[0]) {
      return res
        .status(200)
        .json({ data: result, message: `Languages fetched`, status: true });
    } else {
      return res
        .status(404)
        .json({ data: [], message: `No language found`, status: true });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const getQualifications = async (req, res) => {
  try {
    const result = await query(`select * from qualifcation_list;`);
    if (result[0]) {
      return res.status(200).json({
        data: result,
        message: `Qualifications fetched`,
        status: true,
      });
    } else {
      return res
        .status(404)
        .json({ data: [], message: `No qualification found`, status: true });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const getFresherOrNot = async (req, res) => {
  try {
    const result = await query(
      `select fresher from user_profile where user_id=${req.user[0].id}`
    );
    if (result[0]) {
      return res.status(200).json({
        data: result,
        message: `Fresher or not fetched`,
        status: true,
      });
    } else {
      return res
        .status(404)
        .json({ data: [], message: `No data found`, status: true });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const viewMyProfile = async (req, res) => {
  try {
    const profile = await query(`select ui.id, ui.firstname, ui.lastname, ui.email, ui.phoneno, ui.birthdate,
     ui.address, ui.state, ui.city, ui.country, ui.user_name, ui.timestamp, ui.usertype, ui.is_verified, 
     up.title, up.description, up.fresher, up.yoe, up.has_done_internship
     from user_info as ui 
     left join user_profile as up 
     on ui.id= up.user_id
     where ui.id=${req.user[0].id};`);
    const user_skills = await query(`select group_concat(skill_list.name separator '|') as skills from user_skill
     left join skill_list on user_skill.skill_id=skill_list.id
     where user_skill.user_id=${req.user[0].id}
     group by user_skill.user_id;`);
    const user_hobbies = await query(`select group_concat(hobby_list.name separator '|') as hobbies from user_hobby
     left join hobby_list on user_hobby.hobby_id=hobby_list.id
     where user_hobby.user_id=${req.user[0].id}
     group by user_hobby.user_id;`);
    const user_languages = await query(`select group_concat(language_list.name separator '|') as languages from user_language
     left join language_list on user_language.language_id=language_list.id
     where user_language.user_id=${req.user[0].id}
     group by user_language.user_id;`);
    const user_projects = await query(`select user_project.*, duration_unit.name as duration_name from user_project 
     left join duration_unit on user_project.d_unit=duration_unit.id
     where user_project.user_id=${req.user[0].id};`);
    const user_certification = await query(
      `select * from user_certification where user_id=${req.user[0].id};`
    );
    const user_education = await query(
      `select * from user_education left join qualifcation_list on user_education.qualification_id = qualifcation_list.id 
      where user_id=${req.user[0].id};`
    );
    const user_patent = await query(
      `select * from user_patent where user_id=${req.user[0].id};`
    );
    const user_work_experience = await query(
      `select * from user_work where user_id=${req.user[0].id};`
    );
    const user_social_media = await query(
      `select * from user_socialmedia where user_id=${req.user[0].id};`
    );
    const openJob = await query(`select job_post.id, job_post.name, job_post.description, 
    job_post.salary, job_post.vacancy, job_post.timestamp, job_post.is_open,
    group_concat(coding_list.name separator '|') as 'Required_Skills' 
    from job_post 
    left join job_skill on job_post.id = job_skill.id
    left join coding_list on job_skill.skill_id = coding_list.id
    where 
    job_post.is_open=0 
    and 
    job_post.id not in (select user_job.job_id from user_job where user_job.user_id = ${
      req.user[0].id
    })
    group by job_post.id
    order by timestamp DESC
    ${req.query.ojlimit ? `limit ${req.query.ojlimit}` : ""};`);
    openJob.forEach((value) => {
      value.Required_Skills = split(value.Required_Skills, "|");
    });
    const appliedJob = await query(`select job_post.id, job_post.name, job_post.description, 
    job_post.salary, job_post.vacancy, job_post.timestamp, job_post.is_open,
    group_concat(coding_list.name separator '|') as 'Required_Skills' 
    from job_post 
    left join job_skill on job_post.id = job_skill.id
    left join coding_list on job_skill.skill_id = coding_list.id
    where 
    job_post.is_open=0 
    and 
    job_post.id in (select user_job.job_id from user_job where user_job.user_id = ${
      req.user[0].id
    })
    group by job_post.id
    order by timestamp DESC
    ${req.query.ajlimit ? `limit ${req.query.ajlimit}` : ""};`);
    appliedJob.forEach((value) => {
      value.Required_Skills = split(value.Required_Skills, "|");
    });
    if (profile[0]) {
      return res.status(200).json({
        data: [
          {
            ...profile[0],
            skills: user_skills,
            hobbies: user_hobbies,
            languages: user_languages,
            education: user_education,
            projects: user_projects,
            cetification: user_certification,
            patents: user_patent,
            work_experience: user_work_experience,
            social_media: user_social_media,
            open_job: openJob,
            applied_job: appliedJob,
          },
        ],
        message: `Data fetched`,
        status: true,
      });
    } else {
      return res
        .status(404)
        .json({ data: [], message: `No data found`, status: true });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const viewOthersProfile = async (req, res) => {
  try {
    const profile = await query(`select ui.id, ui.firstname, ui.lastname, ui.email, ui.phoneno, ui.birthdate,
     ui.address, ui.state, ui.city, ui.country, ui.user_name, ui.timestamp, ui.usertype, ui.is_verified, 
     up.title, up.description, up.fresher, up.yoe, up.has_done_internship
     from user_info as ui 
     left join user_profile as up 
     on ui.id= up.user_id
     where ui.user_name='${req.params.username}';`);
    const user_skills = await query(`select group_concat(skill_list.name separator '|') as skills from user_skill
     left join skill_list on user_skill.skill_id=skill_list.id
     where user_skill.user_id=${profile[0].id}
     group by user_skill.user_id;`);
    const user_hobbies = await query(`select group_concat(hobby_list.name separator '|') as hobbies from user_hobby
     left join hobby_list on user_hobby.hobby_id=hobby_list.id
     where user_hobby.user_id=${profile[0].id}
     group by user_hobby.user_id;`);
    const user_languages = await query(`select group_concat(language_list.name separator '|') as languages from user_language
     left join language_list on user_language.language_id=language_list.id
     where user_language.user_id=${profile[0].id}
     group by user_language.user_id;`);
    const user_projects = await query(`select user_project.*, duration_unit.name as duration_name from user_project 
     left join duration_unit on user_project.d_unit=duration_unit.id
     where user_project.user_id=${profile[0].id};`);
    const user_certification = await query(
      `select * from user_certification where user_id=${profile[0].id};`
    );
    const user_education = await query(
      `select * from user_education left join qualifcation_list on user_education.qualification_id = qualifcation_list.id 
      where user_id=${profile[0].id};`
    );
    const user_patent = await query(
      `select * from user_patent where user_id=${profile[0].id};`
    );
    const user_work_experience = await query(
      `select * from user_work where user_id=${profile[0].id};`
    );
    const user_social_media = await query(
      `select * from user_socialmedia where user_id=${profile[0].id};`
    );
    const openJob = await query(`select job_post.id, job_post.name, job_post.description, 
    job_post.salary, job_post.vacancy, job_post.timestamp, job_post.is_open,
    group_concat(coding_list.name separator '|') as 'Required_Skills' 
    from job_post 
    left join job_skill on job_post.id = job_skill.id
    left join coding_list on job_skill.skill_id = coding_list.id
    where 
    job_post.is_open=0 
    and 
    job_post.id not in (select user_job.job_id from user_job where user_job.user_id = ${
      profile[0].id
    })
    group by job_post.id
    order by timestamp DESC
    ${req.query.ojlimit ? `limit ${req.query.ojlimit}` : ""};`);
    openJob.forEach((value) => {
      value.Required_Skills = split(value.Required_Skills, "|");
    });
    const appliedJob = await query(`select job_post.id, job_post.name, job_post.description, 
    job_post.salary, job_post.vacancy, job_post.timestamp, job_post.is_open,
    group_concat(coding_list.name separator '|') as 'Required_Skills' 
    from job_post 
    left join job_skill on job_post.id = job_skill.id
    left join coding_list on job_skill.skill_id = coding_list.id
    where 
    job_post.is_open=0 
    and 
    job_post.id in (select user_job.job_id from user_job where user_job.user_id = ${
      profile[0].id
    })
    group by job_post.id
    order by timestamp DESC
    ${req.query.ajlimit ? `limit ${req.query.ajlimit}` : ""};`);
    appliedJob.forEach((value) => {
      value.Required_Skills = split(value.Required_Skills, "|");
    });
    if (profile[0]) {
      return res.status(200).json({
        data: [
          {
            ...profile[0],
            skills: user_skills,
            hobbies: user_hobbies,
            languages: user_languages,
            education: user_education,
            projects: user_projects,
            cetification: user_certification,
            patents: user_patent,
            work_experience: user_work_experience,
            social_media: user_social_media,
            open_job: openJob,
            applied_job: appliedJob,
          },
        ],
        message: `Data fetched`,
        status: true,
      });
    } else {
      return res
        .status(404)
        .json({ data: [], message: `No data found`, status: false });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const getCodingLanguage = async (req, res) => {
  try {
    const result = await query(`select * from coding_list`);
    if (result[0]) {
      return res.status(200).json({
        data: result,
        message: `Coding Languages fetched`,
        status: true,
      });
    } else {
      return res
        .status(200)
        .json({ data: [], message: `No data found`, status: true });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const fetchUsername = async (req, res) => {
  try {
    const result = await query(`select user_name from user_info`);

    if (result[0]) {
      let usesrname_list = result.map((val) => {
        return val.user_name;
      });
      return res.status(200).json({
        data: usesrname_list,
        message: `Username fetched`,
        status: true,
      });
    } else {
      return res.status(200).json({
        data: [],
        message: `Username fetched`,
        status: true,
      });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const fetchJobPosition = async (req, res) => {
  try {
    const result = await query(`select name from job_post where is_open=0;`);
    if (result[0]) {
      let job_list = result.map((val) => {
        return val.name;
      });
      return res.status(200).json({
        data: job_list,
        message: `Job Position fetched`,
        status: true,
      });
    } else {
      return res.status(200).json({
        data: [],
        message: `No Job Position found`,
        status: true,
      });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const fetchQuestionCount = async (req, res) => {
  let enough_question_one = [];
  let enough_question_two = [];
  let enough_question_one_id = [];
  let enough_question_two_id = [];
  try {
    const result1 = await query(`select coding_list.id, coding_list.name from coding_list 
    where 
    coding_list.id in 
    (select new_table.cl_id from 
    (select cl_id, count(*) as 'count' from round_one group by round_one.cl_id) 
    new_table 
    where new_table.count>=20) 
    or id=9 or id=10;`);
    const result2 = await query(`select coding_list.id, coding_list.name from coding_list 
    where 
    coding_list.id in 
    (select new_table.cl_id from 
    (select cl_id, count(*) as 'count' from round_two group by round_two.cl_id) 
    new_table 
    where new_table.count>=5) 
    or id=9 or id=10;`);
    if (result1[0]) {
      enough_question_one = result1.map((val) => {
        return val.name;
      });
      enough_question_one_id = result1.map((val) => {
        return val.id;
      });
    }
    if (result2[0]) {
      enough_question_two = result2.map((val) => {
        return val.name;
      });
      enough_question_two_id = result2.map((val) => {
        return val.id;
      });
    }
    return res.status(200).json({
      data: {
        id_one: enough_question_one_id,
        name_one: enough_question_one,
        id_two: enough_question_two_id,
        name_two: enough_question_two,
      },
      message: `Coding language id/name with enough question fetched`,
      status: true,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

import { query } from "../index";
import { split } from "lodash";
import { validateJobPost } from "../Validation/validateRounds";
import { sendEmailNewJobPost } from "../auth/authentication";
import * as _ from "lodash";

export const applyForJob = async (req, res) => {
  try {
    const alreadyapplied = await query(
      `select * from user_job where job_id=${req.params.jobId} and user_id=${req.user[0].id}`
    );
    if (alreadyapplied[0]) {
      return res
        .status(400)
        .json({ data: false, message: `Already applied`, status: false });
    }
    const result = await query(
      `insert into user_job values (${req.params.jobId},${req.user[0].id})`
    );
    await query(
      `insert into user_status (id, job_id) values (${req.user[0].id},${req.params.jobId})`
    );
    if (result.affectedRows) {
      return res.status(200).json({
        data: true,
        message: `Successfully applied for job`,
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

export const openJob = async (req, res) => {
  try {
    const result = await query(`select job_post.id, job_post.name, job_post.description, 
    job_post.salary, job_post.vacancy, job_post.timestamp, job_post.is_open,
    group_concat(coding_list.name separator '|') as 'Required_Skills' 
    from job_post 
    left join job_skill on job_post.id = job_skill.id
    left join coding_list on job_skill.skill_id = coding_list.id
    where 
    job_post.is_open=0 
    and 
    job_post.id not in (select user_job.job_id from user_job where user_job.user_id = ${req.user[0].id})
    group by job_post.id;`);
    result.forEach((value) => {
      value.Required_Skills = split(value.Required_Skills, "|");
    });
    if (result[0]) {
      return res
        .status(200)
        .json({ data: result, message: `fetched open jobs`, status: true });
    } else {
      return res
        .status(200)
        .json({ data: [], message: `No open jobs found`, status: true });
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

export const closedJob = async (req, res) => {
  try {
    const result = await query(`select job_post.id, job_post.name, job_post.description, 
          job_post.salary, job_post.vacancy, job_post.timestamp, job_post.is_open,
          group_concat(coding_list.name separator '|') as 'Required_Skills' 
          from job_post 
          left join job_skill on job_post.id = job_skill.id
          left join coding_list on job_skill.skill_id = coding_list.id
          where 
          job_post.is_open=1 
          group by job_post.id;`);
    result.forEach((value) => {
      value.Required_Skills = split(value.Required_Skills, "|");
    });
    if (result[0]) {
      return res
        .status(200)
        .json({ data: result, message: `fetched closed jobs`, status: true });
    } else {
      return res
        .status(200)
        .json({ data: [], message: `No closed jobs found`, status: true });
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

export const appliedJob = async (req, res) => {
  try {
    const result = await query(`select job_post.id, job_post.name, job_post.description, 
          job_post.salary, job_post.vacancy, job_post.timestamp, job_post.is_open,
          group_concat(coding_list.name separator '|') as 'Required_Skills' 
          from job_post 
          left join job_skill on job_post.id = job_skill.id
          left join coding_list on job_skill.skill_id = coding_list.id
          where 
          job_post.is_open=0 
          and 
          job_post.id in (select user_job.job_id from user_job where user_job.user_id = ${req.user[0].id})
          group by job_post.id;`);
    result.forEach((value) => {
      value.Required_Skills = split(value.Required_Skills, "|");
    });
    if (result[0]) {
      return res
        .status(200)
        .json({ data: result, message: `fetched applied jobs`, status: true });
    } else {
      return res
        .status(200)
        .json({ data: [], message: `No job applied yet`, status: true });
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

export const getJobDetails = async (req, res) => {
  try {
    const result = await query(`select job_post.id, job_post.name, job_post.description, 
    job_post.salary, job_post.vacancy, job_post.timestamp, job_post.is_open,
    group_concat(coding_list.name separator '|') as 'Required_Skills' 
    from job_post 
    left join job_skill on job_post.id = job_skill.id
    left join coding_list on job_skill.skill_id = coding_list.id
    where job_post.id=${req.params.jobId}`);
    var applicants = await query(`select job_id, count(*) as applicants from user_job where job_id=${req.params.jobId}
     group by job_id`);
    const alreadyApplied = await query(`select * from user_job 
     where user_id=${req.user[0].id} and job_id=${req.params.jobId}`);
    result.forEach((value) => {
      value.Required_Skills = split(value.Required_Skills, "|");
    });
    var aa = {
      already_applied: 0,
    };
    if (alreadyApplied[0]) {
      aa.already_applied = 1;
    }
    if (!applicants[0]) {
      applicants = [
        {
          job_id: req.params.jobId,
          applicants: 0,
        },
      ];
    }
    if (result[0]) {
      return res.status(200).json({
        data: [{ ...result[0], ...applicants[0], ...aa }],
        message: `fetched job details`,
        status: true,
      });
    } else {
      return res
        .status(404)
        .json({ data: [], message: `No such job found`, status: true });
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

export const jobsRoundOne = async (req, res) => {
  try {
    const result = await query(`select job_post.id, job_post.name, job_post.description, 
          job_post.salary, job_post.vacancy, job_post.timestamp, job_post.is_open,
          group_concat(coding_list.name separator '|') as 'Required_Skills' 
          from job_post 
          left join job_skill on job_post.id = job_skill.id
          left join coding_list on job_skill.skill_id = coding_list.id
          where 
          job_post.is_open=0 
          and 
          job_post.id in (select user_job.job_id from user_job where user_job.user_id = ${req.user[0].id})
          and 
          job_post.id not in (select marks_one.job_id from marks_one where marks_one.id = ${req.user[0].id})
          group by job_post.id;`);
    result.forEach((value) => {
      value.Required_Skills = split(value.Required_Skills, "|");
    });
    if (result[0]) {
      return res.status(200).json({
        data: result,
        message: `fetched jobs for round one`,
        status: true,
      });
    } else {
      return res
        .status(200)
        .json({ data: [], message: `No round one's`, status: true });
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

export const jobsRoundTwo = async (req, res) => {
  try {
    const result = await query(`select job_post.id, job_post.name, job_post.description, 
    job_post.salary, job_post.vacancy, job_post.timestamp, job_post.is_open,
    group_concat(coding_list.name separator '|') as 'Required_Skills' 
    from job_post 
    left join job_skill on job_post.id = job_skill.id
    left join coding_list on job_skill.skill_id = coding_list.id
    where 
    job_post.is_open=0 
    and 
    job_post.id in (select user_job.job_id from user_job where user_job.user_id = ${req.user[0].id})
    and 
    job_post.id not in (select marks_two.job_id from marks_two where marks_two.id = ${req.user[0].id})
    and 
    job_post.id in (select user_status.job_id from user_status left join job_criteria
        on user_status.job_id=job_criteria.id 
        where user_status.id=${req.user[0].id} and mark_one>=round_one)
    group by job_post.id;`);
    result.forEach((value) => {
      value.Required_Skills = split(value.Required_Skills, "|");
    });
    if (result[0]) {
      return res.status(200).json({
        data: result,
        message: `fetched jobs for round two`,
        status: true,
      });
    } else {
      return res
        .status(200)
        .json({ data: [], message: `No round two's`, status: true });
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

export const getUserStatus = async (req, res) => {
  try {
    const result = await query(
      `select user_status.*, job_post.name, job_criteria.round_one, job_criteria.round_two from user_status 
      left join job_post 
      on user_status.job_id = job_post.id
      left join job_criteria
      on user_status.job_id=job_criteria.id 
      where user_status.id=${req.user[0].id}`
    );
    if (result[0]) {
      return res
        .status(200)
        .json({ data: result, message: `fetched user status`, status: true });
    } else {
      return res
        .status(200)
        .json({ data: [], message: `No user status found`, status: true });
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

export const jobConversion = async (req, res) => {
  try {
    if (req.user[0].usertype === 2) {
      const result = await query(
        `update job_post set is_open=${req.body.isOpen} where id=${req.params.jobId}`
      );
      if (result.affectedRows) {
        return res.status(200).json({
          data: true,
          message: `Job Post Status Updated`,
          status: true,
        });
      } else {
        return res.status(400).json({
          data: false,
          message: "something went wrong",
          status: false,
        });
      }
    }
    return res.status(401).json({
      data: false,
      message: "Access Denied",
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

export const addJobPost = async (req, res) => {
  let emailList = [];
  let requiredSkills = [];
  if (req.user[0].usertype === 1) {
    res.status(401).json({
      data: false,
      message: "Access Denied",
      status: false,
    });
  }
  const { validationError, isValid } = validateJobPost(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError });
  }
  try {
    try {
      await query(`begin;`);
      const result = await query(`insert into job_post (name,description,salary,vacancy) values 
      ("${req.body.name}", "${req.body.description}", ${
        req.body.salary
      }, ${parseInt(req.body.vacancy)});`);
      let jsquery = `insert into job_skill values (${result.insertId}, ${req.body.skills[0]})`;
      req.body.skills.forEach((val, index) => {
        if (index != 0) {
          jsquery += `,(${result.insertId}, ${val})`;
        }
      });
      await query(jsquery);

      await query(
        `insert into job_criteria values (${result.insertId}, ${req.body.round_one_criteria}, ${req.body.round_two_criteria})`
      );

      const result2 = await query(`select user_info.id, user_info.email, 
      group_concat(skill_list.name separator '|') as 'skills' 
      from user_info 
      left join user_skill on user_info.id = user_skill.user_id
      left join skill_list on user_skill.skill_id = skill_list.id
      where 
      user_info.usertype=1
      and
      user_info.is_verified=1 
      group by user_info.id;`);

      const result3 = await query(`select jp.id, jp.name, group_concat(coding_list.name separator '|') as 'skills' from
      job_post as jp left join job_skill on jp.id = job_skill.id
      left join coding_list on job_skill.skill_id=coding_list.id
      where jp.id = ${result.insertId}
      group by jp.id;`);

      result2.forEach((value) => {
        value.skills = split(value.skills, "|");
      });

      requiredSkills = split(result3[0].skills, "|");

      result2.map((item) => {
        item.skills.forEach((val) => {
          if (
            (requiredSkills.includes(val) ||
              req.body.name.toLowerCase() === val.toLowerCase()) &&
            !emailList.includes(item.email)
          ) {
            emailList.push(item.email);
          }
        });
      });

      if (emailList[0]) {
        emailList.forEach(async (item) => {
          await sendEmailNewJobPost(item, req.body);
        });
      }

      await query("commit;");

      res.status(200).json({
        data: true,
        message: `Job Post Added`,
        status: true,
      });
    } catch (e) {
      console.log(e);
      await query(`rollback;`);
      return res.status(400).json({
        data: false,
        message: `fail`,
        status: false,
      });
    }
  } catch (e) {
    console.log("Error rolling back: ", e);
    return res.status(400).json({
      data: false,
      message: `fail`,
      status: false,
    });
  }
};

export const hrRoundOne = async (req, res) => {
  let output = [];
  let job_position = [];
  let pass = 0;
  let fail = 0;
  let notgiven = 0;
  let percentage = 0;
  try {
    const result = await query(`select user_info.id, user_info.firstname, user_info.lastname, user_info.user_name,
    job_post.name, job_post.id as job_id, user_status.mark_one, user_status.review_one, job_criteria.round_one 
    from user_job
    left join user_info on user_info.id=user_job.user_id
    left join job_post on user_job.job_id=job_post.id
    left join user_status on job_post.id = user_status.job_id
    left join job_criteria on job_post.id=job_criteria.id
    where job_post.is_open = 0 and user_info.is_verified=1;`);

    if (result[0]) {
      result.forEach((item) => {
        if (!job_position.includes(item.name)) {
          output.push({
            job_id: item.job_id,
            job_position: item.name,
            users: [],
          });
          job_position.push(item.name);
        }
      });
      result.forEach((item) => {
        if (!item.mark_one) {
          notgiven = 1;
        } else {
          percentage = (item.mark_one / 20) * 100;
          if (item.mark_one >= item.round_one) {
            pass = 1;
          } else {
            fail = 1;
          }
        }
        output[_.indexOf(job_position, item.name)]["users"].push({
          user_id: item.id,
          firstname: item.firstname,
          lastname: item.lastname,
          username: item.user_name,
          round_one_score: item.mark_one,
          round_one_criteria: item.round_one,
          pass,
          fail,
          notgiven,
          percentage,
        });
        notgiven = 0;
        pass = 0;
        fail = 0;
        percentage = 0;
      });
      return res.status(200).json({
        data: output,
        message: `Data fetched`,
        status: true,
      });
    }
    return res.status(200).json({
      data: [],
      message: `No one has applied yet`,
      status: true,
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

export const filterHrRoundOne = async (req, res) => {
  let output = [];
  let job_position = [];
  let pass = 0;
  let fail = 0;
  let notgiven = 0;
  let percentage = 0;
  try {
    const result = await query(`select user_info.id, user_info.firstname, user_info.lastname, user_info.user_name,
    job_post.name, job_post.id as job_id, user_status.mark_one, user_status.review_one, job_criteria.round_one 
    from user_job
    left join user_info on user_info.id=user_job.user_id
    left join job_post on user_job.job_id=job_post.id
    left join user_status on job_post.id = user_status.job_id
    left join job_criteria on job_post.id=job_criteria.id
    where job_post.is_open = 0 and user_info.is_verified=1 
    ${
      req.query.username == 1
        ? `and user_info.user_name LIKE "%${req.query.pattern}%";`
        : req.query.position == 1
        ? `and job_post.name LIKE "%${req.query.pattern}%";`
        : `;`
    }`);
    if (result[0]) {
      result.forEach((item) => {
        if (!job_position.includes(item.name)) {
          output.push({
            job_id: item.job_id,
            job_position: item.name,
            users: [],
          });
          job_position.push(item.name);
        }
      });
      result.forEach((item) => {
        if (!item.mark_one) {
          notgiven = 1;
        } else {
          percentage = (item.mark_one / 20) * 100;
          if (item.mark_one >= item.round_one) {
            pass = 1;
          } else {
            fail = 1;
          }
        }
        output[_.indexOf(job_position, item.name)]["users"].push({
          user_id: item.id,
          firstname: item.firstname,
          lastname: item.lastname,
          username: item.user_name,
          round_one_score: item.mark_one,
          round_one_criteria: item.round_one,
          pass,
          fail,
          notgiven,
          percentage,
        });
        notgiven = 0;
        pass = 0;
        fail = 0;
        percentage = 0;
      });
      return res.status(200).json({
        data: output,
        message: `Data fetched`,
        status: true,
      });
    }
    return res.status(200).json({
      data: [],
      message: `No one has applied yet`,
      status: true,
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

export const updateReviewRoundOne = async (req, res) => {
  try {
    const result = await query(`update user_status set review_one = ${req.body.review} where id=${req.body.user_id} and 
    job_id=${req.body.job_id}`);
    if (result.affectedRows) {
      return res
        .status(200)
        .json({ data: true, message: `data updated`, status: true });
    } else {
      return res
        .status(400)
        .json({ data: false, message: `something went wrong`, status: false });
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

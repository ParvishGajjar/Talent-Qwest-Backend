import { query } from "../index";
import { split } from "lodash";

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
          and 
          job_post.id in (select user_job.job_id from user_job where user_job.user_id = ${req.user[0].id})
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
        .status(404)
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
        .status(404)
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
     where user_id=${req.user[0].id} and job_id=${req.params.jobId}`)
    result.forEach((value) => {
      value.Required_Skills = split(value.Required_Skills, "|");
    });
    var aa={
      already_applied: 0
    }
    if(alreadyApplied[0]){
      aa.already_applied = 1
    }
    if(!applicants[0]){
      applicants = [{
        job_id: req.params.jobId,
        applicants: 0
      }]
    }
    if (result[0]) {
      return res
        .status(200)
        .json({
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

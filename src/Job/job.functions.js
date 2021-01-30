import { query } from "../index";

export const applyForJob = async (req, res) => {
  try {
    const alreadyapplied= await query(`select * from user_job where job_id=${req.params.jobId} and user_id=${req.user[0].id}`)
    if(alreadyapplied[0]){
        return res.status(400).json({data: false,message:`Already applied`, status: false})
    }
    const result = await query(
      `insert into user_job values (${req.params.jobId},${req.user[0].id})`
    );
    if (result.affectedRows) {
      return res
        .status(200)
        .json({ data: true, message: `Successfully applied for job`, status: true });
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
        left join user_job on job_post.id != user_job.job_id
        where job_post.is_open=0 and user_job.user_id = ${req.user[0].id}
        group by job_post.id;`);
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
          left join user_job on job_post.id = user_job.job_id
          where job_post.is_open=1 and user_job.user_id = ${req.user[0].id}
          group by job_post.id;`);
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
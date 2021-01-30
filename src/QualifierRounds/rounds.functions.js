import { query } from "../index";
import { localStorage } from "../auth/localstorage";

export const getRoundOne = async (req, res) => {
  try {
    if (localStorage.getItem("JobID")) {
      localStorage.removeItem("JobID");
    }
    localStorage.setItem("JobID", req.params.job_id);
    const marksone = await query(`select marks from marks_one  
      where marks_one.id=${
        req.user[0].id
      } and marks_one.job_id=${localStorage.getItem("JobID")}`);
    const jc = await query(
      `select round_one from job_criteria where id=${localStorage.getItem(
        "JobID"
      )}`
    );
    var Given = {
      hasAlreadyGiven: 0,
      roundOneCriteria: jc[0].round_one || 11,
      score: null,
      hasQualfied: 0,
    };
    if (marksone[0]) {
      Given.hasAlreadyGiven = 1;
      Given.score = marksone[0].marks;
      if (marksone[0].marks >= Given.roundOneCriteria) {
        Given.hasQualfied = 1;
      }
    }
    return res.status(200).json({
      data: [Given],
      message: `Success`,
      status: true,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const fetchRoundOne = async (req, res) => {
  if (!localStorage.getItem("JobID")) {
    return res
      .status(400)
      .json({ data: false, message: `Something went wrong`, status: false });
  }
  try {
    const userLanguages = await query(
      `select user_job.job_id, user_job.user_id,job_skill.skill_id as cl_id from 
      user_job 
      left join 
      job_post on user_job.job_id = job_post.id 
      left join 
      job_skill on job_post.id=job_skill.id
      where user_job.user_id=${
        req.user[0].id
      } and user_job.job_id=${localStorage.getItem("JobID")}
      order by cl_id ASC;`
    );
    if (userLanguages[0].job_id) {
      var fetchQuestions = `select * from round_one where cl_id=${userLanguages[0].cl_id}`;
      var github = 0;
      var database = 0;
      userLanguages.forEach((value, key) => {
        if (key != 0 && value.cl_id != 9 && value.cl_id != 10) {
          fetchQuestions += ` or cl_id=${value.cl_id}`;
        } else if (key != 0 && value.cl_id == 9) {
          github = 9;
        } else if (key != 0 && value.cl_id == 10) {
          database = 10;
        }
      });
      const dataFetched = await query(
        fetchQuestions + ` order by RAND() LIMIT 15`
      );
      if (github) {
        var fetchGithub = [];
        if (!database) {
          fetchGithub = await query(`select * from round_one where cl_id=9 
        order by RAND() LIMIT 5`);
          Array.prototype.push.apply(dataFetched, fetchGithub);
        } else {
          fetchGithub = await query(`select * from round_one where cl_id=9 
        order by RAND() LIMIT 3`);
          Array.prototype.push.apply(dataFetched, fetchGithub);
        }
      }
      if (database) {
        var fetchDB = [];
        if (!github) {
          fetchDB = await query(`select * from round_one where cl_id=10 
          order by RAND() LIMIT 5`);
          Array.prototype.push.apply(dataFetched, fetchDB);
        } else {
          fetchDB = await query(`select * from round_one where cl_id=10 
        order by RAND() LIMIT 2`);
          Array.prototype.push.apply(dataFetched, fetchDB);
        }
      }
      const marksone = await query(`select marks from marks_one  
      where marks_one.id=${
        req.user[0].id
      } and marks_one.job_id=${localStorage.getItem("JobID")}`);
      const jc = await query(
        `select round_one from job_criteria where id=${localStorage.getItem(
          "JobID"
        )}`
      );
      var Given = {
        hasAlreadyGiven: 0,
        roundOneCriteria: jc[0].round_one || 11,
        score: null,
        hasQualfied: 0,
      };
      if (marksone[0]) {
        Given.hasAlreadyGiven = 1;
        Given.score = marksone[0].marks;
        if (marksone[0].marks >= Given.roundOneCriteria) {
          Given.hasQualfied = 1;
        }
      }
      var dataFormat = [];
      dataFetched.forEach((value) => {
        dataFormat.push({
          question: value.question,
          options: [
            `${value.op_1}`,
            `${value.op_2}`,
            `${value.op_3}`,
            `${value.op_4}`,
          ],
          answer: value.correct_answer,
          question_id: value.id,
          coding_language_id: value.cl_id,
        });
      });

      if (dataFetched[0].id) {
        return res.status(200).json({
          data: dataFormat,
          message: `Questions fetched`,
          status: true,
          given: Given,
        });
      } else {
        return res.status(404).json({
          data: [],
          message: `No questions found`,
          status: true,
          given: Given,
        });
      }
    } else {
      return res
        .status(400)
        .json({ data: false, message: `Apply for the Job`, status: false });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

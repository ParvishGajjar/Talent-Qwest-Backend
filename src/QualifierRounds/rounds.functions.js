/* eslint-disable no-undef */
import { query } from "../index";
import { localStorage } from "../auth/localstorage";
import { sendEmailCongoRoundOne, sendEmailCongoRoundTwo } from "../auth/authentication";
import {
  validateQuestionnaireRO,
  validateQuestionnaireRT,
  validateRoundOneQ,
  validateRoundTwoQ,
} from "../Validation/validateRounds";
const AWS = require("aws-sdk");

const s3Client = new AWS.S3({
  accessKeyId: "AKIAUB6UMTZ23KCKACL5",
  secretAccessKey: "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",
  region: "us-east-2",
});

const uploadParams = {
  Bucket: "talentqwest",
  Key: "", // pass key
  Body: null, // pass file body
  ACL: "public-read",
};

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

export const fetchRoundOneQuestionnaire = async (req, res) => {
  try {
    const userLanguages = await query(
      `select user_job.job_id, user_job.user_id,job_skill.skill_id as cl_id from 
      user_job 
      left join 
      job_post on user_job.job_id = job_post.id 
      left join 
      job_skill on job_post.id=job_skill.id
      where user_job.user_id=${req.user[0].id} and user_job.job_id=${req.params.jobId}
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
        fetchQuestions +
          ` order by RAND() LIMIT ${github || database ? "15" : "20"}`
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
      where marks_one.id=${req.user[0].id} and marks_one.job_id=${req.params.jobId}`);
      const jc = await query(
        `select round_one from job_criteria where id=${req.params.jobId}`
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

      if (dataFetched[0]) {
        return res.status(200).json({
          data: dataFormat,
          message: `Questions fetched`,
          status: true,
          given: Given,
          job_id: req.params.jobId,
        });
      } else {
        return res.status(404).json({
          data: [],
          message: `No questions found`,
          status: true,
          given: Given,
          job_id: req.params.jobId,
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

export const fetchRoundTwoQuestionnaire = async (req, res) => {
  try {
    const userLanguages = await query(
      `select user_job.job_id, user_job.user_id,job_skill.skill_id as cl_id from 
      user_job 
      left join 
      job_post on user_job.job_id = job_post.id 
      left join 
      job_skill on job_post.id=job_skill.id
      where user_job.user_id=${req.user[0].id} and user_job.job_id=${req.params.jobId}
      order by cl_id ASC;`
    );
    console.log(userLanguages);
    if (userLanguages[0].job_id) {
      var fetchQuestions = `select * from round_two where cl_id=${userLanguages[0].cl_id}`;
      userLanguages.forEach((value, key) => {
        if (key != 0 && value.cl_id != 9 && value.cl_id != 10) {
          fetchQuestions += ` or cl_id=${value.cl_id}`;
        }
      });
      const dataFetched = await query(
        fetchQuestions + ` order by RAND() LIMIT 5`
      );
      console.log(dataFetched);
      const markstwo = await query(`select marks from marks_two  
      where marks_two.id=${req.user[0].id} and marks_two.job_id=${req.params.jobId}`);
      const jc = await query(
        `select round_two from job_criteria where id=${req.params.jobId}`
      );
      var Given = {
        hasAlreadyGiven: 0,
        roundTwoCriteria: jc[0].round_two || 11,
        score: null,
        hasQualfied: 0,
      };
      if (markstwo[0]) {
        Given.hasAlreadyGiven = 1;
        Given.score = markstwo[0].marks;
        if (marksone[0].marks >= Given.roundTwoCriteria) {
          Given.hasQualfied = 1;
        }
      }
      var dataFormat = [];
      dataFetched.forEach((value) => {
        dataFormat.push({
          question: value.question_link,
          line_number: value.input_line,
          answer: value.corrected_answer,
          question_id: value.id,
          coding_language_id: value.cl_id,
        });
      });

      if (dataFetched[0]) {
        return res.status(200).json({
          data: dataFormat,
          message: `Questions fetched`,
          status: true,
          given: Given,
          job_id: req.params.jobId,
        });
      } else {
        return res.status(200).json({
          data: [],
          message: `No questions found`,
          status: true,
          given: Given,
          job_id: req.params.jobId,
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

export const updateRoundOne = async (req, res) => {
  let qualified = 0;
  try {
    try {
      await query(`begin;`);
      const criteria = await query(
        `select * from job_criteria where id=${req.body.job_id}`
      );
      if (criteria[0] && req.body.score >= criteria[0].round_one) {
        qualified = 1;
      }

      await query(`insert into marks_one (id,job_id,marks,qualified) 
      values (${req.user[0].id}, ${req.body.job_id}, ${req.body.score}, ${qualified})`);

      await query(`update user_status set mark_one=${req.body.score}, status=${qualified} 
      where id=${req.user[0].id} and job_id=${req.body.job_id}`);

      const result3 = await query(
        `select * from job_post where id=${req.body.job_id}`
      );

      await query(
        `insert into notifications (user_id,message) values (${
          req.user[0].id
        },"${
          qualified
            ? `Congratulations! You qualified first round for job position of ${result3[0].name}`
            : `Sorry, You didn't meet the required criteria to become ${result3[0].name}; Good luck next time!`
        }")`
      );
      if (qualified) {
        await sendEmailCongoRoundOne(req.user[0].email, result3[0].name);
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
    console.log(`Rollback error: `, e);
    await query(`rollback;`);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const addQuestionnaireRoundOne = async (req, res) => {
  let newCodingLanguage = 0;
  const { validationError, isValid } = validateQuestionnaireRO(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError[0] });
  }
  try {
    try {
      await query(`begin;`);
      //Inserting new coding language if present
      if (req.body.codingLanguage.new.length) {
        newCodingLanguage = await query(
          `insert into coding_list (name) values ("${req.body.codingLanguage.new[0]}")`
        );
      }
      let quesString = `insert into round_one (cl_id,question,op_1,op_2,op_3,op_4,correct_answer) 
       values (${
         req.body.codingLanguage.old[0]
           ? req.body.codingLanguage.old[0]
           : newCodingLanguage.insertId
       },
       "${req.body.questionnaireList[0].question}","${
        req.body.questionnaireList[0].op_1
      }", 
       "${req.body.questionnaireList[0].op_2}","${
        req.body.questionnaireList[0].op_3
      }",
       "${req.body.questionnaireList[0].op_4}","${
        req.body.questionnaireList[0].correct_answer
      }")`;
      req.body.questionnaireList.forEach((val, index) => {
        if (index != 0) {
          quesString += `, (${
            req.body.codingLanguage.old[0]
              ? req.body.codingLanguage.old[0]
              : newCodingLanguage.insertId
          },
            "${val.question}","${val.op_1}","${val.op_2}","${val.op_3}","${
            val.op_4
          }","${val.correct_answer}")`;
        }
      });
      await query(quesString);
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
    console.log(`Rollback error: `, e);
    await query(`rollback;`);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const uploadCodeSnippetRoundTwo = async (req, res) => {
  try {
    console.log(req.file);
    uploadParams.Key =
      "uploads" + "-" + Date.now() + "-" + req.file.originalname;
    uploadParams.Body = req.file.buffer;

    s3Client.upload(uploadParams, async (err, data) => {
      console.log(data);

      if (err) {
        res.status(500).json({ error: "Error -> " + err });
      }

      const result = await query(
        `insert into uploads (link) values ("${data.Location}")`
      );

      if (result.insertId) {
        return res.status(200).json({
          data: {
            link_id: result.insertId,
            link_url: data.Location,
          },
          message: `success`,
          status: true,
        });
      } else {
        return res.status(400).json({
          data: false,
          message: `something went wrong`,
          status: false,
        });
      }
    });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

// {
//   "codingLanguage":{
//       "old":[3],
//       "new":[]
//   },
//   "questionnaireList":[{
//       "question_link":"http://www.google.com",
//       "input_line":"3",
//       "correct_answer":"google",
//   }]
// }
export const addQuestionnaireRoundTwo = async (req, res) => {
  let newCodingLanguage = 0;
  const { validationError, isValid } = validateQuestionnaireRT(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError[0] });
  }
  try {
    try {
      await query(`begin;`);
      //Inserting new coding language if present
      if (req.body.codingLanguage.new.length) {
        newCodingLanguage = await query(
          `insert into coding_list (name) values ("${req.body.codingLanguage.new[0]}")`
        );
      }
      let quesString = `insert into round_two (cl_id,question_link,input_line,corrected_answer) 
       values (${
         req.body.codingLanguage.old[0]
           ? req.body.codingLanguage.old[0]
           : newCodingLanguage.insertId
       },
       "${req.body.questionnaireList[0].question_link}",${
        req.body.questionnaireList[0].input_line
      }, 
       "${req.body.questionnaireList[0].correct_answer}")`;
      req.body.questionnaireList.forEach((val, index) => {
        if (index != 0) {
          quesString += `, (${
            req.body.codingLanguage.old[0]
              ? req.body.codingLanguage.old[0]
              : newCodingLanguage.insertId
          },
            "${val.question_link}",${val.input_line},"${val.correct_answer}")`;
        }
      });
      await query(quesString);
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
    console.log(`Rollback error: `, e);
    await query(`rollback;`);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

// {
//   "codingLanguage":{
//       "old":[3],
//       "new":[]
//   },
//   "question_link":"http://www.google.com",
//   "link_id":1,
//   "input_line":"3",
//   "correct_answer":"google",
// }

export const addRoundOne = async (req, res) => {
  if (req.user[0].usertype !== 2) {
    return res.status(401).json({
      data: false,
      message: `Access Denied`,
      status: false,
    });
  }
  let newCodingLanguage = 0;
  const { validationError, isValid } = validateRoundOneQ(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError });
  }
  try {
    try {
      await query(`begin;`);
      //Inserting new coding language if present
      if (req.body.codingLanguage.new.length) {
        newCodingLanguage = await query(
          `insert into coding_list (name) values ("${req.body.codingLanguage.new[0]}")`
        );
      }

      await query(`insert into round_one (cl_id,question,op_1,op_2,op_3,op_4,correct_answer) 
      values (${
        req.body.codingLanguage.old[0]
          ? req.body.codingLanguage.old[0]
          : newCodingLanguage.insertId
      },
      "${req.body.question}","${req.body.op_1}", 
      "${req.body.op_2}","${req.body.op_3}",
      "${req.body.op_4}","${req.body.correct_answer}")`);

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
    console.log(`Rollback error: `, e);
    await query(`rollback;`);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const addRoundTwo = async (req, res) => {
  if (req.user[0].usertype !== 2) {
    return res.status(401).json({
      data: false,
      message: `Access Denied`,
      status: false,
    });
  }
  let newCodingLanguage = 0;
  const { validationError, isValid } = validateRoundTwoQ(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError[0] });
  }
  try {
    try {
      await query(`begin;`);
      //Inserting new coding language if present
      if (req.body.codingLanguage.new.length) {
        newCodingLanguage = await query(
          `insert into coding_list (name) values ("${req.body.codingLanguage.new[0]}")`
        );
      }
      await query(`insert into round_two (cl_id,question_link,input_line,corrected_answer) 
      values (${
        req.body.codingLanguage.old[0]
          ? req.body.codingLanguage.old[0]
          : newCodingLanguage.insertId
      },
      "${req.body.question_link}",${req.body.input_line}, 
      "${req.body.correct_answer}")`);
      await query(`update uploads set is_used=1 where id=${req.body.link_id}`);
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
    console.log(`Rollback error: `, e);
    await query(`rollback;`);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const updateRoundTwo = async (req, res) => {
  let qualified = 0;
  try {
    try {
      await query(`begin;`);
      const criteria = await query(
        `select * from job_criteria where id=${req.body.job_id}`
      );
      if (criteria[0] && req.body.score >= criteria[0].round_two) {
        qualified = 1;
      }

      await query(`insert into marks_two (id,job_id,marks,qualified) 
      values (${req.user[0].id}, ${req.body.job_id}, ${req.body.score}, ${qualified})`);

      await query(`update user_status set mark_two=${req.body.score}, status=${
        qualified ? `2` : `1`
      } 
      where id=${req.user[0].id} and job_id=${req.body.job_id}`);

      const result3 = await query(
        `select * from job_post where id=${req.body.job_id}`
      );

      await query(
        `insert into notifications (user_id,message) values (${
          req.user[0].id
        },"${
          qualified
            ? `Congratulations! You qualified second round for job position of ${result3[0].name}`
            : `Sorry, You didn't meet the required criteria to become ${result3[0].name}; Good luck next time!`
        }")`
      );
      if (qualified) {
        await sendEmailCongoRoundTwo(req.user[0].email, result3[0].name);
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
    console.log(`Rollback error: `, e);
    await query(`rollback;`);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

import { query } from "../index";

// Result Object

// {
//     question:``,
//     options:[
//         ``,
//         ``
//     ]
//     answer:``,
//     quid:1,
//     cid:1
// }

export const getRoundOne = async (req, res) => {
  try {
    const dataFetched = await query(`select * from round_one
    LIMIT ${req.query.limit ? req.query.limit : 30} 
    OFFSET ${req.query.offset ? req.query.offset : 0}`);
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
      return res
        .status(200)
        .json({ data: dataFormat.sort(() => Math.random() - 0.5), message: `Questions fetched`, status: true });
    } else {
      return res
        .status(404)
        .json({ data: [], message: `No questions found`, status: true });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

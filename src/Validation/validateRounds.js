import { notEmpty, validateURL, validateEmail } from "./checkempty";
import moment from "moment";

export const validateQuestionnaireRO = (data) => {
  var isValid = false;
  var validationError = [];
  if (!(data.codingLanguage.old[0] || data.codingLanguage.new[0].length)) {
    validationError.push("Please select a coding language");
    return { validationError, isValid };
  } else if (!data.questionnaireList[0]) {
    validationError.push("Please enter one question atleast");
    return { validationError, isValid };
  }
  data.questionnaireList.forEach((item) => {
    if (
      !item.question &&
      (item.op_1 || item.op_2 || item.op_3 || item.op_4 || item.correct_answer)
    ) {
      validationError.push("Question is required");
    } else if (item.question) {
      if (!item.op_1) {
        validationError.push(
          `option one is required for question, ${item.question}`
        );
      } else if (!item.op_2) {
        validationError.push(
          `option two is required for question, ${item.question}`
        );
      } else if (!item.op_3) {
        validationError.push(
          `option three is required for question, ${item.question}`
        );
      } else if (!item.op_4) {
        validationError.push(
          `option four is required for question, ${item.question}`
        );
      } else if (!item.correct_answer) {
        validationError.push(
          `correct answer is required for question, ${item.question}`
        );
      } else if (
        !(
          item.op_1 === item.correct_answer ||
          item.op_2 === item.correct_answer ||
          item.op_3 === item.correct_answer ||
          item.op_4 === item.correct_answer
        )
      ) {
        validationError.push(
          `correct answer should match one of the given options for question, ${item.question}`
        );
      }
    }
  });
  if (!validationError[0]) {
    isValid = true;
    return { isValid, validationError };
  } else {
    return { isValid, validationError };
  }
};

export const validateJobPost = (data) => {
  let isValid = false;
  let validationError = "";
  if (!data.name) {
    validationError = "Job position is required";
    return { isValid, validationError };
  } else if (!data.description) {
    validationError = "Job description is required";
    return { isValid, validationError };
  } else if (!data.salary) {
    validationError = "Job salary is required";
    return { isValid, validationError };
  } else if (!data.vacancy) {
    validationError = "Job vacancy is required";
    return { isValid, validationError };
  } else if (!data.skills[0]) {
    validationError = "Atleast one skill is required";
    return { isValid, validationError };
  } else if (!data.round_one_criteria) {
    validationError = "Round one criteria is required";
    return { isValid, validationError };
  } else if (!data.round_two_criteria) {
    validationError = "Round two criteria is required";
    return { isValid, validationError };
  } else {
    isValid = true;
    return { isValid, validationError };
  }
};

export const validateQuestionnaireRT = (data) => {
  var isValid = false;
  var validationError = [];
  if (!(data.codingLanguage.old[0] || data.codingLanguage.new[0].length)) {
    validationError.push("Please select a coding language");
    return { validationError, isValid };
  } else if (!data.questionnaireList[0]) {
    validationError.push("Please enter one question atleast");
    return { validationError, isValid };
  }
  data.questionnaireList.forEach((item) => {
    if (!item.question_link && (item.input_line || item.correct_answer)) {
      validationError.push("Question is required");
    } else if (item.question_link) {
      if (!item.input_line) {
        validationError.push(
          `input line is required for question, ${item.question}`
        );
      } else if (!item.correct_answer) {
        validationError.push(
          `correct answer is required for question, ${item.question}`
        );
      }
    }
  });
  if (!validationError[0]) {
    isValid = true;
    return { isValid, validationError };
  } else {
    return { isValid, validationError };
  }
};

export const validateRoundOneQ = (data) => {
  var isValid = false;
  var validationError = [];
  if (!(data.codingLanguage.old[0] || data.codingLanguage.new[0].length)) {
    validationError = "Please select a coding language";
    return { validationError, isValid };
  } else if (!data.question.length) {
    validationError = "Please enter question";
    return { validationError, isValid };
  } else if (!data.op_1) {
    validationError = `option one is required for question`;
    return { validationError, isValid };
  } else if (!data.op_2) {
    validationError = `option two is required for question`;
    return { validationError, isValid };
  } else if (!data.op_3) {
    validationError = `option three is required for question`;
    return { validationError, isValid };
  } else if (!data.op_4) {
    validationError = `option four is required for question`;
    return { validationError, isValid };
  } else if (!data.correct_answer) {
    validationError = `correct answer is required for question`;
    return { validationError, isValid };
  } else if (
    !(
      data.op_1 === data.correct_answer ||
      data.op_2 === data.correct_answer ||
      data.op_3 === data.correct_answer ||
      data.op_4 === data.correct_answer
    )
  ) {
    validationError = `correct answer should match one of the given options for question`;
    return { validationError, isValid };
  } else {
    isValid = true;
    return { isValid, validationError };
  }
};

export const validateRoundTwoQ = (data) => {
  var isValid = false;
  var validationError = "";
  if (!(data.codingLanguage.old[0] || data.codingLanguage.new[0].length)) {
    validationError = "Please select a coding language";
    return { validationError, isValid };
  } else if (!data.question_link) {
    validationError = "Please upload one question atleast";
    return { validationError, isValid };
  } else if (!data.input_line.length) {
    validationError = "Please enter error line atleast";
    return { validationError, isValid };
  } else if (!data.correct_answer.length) {
    validationError = "Please enter correct answer";
    return { validationError, isValid };
  } else {
    isValid = true;
    return { validationError, isValid };
  }
};

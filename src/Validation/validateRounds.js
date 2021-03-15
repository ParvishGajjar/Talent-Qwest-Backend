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
          `option four is required for question, ${item.question}`
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

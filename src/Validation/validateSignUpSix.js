import moment from "moment";
export const validateSignUpSix = (data) => {
  var isValid = false;
  var validationError = "";
  if (!data.name.length) {
    validationError = "Institute name is required";
    return { validationError, isValid };
  } else if (!data.passing_year.length) {
    validationError = "Year of passing is required";
    return { validationError, isValid };
  } else if (
    !(
      parseInt(data.passing_year) >= 1900 &&
      parseInt(data.passing_year) <= parseInt(moment().format("YYYY")) + 10
    )
  ) {
    validationError = `Year of passing should be between 1900 and ${
      parseInt(moment().format("YYYY")) + 7
    }`;
    return { validationError, isValid };
  } else if (
    !(data.qualification.old[0] || data.qualification.new.length)
  ) {
    validationError = "Qualification is required";
    return { validationError, isValid };
  } else if (!data.cgpa.length) {
    validationError = "CGPA is required";
    return { validationError, isValid };
  } else {
    isValid = true;
    return { validationError, isValid };
  }
};

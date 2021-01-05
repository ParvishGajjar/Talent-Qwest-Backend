import { validateURL } from "./checkempty";

export const validateSignUpFive = (data) => {
  var isValid = true;
  var validationError = [];
  // var nameregex = /^[a-zA-Z0-9-\s]*$/;

  data.forEach((value) => {
    if (!value.number.length) {
      if (value.name.length || value.description.length || value.link.length) {
        isValid = false;
        validationError.push(`Patent number is required`);
      }
    } else if (value.number.length) {
      if (!value.name.length) {
        isValid = false;
        validationError.push(
          `Patent name is required for patent number: ${value.number}`
        );
      }
      // else if (!value.description.length) {
      //   isValid = false;
      //   validationError.push(`Patent description is required for patent number: ${value.number}`);
      // }
      else if (!(validateURL(value.link) || value.link.length == 0)) {
        isValid = false;
        validationError.push(
          `Patent link is invalid for patent number: ${value.number}`
        );
      }
    }
  });

  return { validationError, isValid };
};

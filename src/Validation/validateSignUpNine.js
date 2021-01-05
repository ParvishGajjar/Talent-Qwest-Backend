import { validateURL } from "./checkempty";

export const validateSignUpNine = (data) => {
  var isValid = true;
  var validationError = [];
  // var nameregex = /^[a-zA-Z0-9-\s]*$/;

  data.forEach((value) => {
    if (!value.name.length) {
      if (
        value.description.length ||
        value.link.length ||
        (parseInt(value.duration) >= 1 &&
        parseInt(value.duration) <=366) ||
        value.duration_unit === 1 ||
        value.duration_unit === 2 ||
        value.duration_unit === 3
      ) {
        isValid = false;
        validationError.push(`Project name is required`);
      }
    } else if (value.name.length) {
        if (!value.description.length) {
          isValid = false;
          validationError.push(`Project description is required for project named, ${value.name}`);
        } else if (!(validateURL(value.link) || value.link.length == 0)) {
        isValid = false;
        validationError.push(
          `Project link is invalid for project named, ${value.name}`
        );
      } else if (!(value.duration !== 0 && value.duration_unit !== 0)) {
        isValid = false;
        validationError.push(
          `Project duration should be selected for project named, ${value.name}`
        );
      }
    }
  });

  return { validationError, isValid };
};

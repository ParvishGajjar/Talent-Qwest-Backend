import { validateURL } from "./checkempty";

export const validateSignUpEight = (data) => {
  var isValid = true;
  var validationError = [];
  // var nameregex = /^[a-zA-Z0-9-\s]*$/;

  data.forEach((value) => {
    if (!value.name.length) {
      if (value.description.length || value.link.length) {
        isValid = false;
        validationError.push(`Certificate name is required`);
      }
    } else if (value.name.length) {
    //   if (!value.description.length) {
    //     isValid = false;
    //     validationError.push(`Certificate description is required for certificate named, ${value.name}`);
    //   } else 
      if (!(validateURL(value.link) || value.link.length == 0)) {
        isValid = false;
        validationError.push(`Certification link is invalid for certificate named, ${value.name}`);
      }
    }
  });

  return { validationError, isValid };
};
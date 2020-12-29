export const validateSignUpThree = (body) => {
  var isValid = false;
  var validationError = "";
  if (!Object.keys(body.skills).length) {
    validationError = "Skills should be selected";
    return { validationError, isValid };
  } else if (body.skills.old.length + body.skills.new.length < 3) {
    validationError = "Minimum 3 skills should be selected";
    return { validationError, isValid };
  } else if (!Object.keys(body.hobbies).length) {
    validationError = "Hobbies should be selected";
    return { validationError, isValid };
  } else if (body.hobbies.old.length + body.hobbies.new.length < 3) {
    validationError = "Minimum 3 hobbies should be selected";
    return { validationError, isValid };
  } else if (!Object.keys(body.languages).length) {
    validationError = "Language should be selected";
    return { validationError, isValid };
  } else if (body.languages.old.length + body.languages.new.length < 1) {
    validationError = "Minimum 1 language should be selected";
    return { validationError, isValid };
  } else {
    isValid = true;
    return { validationError, isValid };
  }
};

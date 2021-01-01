export const validateSignUpFour = (body) => {
  var isValid = false;
  var validationError = "";
  var nameregex = /^[a-zA-Z0-9-\s]*$/;
  if (!body.title.length) {
    validationError = "Profile title should not be empty";
    return { validationError, isValid };
  } else if (!nameregex.test(body.title)) {
    validationError = "Profile title should contain characters a-z, A-Z";
    return { validationError, isValid };
  } else if (!body.description.length) {
    validationError = "Profile description shoud not be empty";
    return { validationError, isValid };
  } else if (!(body.fresher === 1 || body.fresher === 0)) {
    validationError = "Select whether you are a fresher or not";
    return { validationError, isValid };
  } else if (body.fresher === 0) {
    if (!body.yoe) {
      validationError = "Experience should be selected";
      return { validationError, isValid };
    } else {
      isValid = true;
      return { validationError, isValid };
    }
  } else if (body.fresher === 1) {
    if (body.yoe) {
      validationError = "Something went wrong";
      return { validationError, isValid };
    } else {
      isValid = true;
      return { validationError, isValid };
    }
  } else {
    isValid = true;
    return { validationError, isValid };
  }
};

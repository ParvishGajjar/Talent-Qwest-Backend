import { validateEmail } from "./checkempty";

export const validateLogin = (data) => {
  var isValid = false;
  var validationError = "";
  if (!data.email.length) {
    validationError = "Email should not be empty";
    return { validationError, isValid };
  } else if (!validateEmail(data.email)) {
    validationError = "Invalid email format";
    return { validationError, isValid };
  } else if (!data.password.length) {
    validationError = "Password should not be empty";
    return { validationError, isValid };
  } else {
    isValid = true;
    return { validationError, isValid };
  }
}

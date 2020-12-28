import { validateEmail } from "./checkempty";

export const validateSignUp = (data) => {
  var isValid = false;
  var validationError = "";
  if (!data.username.length) {
    validationError = "Username should not be empty";
    return { validationError, isValid };
  } else if (!data.email.length) {
    validationError = "Email should not be empty";
    return { validationError, isValid };
  } else if (!validateEmail(data.email)) {
    validationError = "Invalid email format";
    return { validationError, isValid };
  } else if (!data.password.length) {
    validationError = "Password should not be empty";
    return { validationError, isValid };
  } else if (!data.confirm_password.length) {
    validationError = "Confirm password should not be empty";
    return { validationError, isValid };
  } else if (data.password !== data.confirm_password) {
    validationError = "Confirm password does not match with password";
    return { validationError, isValid };
  } else {
    isValid = true;
    return { validationError, isValid };
  }
};

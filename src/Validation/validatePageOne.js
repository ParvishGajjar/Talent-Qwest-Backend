import * as _ from "lodash";
import { notEmpty } from "./checkempty";

export const valiadtePageOne = (data) => {
  var isValid = false;
  var validationError = "";
  var nameregex = /^[A-Za-z0-9]*$/g;
  if (!data.firstname.length) {
    validationError = "First name should not be empty";
    return { validationError, isValid };
  } else if (!nameregex.test(data.firstname)) {
    validationError = "First name should contain characters a-z, A-Z, 0-9";
    return { validationError, isValid };
  } else if (!data.lastname.length) {
    validationError = "Last name should not be empty";
    return { validationError, isValid };
  } else if (!nameregex.test(data.lastname)) {
    validationError = "Last name should contain characters a-z, A-Z, 0-9";
    return { validationError, isValid };
  } else if (notEmpty(data.phoneno)) {
    validationError = "Phone number should not be empty";
    return { validationError, isValid };
  } else if (notEmpty(data.dob)) {
    validationError = "Date of birth should not be empty";
    return { validationError, isValid };
  } else if (!data.address.length) {
    validationError = "Address should not be empty";
    return { validationError, isValid };
  } else if (notEmpty(data.country)) {
    validationError = "Country should be selected";
    return { validationError, isValid };
  } else if (notEmpty(data.state)) {
    validationError = "State should be selected";
    return { validationError, isValid };
  } else if (notEmpty(data.city)) {
    validationError = "City should be selected";
    return { validationError, isValid };
  } else {
    isValid = true;
    return { validationError, isValid };
  }
};

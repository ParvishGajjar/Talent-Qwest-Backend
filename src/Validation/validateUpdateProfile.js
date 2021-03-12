import { notEmpty, validateURL } from "./checkempty";
import moment from "moment";

export const basicInformation = (data) => {
  var isValid = false;
  var validationError = "";
  var nameregex = /^[A-Za-z]*$/;
  var phoneregex = /^[0-9]{10}$/;
  if (!data.firstname.length) {
    validationError = "First name should not be empty";
    return { validationError, isValid };
  } else if (data.firstname.length < 3 && data.firstname.length > 30) {
    validationError = "First name should be of length 3 to 30";
    return { validationError, isValid };
  } else if (!nameregex.test(data.firstname)) {
    validationError = "First name should contain characters a-z, A-Z";
    return { validationError, isValid };
  } else if (!data.lastname.length) {
    validationError = "Last name should not be empty";
    return { validationError, isValid };
  } else if (data.lastname.length < 3 && data.lastname.length > 30) {
    validationError = "Last name should be of length 3 to 30";
    return { validationError, isValid };
  } else if (!nameregex.test(data.lastname)) {
    validationError = "Last name should contain characters a-z, A-Z";
    return { validationError, isValid };
  } else if (!notEmpty(data.phoneno)) {
    validationError = "Phone number should not be empty";
    return { validationError, isValid };
  } else if (!phoneregex.test(data.phoneno)) {
    validationError = "Phone number should be of 10 digits";
    return { validationError, isValid };
  } else if (!notEmpty(data.dob)) {
    validationError = "Date of birth should be selected";
    return { validationError, isValid };
  } else if (!data.address.length) {
    validationError = "Address should not be empty";
    return { validationError, isValid };
  } else if (data.address.length < 5 && data.address.length > 80) {
    validationError = "Address should be of length 5 to 80";
    return { validationError, isValid };
  } else {
    isValid = true;
    return { validationError, isValid };
  }
};

export const Location = (data) => {
  var isValid = false;
  var validationError = "";
  if (!notEmpty(data.country)) {
    validationError = "Country should be selected";
    return { validationError, isValid };
  } else if (!notEmpty(data.state)) {
    validationError = "State should be selected";
    return { validationError, isValid };
  } else if (!notEmpty(data.city)) {
    validationError = "City should be selected";
    return { validationError, isValid };
  } else {
    isValid = true;
    return { validationError, isValid };
  }
};

export const profileData = (data) => {
  var isValid = false;
  var validationError = "";
  var nameregex = /^[a-zA-Z0-9-\s]*$/;
  if (!data.title.length) {
    validationError = "Profile title should not be empty";
    return { validationError, isValid };
  } else if (!nameregex.test(data.title)) {
    validationError = "Profile title should contain characters a-z, A-Z";
    return { validationError, isValid };
  } else if (!data.description.length) {
    validationError = "Profile description shoud not be empty";
    return { validationError, isValid };
  } else {
    isValid = true;
    return { validationError, isValid };
  }
};

import { notEmpty, validateURL, validateEmail } from "./checkempty";

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

export const socialMediaDetails = (data) => {
  var isValid = false;
  var validationError = "";
  if (data.linkedin.length && !validateURL(data.linkedin)) {
    validationError = "LinkedIn link should be in correct format";
    return { validationError, isValid };
  } else if (data.github.length && !validateURL(data.github)) {
    validationError = "Github link should be in correct format";
    return { validationError, isValid };
  } else if (data.medium.length && !validateURL(data.medium)) {
    validationError = "Medium link should be in correct format";
    return { validationError, isValid };
  } else if (data.dribbble.length && !validateURL(data.dribbble)) {
    validationError = "Dribbble link should be in correct format";
    return { validationError, isValid };
  } else if (data.twitter.length && !validateURL(data.twitter)) {
    validationError = "Twitter link should be in correct format";
    return { validationError, isValid };
  } else if (data.instagram.length && !validateURL(data.instagram)) {
    validationError = "Instagram link should be in correct format";
    return { validationError, isValid };
  } else {
    isValid = true;
    return { validationError, isValid };
  }
};

export const validateSkills = (body) => {
  var isValid = false;
  var validationError = "";
  if (!Object.keys(body.skills).length) {
    validationError = "Skills should be selected";
    return { validationError, isValid };
  } else if (body.skills.old.length + body.skills.new.length < 1) {
    validationError = "Minimum 1 skill should be selected";
    return { validationError, isValid };
  } else {
    isValid = true;
    return { validationError, isValid };
  }
};

export const validateHobbies = (body) => {
  var isValid = false;
  var validationError = "";
  if (!Object.keys(body.hobbies).length) {
    validationError = "Hobbies should be selected";
    return { validationError, isValid };
  } else if (body.hobbies.old.length + body.hobbies.new.length < 1) {
    validationError = "Minimum 1 hobby should be selected";
    return { validationError, isValid };
  } else {
    isValid = true;
    return { validationError, isValid };
  }
};

export const validateLanguages = (body) => {
  var isValid = false;
  var validationError = "";
  if (!Object.keys(body.languages).length) {
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

export const validateUpdatePassword = (data) => {
  var isValid = false;
  var validationError = "";
  if (data.password.length < 1) {
    validationError = "Password should be entered";
    return { validationError, isValid };
  } else if (data.new_password.length < 1) {
    validationError = "New password should be entered";
    return { validationError, isValid };
  } else {
    isValid = true;
    return { validationError, isValid };
  }
};

export const validateForgetPassword = (data) => {
  var isValid = false;
  var validationError = "";
  if (data.email === "") {
    validationError = "Email should be entered";
    return { validationError, isValid };
  } else if (!validateEmail(data.email)) {
    validationError = "Invalid Email";
    return { validationError, isValid };
  } else {
    isValid = true;
    return { validationError, isValid };
  }
};

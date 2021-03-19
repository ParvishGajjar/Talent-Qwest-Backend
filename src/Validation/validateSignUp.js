import { notEmpty, validateURL, validateEmail } from "./checkempty";
import moment from "moment";

export const validateSignUp = (data) => {
  var isValid = false;
  var validationError = "";
  if (!data.username.length) {
    validationError = "Username should not be empty";
    return { validationError, isValid };
  } else if (data.username.length < 3 && data.username.length > 25) {
    validationError = "Username should be of length 3 to 25";
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
  } else if (data.password.length < 8 && data.password.length > 30) {
    validationError = "Password should be of length 8 to 30";
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

export const validateSignUpTwo = (data) => {
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
  } else if (!notEmpty(data.country)) {
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

export const validateSignUpThree = (body) => {
  var isValid = false;
  var validationError = "";
  if (!Object.keys(body.skills).length) {
    validationError = "Skills should be selected";
    return { validationError, isValid };
  } else if (body.skills.old.length + body.skills.new.length < 1) {
    validationError = "Minimum 1 skill should be selected";
    return { validationError, isValid };
  } else if (!Object.keys(body.hobbies).length) {
    validationError = "Hobbies should be selected";
    return { validationError, isValid };
  } else if (body.hobbies.old.length + body.hobbies.new.length < 1) {
    validationError = "Minimum 1 hobby should be selected";
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
    } else if (body.has_done_internship !== "") {
      validationError = "Something went wrong";
      return { validationError, isValid };
    } else {
      isValid = true;
      return { validationError, isValid };
    }
  } else if (body.fresher === 1) {
    if (body.yoe) {
      validationError = "Something went wrong";
      return { validationError, isValid };
    } else if (
      body.has_done_internship === null ||
      body.has_done_internship === ""
    ) {
      validationError = "Select whether you have done internship or not";
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

export const validateSignUpSix = (data) => {
  var isValid = false;
  var validationError = "";
  if (!data.name.length) {
    validationError = "Institute name is required";
    return { validationError, isValid };
  } else if (!data.passing_year.length) {
    validationError = "Year of passing is required";
    return { validationError, isValid };
  } else if (
    !(
      parseInt(data.passing_year) >= 1900 &&
      parseInt(data.passing_year) <= parseInt(moment().format("YYYY")) + 10
    )
  ) {
    validationError = `Year of passing should be between 1900 and ${
      parseInt(moment().format("YYYY")) + 7
    }`;
    return { validationError, isValid };
  } else if (
    !(data.qualification.old.length || data.qualification.new.length)
  ) {
    validationError = "Qualification is required";
    return { validationError, isValid };
  } else if (
    data.qualification.old.length + data.qualification.new.length !==
    1
  ) {
    validationError = "Only 1 qualification should be selected";
    return { validationError, isValid };
  } else if (!data.cgpa.length) {
    validationError = "CGPA is required";
    return { validationError, isValid };
  } else {
    isValid = true;
    return { validationError, isValid };
  }
};

export const validateSignUpSeven = (data) => {
  var isValid = true;
  var validationError = [];
  // var nameregex = /^[a-zA-Z0-9-\s]*$/;
  console.log("seven", data)

  data.forEach((value) => {
    if (!value.company_name.length) {
      if (
        value.job_title.length ||
        value.description.length ||
        value.start_date.length ||
        value.contact_name.length ||
        value.contact_email.length ||
        value.company_url
      ) {
        isValid = false;
        validationError.push(`Company name is required`);
      }
    } else if (value.company_name.length) {
      if (!value.job_title.length) {
        isValid = false;
        validationError.push(
          `Job title is required for company named, ${value.company_name}`
        );
      } else if (
        !(
          value.contact_email.length === 0 || validateEmail(value.contact_email)
        )
      ) {
        isValid = false;
        validationError.push(
          `Invalid contact person email for company named, ${value.company_name}`
        );
      } else if (!value.start_date.length) {
        isValid = false;
        validationError.push(
          `Start date should be selected for company named, ${value.company_name}`
        );
      } else if (
        !(value.company_url.length === 0 || validateURL(value.company_url))
      ) {
        isValid = false;
        validationError.push(
          `URL should be in correct format for company named, ${value.company_name}`
        );
      }
    }
  });

  return { validationError, isValid };
};

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
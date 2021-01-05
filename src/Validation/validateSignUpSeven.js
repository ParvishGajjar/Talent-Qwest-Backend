import { validateEmail, validateURL } from "./checkempty";

export const validateSignUpSeven = (data) => {
  var isValid = true;
  var validationError = [];
  // var nameregex = /^[a-zA-Z0-9-\s]*$/;

  data.forEach((value) => {
    if (!value.company_name.length) {
      if (
        value.job_title.length ||
        value.description.length ||
        value.start_date.length ||
        value.end_date.length ||
        value.cotact_name.length ||
        value.contact_email.length ||
        value.till_present.length ||
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

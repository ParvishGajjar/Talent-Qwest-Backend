import moment from "moment";
import { split } from "lodash";
import {
  HeadingLevel,
  Paragraph,
  TabStopType,
  TabStopPosition,
  TextRun,
  AlignmentType,
} from "docx";

export const createHeading = (text) => {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    thematicBreak: true,
  });
};

export const createSubHeading = (text) => {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
  });
};

export const createInstitutionHeader = (institutionName, dateText) => {
  return new Paragraph({
    tabStops: [
      {
        type: TabStopType.RIGHT,
        position: TabStopPosition.MAX,
      },
    ],
    children: [
      new TextRun({
        text: institutionName,
        bold: true,
      }),
      new TextRun({
        text: `\t${dateText}`,
        bold: true,
      }),
    ],
  });
};

export const createInstitutionRoleText = (role, cgpa) => {
  return new Paragraph({
    tabStops: [
      {
        type: TabStopType.RIGHT,
        position: TabStopPosition.MAX,
      },
    ],
    children: [
      new TextRun({
        text: role,
        italics: true,
      }),
      new TextRun({
        text: `\t${cgpa}`,
        italics: true,
        color: "grey",
      }),
    ],
  });
};

export const createSkillList = (skills) => {
  const formattedSkills = split(skills[0].skills, "|");
  return new Paragraph({
    children: [new TextRun(formattedSkills.join(", ") + ".")],
  });
};

export const createHobbyList = (skills) => {
    const formattedSkills = split(skills[0].hobbies, "|");
    return new Paragraph({
      children: [new TextRun(formattedSkills.join(", ") + ".")],
    });
  };

  export const createLanguageList = (skills) => {
    const formattedSkills = split(skills[0].languages, "|");
    return new Paragraph({
      children: [new TextRun(formattedSkills.join(", ") + ".")],
    });
  };

export const createInterests = (interests) => {
  return new Paragraph({
    children: [new TextRun(interests)],
  });
};

export const createRoleText = (roleText) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: roleText,
        italics: true,
      }),
    ],
  });
};

export const createBullet = (text) => {
  return new Paragraph({
    text: text,
    bullet: {
      level: 0,
    },
  });
};

export const splitParagraphIntoBullets = (text) => {
  return text.split("\n\n");
};

export const createPositionDateText = (startDate, endDate, isCurrent) => {
  const startDateText = moment(startDate).format("MMM. YYYY");
  const endDateText = isCurrent
    ? "Present"
    : `${moment(endDate).format("MMM. YYYY")}`;
  return `${startDateText} - ${endDateText}`;
};

export const createContactInfo = (phoneNumber, email) => {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun(`\n\nMobile: ${phoneNumber} | Email: ${email}`)],
  });
};

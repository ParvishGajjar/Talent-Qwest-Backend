import * as _ from "lodash";

// Variable is not Empty
function notEmpty(val) {
  if (_.isNumber(val)) {
    //Number Validation
    if (val !== null && val !== undefined) {
      return true;
    } else {
      return false;
    }
  } else if (_.isString(val)) {
    //String Validation
    if (!_.isEmpty(val) && val !== null && val !== undefined) {
      return true;
    } else {
      return false;
    }
  } else if (_.isObject(val)) {
    //Object Validation
    if (!_.isEmpty(val) && val !== null && val !== undefined) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function notUndefined(val) {
  if (_.isNumber(val)) {
    //Number Validation
    if (val !== undefined) {
      return true;
    } else {
      return false;
    }
  } else if (_.isString(val)) {
    //String Validation
    if (val !== undefined) {
      return true;
    } else {
      return false;
    }
  } else if (_.isObject(val)) {
    //Object Validation
    if (val !== undefined) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

// Validate Email Format.
function validateEmail(val) {
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(val);
}

// Validate URL Format
function validateURL(val) {
  var urlPattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  return urlPattern.test(val);
}

export { notEmpty, notUndefined, validateEmail, validateURL };

// router.post('/updateprofessiondata', isAuthenticated(), updateProfessionData)
// export const updateProfessionData = async (req,res)=>{
//   try {
//     let uid = req.user[0];
//     let usertype = req.body.usertype;
//     let proftitle = req.body.proftitle;
//     let company = req.body.company;
//     let website = req.body.website;

//     if (notEmpty(uid)) {
//       if (
//         usertype == "1" &&
//         !isEmpty(proftitle) &&
//         !isEmpty(company) &&
//         validateURL(website)
//       ) {
//         const result = await query(
//           `update user_profile set usertype=${usertype},proftitle=${proftitle},company=${company},website=${website} where uid=${uid};`
//         );
//         if (notEmpty(result)) {
//           console.log(result);
//           res
//             .status(200)
//             .json({ data: true, message: `Data Updated`, status: true });
//         } else {
//           throw "Couldn't Update Data";
//         }
//       } else if (usertype == "2" && !isEmpty(proftitle)) {
//         const result = await query(
//           `update user_profile set usertype=${usertype},proftitle=${proftitle},company=${company},website=${website} where uid=${uid};`
//         );
//         if (notEmpty(result)) {
//           console.log(result);
//           res
//             .status(200)
//             .json({ data: true, message: `Data Inserted`, status: true });
//         } else {
//           throw "Couldn't Update Data";
//         }
//       } else {
//         throw "Invalid Data";
//       }
//     } else {
//       throw "Unauthorized ";
//     }
//   } catch (error) {
//     console.error(error)
//     return res.status(400).json({ data: error, message: 'fail', status: false })
//   }
// }


// router.get('/getuserssimilarplatforms', isAuthenticated(), getUserSimilarPlatforms)

// export const getUserSimilarPlatforms = async (req, res) => {
//   try {
//     if (req.user[0].id) {
//       const platform = await query(
//         `select * from user_platform_list where user_id=${req.user[0].id};`
//       )
//       if (!isEmpty(platform)) {
//         console.log('Platforms Fetched')
//         return res
//           .status(200)
//           .json({ data: platform, message: 'Platforms Fetched', status: true })
//       } else {
//         console.log('Error fetching Platforms')
//         return res.status(400).json({
//           data: false,
//           message: 'Error fetching platforms',
//           status: false
//         })
//       }
//     } else {
//       console.log('User Authentication Failed')
//       return res.status(400).json({
//         data: false,
//         message: 'User Authentication Failed',
//         status: false
//       })
//     }
//   } catch (e) {
//     console.error(e)
//     return res.status(400).json({ data: e, message: 'fail', status: false })
//   }
// }


// Date: 08/09/2020

// Create table similarplatforms

//sql
// -> create table similarplatform (plat_id int auto_increment primary key, plat_name varchar(225) not null unique)

// Reason: Need to add table for similarplatform list so it can be dynamic and not static in frontend.

// <------------------------------------------> 

// [ RowDataPacket { id: 36, user_id: 46, name: 'linkedin' } ]

// Data
// {
//   "Platform":["linkedin","dribbble","fiverr","upwork"]
// }


// export const updateUserPrevPlatforms = async (req, res) => {
//   try {
//     if (req.user[0].id && !isEmpty(req.body.Platform)) {
//       const prevPlat = await query(
//         `select * from user_platform_list where user_id=${req.user[0].id}`
//       )
//       const oldPlat = []
//       prevPlat.forEach(item => {
//         oldPlat.push(item.name)
//       })

//       const newPlat = req.body.Platform

//       const plattodelete = _.difference(oldPlat, newPlat)
//       const plattoinsert = _.difference(newPlat, oldPlat)

//       let flagdel = 0
//       let complete0 = 0
//       plattodelete.forEach(async item => {
//         complete0 = await deletePrevPlatform(req.user[0].id, item, res)
//         if (complete0 === '1') {
//           flagdel++
//         }
//         if (flagdel === plattodelete.length) {
//           if (isEmpty(plattoinsert)) {
//             console.log('Data Updated Succesfully')
//             return res.status(200).json({
//               data: true,
//               message: 'Data Updated Succesfully',
//               status: true
//             })
//           }
//         }
//       })
//       let flagin = 0
//       let complete = 0
//       plattoinsert.forEach(async item => {
//         complete = await insertPrevPlatform(req.user[0].id, item, res)
//         if (complete === '1') {
//           flagin++
//         }
//         if (flagin === plattoinsert.length) {
//           console.log('Data Updated Succesfully')
//           return res.status(200).json({
//             data: true,
//             message: 'Data Updated Succesfully',
//             status: true
//           })
//         }
//       })
//       if (isEmpty(plattoinsert) && isEmpty(plattodelete)) {
//         console.log('No change seen')
//         return res.status(400).json({
//           data: false,
//           message: 'No change seen',
//           status: false
//         })
//       }
//     } else {
//       console.log('Invalid User Authentication')
//       return res.status(400).json({
//         data: false,
//         message: 'Invalid User Authentication',
//         status: false
//       })
//     }
//   } catch (e) {
//     console.error(e)
//     return res.status(400).json({ data: e, message: 'fail', status: false })
//   }
// }

// async function insertPrevPlatform(uid, pname, res, flagin) {
//   try {
//     const result = await query(
//       `insert into user_platform_list (user_id,name) values (${uid},'${pname}')`
//     )
//     return '1'
//   } catch (e) {
//     console.error(e)
//     return res.status(400).json({ data: e, message: 'fail', status: false })
//   }
// }

// async function deletePrevPlatform(uid, pname, res) {
//   try {
//     const result = await query(
//       `delete from user_platform_list where user_id=${uid} and name='${pname}'`
//     )
//     return '1'
//   } catch (e) {
//     console.error(e)
//     return res.status(400).json({ data: e, message: 'fail', status: false })
//   }
// }


// Server

// var db = mysql.createConnection({
//   // host: '157.245.140.101',
//   host: '52.15.61.22',
//   // user: 'node_server',
//   user:'test',
//   // password: 'qjas@#$dsgsw.,1m23poojDD',
//   password:'test',
//   // user: 'sanket',
//   // password: 'drake@11294',
//   // database: 'Workoscope'
//   database: 'workoscope'
// })

 // const sresult = await query(
      //   `insert into user_services (serviceid,userid) values(${serviceid},${uid});`
      // )
      // const result = await skills.map(async item => {
      //   var rs = await query(
      //     `insert into user_skills (userid,skills) values (${uid},${item});`
      //   )
      //   return rs
      // })
      // result.push(phresult)
      // result.push(sresult)
      // Promise.all(result)
      //   .then(() => {
      //     return res.status(200).json({
      //       data: true,
      //       message: 'Data Inserted Succesfully',
      //       status: true
      //     })
      //   })
      //   .catch(err => {
      //     console.log(err)
      //     return res.status(400).json({
      //       data: false,
      //       message: 'something went wrong',
      //       status: false
      //     })
      //   })
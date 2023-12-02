//import sql module
const mysql = require("mysql2");

//connect to mysql
var dbConn = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12666705",
  password: "QEiNYi3Dj5",
  database: "sql12666705",
});
// connect to database
dbConn.connect(function () {
  console.log("Database Connected");
});

//Login
const login = (data, done) => {
  username = data.username;
  password = data.password;
  dbConn.query(
    "SELECT trainer.*,COUNT(trainersuseremail.gymname) AS noofgyms , COUNT(trainersuseremail.email) AS noofstudents FROM trainer LEFT JOIN trainersuseremail ON trainer.trainerid = trainersuseremail.trainerid WHERE username = ? AND password = ?",
    [username, password],
    (error, results, fields) => {
      if (error) return done("Error occured while retriving user data");
      done(undefined, results);
    }
  );
  return;
};

// const getUser =(userid,done)=>{

//   dbConn.query(
//     "SELECT * from userr WHERE userid = ?",
//     [userid],
//     (error, results, fields) => {
//       if (error) return done("Error occured while retriving user data");
//       done(undefined, results);
//     }
//   );
//   return;

// }

const userlogin = (data, done) => {
  username = data.username;
  password = data.password;
  dbConn.query(
    "SELECT * from userr WHERE username = ? AND password = ?",
    [username, password],
    (error, results, fields) => {
      if (error) return done("Error occured while retriving user data");
      done(undefined, results);
    }
  );
  return;
};

// Users
const getUsers = (done) => {
  dbConn.query("SELECT * FROM userr", (error, results, fields) => {
    if (error) return done("Error occured while retriving user data");
    done(undefined, results);
  });
};
const getUserById = (userId, done) => {
  dbConn.query(
    "SELECT * FROM userr WHERE userid=?",
    userId,
    (error, results, fields) => {
      if (error) return done("Error occured while retriving userbyId data");
      if (results == "") {
        return done("No such user with Id " + userId);
      }
      done(undefined, results);
    }
  );
};

const getUserByTrainerId = (trainerId, done) => {
  dbConn.query(
    "SELECT * FROM userr WHERE trainerid=?",
    trainerId,
    (error, results, fields) => {
      if (error)
        return done("Error occured while retriving userbytrainerId data");
      if (results == "") {
        return done("No such user with Id " + trainerId);
      }
      done(undefined, results);
    }
  );
};
const saveUserDetails = (userDetails, done) => {
  // userDetails= JSON.parse(userDetails)
  console.log(userDetails);
  dbConn.query(
    "INSERT INTO userr SET ?",
    userDetails,
    (error, results, fields) => {
      if (error) return done(error);
      if (results == "") {
        return done("User not Added");
      }
      done(undefined, results);
    }
  );
};
const deleteUserById = (userId, done) => {
  dbConn.query(
    "DELETE FROM userr WHERE userid=?",
    [userId],
    (error, results, fields) => {
      if (error) return done("Error occured while deleting userbyId data");
      if (results.affectedRows === 0) {
        return done("No user with id " + userId);
      }
      done(undefined, results);
    }
  );
};

const updateUserByTrainerId = (trainerid, userid, done) => {
  dbConn.query(
    "UPDATE userr SET trainerid = ? WHERE userid = ?",
    [trainerid, userid],
    (error, results, fields) => {
      if (error) return done(error);
      if (results == "") {
        return done("No such user with Id " + userid);
      }
      done(undefined, results);
    }
  );
};

const updateUserData = (userid, data, done) => {
  const { weight, height, age, bodyfat, bmi , weightstatus} = data;
  dbConn.query(
    `UPDATE userr SET  weight = ? , height = ? , age = ? , bodyfat = ? , bmi = ? , weightstatus = ? WHERE userid = ${userid}`,
    [weight, height, age, bodyfat, bmi, weightstatus],

    (error, results, fields) => {
      if (error) return done(error);
      if (results == "") {
        return done("No such user with Id " + userid);
      }
      done(undefined, results);
    }
  );
};


const updateuserwithworkout = (userid,payload,done) => {
  const {workouttype} = payload;
  dbConn.query(
    `UPDATE userr SET  workouttype = ? WHERE userid = ${userid}`,workouttype,
   
    (error, results, fields) => {
      if (error)
        return done("Error occured ");
      if (results == "") {
        return done("No such trainer with id " + userid);
      }
      done(undefined, results);
    }
  );
};

const updateUserDiet = (userid, payload, done) => {
  const { diet, meal } = payload;
  dbConn.query(
    `UPDATE userr SET diet = ? , meal = ?  WHERE userid = ${userid}`,
    [diet, meal],
    (error, results, fields) => {
      if (error) return done(error);
      if (results == "") {
        return done("No such user with Id " + userid);
      }
      done(undefined, results);
    }
  );
};

const updateUserGym = (userid, payload, done) => {
  const { gymid, gymName, fee } = payload;

  dbConn.query(
    `UPDATE userr SET gymid = ? , gymName = ? , fee = ?  WHERE userid = ${userid}`,
    [gymid, gymName, fee],
    (error, results, fields) => {
      if (error) return done(error);
      if (results == "") {
        return done("No such user with Id " + userid);
      }
      done(undefined, results);
    }
  );
};

// const getUsersByTrainerId = (trainerid, done) => {
//   dbConn.query(
//     "SELECT * FROM userr WHERE trainerid=?",
//     trainerid,
//     (error, results, fields) => {
//       if (error) return done("Error occured while retriving gym by id data");
//       if (results == "") {
//         return done("No such gym with Id " + trainerid);
//       }
//       done(undefined, results);
//     }
//   );
// };

// Announcements
// const login = (data, done) => {
//   username = data.username;
//   password = data.password;
//   dbConn.query(
//     "SELECT trainer.*,trainerprofile.* FROM trainer LEFT JOIN trainerprofile ON trainer.trainerid = trainerprofile.trainerid WHERE username = ? AND password = ?",
//     [username, password],
//     (error, results, fields) => {
//       if (error) return done("Error occured while retriving user data");
//       done(undefined, results);
//     }
//   );
//   return;
// };
const getannouncements = (done) => {
  dbConn.query("SELECT * FROM announcement", (error, results, fields) => {
    if (error) return done("Error occured while retriving user data");
    done(undefined, results);
  });
};

const getAnnouncementById = (id, done) => {
  dbConn.query(
    "SELECT * FROM announcement WHERE id=?",
    id,
    (error, results, fields) => {
      if (error)
        return done("Error occured while retriving announcementbyId data");
      if (results == "") {
        return done("No such user with Id " + id);
      }
      done(undefined, results);
    }
  );
};

const deleteAnnouncementById = (id, done) => {
  dbConn.query(
    "DELETE FROM announcement WHERE id=?",
    [id],
    (error, results, fields) => {
      if (error)
        return done("Error occured while deleting announcementbyId data");
      if (results.affectedRows === 0) {
        return done("No user with id " + id);
      }
      done(undefined, results);
    }
  );
};

const getAnnouncementsByTrainerId = (trainerid, done) => {
  dbConn.query(
    "SELECT * FROM announcement WHERE trainerid=?",
    trainerid,
    (error, results, fields) => {
      if (error) return done("Error occured while retriving gym by id data");
      if (results == "") {
        return done("No such announcements with Id " + trainerid);
      }
      done(undefined, results);
    }
  );
};

// Trainers
const getTrainers = (done) => {
  dbConn.query("SELECT * FROM trainer", (error, results, fields) => {
    if (error) return done("Error occured while retriving trainer data");
    done(undefined, results);
  });
};
const getTrainerById = (trainerId, done) => {
  dbConn.query(
    "SELECT * FROM trainer WHERE Trainerid=?",
    trainerId,
    (error, results, fields) => {
      if (error)
        return done("Error occured while retriving trainer by id data");
      if (results == "") {
        return done("No such trainer with Id " + trainerId);
      }
      done(undefined, results);
    }
  );
};
const saveTrainerDetails = (trainerDetails, done) => {
  dbConn.query(
    "INSERT INTO trainer SET ?",
    trainerDetails,
    (error, results, fields) => {
      if (error) return done(error);
      if (results == "") {
        return done("Trainer not Added");
      }
      done(undefined, results);
    }
  );
};
const deleteTrainerById = (trainerId, done) => {
  dbConn.query(
    "DELETE FROM trainer WHERE trainerid = ?",
    [trainerId],
    (error, results, fields) => {
      if (error) return done("Error occured while deleting trainerbyId data");
      if (results.affectedRows === 0) {
        return done("No trainer with id " + trainerId);
      }
      done(undefined, results);
    }
  );
};
const getTrainerProfiles = (done) => {
  dbConn.query("SELECT * FROM trainerprofile", (error, results, fields) => {
    if (error)
      return done("Error occured while retriving trainer-profile data");
    done(undefined, results);
  });
};
const getTrainerProfileById = (trainerid, done) => {
  dbConn.query(
    "SELECT * FROM trainerprofile WHERE trainerid=?",
    trainerid,
    (error, results, fields) => {
      if (error) return done("Error occured while retriving gym by id data");
      if (results == "") {
        return done("No such gym with Id " + trainerid);
      }
      done(undefined, results);
    }
  );
};
const saveTrainerprofileDetails = (trainerprofileDetails, done) => {
  dbConn.query(
    "INSERT INTO trainerprofile SET ?",
    trainerprofileDetails,
    (error, results, fields) => {
      if (error) return done(error);
      if (results == "") {
        return done("trainer profile not Added");
      }
      done(undefined, results);
    }
  );
};

// Gyms
const getGyms = (done) => {
  dbConn.query("SELECT * FROM gym", (error, results, fields) => {
    if (error) return done("Error occured while retriving gym data");
    done(undefined, results);
  });
};
const getGymById = (gymId, done) => {
  dbConn.query(
    "SELECT * FROM gym WHERE gymid=?",
    gymId,
    (error, results, fields) => {
      if (error) return done("Error occured while retriving gym by id data");
      if (results == "") {
        return done("No such gym with Id " + gymId);
      }
      done(undefined, results);
    }
  );
};
const saveGymDetails = (gymDetails, done) => {
  dbConn.query(
    "INSERT INTO gym SET ?",
    gymDetails,
    (error, results, fields) => {
      if (error) return done(error);
      if (results == "") {
        return done("Gym not Added");
      }
      done(undefined, results);
    }
  );
};
const deleteGymById = (gymId, done) => {
  dbConn.query(
    "DELETE FROM gym WHERE gymid = ?",
    gymId,
    (error, results, fields) => {
      if (error) return done("Error occured while deleting gymbyId data");
      if (results.affectedRows == '00') {
        return done("No such gym with Id " + gymId);
      }
      done(undefined, results);
    }
  );
};
const registeredgyms = (gyms, done) => {
  dbConn.query("SELECT gymname FROM gym", gyms, (error, results, fields) => {
    if (error) return done("Error occured while retriving gyms");
    if (results == "") {
      return done("No any record");
    }
    done(undefined, results);
  });
};

const getGymsByTrainerId = (trainerid, done) => {
  dbConn.query(
    "SELECT * FROM gym WHERE trainerid=?",
    trainerid,
    (error, results, fields) => {
      if (error) return done("Error occured while retriving gym by id data");
      if (results == "") {
        return done("No such gym with Id " + trainerid);
      }
      done(undefined, results);
    }
  );
};

const updateGymByTrainerId = (trainerid, gymid, done) => {
  dbConn.query(
    "UPDATE gym SET trainerid = ? WHERE gymid = ?",
    [trainerid, gymid],
    (error, results, fields) => {
      if (error) return done(error);
      if (results == "") {
        return done("No such gym with Id " + trainerid);
      }
      done(undefined, results);
    }
  );
};

// Diets
const getDiets = (done) => {
  dbConn.query("SELECT * FROM diet", (error, results, fields) => {
    if (error) return done("Error occured while retriving diet data");
    done(undefined, results);
  });
};
const getDietById = (dietId, done) => {
  dbConn.query(
    "SELECT * FROM diet WHERE dietid=?",
    dietId,
    (error, results, fields) => {
      if (error) return done("Error occured while retriving diet by id data");
      if (results == "") {
        return done("No such diet with Id " + dietId);
      }
      done(undefined, results);
    }
  );
};
const saveDietDetails = (dietDetails, done) => {
  dbConn.query(
    "INSERT INTO diet SET ?",
    dietDetails,
    (error, results, fields) => {
      if (error) return done(error);
      if (results == "") {
        return done("diet not Added");
      }
      done(undefined, results);
    }
  );
};
const deleteDietById = (dietId, done) => {
  dbConn.query(
    "DELETE FROM diet WHERE dietid = ?",
    dietId,
    (error, results, fields) => {
      if (error) return done("Error occured while deleting dietbyId data");
      if (results.affectedRows == 0) {
        return done("No such diet with Id " + dietId);
      }
      done(undefined, results);
    }
  );
};
const saveAnnouncementDetails = (announcementDetails, done) => {
  dbConn.query(
    "INSERT INTO announcement SET ?",
    announcementDetails,
    (error, results, fields) => {
      if (error) return done(error);
      if (results == "") {
        return done("announcement not Added");
      }
      done(undefined, results);
    }
  );
};

// Payments
const getPayments = (done) => {
  dbConn.query("SELECT * FROM payment", (error, results, fields) => {
    if (error) return done("Error occured while retriving user data");
    done(undefined, results);
  });
};
const savePaymentDetails = (paymentDetails, done) => {
  dbConn.query(
    "INSERT INTO payment SET ?",
    paymentDetails,
    (error, results, fields) => {
      if (error) return done(error);
      if (results == "") {
        return done("payment not Added");
      }
      done(undefined, results);
    }
  );
};

// Sessions
const getSessions = (done) => {
  dbConn.query("SELECT * FROM session", (error, results, fields) => {
    if (error) return done("Error occured while retriving user data");
    done(undefined, results);
  });
};
const saveSessionDetails = (sessionDetails, done) => {
  dbConn.query(
    "INSERT INTO session SET ?",
    sessionDetails,
    (error, results, fields) => {
      if (error) return done(error);
      if (results == "") {
        return done("session not Added");
      }
      done(undefined, results);
    }
  );
};

// Tasks
const getTasks = (done) => {
  dbConn.query("SELECT * FROM task", (error, results, fields) => {
    if (error) return done("Error occured while retriving user data");
    done(undefined, results);
  });
};
const getTaskById = (taskid, done) => {
  dbConn.query(
    "SELECT * FROM task WHERE taskid=?",
    taskid,
    (error, results, fields) => {
      if (error) return done("Error occured while retriving userbyId data");
      if (results == "") {
        return done("No such user with Id " + taskid);
      }
      done(undefined, results);
    }
  );
};
const deleteTaskById = (taskid, done) => {
  dbConn.query(
    "DELETE FROM task WHERE taskid=?",
    [taskid],
    (error, results, fields) => {
      if (error) return done("Error occured while deleting taskbyId data");
      if (results.affectedRows === 0) {
        return done("No user with id " + taskid);
      }
      done(undefined, results);
    }
  );
};
const saveTaskDetails = (taskDetails, done) => {
  dbConn.query(
    "INSERT INTO task SET ?",
    taskDetails,
    (error, results, fields) => {
      if (error) return done(error);
      if (results == "") {
        return done("task not Added");
      }
      done(undefined, results);
    }
  );
};

// Meals
const getMeals = (done) => {
  dbConn.query("SELECT * FROM meal", (error, results, fields) => {
    if (error) return done("Error occured while retriving user data");
    done(undefined, results);
  });
};
const saveMealDetails = (mealDetails, done) => {
  dbConn.query(
    "INSERT INTO meal SET ?",
    mealDetails,
    (error, results, fields) => {
      if (error) return done(error);
      if (results == "") {
        return done("meal not Added");
      }
      done(undefined, results);
    }
  );
};
const emailsofstudents = (emails, done) => {
  dbConn.query("SELECT email FROM userr", emails, (error, results, fields) => {
    if (error) return done("Error occured while retriving emails of users");
    if (results == "") {
      return done("No any record");
    }
    done(undefined, results);
  });
};

const gettraineridbyemail = (email, done) => {
  dbConn.query(
    "SELECT Trainerid FROM trainer WHERE email=?", email, (error, results, fields) => {
      if (error)
        return done("Error occured while retriving trainerid by email");
      if (results == "") {
        return done("No such trainer with email " + email);
      }
      done(undefined, results);
    }
  );
};


const gethalfgymdata = (done) => {
  dbConn.query("SELECT gymid, gymname, address, contact, email, monthlyfee, registrationfee, website, starttiming, endtiming, description FROM gym", (error, results, fields) => {
    if (error) return done("Error occured while retriving user data");
    done(undefined, results);
  });
};

const updategymdescriptionbyid = (gymid,description, done) => {
  dbConn.query(
    "UPDATE gym SET description = ? WHERE gymid = ?",
    [gymid,description],
    (error, results, fields) => {
      if (error) return done(error);
      if (results == "") {
        return done("No such gym with Id " + gymid);
      }
      done(undefined, results);
    }
  );
};

const gettrainersbygym = (payload, done) => {
  dbConn.query(
    "SELECT Trainerid,firstname,fee,rating FROM trainer WHERE gymname=?", payload, (error, results, fields) => {
      if (error)
        return done("Error occured while retriving trainer by gymname");
      if (results == "") {
        return done("No such gym with this name " + payload);
      }
      done(undefined, results);
    }
  );
};


module.exports = {
  getUsers,
  getDiets,
  getGyms,
  updateGymByTrainerId,
  updateUserGym,
  updateUserByTrainerId,
  updateUserData,
  updateUserDiet,
  getTrainers,
  getTrainerProfiles,
  login,
  userlogin,
  getannouncements,
  getPayments,
  getSessions,
  getTasks,
  getMeals,
  getUserById,
  getTrainerById,
  getDietById,
  getGymById,
  getAnnouncementById,
  getAnnouncementsByTrainerId,
  getTaskById,
  getUserByTrainerId,
  getGymsByTrainerId,
  saveUserDetails,
  saveTrainerDetails,
  saveTrainerprofileDetails,
  saveDietDetails,
  saveGymDetails,
  saveAnnouncementDetails,
  savePaymentDetails,
  saveSessionDetails,
  saveTaskDetails,
  saveMealDetails,
  deleteUserById,
  deleteTrainerById,
  deleteDietById,
  deleteGymById,
  deleteAnnouncementById,
  deleteTaskById,
  emailsofstudents,
  registeredgyms,
  getTrainerProfileById,
  gettraineridbyemail,
  updateuserwithworkout,
  gethalfgymdata,
  updategymdescriptionbyid,
  gettrainersbygym,
};

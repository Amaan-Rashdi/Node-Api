//import the modules require
const express = require("express");
const router = express.Router();
const usersDao = require("./userDao");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
require("dotenv/config");

const stripe = require("stripe")(
  "sk_test_51MCI4ISJT3X6Q6qZyqpuEh9Rvr3hZS5m67JRc06o8UZyrR1T0WlvbmBkQPPSIJxtyIypJjZ9JxUEgWpclYMX9FJc00sCV9wcBF"
);

router.get("/", (req, res) => {
  return res.send({ name: "Hellow Users" });
});

router.get("/", (req, res) => {
  return res.send({ name: "Hellow Users" });
});

//Announcements
router.get("/announcements", (req, res) => {
  try {
    usersDao.getannouncements((err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});
router.get("/announcements/:id", (req, res) => {
  try {
    const id = req.params.id;
    usersDao.getAnnouncementById(id, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results[0] });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});
router.delete("/announcements/:id", (req, res) => {
  try {
    const id = req.params.id;
    if (!id || id < 0) return res.send("Id not entered");
    usersDao.deleteAnnouncementById(id, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({
        status: "OK",
        data: results,
        message: "announcement deleted successfully",
      });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});
router.post("/announcement", (req, res) => {
  try {
    const announcementDetails = req.body;
    if (!announcementDetails) {
      return res.status(400).send("Announcement data not provided in body");
    }
    usersDao.saveAnnouncementDetails(announcementDetails, (err, results) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res.status(201).send({
        status: "OK",
        data: results,
        message: "New Announcement Added",
      });
    });
  } catch (err) {
    //Handle the exception return response as 400 with status as some error msg
    return res.status(400).send(err);
  }
});

//Trainers
router.post("/trainer/login", (req, res) => {
  const data = req.body;
  const username = data.username;
  const password = data.password;
  // let data = (req.body)
  // var user = data.username;
  // var password = data.password;
  const secret = process.env.secret;
  if (username == null) {
    return res.status(400).send("The user not found");
  }

  if (!username && !password) {
    return res.status(400).send("user data not provided in body");
  }
  usersDao.login(data, (err, results) => {
    if (results == "") {
      return res
        .status(400)
        .send({ status: "OK", data: results, message: "invalid credientials" });
    }
    if (err) {
      return res.status(400).send(err);
    }
    const token = jwt.sign(
      {
        username: username,
        // isAdmin: user.isAdmin
      },
      "secret",
      { expiresIn: "1d" }
    );

    //res.status(400).send({user: user , token: token})

    return res.status(201).send({
      status: "OK",
      token: token,
      data: results,
      message: "Login successfully",
    });
  });
});

router.get("/trainers", (req, res) => {
  try {
    usersDao.getTrainers((err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});
router.get("/trainers/:trainerId", (req, res) => {
  try {
    const trainerId = req.params.trainerId;
    usersDao.getTrainerById(trainerId, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results[0] });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});
router.post("/trainer", (req, res) => {
  try {
    const trainerDetails = req.body;
    //  const obj = res.body;
    // // const msg = JSON.parse(obj);
    //  console.log(obj)
    if (!trainerDetails) {
      return res.status(400).send("trainer data not provided in body");
    }
    usersDao.saveTrainerDetails(trainerDetails, (err, results) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res
        .status(201)
        .send({ status: "OK", data: results, message: "New trainer Added" });
    });
  } catch (err) {
    //Handle the exception return response as 400 with status as some error msg
    return res.status(400).send(err);
  }
});
router.delete("/trainers/:trainerId", (req, res) => {
  try {
    const trainerId = req.params.trainerId;
    usersDao.deleteTrainerById(trainerId, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({
        status: "OK",
        data: results,
        message: "Trainer deleted successfully",
      });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.get("/trainer-profiles", (req, res) => {
  try {
    usersDao.getTrainerProfiles((err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});
router.get("/trainer-profiles/:trainerId", (req, res) => {
  const trainerid = req.params.trainerId;
  if (!trainerid || trainerid < 0) return res.send("Trainer id not entered");
  try {
    usersDao.getTrainerProfileById(trainerid, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.post("/trainer-profile", (req, res) => {
  try {
    const trainerprofileDetails = req.body;
    if (!trainerprofileDetails) {
      return res.status(400).send("Trainer profile data not provided in body");
    }
    usersDao.saveTrainerprofileDetails(
      trainerprofileDetails,
      (err, results) => {
        if (err) {
          return res.status(400).send(err);
        }
        return res.status(201).send({
          status: "OK",
          data: results,
          message: "Trainer profile Added",
        });
      }
    );
  } catch (err) {
    //Handle the exception return response as 400 with status as some error msg
    return res.status(400).send(err);
  }
});

router.get("/trainer/gyms/:trainerId", (req, res) => {
  try {
    const trainerId = req.params.trainerId;
    if (!trainerId || trainerId < 0) return res.send("trainerId not entered");
    usersDao.getGymsByTrainerId(trainerId, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.get("/trainer/students/:trainerId", (req, res) => {
  try {
    const trainerId = req.params.trainerId;
    if (!trainerId || trainerId < 0) return res.send("trainerId not entered");

    usersDao.getUserByTrainerId(trainerId, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.get("/trainer/announcements/:trainerId", (req, res) => {
  try {
    const trainerId = req.params.trainerId;
    if (!trainerId || trainerId < 0) return res.send("trainerId not entered");

    usersDao.getAnnouncementsByTrainerId(trainerId, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

//Users

router.post("/user/login", (req, res) => {
  const data = req.body;
  const username = data.username;
  const password = data.password;
  // let data = (req.body)
  // var user = data.username;
  // var password = data.password;
  const secret = process.env.secret;
  if (username == null) {
    return res.status(400).send("The user not found");
  }

  if (!username && !password) {
    return res.status(400).send("user data not provided in body");
  }
  usersDao.userlogin(data, (err, results) => {
    if (results == "") {
      return res
        .status(400)
        .send({ status: "OK", data: results, message: "invalid credientials" });
    }
    if (err) {
      return res.status(400).send(err);
    }
    const token = jwt.sign(
      {
        username: username,
        // isAdmin: user.isAdmin
      },
      "secret",
      { expiresIn: "1d" }
    );

    //res.status(400).send({user: user , token: token})

    return res.status(201).send({
      status: "OK",
      token: token,
      data: results,
      message: "Login successfully",
    });
  });
});

router.get("/users", (req, res) => {
  try {
    usersDao.getUsers((err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.delete("/users/:userId", (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId || userId < 0) return res.send("userId not entered");
    usersDao.deleteUserById(userId, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({
        status: "OK",
        data: results,
        message: "User deleted successfully",
      });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.get("/users/:userId", (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId || userId < 0) return res.send("userId not entered");
    usersDao.getUserById(userId, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results[0] });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.get("/usersbytrainerid/:trainerId", (req, res) => {
  try {
    const trainerId = req.params.trainerId;
    if (!trainerId || trainerId < 0) return res.send("trainerId not entered");
    usersDao.getUserByTrainerId(trainerId, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.post("/user", (req, res) => {
  try {
    const userDetails = req.body;
    if (!userDetails) {
      return res.status(400).send("user data not provided in body");
    }
    usersDao.saveUserDetails(userDetails, (err, results) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res
        .status(201)
        .send({ status: "OK", data: results, message: "New user Added" });
    });
  } catch (err) {
    //Handle the exception return response as 400 with status as some error msg
    return res.status(400).send(err);
  }
});

router.patch("/user/:userId", (req, res) => {
  try {
    const userid = req.params.userId;
    const trainerid = req.body.trainerid;

    usersDao.updateUserByTrainerId(trainerid, userid, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({
        status: "OK",
        data: results,
        message: "Gym Trainer Updated successfully",
      });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.patch("/user/data/:userId", (req, res) => {
  try {
    const userid = req.params.userId;

    usersDao.updateUserData(userid, req.body, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({
        status: "OK",
        data: results,
        message: "User Data Updated successfully",
      });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});
router.patch("/user/workout/:userId", (req, res) => {
  try {
    const userid = req.params.userId;

    usersDao.updateuserwithworkout(userid, req.body, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({
        status: "OK",
        data: results,
        message: "User Data Updated successfully",
      });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.patch("/user/data/:userId", (req, res) => {
  try {
    const userid = req.params.userId;

    usersDao.updateUserData(userid, req.body, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({
        status: "OK",
        data: results,
        message: "User Data Updated successfully",
      });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.patch("/user/diet/:userId", (req, res) => {
  try {
    const userid = req.params.userId;

    usersDao.updateUserDiet(userid, req.body, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({
        status: "OK",
        data: results,
        message: "User Data Updated successfully",
      });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.patch("/user/gym/:userId", (req, res) => {
  try {
    const userid = req.params.userId;

    usersDao.updateUserGym(userid, req.body, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({
        status: "OK",
        data: results,
        message: "User Gym Updated successfully",
      });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.post("/payment-sheet", async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const { amount, currency, name } = req.body;

  const customer = await stripe.customers.create({
    name,
    address: {
      line1: "Bahria Town Phase 2",
      postal_code: "75340",
      city: "Karachi",
      state: "Sindh",
      country: "Pakistan",
    },
  });
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2022-11-15" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    description: "Fitness partner processing fee",
    shipping: {
      name: "Aman Shah",
      address: {
        line1: "510 Townsend St",
        postal_code: "75340",
        city: "Karachi",
        state: "Sindh",
        country: "Pakistan",
      },
    },

    amount: amount,
    currency: currency || "inr",
    customer: customer.id,

    automatic_payment_methods: {
      enabled: true,
    },
    // payment_method: "card",
    // payment_method_types: ["card"],
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey:
      "pk_test_51MCI4ISJT3X6Q6qZfCuSKAWMmWz4SlhQ2N911GZdUko1J8a3odVPNJgT7cL6FiCgwCPx0KDGMiponEZfbOVAzKkr005LRTpIHT",
  });
});

router.post("/login", (req, res) => {
  const data = req.body;
  const username = data.username;
  const password = data.password;
  // let data = (req.body)
  // var user = data.username;
  // var password = data.password;
  const secret = process.env.secret;
  if (username == null) {
    return res.status(400).send("The user not found");
  }

  if (!username && !password) {
    return res.status(400).send("user data not provided in body");
  }
  usersDao.login(data, (err, results) => {
    if (results == "") {
      return res
        .status(400)
        .send({ status: "OK", data: results, message: "invalid credientials" });
    }
    if (err) {
      return res.status(400).send(err);
    }
    const token = jwt.sign(
      {
        username: username,
        // isAdmin: user.isAdmin
      },
      "secret",
      { expiresIn: "1d" }
    );

    //res.status(400).send({user: user , token: token})

    return res.status(201).send({
      status: "OK",
      token: token,
      data: results,
      message: "Login successfully",
    });
  });
});

//server.js
const multer = require("multer");
// SET STORAGE
const videoStorage = multer.diskStorage({
  // destination: "videos", // Destination to store video

  destination: (req, file, cb) => {
    const { userType, id } = req.params;
    const directory = `videos/${userType}/${id}`;

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    cb(null, directory);
  },

  filename: (req, file, cb) => {
    const { userType, id } = req.params;
    cb(
      null,
      userType +
        "-" +
        id +
        "-" +
        file.originalname.split(".")[0] +
        path.extname(file.originalname)
    );
  },
});

const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 10000000, // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
    // upload only mp4 and mkv format
    if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
      return cb(new Error("Please upload a video"));
    }
    cb(undefined, true);
  },
});

// Video Uploads
router.post(
  "/videos/:userType/:id",
  videoUpload.single("video"),
  (req, res) => {
    try {
      res.json({ message: "Successfully uploaded videos" });
    } catch (error) {
      console.log(error);
    }
  }
);

router.get("/videos/:userType/:id", (req, res) => {
  try {
    const { userType, id } = req.params;
    const videosFolder = path.resolve(__dirname, `../videos/${userType}/${id}`);
    var videosNames = [];

    if (fs.existsSync(videosFolder)) {
      fs.readdirSync(videosFolder).forEach((file) => {
        videosNames.push(file);
      });
      res.json({ message: "Videos Names", videos: videosNames, success: true });
    } else {
      res.status(404).send({ message: "No such directory found" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/download/:userType/:id/:filename", function (req, res) {
  try {
    const { userType, id, filename } = req.params;
    console.log(req.params);
    const videosFolder = path.resolve(__dirname, `../videos/${userType}/${id}`);

    const file = videosFolder + "/" + filename;
    console.log("File=========");
    console.log(file);
    res.download(file); // Set disposition and send it.
  } catch (error) {
    res.status(500).send({ errorMessage: error });
  }
});

//  Diets

// router.post("/login", (req, res) => {
//   try {
//         const data = (req.body)
//        const username = data.username;
//         const password= data.password;

//         if(!username && !password){
//           return res.status(400).send("user data not provided in body")
//         }
//         usersDao.login(data, (err, results) => {
//           if (results=="")
//           {
//             return res.status(400).send({status:"OK",data:results,message:"invalid credientials"})
//           }
//           if(err){
//             return res.status(400).send(err)
//            }
//            return res.status(201).send({status:"OK",data:results,message:"Login successfully"})
//         });

//       } catch (err) {
//           //Handle the exception return response as 400 with status as some error msg
//           return res.status(400).send(err)
//       }
// });

// Diets
router.get("/diets", (req, res) => {
  try {
    usersDao.getDiets((err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});
router.get("/diets/:dietId", (req, res) => {
  try {
    const dietId = req.params.dietId;
    usersDao.getDietById(dietId, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results[0] });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});
router.post("/diet", (req, res) => {
  try {
    const dietDetails = req.body;
    if (!dietDetails) {
      return res.status(400).send("Diet data not provided in body");
    }
    usersDao.saveDietDetails(dietDetails, (err, results) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res
        .status(201)
        .send({ status: "OK", data: results, message: "New Diet Added" });
    });
  } catch (err) {
    //Handle the exception return response as 400 with status as some error msg
    return res.status(400).send(err);
  }
});
router.delete("/diets/:dietId", (req, res) => {
  try {
    const dietId = req.params.dietId;
    usersDao.deleteDietById(dietId, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({
        status: "OK",
        data: results,
        message: "Diet deleted successfully",
      });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

//Gyms
router.get("/gyms", (req, res) => {
  try {
    usersDao.getGyms((err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});
router.get("/gyms/:gymId", (req, res) => {
  try {
    const gymId = req.params.gymId;
    usersDao.getGymById(gymId, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results[0] });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});
router.post("/gym", (req, res) => {
  try {
    const gymDetails = req.body;
    if (!gymDetails) {
      return res.status(400).send("Gym data not provided in body");
    }
    usersDao.saveGymDetails(gymDetails, (err, results) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res
        .status(201)
        .send({ status: "OK", data: results, message: "New Gym Added" });
    });
  } catch (err) {
    //Handle the exception return response as 400 with status as some error msg
    return res.status(400).send(err);
  }
});

router.patch("/gym/:gymId", (req, res) => {
  try {
    const gymid = req.params.gymId;
    const trainerid = req.body.trainerid;

    usersDao.updateGymByTrainerId(trainerid, gymid, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({
        status: "OK",
        data: results,
        message: "Gym Trainer Updated successfully",
      });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.delete("/gyms/:gymId", (req, res) => {
  try {
    const gymId = req.params.gymId;
    usersDao.deleteGymById(gymId, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({
        status: "OK",
        data: results,
        message: "Gym deleted successfully",
      });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});
router.get("/registeredgyms", (req, res) => {
  try {
    usersDao.registeredgyms((err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.get("/payments", (req, res) => {
  try {
    usersDao.getPayments((err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.post("/payment", (req, res) => {
  try {
    const paymentDetails = req.body;
    if (!paymentDetails) {
      return res.status(400).send("Payment data not provided in body");
    }
    usersDao.savePaymentDetails(paymentDetails, (err, results) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res
        .status(201)
        .send({ status: "OK", data: results, message: "New Payment Added" });
    });
  } catch (err) {
    //Handle the exception return response as 400 with status as some error msg
    return res.status(400).send(err);
  }
});

router.get("/sessions", (req, res) => {
  try {
    usersDao.getSessions((err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.post("/session", (req, res) => {
  try {
    const sessionDetails = req.body;
    if (!sessionDetails) {
      return res.status(400).send("Session data not provided in body");
    }
    usersDao.saveSessionDetails(sessionDetails, (err, results) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res
        .status(201)
        .send({ status: "OK", data: results, message: "New Session Added" });
    });
  } catch (err) {
    //Handle the exception return response as 400 with status as some error msg
    return res.status(400).send(err);
  }
});

//Tasks
router.get("/tasks", (req, res) => {
  try {
    usersDao.getTasks((err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.get("/tasks/:taskid", (req, res) => {
  try {
    const taskid = req.params.taskid;
    usersDao.getTaskById(taskid, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results[0] });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.delete("/tasks/:taskid", (req, res) => {
  try {
    const taskid = req.params.taskid;
    if (!taskid || taskid < 0) return res.send("taskid not entered");
    usersDao.deleteTaskById(taskid, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({
        status: "OK",
        data: results,
        message: "Task deleted successfully",
      });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.post("/task", (req, res) => {
  try {
    const taskDetails = req.body;
    if (!taskDetails) {
      return res.status(400).send("Task data not provided in body");
    }
    usersDao.saveTaskDetails(taskDetails, (err, results) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res
        .status(201)
        .send({ status: "OK", data: results, message: "New Task Added" });
    });
  } catch (err) {
    //Handle the exception return response as 400 with status as some error msg
    return res.status(400).send(err);
  }
});

//Meals
router.get("/meals", (req, res) => {
  try {
    usersDao.getMeals((err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.post("/meal", (req, res) => {
  try {
    const mealDetails = req.body;
    if (!mealDetails) {
      return res.status(400).send("Meal data not provided in body");
    }
    usersDao.saveMealDetails(mealDetails, (err, results) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res
        .status(201)
        .send({ status: "OK", data: results, message: "New Meal Added" });
    });
  } catch (err) {
    //Handle the exception return response as 400 with status as some error msg
    return res.status(400).send(err);
  }
});

router.get("/emails", (req, res) => {
  try {
    usersDao.emailsofstudents((err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});
router.get("/trainersemail/:email", (req, res) => {
  try {
    const email = req.params.email;
    usersDao.gettraineridbyemail(email, (err, results) => {
      if (err) return res.status(400).send(err);
      console.log(email)
      return res.status(200).send({ status: "OK", data: results[0] });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.get("/halfgym/", (req, res) => {
  try {
    usersDao.gethalfgymdata((err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ status: "OK", data: results });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.patch("/gyms/update/:gymId", (req, res) => {
  try {
    const gymid = req.params.gymId;
    const description = req.body.description;

    usersDao.updategymdescriptionbyid(gymid,description, (err, results) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({
        status: "OK",
        data: results,
        message: "Gym description Updated successfully",
      });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

router.get("/trainergym/:gymname", (req, res) => {
  try {
    const gymname = req.params.gymname;
    usersDao.gettrainersbygym(gymname, (err, results) => {
      if (err) return res.status(400).send(err);
      console.log(gymname)
      return res.status(200).send({ status: "OK", data: results[0] });
    });
  } catch (err) {
    res.send(400).send(err);
  }
});

module.exports = router;

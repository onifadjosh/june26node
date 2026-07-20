const UserModel = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer= require("nodemailer")
const cloudinary= require("cloudinary").v2


cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_KEY,
  api_secret:process.env.CLOUD_SECRET
})

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.APP_MAIL,
    pass: process.env.APP_PASSWORD
  }
});



const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, profilePicture } = req.body;
  try {
    const saltround = 10;
    const hashedPassword = await bcryptjs.hash(password, saltround);

    const image= await cloudinary.uploader.upload(profilePicture)


    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profilePicture:{
        secure_url:image.secure_url,
        public_id:image.public_id
      }
    });

    const token = await jwt.sign({ id: user._id }, process.env.AUTH_SECRET, {
      expiresIn: "5h",
    });

          let mailOptions = {
        from: process.env.APP_MAIL,
        to: ["${email}", "davidoladipo2025@gmail.com", "olapademukhtarmotilola@gmail.com", "shiffy78@gmail.com", "adeyemifavour615@gmail.com"],
        subject: "Welcome to my app",
        text: `Welcome to June 26 app ${firstName}`
      };


      transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

    res.status(201).send({
      message: "User registered succesfully",
      data: {
        id:user._id,
        firstName,
        lastName,
        email,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    if (error.code == 11000) {
      res.status(400).send({
        message: "user already exist",
      });
    } else {
      res.status(400).send({
        message: "user cannot be created at this time",
      });
    }
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const isUser = await UserModel.findOne({ email }).select("+password");
    console.log(isUser);

    if (!isUser) {
      console.log("no user");

      res.status(404).send({
        message: "invalid credentials",
      });

      return;
    }

    const isMatch = await bcryptjs.compare(password, isUser.password);

    if (!isMatch) {
      console.log("no match");

      res.status(400).send({
        message: "invalid credentials",
      });

      return;
    }

    const token = await jwt.sign({ id: isUser._id }, process.env.AUTH_SECRET, {
      expiresIn: "5h",
    });

    res.status(200).send({
      message: "user login successful",
      data: {
        firstName: isUser.firstName,
        lastName: isUser.lastName,
        email: isUser.email,
        id: isUser._id,
      },
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      message: "invalid credentials",
    });
  }
};

const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
    ? req.headers.authorization?.split(" ")[1]
    : req.headers.authorization?.split(" ")[0];

    try {
       jwt.verify(token, process.env.AUTH_SECRET, function(err, decoded){
        if (err) {
            res.status(401).send({
                message:"user unathourized"
            })
        }else{
            console.log(decoded);

            req.user = decoded.id
            next()
            
        }
        
       }) 
    } catch (error) {
        console.log(error);
        res.status(401).send({
              message:"user unathourized"
        })
        
    }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const isUser = await UserModel.findById(id);
    if (!isUser) {
      res.status(400).send({
        message: "error deleting user",
      });

      return;
    }

    const deleted = await UserModel.findByIdAndDelete(id);
    if (!deleted) {
      res.status(400).send({
        message: "error deleting user",
      });

      return;
    }

    res.status(204).send({
      message: "user deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      message: "error deleting user",
    });
  }
};

const updateUser = async (req, res) => {
  const { firstName, lastName } = req.body;
  const { id } = req.params;
  try {
    const isUser = await UserModel.findById(id);
    if (!isUser) {
      res.status(400).send({
        message: "error updating user",
      });

      return;
    }

    const allowedUpdate = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
    };

    const updatedUser = await UserModel.findByIdAndUpdate(id, allowedUpdate, {
      returnDocument: "after",
    });

    if (!updatedUser) {
      res.status(400).send({
        message: "error updating user",
      });

      return;
    }

    res.status(200).send({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      message: "error updating user",
    });
  }
};

const getAllUsers= async(req, res)=>{
    try {
        const users = await UserModel.find()

        res.status(200).send({
            message:"users fetched successfully",
            data:users
        })
    } catch (error) {
        console.log(error);

         res.status(400).send({
            message:"users failed to fetch",
        })
        
    }
}

module.exports = {
  registerUser,
  loginUser,
  deleteUser,
  updateUser,
  verifyUser,
  getAllUsers
};

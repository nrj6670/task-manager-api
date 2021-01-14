const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tasks = require("./task");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,

      lowercase: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    age: {
      type: Number,
      default: 0,
    },

    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length <= 6) {
          throw new Error("Password must be of length greater than 6");
        }

        if (value.toLowerCase().includes("password")) {
          throw new Error(`Cannot set password as '${value}'`);
        }
      },
    },

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],

    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("tasks", {
  ref: "tasks",
  localField: "_id",
  foreignField: "author",
});

userSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

//user schema to store hashed password
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

//user schema to remove all the tasks associated with a user whenver a user is removed
userSchema.pre("remove", async function (next) {
  const user = this;
  await Tasks.deleteMany({ author: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

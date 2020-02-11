const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const validator = require("validator");

const jwt = require("jsonwebtoken");
// defining the schema for the user model which includes validation and roles defined into either basic or admin roles also there is the accessWebToken object used to access the jsonwebToken value

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Use a valid Email");
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength:6
    
  },
  role: {
    type: String,
    default: "basic",
    enum: ["basic", "admin"]
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }]
});

 userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  // delete userObject.avatar;
  delete userObject.tokens;
  return userObject;
};

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });

  await user.save();
  return token;
};


// algorithm to hash password
// to hash the plain text password before saving
userSchema.pre('save', async function (next){
  const user = this;
if(user.isModified('password')){
  user.password = await bcrypt.hash(user.password,8);
}
  next()
})

// an algorithm to compare an authenticate passwords
userSchema.statics.findByCredentials = async (email, password) => {
  // const User = this;
  const user = await User.findOne({email});
  if (!user) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password,user.password) 

  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

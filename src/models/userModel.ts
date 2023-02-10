import {Model, Schema, HydratedDocument,model} from 'mongoose'
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {Journal} from "./journalModel";
import {OwnedStock} from "./ownedStockModel";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  passwordResetToken?: string;
  tokens: string[];
  isSuperuser: boolean;
}

interface IUserMethods {
  toJSON(): object;
  generatePasswordResetToken():Promise<string>;
  generateAuthToken():Promise<string>;
}

export interface UserModel extends Model<IUser, {}, IUserMethods> {
  findByCredentials(email: string, password: string): Promise<HydratedDocument<IUser, IUserMethods>>;
}


const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: false,
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain "password"');
        }
      },
    },
    passwordResetToken: {
      type: String,
      required: false,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    isSuperuser: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("journals", {
  ref: "Journal",
  localField: "_id",
  foreignField: "owner",
});

userSchema.virtual("ownedStocks", {
  ref: "OwnedStock",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  // hide unnecessary fields
  delete userObject.__v;
  delete userObject.password;
  delete userObject.tokens;
  // delete userObject.createdAt;
  // delete userObject.updatedAt;
  // delete userObject.isSuperuser;
  return userObject;
};

userSchema.methods.generatePasswordResetToken = async function ():Promise<string> {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.PASSWORD_RESET_KEY, {
    expiresIn: "20 minutes",
  });
  user.passwordResetToken = token;
  await user.save();
  return token;
};

userSchema.methods.generateAuthToken = async function ():Promise<string> {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
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

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  await Journal.deleteMany({ owner: user._id });
  await OwnedStock.deleteMany({ owner: user._id });
  next();
});

export const User = model<IUser, UserModel, IUserMethods>("User", userSchema);

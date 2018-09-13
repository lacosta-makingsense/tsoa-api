import { Schema, Document, Model, model } from 'mongoose';
import * as mongooseUniqueValidator from 'mongoose-unique-validator';
import { hash, compare } from 'bcrypt';

import config from '../config';
import { iocContainer } from '../config/ioc';
import { UserAttributes } from '../types/user';
import { TYPES } from '../types/ioc';
import { USER_ROLE_VALUES } from '../types/authorization';

export interface UserDocument extends Document, UserAttributes {
  // Add definitions for instance attributes and methods here
  _password: string;
  hashedPassword: string;
  checkPassword: (password: string) => Promise<boolean>;
}

export interface UserModel extends Model<UserDocument> {
  // Add definitions for static methods here
}

let UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: USER_ROLE_VALUES
  },
  hashedPassword: {
    type: String,
    select: false
  }
}, {
  timestamps: true,
  toObject: {
    transform: function(doc, ret) {
      delete ret.hashedPassword;
    }
  }
});

UserSchema.methods.checkPassword = async function(password): Promise<boolean> {
  return compare(password, this.hashedPassword);
};

UserSchema.plugin(mongooseUniqueValidator, { type: 'mongoose-unique-validator' });

UserSchema.virtual('password')
  .set(function(password) {
    this._password = password;
  });

UserSchema
  .pre<UserDocument>('save', async function () {
    if (this._password) {
      this.hashedPassword = await hash(this._password, config.password.saltOrRounds);
    }
  });

const User = model<UserDocument, UserModel>('User', UserSchema);

iocContainer.bind<UserModel>(TYPES.UserModel).toConstantValue(User);

export { User };

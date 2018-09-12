import { Schema, Document, Model, model } from 'mongoose';
import * as mongooseUniqueValidator from 'mongoose-unique-validator';

import { iocContainer } from '../config/ioc';
import { UserAttributes } from '../types/user';
import { TYPES } from '../types/ioc';

export interface UserDocument extends Document, UserAttributes {
  // Add definitions for instance methods here
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
  }
}, { timestamps: true });

UserSchema.methods = {};

UserSchema.plugin(mongooseUniqueValidator, { type: 'mongoose-unique-validator' });

const User = model<UserDocument, UserModel>('User', UserSchema);

iocContainer.bind<UserModel>(TYPES.UserModel).toConstantValue(User);

export { User };

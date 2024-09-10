import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: false })
  permissions?: string[];
  @Prop({ required: true, default: 'EMPLOYEE' })
  type: 'MANAGER' | 'EMPLOYEE';
  @Prop({ required: true })
  companyId: string;
  @Prop({ required: true })
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

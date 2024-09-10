import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({
  timestamps: true,
  collection: 'companies',
})
export class Company {
  @Prop({ required: true })
  name: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CampaignDocument = HydratedDocument<Campaign>;

class Document {
  @Prop({ required: true })
  url: string;
  @Prop({ required: true })
  mime: string;
  @Prop({ required: true })
  ext: string;
}

@Schema({
  timestamps: true,
  collection: 'campaigns',
})
export class Campaign {
  @Prop({ required: true })
  name: string;
  @Prop({ required: false })
  description?: string;
  @Prop({ required: true })
  start: Date;
  @Prop({ required: true })
  end: Date;
  @Prop({ required: false, default: false })
  status?: boolean;
  @Prop({ required: true })
  companyId: string;
  @Prop({ required: true })
  createdBy: string;
  @Prop({ required: false })
  updatedBy?: string;
  @Prop({ required: true, type: Number })
  fee: number;
  @Prop({ required: true })
  product: string;
  @Prop({ required: false, type: Document })
  document?: Document;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ApplyDocument = HydratedDocument<Apply>;

class Document {
  @Prop({ required: true })
  url: string;
  @Prop({ required: true })
  mime: string;
  @Prop({ required: true })
  ext: string;
}

class Client {
  @Prop({ required: true })
  sex: string;
  @Prop({ required: true })
  age: string;
  @Prop({ required: true })
  tourist: boolean;
}

class Evidence {
  @Prop({ type: Document })
  document: Document;

  @Prop()
  description?: string;

  @Prop()
  givenAt: Date;
}

class Location {
  @Prop()
  latitude: string;
  @Prop()
  longitude: string;
}

@Schema({
  timestamps: true,
  collection: 'applies',
})
export class Apply {
  @Prop({ required: false, type: Evidence })
  evidences?: Evidence;
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  campaignId: string;
  @Prop({ required: true })
  companyId: string;
  @Prop({ required: true })
  location: Location;
  @Prop({ required: true })
  client: Client[];
}

export const ApplySchema = SchemaFactory.createForClass(Apply);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

class EventData {}

@Schema({
  timestamps: true,
  collection: 'events',
})
export class Event {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  type: string;
  @Prop({ required: false })
  data?: EventData;
  @Prop({ required: true })
  companyId: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);

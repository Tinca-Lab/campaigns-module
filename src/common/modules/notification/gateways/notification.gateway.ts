import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { OnEvent } from '@nestjs/event-emitter';
import { FindEventsInteractor } from '../../../../application-core/event/use-cases/findEvents.interactor';
import { CreateEventInteractor } from '../../../../application-core/event/use-cases/createEvent.interactor';
import { EventDocument } from '../../../../infrastructure/persistence/schemas/event.schema';
import { DeleteEventByIdInteractor } from '../../../../application-core/event/use-cases/deleteEventById.interactor';

@WebSocketGateway({
  transports: ['websocket'],
  namespace: 'notification',
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly jwt: JwtService,
    private readonly findEventsInteractor: FindEventsInteractor,
    private readonly createEventInteractor: CreateEventInteractor,
    private readonly deleteEventByIdInteractor: DeleteEventByIdInteractor,
  ) {}

  private clients: Map<number, string[]> = new Map<number, string[]>();

  handleConnection(client: Socket) {
    const auth = client.handshake.auth;
    if (!auth) {
      return;
    }
    const access_token: string = auth.Authorization.split(' ')[1];
    if (!access_token) {
      return;
    }
    let user;
    try {
      user = this.jwt.verify(access_token);
      if (!user) {
        return;
      }
    } catch {
      return;
    }
    const existing: string[] = this.clients.get(user.companyId) || [];
    existing.push(client.id);
    this.clients.set(user.companyId, existing);
  }

  handleDisconnect(client: Socket) {
    const auth = client.handshake.auth;
    if (!auth) {
      return;
    }
    const access_token: string = auth.Authorization.split(' ')[1];
    if (!access_token) {
      return;
    }
    const user = this.jwt.decode(access_token);
    if (!user) {
      return;
    }
    const existing: string[] = this.clients.get(user.companyId) || [];
    const index: number = existing.indexOf(client.id);
    if (index !== -1) {
      existing.splice(index, 1);
      if (existing.length > 0) {
        this.clients.set(user.companyId, existing);
      } else {
        this.clients.delete(user.companyId);
      }
    }
  }

  @OnEvent('campaign.created')
  @SubscribeMessage('campaign.created')
  async campaignCreated(payload: any): Promise<any> {
    const clients: string[] = this.clients.get(payload.createdBy);
    if (!clients) {
      return;
    }
    clients.forEach((client: string): void => {
      this.server.to(client).emit('campaign.created', payload);
    });
  }

  @OnEvent('apply.created')
  async applyCreated(payload: any): Promise<any> {
    const event: EventDocument = await this.createEventInteractor.execute({
      data: payload,
      name: 'Apply created',
      type: 'apply.created',
      companyId: payload.companyId,
    });
    const clients: string[] = this.clients.get(payload.companyId);
    clients.forEach((client: string): void => {
      this.server.to(client).emit('apply.created', event);
    });
  }

  @SubscribeMessage('find.events')
  async findEvents(client: Socket): Promise<any> {
    const auth = client.handshake.auth;
    if (!auth) {
      return;
    }
    const access_token: string = auth.Authorization.split(' ')[1];
    if (!access_token) {
      return;
    }
    const user = this.jwt.decode(access_token);
    if (!user) {
      return;
    }
    const clients: string[] = this.clients.get(user.companyId);
    const events: EventDocument[] = await this.findEventsInteractor.execute({
      companyId: user.companyId,
    });
    if (!events[0]) {
      return;
    }
    clients.forEach((client: string): void => {
      this.server.to(client).emit('find.events', events);
    });
  }

  @SubscribeMessage('delete.event')
  async deleteEvent(client: Socket, id: string): Promise<any> {
    const auth = client.handshake.auth;
    if (!auth) {
      return;
    }
    const access_token: string = auth.Authorization.split(' ')[1];
    if (!access_token) {
      return;
    }
    const user = this.jwt.decode(access_token);
    if (!user) {
      return;
    }
    const event: EventDocument =
      await this.deleteEventByIdInteractor.execute(id);
    const clients: string[] = this.clients.get(user.companyId);
    clients.forEach((client: string): void => {
      this.server.to(client).emit('delete.event', event);
    });
  }
}

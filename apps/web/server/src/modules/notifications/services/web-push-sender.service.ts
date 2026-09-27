import { Injectable } from '@nestjs/common';
import { sendNotification } from 'web-push';

@Injectable()
export class WebPushSenderService {
  readonly send = sendNotification;
}

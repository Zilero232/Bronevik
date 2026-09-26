import { Injectable } from '@nestjs/common';

import { postWebhook } from '../lib';

@Injectable()
export class WebhookPosterService {
  readonly post = postWebhook;
}

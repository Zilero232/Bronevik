import type { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Injectable()
export class MailTransportService {
  create(options: SMTPTransport.Options): Transporter {
    return createTransport(options);
  }
}

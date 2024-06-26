import { MailerOptions } from '@nestjs-modules/mailer';
import { handle } from '@nestjs-modules/mailer';
import * as path from 'path';

export const mailerConfig: MailerOptions = {
  template: {
    dir: path.resolve(__dirname, '..', '..', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      extName: '.hbs',
      layoutsDir: path.resolve(__dirname, '..', '..', 'templates'),
    },
  },
  transport: `smtps://user@domain.com:pass@smtp.domain.com`,
};

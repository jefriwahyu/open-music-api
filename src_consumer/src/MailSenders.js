
const nodemailer = require('nodemailer');

class MailSender {
    constructor() {
        this._transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: process.env.SMTP_ENCRYPTION,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });
    }

    sendEmail(targetEmail, content) {
        const message = {
            from: 'Music Apps',
            to: targetEmail,
            subject: 'Ekspor Lagu',
            text: 'Terlampir hasil dari ekspor lagu dari playlist',
            attachments: [
              {
                filename: 'playlist.json',
                content,
              },
            ],
          };

          return this._transporter.sendMail(message);
    }
}

module.exports = MailSender;


require('dotenv').config();

const amqp = require('amqplib');
const MailSender = require('./MailSenders');
const PlaylistService = require('./PlaylistService');
const PlaylistSongsService = require('./PlaylistSongsService');
const Listener = require('./Listener');

const init = async () => {
    const playlistService = new PlaylistService();
    const playlistSongsService = new PlaylistSongsService();
    const mailSender = new MailSender();
    const listener = new Listener(playlistService, playlistSongsService, mailSender);

    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue('export:playlist', {
        durable: true,
      });

    channel.consume('export:playlist', listener.listen, { noAck: true });
};
   
init();
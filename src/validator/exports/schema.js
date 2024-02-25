
const Joi = require('joi');

const ExportSonginPlaylistPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportSonginPlaylistPayloadSchema;

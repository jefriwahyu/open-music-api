
class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportExportPayload(request.payload);

    const message = {
      userId: request.auth.credentials.id,
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Untuk sekarang Permintaan Anda dalam antrean. Mohon ditunggu yaa..',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;

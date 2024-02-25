/* eslint-disable no-unused-vars */

class UploadsHandler {
  constructor(service, albumsService, validator) {
    this._service = service;
    this._albumsService = albumsService;
    this._validator = validator;
  }

  async postUploadCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    this._validator.validateCoversHeaders(cover.hapi.headers);

    const filename = await this._service.writeFile(cover, cover.hapi);
    const fileloc = `http://${process.env.HOST}:${process.env.PORT}/uploads/file/images/${filename}`;

    await this._albumsService.addCoverHandler({ cover: fileloc, id });

    const response = h.response({
      status: 'success',
      message: ' Cover berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;

/* eslint-disable no-unused-vars */

class UploadsHandler {
  constructor(storageService, validator, albumsService) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    this.postUploadCoverHandler = this.postUploadCoverHandler.bind(this);
  }

  async postUploadCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    this._validator.validateCoversHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const fileloc = `http://${process.env.HOST}:${process.env.PORT}/uploads/images/${filename}`;

    await this._albumsService.addCoverHandler({ id, cover: fileloc });

    const response = h.response({
      status: 'success',
      message: ' Cover berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}


exports.modules = UploadsHandler;

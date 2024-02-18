/* eslint-disable no-unused-vars */

class CollaborationsHandler {
  constructor(collaborationsService, playlistService, usersService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistService = playlistService;
    this._usersService = usersService;
    this._validator = validator;
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;

    const { playlistId, userId } = request.payload;

    await this._playlistService.verifyPlaylistsExist(playlistId);

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);

    await this._usersService.verifyUserExist(userId);

    const collabId = await this._collaborationsService.addCollaboration(playlistId, userId);

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collabId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;

    const { playlistId, userId } = request.payload;

    await this._playlistService.verifyPlaylistsExist(playlistId);

    await this._Service.verifyNoteOwner(playlistId, credentialId);

    await this._usersService.verifyUserExist(userId);

    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Berhasil menghapus kolaborasi.',
    };
  }
}

module.exports = CollaborationsHandler;

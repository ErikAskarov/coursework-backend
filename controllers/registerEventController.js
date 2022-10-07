const { RegisterEvent, User, Worker, Master, Event, Cardpass } = require('../models/models');
const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('path');

class RegisterEventController {
  async create(req, res, next) {
    try {
      console.log(req.files.file)
      const { workerId, eventId } = req.body;
      const file  = req.files.file;
      let filename = uuid.v4() + ".pdf"
      file.mv(path.resolve(__dirname, '..', 'static', filename));

      const registerEvent = await RegisterEvent.create({workerId, eventId, file: filename});
      return res.json(registerEvent) 

    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  };
  
  async getAll(req, res, next) {
    try {
      const registerEvents = await RegisterEvent.findAll({
        include: [
          {
            model: Event,
            include: [
              {
                model: Master,
                attributes: ['secondName', 'firstName', 'patronymic']
              }
            ]
          },
          {
            model: Worker,
            attributes: ['secondName', 'firstName', 'patronymic']
          },
          {
            model: Event,
            attributes: ['name', 'start']
          }
        ]
      });
      return res.json(registerEvents)
    } catch(e) {
      next(ApiError.badRequest(e.message))
    } 
  };

  async getOneToWorker(req, res, next) {
    try {
      const { id } = req.params;
      const registerUserEvents = await RegisterEvent.findAll({
        where: { workerId: id },
        include: [
          {
            model: Event,
            include: [
              {
                model: Master,
                attributes: ['id', 'secondName', 'firstName', 'patronymic']
              }
            ]
          },
          {
            model: Worker,
            attributes: ['id', 'secondName', 'firstName', 'patronymic']
          },
          {
            model: Event,
            attributes: ['name', 'start']
          }
        ]
      });
      return res.json(registerUserEvents)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  };

  async getOneToMaster(req, res, next) {
    try {
      const { id } = req.params;
      const registerUserEvents = await RegisterEvent.findAll({
        include: [
          {
            model: Event,
            where: { masterId: id },
            include: [
              {
                model: Master,
                attributes: ['id', 'secondName', 'firstName', 'patronymic']
              }
            ]
          },
          {
            model: Worker,
            attributes: ['id', 'secondName', 'firstName', 'patronymic'],
            include: [
              {
                model: Cardpass,
                attributes: ['code']
              }
            ]
          },
          {
            model: Event,
            attributes: ['name', 'start', 'count']
          }
        ]
      });
      return res.json(registerUserEvents)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  };

  async updateConfirm(req, res, next) {
    try {
      const { id, confirm } = req.body;
      const updateRegisterEvent = await RegisterEvent.update({ confirm: confirm}, {
        where: {
          id: id
        },
        returning: true,
        plain: true
      })
      return res.json(updateRegisterEvent[1])
    } catch (error) {
      next(ApiError.badRequest(e.message))
    }
  }

}

module.exports = new RegisterEventController();
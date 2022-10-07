const { Event, /* AuthorEvent */ } = require('../models/models')
const ApiError = require('../error/ApiError')

class EventController {
  async create(req, res, next) {
    try {
      const { name, details, start, end, count, masterId } = req.body;
      const event = await Event.create({ name, details, start, end, count, masterId });
      /* await AuthorEvent.create({userId, eventId: event.id}); */
      return res.json(event);

    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  };
  async getAll(req, res) {
    const events = await Event.findAll();
    return res.json(events);
  };
  async getOne(req, res) {
    const { id } = req.params;
    const event = await Event.findOne({
      where: { id },
    })
    return res.json(event)
  };
}

module.exports = new EventController();
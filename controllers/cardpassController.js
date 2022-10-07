const { Cardpass } = require('../models/models');
const ApiError = require('../error/ApiError');

class CardpassController {
  async create(req, res, next) {
    const { code } = req.body;
    const findCode = await Cardpass.findOne({where: {code}});
    if (findCode) {
      return next(ApiError.badRequest('Такой табельный номер уже создан'));
    }
    const cardpass = await Cardpass.create({ code });
    return res.json(cardpass);
  };
  async getAll(req, res) {
    const cardpasses = await Cardpass.findAll();
    return res.json(cardpasses);
  };
}

module.exports = new CardpassController();
const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Worker, Master, Cardpass, RegisterEvent, Event } = require('../models/models');
const { Op } = require('sequelize');

const generateJwt = (id, email, role) => {
  return jwt.sign(
    {id, email, role},
    process.env.SECRET_KEY,
    {expiresIn: '24h'}
  )
}

class UserController {
  async registration(req, res, next) {
    const { secondName, firstName, patronymic, cardpassId, email, password, role } = req.body;
    try {
      if (!email || !password) {
        return next(ApiError.badRequest('Неккоректный email или пароль'));
      }
      const candidate = await User.findOne({where: {email}});
      if (candidate) {
        return next(ApiError.badRequest('Пользователь с таким email уже создан'));
      }
      const findCardpass = await Cardpass.findOne({where: {code: cardpassId}})
      if (!findCardpass) {
        return next(ApiError.badRequest('Такого табельного номера не существует'));
      }
      if (role == 'Сотрудник') {
        const registerCardpass = await Worker.findOne({where: {cardpassId: findCardpass.id}});
        if (registerCardpass) {
          return next(ApiError.badRequest('Пользователь с таким табельным номером уже создан'));
        }
      }
      else {
        const registerCardpass = await Master.findOne({where: {cardpassId: findCardpass.id}});
        if (registerCardpass) {
          return next(ApiError.badRequest('Пользователь с таким табельным номером уже создан'));
        }
      }
      const hashPassword = await bcrypt.hash(password, 5);
      const user = await User.create({email, role, password: hashPassword});
      if (role == 'Начальник смены') {
        const master = await Master.create({secondName, firstName, patronymic, cardpassId: findCardpass.id, userId: user.id});
        const token = generateJwt(user.id, user.email, user.role);
        return res.json({token});
      }
      if (role == 'Работник') {
        const worker = await Worker.create({secondName, firstName, patronymic, cardpassId: findCardpass.id, userId: user.id});
        const token = generateJwt(user.id, user.email, user.role);
        return res.json({token});
      }
    } catch(e) {
      return next(ApiError.badRequest(e.message))
    }
  };

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({where: {email}});
    if (!user) {
      return next(ApiError.internal('Такого пользователя не существует'));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal('Указан неверный пароль'))
    }
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({token});
  };

  async check(req, res, next) {
    const token = generateJwt(req.user.id, req.user.email, req.user.role);
    return res.json({token})
  };

  async getAll(req, res, next) {
    try {
      const users = await User.findAll({
        include: [
          {
            model: Worker,
            attributes: ['secondName', 'firstName', 'patronymic']
          },
          {
            model: Worker,
            include: [
              {
                model: Cardpass,
                attributes: ['code']
              }
            ]
          },
          {
            model: Master,
            attributes: ['secondName', 'firstName', 'patronymic']
          },
          {
            model: Master,
            include: [
              {
                model: Cardpass,
                attributes: ['code']
              }
            ]
          },
        ]
      })
      return res.json(users)
    } catch(e) {
      return next(ApiError.badRequest(e.message))
    }
  };

  async getOne(req, res, next) {
    try {
      const { id } = req.params
      const user = await User.findOne({
        where: { id },
        include: [
          {
            model: Worker,
            attributes: ['id', 'secondName', 'firstName', 'patronymic']
          },
          {
            model: Worker,
            include: [
              {
                model: Cardpass,
                attributes: ['code']
              }
            ]
          },
          {
            model: Master,
            attributes: ['id', 'secondName', 'firstName', 'patronymic']
          },
          {
            model: Master,
            include: [
              {
                model: Cardpass,
                attributes: ['code']
              }
            ]
          },
        ]
      })
      return res.json(user)
    } catch(e) {
      return next(ApiError.badRequest(e.message))
    }
  };

  async getDataToTable(req, res, next) {
    console.log('get table', req.query)
    const { id, startDate, endDate } = req.query
    try {
      const data = await Worker.findAll({
        attributes: ['secondName', 'firstName', 'patronymic', 'userId'],
        include: [
          {
            model: Cardpass,
            attributes: ['code']
          },
          {
            model: RegisterEvent,
            where: { confirm: "Подтверждено" },
            attributes: ['id'],
            include: [
              {
                model: Event,
                attributes: ['start'],
                where: {
                  start: {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                  }
                },
                include: [
                  {
                    model: Master,
                    where: { id: id },
                    attributes: ['secondName', 'firstName', 'patronymic']
                  }
                ]
              }
            ]
          }
        ]
      })
      return res.json(data)
    } catch (error) {
      next(ApiError.badRequest(error.message))
    }
  };
}

module.exports = new UserController();
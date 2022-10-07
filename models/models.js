const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Master = sequelize.define('master', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  secondName: {type: DataTypes.STRING, allowNull: false},
  firstName: {type: DataTypes.STRING, allowNull: false},
  patronymic: {type: DataTypes.STRING, allowNull: false},
});

const Worker = sequelize.define('workers', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  secondName: {type: DataTypes.STRING, allowNull: false},
  firstName: {type: DataTypes.STRING, allowNull: false},
  patronymic: {type: DataTypes.STRING, allowNull: false},
});

const User = sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  email: {type: DataTypes.STRING, unique: true, allowNull: false},
  password: {type: DataTypes.STRING, allowNull: false},
  role: {type: DataTypes.STRING, allowNull: false},
});

const Cardpass = sequelize.define('cardpass', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  code: {type: DataTypes.INTEGER, unique: true, allowNull: false},
});

const RegisterEvent = sequelize.define('register_event', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  file: {type: DataTypes.STRING, allowNull: false},
  confirm: {type: DataTypes.STRING, allowNull: false, defaultValue: "Не подтверждено"}
});

const Event = sequelize.define('event', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false},
  details: {type: DataTypes.STRING, allowNull: false},
  start: {type: DataTypes.DATEONLY, allowNull: false},
  end: {type: DataTypes.DATEONLY, allowNull: false},
  count: {type: DataTypes.INTEGER, allowNull: false},
});

User.hasOne(Master);
Master.belongsTo(User);

User.hasOne(Worker);
Worker.belongsTo(User);

Cardpass.hasOne(Master);
Master.belongsTo(Cardpass);

Cardpass.hasOne(Worker);
Worker.belongsTo(Cardpass);

Worker.hasMany(RegisterEvent);
RegisterEvent.belongsTo(Worker);

Event.hasMany(RegisterEvent);
RegisterEvent.belongsTo(Event);

Master.hasMany(Event);
Event.belongsTo(Master);

module.exports = {
  User, 
  Master,
  Worker,
  Cardpass, 
  RegisterEvent, 
  Event,
}
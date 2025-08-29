const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OtpLogin = sequelize.define('OtpLogin', {
  otp_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mobile_number: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  otp_code: {
    type: DataTypes.STRING(6),
    allowNull: false
  },
  sent_via: {
    type: DataTypes.ENUM('whatsapp', 'sms'),
    defaultValue: 'whatsapp'
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'otp_logins',
  timestamps: false
});

module.exports = OtpLogin;

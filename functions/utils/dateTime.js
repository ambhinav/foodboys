const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Singapore")

const DAY_MONTH = "DDMM";

const formatCreateDate = v => moment(v).format(DAY_MONTH);

module.exports = {
  formatCreateDate
}
"use strict";

const { getSessionFromReq } = require("../../lib/auth");
const { mode } = require("../../lib/storage");

module.exports = async (req, res) => {
  const session = getSessionFromReq(req);
  return res.status(200).json({
    authenticated: Boolean(session),
    storage: mode(),
    smtpPasswordSet: Boolean(process.env.SMTP_PASSWORD),
  });
};

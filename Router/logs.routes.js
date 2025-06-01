const { Router } = require("express");
const getLogs = require("../Controller/logs.controller");
const {verifyAccessToken} = require("../Middlewares/verify_token_middleware");
const  portfolioEmailSender  = require("../Utils/email-sender.portfolio");
const LogsRouter = Router()

LogsRouter.get("/get_logs", verifyAccessToken, getLogs)
LogsRouter.post("/send_portfolio_email", portfolioEmailSender)

module.exports = LogsRouter
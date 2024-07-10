"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.DEFAULT = void 0;
const winston = require("winston");
const namespace = "logger";
exports.DEFAULT = {
    [namespace]: (config) => {
        const loggers = [];
        loggers.push(buildConsoleLogger(process.env.LOG_LEVEL));
        config.general.paths.log.forEach((p) => {
            loggers.push(buildFileLogger(p, process.env.LOG_LEVEL));
        });
        return {
            loggers,
            maxLogStringLength: 100, // the maximum length of param to log (we will truncate)
            maxLogArrayLength: 10, // the maximum number of items in an array to log before collapsing into one message
        };
    },
};
exports.test = {
    [namespace]: (config) => {
        var _a;
        const loggers = [];
        loggers.push(buildConsoleLogger((_a = process.env.LOG_LEVEL) !== null && _a !== void 0 ? _a : "crit"));
        config.general.paths.log.forEach((path) => {
            loggers.push(buildFileLogger(path, "debug", 1));
        });
        return { loggers };
    },
};
// helpers for building the winston loggers
function buildConsoleLogger(level = "info") {
    return function () {
        return winston.createLogger({
            format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), winston.format.printf((info) => {
                return `${info.timestamp} - ${info.level}: ${info.message} ${stringifyExtraMessagePropertiesForConsole(info)}`;
            })),
            level,
            levels: winston.config.syslog.levels,
            transports: [new winston.transports.Console()],
        });
    };
}
function buildFileLogger(path, level = "info", maxFiles) {
    return function (config) {
        const filename = `${path}/${config.process.id}-${config.process.env}.log`;
        return winston.createLogger({
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            level,
            levels: winston.config.syslog.levels,
            transports: [
                new winston.transports.File({
                    filename,
                    maxFiles,
                }),
            ],
        });
    };
}
function stringifyExtraMessagePropertiesForConsole(info) {
    const skippedProperties = ["message", "timestamp", "level"];
    let response = "";
    for (const key in info) {
        const value = info[key];
        if (skippedProperties.includes(key)) {
            continue;
        }
        if (value === undefined || value === null || value === "") {
            continue;
        }
        response += `${key}=${value} `;
    }
    return response;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptToken = encryptToken;
exports.decryptToken = decryptToken;
const crypto_1 = require("crypto");
const algorithm = 'aes-256-cbc';
const key = 'HBjjTSw6v0LIdEp7nVIJqMsQqfowKhRi';
function encryptToken(text) {
    const cipher = (0, crypto_1.createCipheriv)(algorithm, key, Buffer.alloc(16));
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
function decryptToken(encryptedText) {
    const decipher = (0, crypto_1.createDecipheriv)(algorithm, key, Buffer.alloc(16));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

import { createCipheriv, createDecipheriv } from "crypto";


const algorithm = 'aes-256-cbc';
const key = 'HBjjTSw6v0LIdEp7nVIJqMsQqfowKhRi';

export function encryptToken(text) {
    const cipher = createCipheriv(algorithm, key, Buffer.alloc(16));
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decryptToken(encryptedText) {
    const decipher = createDecipheriv(algorithm, key, Buffer.alloc(16));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


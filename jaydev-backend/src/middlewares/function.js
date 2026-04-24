const crypto = require("crypto")


function customencrypt(str) {
    const cipher = crypto.createCipheriv('aes256', Buffer.alloc(32).fill(0), Buffer.alloc(16).fill(0));
    return cipher.update(str.toString(), 'utf8', 'hex') + cipher.final('hex');
}

function customdecrypt(str) {
    if (!str) return str;
    try {
        const decipher = crypto.createDecipheriv('aes256', Buffer.alloc(32).fill(0), Buffer.alloc(16).fill(0));
        return decipher.update(str.toString(), 'hex', 'utf8') + decipher.final('utf8');
    } catch (e) {
        console.error(str);
        console.error(e);
        return "";
    }
}

module.exports = { customencrypt, customdecrypt };

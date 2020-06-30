import CryptoJS from 'crypto-js';

const encrypt = (message = '', secretKey = '') => {
  var encryptedMessage = CryptoJS.AES.encrypt(message, secretKey);
  return encryptedMessage.toString();
};

const decrypt = (encryptedMessage = '', secretKey = '') => {
  var decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
  return decryptedBytes.toString(CryptoJS.enc.Utf8);
};

export default {
  encrypt,
  decrypt
};
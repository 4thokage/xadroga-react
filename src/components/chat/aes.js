let aes256 = require("aes256");

let key = "obvwoqcbv21801f19d0zibcoavwpnq";

export const DoEncrypt = (text) => {
  return aes256.encrypt(key, text);
};
export const DoDecrypt = (cipher, username) => {
  if(cipher.hasOwnProperty('ans')) {
    cipher = cipher.ans;
  }
  if (cipher.startsWith("Welcome")) {
    return cipher;
  }

  if (cipher.startsWith(username)) {
    return cipher;
  }

  return aes256.decrypt(key, cipher);
};

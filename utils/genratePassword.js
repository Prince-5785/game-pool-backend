/**
 * Generates a password that starts with a capital letter,
 * followed by lowercase letters and numbers.
 *
 * @param {number} length - Total length of the password (default is 8).
 * @returns {string} Generated password.
 */
const generatePassword = (length = 8) => {
    if (length < 1) return '';
  
    const capitalLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerAndDigits = 'abcdefghijklmnopqrstuvwxyz0123456789';
  
    let password = capitalLetters[Math.floor(Math.random() * capitalLetters.length)];
  
    for (let i = 1; i < length; i++) {
      password += lowerAndDigits[Math.floor(Math.random() * lowerAndDigits.length)];
    }
  
    return password;
  };
  
  module.exports = { generatePassword };
  
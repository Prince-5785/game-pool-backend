/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = (object, keys) => {
    return keys.reduce((obj, key) => {
      if (object && Object.prototype.hasOwnProperty.call(object, key)) {
        // eslint-disable-next-line no-param-reassign
        obj[key] = object[key];
      }
      return obj;
    }, {});
  };
  
  /**
   * Converts a string to title case, where the first letter of each word is capitalized.
   *
   * @param {string} str - The input string to be converted to title case.
   * @returns {string} The title-cased version of the input string.
   *
   */
  const titleCase = (str) => {
    return str
      // .toLowerCase() // Convert the entire string to lowercase
      .split(" ") // Split the string into an array of words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(" "); // Join the array back into a string
  };
  
  module.exports = { pick, titleCase };
  
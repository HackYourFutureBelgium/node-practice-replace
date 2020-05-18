const replace = (text, toReplace, withThis) => {
  // write me!
  var ourNewString = text
    .split(toReplace).join(withThis);
  return ourNewString;

};
module.exports = replace;

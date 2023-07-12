const XMLHandler = require("./handlers/xmlHandler");
const BinaryHandler = require("./handlers/binaryHandler");

// create instances
const xmlHandlerInstance = new XMLHandler();
const binaryHandlerInstance = new BinaryHandler();

const handlerMap = {
  ".xml": xmlHandlerInstance,
  ".bin": binaryHandlerInstance,
};

module.exports = {
  addHandler: (extension, handler) => {
    handlerMap[extension] = handler;
  },

  getHandler: (extension) => {
    return handlerMap[extension];
  },
};

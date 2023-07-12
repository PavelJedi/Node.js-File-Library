class FileHandler {
  read(path) {
    throw new Error("You have to implement the method read!");
  }

  write(path, data) {
    throw new Error("You have to implement the method write!");
  }

  modifyRecord(recordId, newRecord) {
    throw new Error("You have to implement the method modifyRecord!");
  }

  addRecord(newRecord) {
    throw new Error("You have to implement the method addRecord!");
  }

  deleteRecord(recordId) {
    throw new Error("You have to implement the method deleteRecord!");
  }
}

module.exports = FileHandler;

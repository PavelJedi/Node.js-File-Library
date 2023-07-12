const FileHandler = require("./fileHandler");
const fs = require("fs");

function getBufferForRecord(record) {
  const dateBuffer = Buffer.from(record.Date.replace(/\./g, ""));
  const brandNameBuffer = Buffer.from(record.BrandName, "utf16le");
  const brandNameLengthBuffer = Buffer.alloc(2);
  brandNameLengthBuffer.writeUInt16LE(brandNameBuffer.length / 2);
  const priceBuffer = Buffer.alloc(4);
  priceBuffer.writeInt32LE(record.Price);
  return Buffer.concat([
    dateBuffer,
    brandNameLengthBuffer,
    brandNameBuffer,
    priceBuffer,
  ]);
}

class BinaryHandler extends FileHandler {
  read(filePath) {
    return new Promise((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          reject(`File does not exist at path: ${filePath}`);
        } else {
          fs.readFile(filePath, (err, data) => {
            if (err) {
              return reject(err);
            }

            let buffer = Buffer.from(data);
            let offset = 0;

            let header = buffer.readUInt16BE(offset);
            offset += 2;
            if (header !== 0x2526) {
              return reject(new Error("Invalid file format"));
            }

            let recordCount = buffer.readUInt32BE(offset);
            offset += 4;

            let records = [];
            for (let i = 0; i < recordCount; i++) {
              let record = {};

              let date = "";
              for (let j = 0; j < 8; j++) {
                date += String.fromCharCode(buffer.readUInt8(offset));
                offset++;
              }
              record.Date = date.replace(/(\d{2})(\d{2})(\d{4})/, "$1.$2.$3");

              let brandNameLength = buffer.readUInt16LE(offset);
              offset += 2;

              record.BrandName = buffer.toString(
                "utf16le",
                offset,
                offset + brandNameLength * 2
              );
              offset += brandNameLength * 2;

              record.Price = buffer.readInt32LE(offset);
              offset += 4;

              records.push(record);
            }

            resolve(records);
          });
        }
      });
    });
  }

  write(filePath, records) {
    return new Promise((resolve, reject) => {
      const headerBuffer = Buffer.alloc(6);
      headerBuffer.writeUInt16BE(0x2526);
      headerBuffer.writeUInt32BE(records.length, 2);

      const recordBuffers = records.map(getBufferForRecord);

      fs.writeFile(
        filePath,
        Buffer.concat([headerBuffer, ...recordBuffers]),
        (err) => {
          if (err) {
            return reject(err);
          }

          resolve();
        }
      );
    });
  }

  async addRecord(filePath, newRecord) {
    const recordBuffer = getBufferForRecord(newRecord);

    const data = await fs.promises.readFile(filePath);
    let buffer = Buffer.from(data);
    let recordCount = buffer.readUInt32BE(2);
    buffer.writeUInt32BE(recordCount + 1, 2);

    await fs.promises.writeFile(
      filePath,
      Buffer.concat([buffer, recordBuffer])
    );

    return this.read(filePath);
  }

  async deleteRecord(filePath, recordId) {
    const records = await this.read(filePath);

    if (recordId >= 0 && recordId < records.length) {
      records.splice(recordId, 1);
      await this.write(filePath, records);
    } else {
      throw new Error(`Record not found at index: ${recordId}`);
    }
  }

  async modifyRecord(filePath, recordId, newRecord) {
    const records = await this.read(filePath);

    if (recordId >= 0 && recordId < records.length) {
      records[recordId] = newRecord;
      await this.write(filePath, records);
    } else {
      throw new Error(`Record not found at index: ${recordId}`);
    }
  }
}

module.exports = BinaryHandler;

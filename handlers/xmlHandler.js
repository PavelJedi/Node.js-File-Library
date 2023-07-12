const xml2js = require("xml2js");
const fs = require("fs");
const FileHandler = require("./fileHandler");

class XMLHandler extends FileHandler {
  constructor() {
    super();
    this.data = null;
  }

  read(path) {
    return new Promise((resolve, reject) => {
      fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
          reject(`File does not exist at path: ${path}`);
        } else {
          fs.readFile(path, "utf-8", (error, data) => {
            if (error) {
              reject(error);
            } else {
              xml2js.parseString(data, (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  this.data = result;
                  const transformedData = result.Document.Car.map((car) => ({
                    Date: car.Date[0],
                    BrandName: car.BrandName[0],
                    Price: parseInt(car.Price[0]),
                  }));
                  resolve(transformedData);
                }
              });
            }
          });
        }
      });
    });
  }

  write(path, data) {
    this.data = {
      Document: {
        Car: data.map((record) => ({
          Date: [record.Date],
          BrandName: [record.BrandName],
          Price: [record.Price],
        })),
      },
    };

    const builder = new xml2js.Builder();
    const xml = builder.buildObject(this.data);

    return new Promise((resolve, reject) => {
      fs.writeFile(path, xml, "utf-8", (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async addRecord(newRecord) {
    if (this.data === null) {
      this.data = {
        Document: {
          Car: [],
        },
      };
    }

    if (newRecord.Date && newRecord.BrandName && newRecord.Price) {
      const record = {
        Date: [newRecord.Date],
        BrandName: [newRecord.BrandName],
        Price: [newRecord.Price],
      };
      this.data.Document.Car.push(record);
      return this.data;
    } else {
      return { status: "error", message: "Invalid record format!" };
    }
  }

  findRecord(record) {
    console.log("Finding record:", record);
    const carArray = this.data.Document.Car || [];
    const index = carArray.findIndex((r) => {
      console.log("Comparing with:", r);
      return (
        r.Date[0] === record.Date &&
        r.BrandName[0] === record.BrandName &&
        parseInt(r.Price[0]) === record.Price
      );
    });
    console.log("Found record at index:", index);
    return index;
  }

  deleteRecord(record) {
    return new Promise((resolve, reject) => {
      const index = this.findRecord(record);
      if (index === -1) {
        reject(`Record not found`);
      } else {
        this.data.Document.Car.splice(index, 1);
        this.write(path, this.data)
          .then(() => {
            console.log("Deleted record. Data after deletion:", this.data);
            resolve(this.data);
          })
          .catch((error) => reject(error));
      }
    });
  }

  async modifyRecord(recordId, newRecord) {
    if (
      newRecord.Date &&
      newRecord.BrandName &&
      newRecord.Price &&
      this.data.Document.Car[recordId]
    ) {
      const record = {
        Date: [newRecord.Date],
        BrandName: [newRecord.BrandName],
        Price: [newRecord.Price],
      };
      this.data.Document.Car[recordId] = record;
    } else {
      throw new Error(
        `Invalid record format or record not found at index: ${recordId}`
      );
    }
  }
}

module.exports = XMLHandler;

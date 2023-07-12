const path = require("path");
const handlers = require("./index");

const records = [
  {
    Date: "10.10.2008",
    BrandName: "Alpha Romeo Brera",
    Price: 37000,
  },
  {
    Date: "11.11.2011",
    BrandName: "Beta Beta Car",
    Price: 45000,
  },
];

const newRecord = { Date: "12.12.2020", BrandName: "Gamma Car", Price: 50000 };
const recordIdToDelete = "10.10.2008";
const recordIdToModify = "10.10.2008";
const modifiedRecord = {
  Date: "01.01.2022",
  BrandName: "Delta Car",
  Price: 60000,
};

const xmlFilePath = process.argv[2] || path.join(__dirname, "test.xml");
const binFilePath = process.argv[3] || path.join(__dirname, "test.bin");

const performOperations = async (handler, filePath) => {
  try {
    await handler.write(filePath, records);
    let data = await handler.read(filePath);
    console.log("Data:", JSON.stringify(data, null, 2));

    let indexToDelete = data.findIndex(
      (record) => record.Date === recordIdToDelete
    );
    let indexToModify = data.findIndex(
      (record) => record.Date === recordIdToModify
    );

    await handler.addRecord(filePath, newRecord);
    data = await handler.read(filePath);
    console.log("Data After Adding Record:", JSON.stringify(data, null, 2));

    await handler.deleteRecord(filePath, indexToDelete);
    data = await handler.read(filePath);
    console.log("Data After Deleting Record:", JSON.stringify(data, null, 2));

    await handler.modifyRecord(filePath, indexToModify, modifiedRecord);
    data = await handler.read(filePath);
    console.log("Data After Modifying Record:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error with handler:`, error);
  }
};

performOperations(handlers.getHandler(".xml"), xmlFilePath);
performOperations(handlers.getHandler(".bin"), binFilePath);
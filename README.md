# Node.js-File-Library

Overview
This project provides a library for handling XML and binary files. It provides a standardized interface for reading, writing, adding, modifying, and deleting records in these file formats.

Installation
Clone the repository and run npm install to install the necessary dependencies.

Usage
To use this library, require the main module in your application:

const handlers = require('./index');
Then, you can call the methods provided by the handlers to manipulate the data in your files.

Methods:
read(path): This method reads the file at the provided path and returns the data as a Promise.

write(path, data): This method writes the provided data to the file at the provided path. The data should be an array of objects, each object representing a record.

addRecord(newRecord): This method adds a new record to the existing data. The newRecord parameter should be an object with Date, BrandName, and Price properties. If the record format is invalid, an error message will be returned.

deleteRecord(recordId): This method deletes the record with the provided ID from the data. If the record is not found, an error message will be returned.

modifyRecord(recordId, newRecord): This method replaces the record with the provided ID with the new record. The newRecord parameter should be an object with Date, BrandName, and Price properties. If the record format is invalid or the record is not found, an error message will be returned.

Troubleshooting
Invalid Record Format: Ensure that all records have a Date, BrandName, and Price property.

Record Not Found: Ensure that the record ID you're trying to delete or modify actually exists in the data.

Contributing
If you want to contribute to this project, please submit a pull request with your changes.

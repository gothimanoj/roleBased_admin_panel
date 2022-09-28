
const connection = require("../config/mysqlConfig");
const testRequest = {
  async getAllData(query) {
    try {
      const response = await new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  },
};



module.exports = testRequest;


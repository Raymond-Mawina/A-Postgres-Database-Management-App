const { pool } = require("./config");
const { message, queryString } = require("./helper_variables.js");

async function createTable() {
  await pool.query(queryString.queryStringForCreateTable);
  return message.tableCreated;
}

async function addNewVisitor(name, age, date, time, assistant, comment) {
  await pool.query(
    queryString.queryStringForAddNewVisitor(
      name,
      age,
      date,
      time,
      assistant,
      comment
    )
  );
  return message.visitorAdded;
}

async function deleteVisitor(id) {
  const returnedValue = await pool.query(
    queryString.queryStringForDeleteVisitor(id)
  );
  if (returnedValue.rowCount === 0)
    throw Error(message.visitorDoesNotExist(id));
  else return message.visitorRemoved;
}

async function updateVisitor(id, column, value) {
  const returnedValue = await pool.query(
    queryString.queryStringForUpdateVisitor(id, column, value)
  );
  if ((await returnedValue.rowCount) === 0)
    throw Error(message.visitorDoesNotExist(id));
  else return message.visitorUpdated;
}

async function viewOneVisitor(id) {
  const res = await pool.query(queryString.queryStringForViewOneVisitor(id));
  if (res.rowCount === 0) throw Error(message.visitorDoesNotExist(id));
  else return res.rows[0];
}

async function viewLastVisitor() {
  const res = await pool.query(queryString.queryStringForViewLastVisitor);
  return res.rows[0].id;
}

async function listAllVisitors() {
  const res = await pool.query(queryString.queryStringForListAllVisitors);
  return res.rows;
}

async function deleteAllVisitors() {
  await pool.query(queryString.queryStringForDeleteAllVisitors);
  return message.allVisitorsRemoved;
}

module.exports = {
  createTable,
  addNewVisitor,
  deleteVisitor,
  deleteAllVisitors,
  updateVisitor,
  viewLastVisitor,
  viewOneVisitor,
  listAllVisitors,
};

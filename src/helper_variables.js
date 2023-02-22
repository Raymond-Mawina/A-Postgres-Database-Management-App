const message = {
  tableCreated: "Table Visitors successfullly created",
  visitorAdded: "New visitor added successfully",
  visitorRemoved: "Visitor removed successfully",
  visitorUpdated: "Visitor updated successfully",
  allVisitorsRemoved: "All visitors removed successfully",
  visitorDoesNotExist: (id) => `Visitor at Id ${id} does not exist`,
};

const queryString = {
  queryStringForDropVisitorTable: "DROP TABLE IF EXISTS visitors",
  queryStringForCreateTable: `CREATE TABLE IF NOT EXISTS Visitors(
				id serial PRIMARY KEY,
				visitorName varchar(255),
				visitorAge int,
				dateOfVisit DATE,
				timeOfVisit TIME,
				nameOfAssistant varchar(255),
				comments varchar)`,
  queryStringForViewLastVisitor: `SELECT * FROM Visitors WHERE id = (SELECT MAX(id) FROM Visitors)`,
  queryStringForListAllVisitors: `SELECT visitorName, id FROM Visitors`,
  queryStringForDeleteAllVisitors: `DELETE FROM Visitors`,
  queryStringForAddNewVisitor: (name, age, date, time, assistant, comment) =>
    `INSERT INTO Visitors(visitorName, visitorAge, dateOfVisit, timeOfVisit, nameOfAssistant, comments) VALUES('${name}','${age}','${date}','${time}','${assistant}','${comment}')`,
  queryStringForDeleteVisitor: (id) => `DELETE FROM Visitors WHERE id = ${id}`,
  queryStringForUpdateVisitor: (id, column, value) =>
    `UPDATE Visitors SET ${column} = '${value}' WHERE id = ${id}`,
  queryStringForViewOneVisitor: (id) =>
    `SELECT * FROM Visitors WHERE id = ${id}`,
};

module.exports = { message, queryString };

const { pool } = require("../src/config");
const {
  createTable,
  addNewVisitor,
  deleteVisitor,
  deleteAllVisitors,
  updateVisitor,
  viewLastVisitor,
  viewOneVisitor,
  listAllVisitors,
} = require("../src/index");
const { message, queryString } = require("../src/helper_variables");

beforeEach(async function () {
  await pool.query(queryString.queryStringForDropVisitorTable);
  await createTable();
  await addNewVisitor(
    "Raymond",
    24,
    "2022-06-15",
    "14:56",
    "Andile",
    "Suitable Candidate"
  );
});

afterEach(async function () {
  await pool.query(queryString.queryStringForDropVisitorTable);
});

describe("createTable", function () {
  it("should call pool query with the right parameter and return string 'New visitor added successfully'", async function () {
    spyOn(pool, "query").and.callThrough();
    expect(await createTable()).toEqual(message.tableCreated);
    expect(pool.query).toHaveBeenCalledOnceWith(
      queryString.queryStringForCreateTable
    );
  });
});

describe("addNewVisitor", function () {
  it("should call pool query with the right parameter and return string 'New visitor added successfully'", async function () {
    spyOn(pool, "query").and.callThrough();

    expect(
      await addNewVisitor(
        "Raymond",
        24,
        "2022-06-15",
        "14:56",
        "Andile",
        "Suitable Candidate"
      )
    ).toEqual(message.visitorAdded);
    expect(pool.query).toHaveBeenCalledOnceWith(
      queryString.queryStringForAddNewVisitor(
        "Raymond",
        24,
        "2022-06-15",
        "14:56",
        "Andile",
        "Suitable Candidate"
      )
    );
  });
});

describe("listAllVisitors", function () {
  beforeEach(function () {
    spyOn(pool, "query").and.callThrough();
  });

  it("should call pool query with the right parameter and return an array of visitors", function () {
    listAllVisitors().then((data) => {
      expect(Array.isArray(data)).toBe(true);
    });

    expect(pool.query).toHaveBeenCalledOnceWith(
      queryString.queryStringForListAllVisitors
    );
  });
});

describe("viewOneVisitor", function () {
  it("should call pool query once, with the right parameter and return an object with all the Visitor's information", async function () {
    spyOn(pool, "query").and.callThrough();
    expect(typeof (await viewOneVisitor(1))).toBe("object");
    expect(pool.query).toHaveBeenCalledOnceWith(
      queryString.queryStringForViewOneVisitor(1)
    );
  });
});

describe("viewLastVisitor", function () {
  beforeEach(function () {
    spyOn(pool, "query").and.callThrough();
  });

  it("should call pool query once, with the right parameter(s) and return the id of the last visitor", async function () {
    expect(typeof (await viewLastVisitor())).toBe("number");
    expect(pool.query).toHaveBeenCalledOnceWith(
      queryString.queryStringForViewLastVisitor
    );
  });
});

describe("updateVisitor", function () {
  it("should call pool query once, with the right parameter(s) and return string 'Visitor updated successfully'", async function () {
    spyOn(pool, "query").and.callThrough();
    await updateVisitor(1, "visitorName", "Raymond").then((returnedString) => {
      expect(returnedString).toBe(message.visitorUpdated);
    });
    expect(pool.query).toHaveBeenCalledOnceWith(
      queryString.queryStringForUpdateVisitor(1, "visitorName", "Raymond")
    );
  });
});

describe("deleteVisitor", function () {
  it("should call pool query once, with the right parameter(s) and return string 'Visitor updated successfully'", async function () {
    spyOn(pool, "query").and.callThrough();
    await deleteVisitor(1).then((returnedString) => {
      expect(returnedString).toBe(message.visitorRemoved);
    });
    expect(pool.query).toHaveBeenCalledOnceWith(
      queryString.queryStringForDeleteVisitor(1)
    );
  });
});

describe("deleteAllVisitors", function () {
  it("should call pool query once, with the right parameter(s) and return string 'All visitors removed successfully'", async function () {
    spyOn(pool, "query");
    await deleteAllVisitors().then((returnedString) => {
      expect(returnedString).toBe(message.allVisitorsRemoved);
    });
    expect(pool.query).toHaveBeenCalledOnceWith(
      queryString.queryStringForDeleteAllVisitors
    );
  });
});

afterAll(async function () {
  pool.end();
});

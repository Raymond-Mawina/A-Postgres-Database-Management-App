const { pool } = require("../src/config");
const { createTable, addNewVisitor } = require("../src/index");
const { message, queryString } = require("../src/helper_variables");

const { app } = require("../src/server");
const request = require("supertest");

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

  await addNewVisitor(
    "Thabiso",
    16,
    "2022-09-15",
    "14:56",
    "Andile",
    "Suitable Candidate"
  );
});

afterEach(async function () {
  await pool.query(queryString.queryStringForDropVisitorTable);
});

describe("GET /visitors", function () {
  it("should return all the visitors currently present in the table 'visitors'", async function () {
    await request(app)
      .get("/visitors")
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toEqual(2);
        expect(response.body).toEqual([
          { visitorname: "Raymond", id: 1 },
          { visitorname: "Thabiso", id: 2 },
        ]);
      });
  });
});

describe("GET /visitors/id", function () {
  it("should fail to return the visitor with Id 3 from the table 'visitors'", async function () {
    await request(app)
      .get("/visitors/3")
      .then((response) => {
        expect(response.statusCode).toEqual(500);
      })
      .catch((error) => {
        expect(error.message).toBe(message.visitorDoesNotExist(3));
      });
  });

  it("should return the visitor with Id 2 from the table 'visitors'", async function () {
    await request(app)
      .get("/visitors/2")
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
          id: 2,
          visitorname: "Thabiso",
          visitorage: 16,
          dateofvisit: "2022-09-14T22:00:00.000Z",
          timeofvisit: "14:56:00",
          nameofassistant: "Andile",
          comments: "Suitable Candidate",
        });
      });
  });

  describe("DELETE /visitors", function () {
    it("should delete all the visitors in the table 'visitors'", async function () {
      await request(app)
        .delete("/visitors")
        .then((response) => {
          expect(response.statusCode).toEqual(200);
          expect(response.text).toBe(message.allVisitorsRemoved);
        });
    });
  });

  describe("DELETE /visitors/id", function () {
    it("should delete the visitors at Id 1 from the table 'visitors'", async function () {
      await request(app)
        .delete("/visitors/1")
        .then((response) => {
          expect(response.statusCode).toEqual(200);
          expect(response.text).toBe(message.visitorRemoved);
        });
    });

    it("should fail to delete the visitors at Id 3 from the table 'visitors'", async function () {
      await request(app)
        .delete("/visitors/3")
        .then((response) => {
          expect(response.statusCode).toEqual(500);
        })
        .catch((error) => {
          expect(error.message).toBe(message.visitorDoesNotExist(3));
        });
    });
  });

  describe("PUT /visitors/id", function () {
    it("should update the visitors at Id 1 in the table 'visitors'", async function () {
      await request(app)
        .put("/visitors/1")
        .send({
          column: "visitorname",
          value: "NewerName",
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200);
          expect(response.text).toBe(message.visitorUpdated);
        });
    });

    it("should fail to update the visitors at Id 3 in the table 'visitors'", async function () {
      await request(app)
        .put("/visitors/3")
        .send({
          column: "visitorname",
          value: "NewerName",
        })
        .then((response) => {
          expect(response.statusCode).toEqual(500);
        })
        .catch((error) => {
          expect(error.message).toBe(message.visitorDoesNotExist(3));
        });
    });
  });

  describe("POST", function () {
    it("should add a new visitor to the table 'visitors'", async function () {
      await request(app)
        .post("/visitors")
        .send({
          visitorName: "Rose",
          visitorAge: 22,
          dateOfVisit: "2022-05-06",
          timeOfVisit: "14:54",
          nameOfAssistant: "Jake",
          comments: "Best Candidate",
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200);
          expect(response.text).toBe(message.visitorAdded);
        });
    });
  });
});

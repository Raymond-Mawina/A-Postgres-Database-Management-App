const {
  createTable,
  addNewVisitor,
  deleteVisitor,
  deleteAllVisitors,
  updateVisitor,
  viewLastVisitor,
  viewOneVisitor,
  listAllVisitors,
} = require("./index");
const router = (app) => {
  createTable();

  app.get("/single-page-app", function (req, res) {
    res.sendFile(__dirname + "/" + "ajax_form.html");
  });

  app.get("/new_visit", function (req, res) {
    res.sendFile(__dirname + "/" + "form.html");
  });

  app.post("/save_visit", async function (req, res, next) {
    const {
      visitorName,
      visitorAge,
      dateOfVisit,
      timeOfVisit,
      assistantName,
      comments,
    } = req.body;

    await addNewVisitor(
      visitorName,
      visitorAge,
      dateOfVisit,
      timeOfVisit,
      assistantName,
      comments
    );

    await viewLastVisitor()
      .then((lastVisitor) => {
        res.render("index", {
          visitorName,
          visitorAge,
          dateOfVisit,
          timeOfVisit,
          assistantName,
          comments,
          lastVisitor,
        });
      })
      .catch((error) => {
        next(error);
      });
  });

  app.post("/visitors", function (req, res, next) {
    addNewVisitor(
      req.body.visitorName,
      req.body.visitorAge,
      req.body.dateOfVisit,
      req.body.timeOfVisit,
      req.body.assistantName,
      req.body.comments
    )
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        next(error);
      });
  });

  app.get("/visitors", function (req, res, next) {
    listAllVisitors()
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        next(error);
      });
  });

  app.get("/visitors/:id", function (req, res, next) {
    viewOneVisitor(req.params["id"])
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        next(error);
      });
  });

  app.put("/visitors/:id", function (req, res, next) {
    updateVisitor(req.params["id"], req.body.column, req.body.value)
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        next(error);
      });
  });

  app.delete("/visitors", function (req, res, next) {
    deleteAllVisitors()
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        next(error);
      });
  });

  app.delete("/visitors/:id", function (req, res, next) {
    deleteVisitor(req.params["id"])
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        next(error);
      });
  });
};

module.exports = { router };

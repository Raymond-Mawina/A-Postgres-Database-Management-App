$("#ajax-form").on("submit", function (e) {
  console.log($("#dateOfVisit")[0].value);
  $.ajax({
    type: "POST",
    url: "http://localhost:8081/visitors",
    data: {
      visitorName: $("#visitorName")[0].value,
      visitorAge: $("#visitorAge")[0].value,
      dateOfVisit: $("#dateOfVisit")[0].value.replaceAll("-", "/"),
      timeOfVisit: $("#timeOfVisit")[0].value,
      assistantName: $("#assistantName")[0].value,
      comments: $("#comments")[0].value,
    },
    success: async function () {
      getVisitors();
    },
  });
  e.preventDefault();
  $("#ajax-form")[0].reset();
});

$("#update-form").on("submit", function (e) {
  e.preventDefault();
  const id = $("#visitorId")[0].value;

  $.ajax({
    type: "PUT",
    url: `http://localhost:8081/visitors/${id}`,
    data: {
      column: $("#columnToUpdate")[0].value,
      value: $("#value")[0].value,
    },
    success: async function () {
      getVisitors();
    },
  }).fail((err) => {
    const message = `Visitor at Id ${id} does not exist`;
    if (err.responseText.match(message).length > 0) {
      errorMessages.innerText = message;
    }
  });
  $("#update-form")[0].reset();
});

$("#columnToUpdate").on("change", function () {
  const columnValue = document.getElementById("columnToUpdate").value;
  const rowValue = document.getElementById("rowValue");

  if (columnValue === "visitorName") {
    rowValue.innerHTML = `<label>
      Enter new Name:
      <input type="text" name="value" id="value" required />
    </label>`;
  } else if (columnValue === "visitorAge") {
    rowValue.innerHTML = `<label>
      Enter new Name:
      <input type="number" name="value" id="value" min="1" required />
    </label>`;
  } else if (columnValue === "dateOfVisit") {
    rowValue.innerHTML = `<label>
      Enter new Date:
      <input type="date" name="value" id="value" required />
    </label>`;
  } else if (columnValue === "timeOfVisit") {
    rowValue.innerHTML = `<label>
      Enter new Time:
      <input type="time" name="value" id="value" required />
    </label>`;
  } else if (columnValue === "nameOfAssistant") {
    rowValue.innerHTML = `<label>
      Enter new Assistant Name:
      <input type="text" name="value" id="value" required />
    </label>`;
  } else if (columnValue === "comments") {
    rowValue.innerHTML = `<label>
      Enter new Comments:
      <input type="text" name="value" id="value" required />
    </label>`;
  }
});

async function deleteVisitor(id) {
  $.ajax({
    url: `http://localhost:8081/visitors/${id}`,
    type: "DELETE",
    success: async function () {
      getVisitors();
    },
  });
}

async function getSingleVisitor(id) {
  return $.ajax({
    url: `http://localhost:8081/visitors/${id}`,
    type: "GET",
  });
}

async function getVisitors() {
  $.ajax({
    url: "http://localhost:8081/visitors",
    type: "GET",
    success: async function (visitors) {
      document.getElementById("visitors").innerHTML = `<tr>
        <th>ID</th>
        <th>NAME</th>
        <th>AGE</th>
        <th>DATE</th>
        <th>TIME</th>
        <th>ASSISTANT</th>
        <th>COMMENTS</th>
        <th>DELETE</th>
      </tr>`;

      const userIdArray = [];
      for (const visitor of visitors) {
        userIdArray.push(visitor.id);
        const currentVisitor = await getSingleVisitor(visitor.id);
        const id = document.createElement("td");
        const visitorName = document.createElement("td");
        const visitorAge = document.createElement("td");
        const dateOfVisit = document.createElement("td");
        const timeOfVisit = document.createElement("td");
        const nameOfAssistant = document.createElement("td");
        const comments = document.createElement("td");
        const deleteRow = document.createElement("td");

        const deleteButton = document.createElement("button");
        deleteButton.addEventListener(
          "click",
          deleteVisitor.bind(null, visitor.id),
          false
        );

        deleteButton.innerText = `Delete ${currentVisitor.visitorname}`;
        deleteRow.appendChild(deleteButton);
        id.innerText = visitor.id;

        visitorName.innerText = currentVisitor.visitorname;
        visitorAge.innerText = currentVisitor.visitorage;
        dateOfVisit.innerText = new Date(currentVisitor.dateofvisit)
          .toLocaleString()
          .slice(0, 10)
          .replaceAll("-", "/");
        timeOfVisit.innerText = currentVisitor.timeofvisit;
        nameOfAssistant.innerText = currentVisitor.nameofassistant;
        comments.innerText = currentVisitor.comments;

        const row = document.createElement("tr");
        row.appendChild(id);
        row.appendChild(visitorName);
        row.appendChild(visitorAge);
        row.appendChild(dateOfVisit);
        row.appendChild(timeOfVisit);
        row.appendChild(nameOfAssistant);
        row.appendChild(comments);
        row.appendChild(deleteRow);
        document.getElementById("visitors").appendChild(row);
      }

      const userIds = document.getElementById("userId");
      const newOptions = userIdArray.map(
        (arrayElement) =>
          `<option value=${arrayElement}>ID ${arrayElement}</option>`
      );

      let options = ``;
      for (const userIdd of newOptions) {
        options += userIdd;
      }

      userIds.innerHTML = `<label for="visitorId">
         Select visitor's ID to Update:
         <select name="visitorId" id="visitorId" required>
           ${options}
         </select>
       </label>`;
    },
  });
}

getVisitors();

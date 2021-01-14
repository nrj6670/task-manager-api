require("../src/db/mongoose");
const Tasks = require("../src/models/task");

Tasks.findByIdAndDelete("5ffd2d0282a2c32ca4bff670")
  .then((task) => {
    console.log(task);
    return Tasks.countDocuments({ completed: false });
  })
  .then((count) => console.log(count))
  .catch((error) => console.log(error));

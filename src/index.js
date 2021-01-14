const express = require("express");

//importing models
require("./db/mongoose");

//importing routers
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

//starting the express server
const app = express();

//setting up port
const port = process.env.PORT;

//middleware
// app.use((req, res, next) => {
//   res.status(503).send("Site under maitainance");
// });

//parsing json data sent by the client
app.use(express.json());
//setting up router
app.use(userRouter);
app.use(taskRouter);

//setting up server

//listening to port
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});

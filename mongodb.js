const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Connetion failed");
    }

    const db = client.db(databaseName);

    // db.collection("users").insertOne({
    //   name: "Neeraj",
    //   age: 23,
    // });

    // db.collection("users").insertMany(
    //   [
    //     {
    //       name: "Jen",
    //       age: 28,
    //     },
    //     {
    //       name: "Gunther",
    //       age: 27,
    //     },
    //     {
    //       name: "Andrew",
    //       age: 27,
    //     },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Insertion failed");
    //     }

    //     console.log(result.ops);
    //   }
    // );

    // db.collection("tasks").insertMany(
    //   [
    //     {
    //       description: "Complete today's lectures",
    //       completed: false,
    //     },
    //     {
    //       description: "Plan tommorow's tasks",
    //       completed: false,
    //     },
    //     {
    //       description:
    //         "Finish inserting new document to a new collection in mongoDB",
    //       completed: true,
    //     },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Insertion failed");
    //     }
    //     console.log(result.ops);
    //   }
    // );

    db.collection("tasks")
      .updateMany(
        {
          completed: false,
        },
        {
          $set: {
            completed: true,
          },
        }
      )
      .then(() => console.log("Updated successfully"))
      .catch(() => console.log("Update unsuccessful"));
  }
);

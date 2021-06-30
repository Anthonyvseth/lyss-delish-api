// dependencies
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors"); // deepscan-disable-line
const express = require("express");

const app = express();

// init
admin.initializeApp();
// admin.firestore().settings({ ignoreUndefinedProperties: true });

app.get("/", async (req, res) => {
  const snapshot = await admin.firestore().collection("users").get();

  let users = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();

    users.push({ id, ...data });
  });

  res.status(200).send(JSON.stringify(users));
});

app.get("/:id", async (req, res) => {
  const snapshot = await admin
    .firestore()
    .collection("users")
    .doc(req.params.id)
    .get();

  let userId = snapshot.id;
  let userData = snapshot.data;

  res.status(200).send(JSON.stringify({ id: userId, ...userData }));
});

app.post("/", async (req, res) => {
  const user = req.body;

  await admin.firestore().collection("users").add(user);

  res.status(201).send();
});

app.put("/:id", async (req, res) => {
  const body = req.body;

  await admin.firestore().collection("users").doc(req.params.id).update({
    ...body
  });

  res.status(200).send();
});

app.delete('/:id', async (req, res) => {
    await admin.firestore().collection('users').doc(req.params.id).delete();

    res.status(200).send();
});

exports.user = functions.https.onRequest(app);

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

/* eslint-disable no-console */
const express = require('express');

const app = express();
const path = require('path');

const PORT = 3000;

app.use(express.static(path.resolve(__dirname, '../client/src/dist')));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

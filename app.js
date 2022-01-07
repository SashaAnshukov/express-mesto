const express = require('express')
const mongoose = require('mongoose')
const path = require ('path')
const bodyParser = require('body-parser')


const { PORT = 3000 } = process.env;

const app = express();

app.get('/', (request, response) => {
    response.send('wazzzaap');
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
})
const express = require('express');
const taskRouter = require('./routes/taskRoutes');
const app = express();
const { type } = require('os');
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/tasks', taskRouter);

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});


module.exports = app;
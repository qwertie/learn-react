const express = require('express');
const app = express();

app.use('/node_modules', express.static('node_modules'));
app.use('/', express.static('app'));
app.listen(1234, () => console.log('Express server running at http://127.0.0.1:1234'));

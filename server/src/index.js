const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const config = require('./config/config')
const mysql = require('mysql')
const dbConfig = require('./config/dbconfig')
const connection = mysql.createConnection(dbConfig)
const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
app.listen(process.env.PORT || config.port,
  () => console.log(`Server start on port ${config.port} ...`))

function handleDisconnect(conn) {
  conn.on('error', function(err) {
    if (!err.fatal) {
      return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.log('Re-connecting lost connection: ' + err.stack);

    const connection = mysql.createConnection(conn.config);
    handleDisconnect(connection);
    connection.connect();
  });
}

handleDisconnect(connection);

app.get('/tasks', (req, res) => {
  connection.query('SELECT * from tasks', function(err, rows, fields) {
    if (!err) {
      res.send(rows)
    }
    else {
      console.log('Error while performing Query. ' + err)
      // connection.end()
    }
  })
})
app.put('/update_task', (req, res) => {
  const query = 'UPDATE tasks SET name=?, updatedAt=? WHERE id=?'
  connection.query(query, [req.body.name, req.body.updatedAt, req.body.id], function(err, rows, fields) {
    if (!err) {
      res.send(rows)
    }
    else {
      console.log('Error while performing Query. ' + err)
      // connection.end()
    }
  })
})

app.post('/add_task', (req, res) => {
  const query = 'INSERT INTO tasks (id, name, createdAt, updatedAt) VALUES (?,?,?,?)'
  connection.query(query, [req.body.id, req.body.name, req.body.createdAt, req.body.updatedAt], function(err, rows, fields) {
    if (!err) {
      res.send(rows)
    }
    else {
      console.log('Error while performing Query. ' + err)
      // connection.end()
    }
  })
})

app.post('/remove_task', (req, res) => {
  const query = 'DELETE FROM tasks WHERE id=?'
  connection.query(query, req.body.id, function(err, rows, fields) {
    if (!err) {
      res.send(rows)
    }
    else {
      console.log('Error while performing Query. ' + err)
      // connection.end()
    }
  })
})


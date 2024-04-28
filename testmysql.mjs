import { createConnection } from 'mysql';
import { exit } from 'process';

var con = createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pos"
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM productos", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    exit();
  });
});

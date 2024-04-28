// server.mjs
import { createServer } from 'node:http';
import * as ejs from 'ejs';
import {parse} from 'node:querystring';
import { readFile } from 'node:fs';
import { createConnection } from 'mysql';

var con = createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pos"
});


const server = createServer((req, res) => {
  console.log('req.url:', req.url);

  if(req.url === 'productos') {
    con.connect(function(err) {
      con.query("SELECT * FROM productos", function (err, result, fields) {
        if(err) throw err;
        console.log(result);
        ejs.renderFile('views/catalogoproductos.html', { productos: result }, (err, str) => {
          if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Algo salio mal');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(str);
          }
        });
      });
    });

  } else if (req.url === 'usuarios') { con.connect(function(err) {
    con.query("SELECT * FROM usuarios", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      ejs.renderFile('views/catalogoproductos.html', { usuarios: result }, (err, str) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Algo salio mal');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(str);
        }
      });
    });
  });
} else if (req.url === 'clientes') {
  con.connect(function(err) {
    con.query("SELECT * FROM clientes", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      ejs.renderFile('views/catalogoclientes.html', {clientes: result}, (err, str) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Algo salio mal');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(str);
        }
      });
    });
  });

} 

else if (req.url === '/login') {
  ejs.renderFile('views/index.html', (err, str) => {
    if (err) {
      console.error(err);
      res.writeHead(500, { 'content-Type': 'text/plain' });
      res.end('Algo salio mal');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(str);
    }
  });
} else if (req.method === 'POST' && req.utl === '/submit') {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const fromData = parse(body);
    console.log('usuario:', fromData.usuario);
    console.log('contraseña:', fromData.contrasena);
    if (fromData.usuario === 'admin' && fromData.contrasena === '1234') {

      readFile('views/menu.html', 'utf8', (err, str) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'content-Type': 'text/plain' });
          res.end('Algo salio mal');
        } else {
          console.log('Redireccionando a menu.html');
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(str);
        }
      });
    } else {
      console.log('Credenciales incorrectas, redirigiendo a index.html');
      res.writeHead(302, { 'Location': '/' });
      res.end();
    }
  });
} else {
  ejs.renderFile('views/index.html', ( err, str) => {
    if (err) {
      console.error(err);
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('Algo salio mal');
    } else {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(str);
    }
  });
}
});

// starts a simple http server locally on port 3000
server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});

// run with `node server.mjs`

const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

// Crea una instancia de la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Express-session
app.use(session({
  secret: 'secret', 
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));

// Inicio de sesión
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Autenticación del usuario
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'usuario1' && password === '123456') {
    req.session.loggedIn = true; 
    res.redirect('/dashboard');
  } else {
    res.send('Usuario y/o Contraseña no identificados'); 
  }
});

// Inicio de sesión
app.get('/dashboard', (req, res) => {
  if (req.session.loggedIn) {
    res.send('Ha ingresado con exito, ¡Bienvenido!'); 
  } else {
    res.redirect('/login'); 
  }
});

// Configuración de CORS
app.use(cors());

// Carga de archivos
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('!Lo sentimos¡, Algo salió mal en el servidor, estamos trabajando para arreglarlo.');
});

// Rutas
app.get('/', (req, res) => {
  res.render('index', { title: '¡Hola mundo!' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'Acerca de la pagina' });
});

app.get('/contact', (req, res) => {
  res.render('contact'); 
});

app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;

  res.send(`Gracias por escribirnos, ¡El formulario fue enviado con éxito! Nombre: ${name}, Email: ${email}, Mensaje: ${message}`);
});

app.get('/subirArchivos', (req, res) => {
  res.render('subirArchivos', { title: 'Subir Archivos' });
});

app.post('/upload/image', upload.single('image'), (req, res) => {
  console.log(req.file);
  res.send('La Imagen fue subida correctamente');
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
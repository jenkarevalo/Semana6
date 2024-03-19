// Importa las librerías necesarias
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

// Crea una instancia de la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configura EJS como motor de plantillas
app.set('view engine', 'ejs');

// Middleware para manejar datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para manejar archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de express-session
app.use(session({
  secret: 'secret', 
  resave: true,
  saveUninitialized: true
}));

// Middleware para manejar datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para la página de inicio de sesión
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Ruta para manejar la autenticación del usuario
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Verificar las credenciales (datos de ejemplo )
  if (username === 'admin' && password === '123456') {
    req.session.loggedIn = true; 
    res.redirect('/dashboard');
  } else {
    res.send('Credenciales incorrectas'); 
  }
});

// Ruta protegida que requiere inicio de sesión
app.get('/dashboard', (req, res) => {
  if (req.session.loggedIn) {
    res.send('¡Bienvenido al Módulo de Administración!'); 
  } else {
    res.redirect('/login'); 
  }
});

// Configuración de CORS
app.use(cors());

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal en el servidor');
});

// Ruta principal
app.get('/', (req, res) => {
  res.render('index', { title: '¡Hola mundo!' });
});

// Ruta sobre
app.get('/about', (req, res) => {
  res.render('about', { title: 'Acerca de' });
});

// Ruta para mostrar el formulario de contacto
app.get('/contact', (req, res) => {
  res.render('contact'); // Renderiza el archivo contact.ejs
});

// Ruta para procesar los datos del formulario enviado
app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;

  res.send(`¡Formulario enviado con éxito! Nombre: ${name}, Email: ${email}, Mensaje: ${message}`);
});

// Ruta Subir Archivos
app.get('/subirArchivos', (req, res) => {
  res.render('subirArchivos', { title: 'Subir Archivos' });
});

// Ruta para manejar la carga de una sola imagen
app.post('/upload/image', upload.single('image'), (req, res) => {
  console.log(req.file);
  res.send('Imagen subida correctamente');
});

// Ruta para subir archivos múltiples
app.post('/upload/multi', upload.array('files'), (req, res) => {
  res.send('Archivos subidos correctamente');
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
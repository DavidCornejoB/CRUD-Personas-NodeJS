# CRUD de Personas con NodeJS y Base de Datos MySQL:

El siguiente proyecto consta de un CRUD básico de personas desarrollado en NodeJS, con conexión a una base de datos de MySQL desplegada en la nube mediante [freemysqlhosting.net](https://www.freemysqlhosting.net).

## Desarrollo de la Aplicación:

Requerimientos:

- NodeJS (Yo tengo la versión 16.15.0)
- express: ^4.18.2
- express-handlebars: 6.0.6 (Se recomienda expecíficamente ésta versión para evitar errores al desplegar en Render. Info [aquí](https://stackoverflow.com/questions/75751786/error-with-handlebars-cannot-find-module-nodepath))
- morgan: ^1.10.0
- mysql2: ^3.6.1

---

1. Comenzamos con un proyecto en NodeJS. Nos dirigimos a una ubicación de nuestra preferencia y ejecutamos el comando ```npm init```. Realizamos todas las configuraciones, las cuales se verán reflejadas en el archivo ```package.json``` que se generará luego:

  ```json
  {
    "name": "crud-basico",
    "version": "1.0.0",
    "description": "Un crud básico hecho con NodeJS y el framework Express, y una base de datos de MySQL",
    "main": "index.js",
    "type": "module",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "dev": "npx nodemon ./src/index.js",
      "start": "node ./src/index.js"
    },
    "author": "David Cornejo B <luisdavidcorbra24@gmail.com>",
    "license": "MIT",
  }
  ```

2. Ahora, instalamos las dependencias que vamos a utilizar en el proyecto. Utilizamos el siguiente comando:

  ```
  npm install express express-handlebars@6.0.6 morgan mysql2
  ```
  
  También es recomendable instalar el paquete "Nodemon" que nos facilitará el desarrollo al actualizar en tiempo real la visualización de todos los cambios realizados. ésta es una dependencia únicamente de desarrollo y no nos será util en producción, por lo tanto, la instalamos con el siguiente comando:
  
  ```
  npm i nodemon -D
  ```

  Podremos ver las dependencias instaladas en el archivo ```package.json```: en el apartado ```"dependencies":{}``` constarán todas las dependencias que serán utilizadas tanto en desarrollo como en producción, mientras que en el apartado ```"devDependencies":{}``` constarán todas las dependencias que serán instaladas únicamente para desarrollo, como es el caso de Nodemon:
  
  ```json
  {
    "name": "crud-basico",
    "version": "1.0.0",
    "description": "Un crud básico hecho con NodeJS y el framework Express, y una base de datos de MySQL",
    "main": "index.js",
    "type": "module",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "dev": "npx nodemon ./src/index.js",
      "start": "node ./src/index.js"
    },
    "author": "David Cornejo B <luisdavidcorbra24@gmail.com>",
    "license": "MIT",
    "dependencies": {
      "express": "^4.18.2",
      "express-handlebars": "^7.1.2",
      "morgan": "^1.10.0",
      "mysql2": "^3.6.1"
    },
    "devDependencies": {
      "nodemon": "^3.0.1"
    }
  }
  ```

  También observaremos que se crea una carpeta llamada ```node_modules``` que corresponde a las dependencias descargadas.

3. Ahora, creamos una carpeta de "source" ```src``` y dentro de ésta creamos las carpetas ```public``` que contendrán los assets necesarios en el proyecto, hojas de estilos, archivos, etc; ```routes``` que contendrán los scripts de enrutamiento de los endpoints que creemos con Express; y ```views``` que contendrán todas las vistas del proyecto. En el caso de que vayamos a conectar éste proyecto con una aplicación Frontend, ésta carpeta no sería necesaria.
  
4. También debemos crear dentro de ```src``` el archivo ```index.js```, que será el archivo principal a partir del cual correrá la aplicación.

---

### Configuraciones Iniciales en Index.js:

1. Lo primero que tenemos que hacer es utilizar [Express](https://expressjs.com/es/) para el desarrollo de la Aplicación Web:

  ```js
  import express from "express";
  
  // Inicializamos express en una constante
  const app = express();
  
  // Configuramos el puerto en el que se ejecutará express. Por defecto, será en el puerto 3000:
  app.set('port', process.env.PORT || 3000);

  // Corremos el servidor de express:
  app.listen(app.get('port'), () => console.log('Server listening on port', app.get('port')));
  ```

2. Configuramos todos los middleware que se utilizarán en el servidor, ésto con el fin de poder observar a nivel de desarrollo todas las peticiones HTTP que se hacen al servidor, y los errores que puedan irse generando:

  ```js
  import morgan from "morgan";

  // Middleware Morgan: enviamos el parámetro 'dev' y con ésto podremos ver todas las peticiones HTTP en consola:
  app.use(morgan('dev'));

  // Middleware de Express, ya que estaremos trabajando con interfaces y formularios:
  app.use(express.urlencoded({ extended: false}));

  // Middleware para trabajar con archivos .json:
  app.use(express.json());
  ```
3. Configuramos las vistas que serán utilizadas. Lo primero es crear dentro de la carpeta ```views``` las carpetas ```layouts``` y ```partials```. En la carpeta ```views``` creamos también el archivo ```index.hbs```, mientras que en la carpeta ```layouts``` debemos crear el archivo ```main.hbs```. El formato "hbs" hace referencia al motor de plantillas de Express Handlebars. Una vez creadas todas éstas carpetas y archivos, configuramos el motor de plantillas en el ```index.js```:

  ```js
  import { join, dirname } from 'path';
  import { fileURLToPath } from "url";

  // Especificamos el directorio de nuestro proyecto, que será utilizado para expecificar al motor de plantillas la ubicación de las vistas
  const __dirname = dirname(fileURLToPath(import.meta.url));

  // Especificamos la ubicación de las vistas, las cuales están dentro de la carpeta "views"
  app.set('views', join(__dirname, 'views'));

  // Configuración del motor de plantillas: Especificamos el motor de plantilla a utilizar: ".hbs", 
  app.engine('.hbs', engine({
      defaultLayout: 'main', // Especificamos el layout por defecto, que será "main.hbs"
      layoutsDir: join(app.get('views'), 'layouts'), // Especificamos la carpeta donde estarán los "layouts"
      partialsDir: join(app.get('views'), 'partials'), // Especificamos la carpeta donde estarán los "partials"
      extname: '.hbs' // Extensión del motor de plantillas
  }));
  app.set('view engine', '.hbs');
  ```

4. Por otro lado, especificamos los elementos estáticos que serán utilizados, ya sean imágenes, archivos css, etc. Los archivos públicos estarán dentro de la carpeta ```public```, por lo que en ```index.js``` agregamos la siguiente línea:

  ```js
  // Public files:
  app.use(express.static(join(__dirname, 'public')));
  ```

5. Finalmente, configuramos todas las rutas que serán utilizadas en la aplicación, ya sea los endpoints como la ruta inicial del proyecto. Primero configuramos la ruta inicial del proyecto dentro del archivo ```index.js```:

  ```js
  // Routes:
  app.get('/', (req, res) => {
      res.render('index');
  });
  ```

  Con ésto especificamos que, cuando se acceda a la ruta principal del proyecto (localhost:3000/) se renderizará la vista "index" que corresponde al archivo ```index.hbs``` creado en la carpeta ```views```.

---

### Vistas:

1. Dentro del archivo ```main.hbs``` insertamos la siguiente plantilla:

  ```hbs
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CRUD en NodeJS</title>
      {{!--BOOTSTRAP PARA LOS ESTILOS DE LAS VISTAS: --}}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">

      {{!--ICONOS TOMADOS DESDE FONT AWESOME: --}}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  </head>
  <body>
      {{!--PARTIAL DE BARRA DE NAVEGACIÓN: --}}
      {{>navigation}}

      {{!--FORMULARIO DE index.hbs: --}}
      {{{body}}}

      {{!-- SCRIPTS BOOTSTRAP: --}}
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js" integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+" crossorigin="anonymous"></script>
  
  </body>
  </html>
  ```

  Dentro, especificamos los link de Bootstrap para los estilos, y el link de Font Awesome para utilizar íconos.

2. Creamos el Partial de la Barra de navegación dentro de la carpeta ```partials```. Lo llamamos ```navigation.hbs```:

  ```hbs
  <nav class="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">CRUD NodeJS</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav" style="margin-left: auto;">
          <li class="nav-item">
            <a class="nav-link" href="/">Inicio</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/add">Crear</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/list">Listar</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  ```

3. Finalmente, establecemos la plantilla de la vista de ```index.hbs```:

  ```hbs
  <main class="mt-5">
      <div class="container">
          <card class="mx-auto" style="width: 500px;">
              <div class="card-header">
                  <img class="card-img-top mx-auto m-2" src="/img/icon.png" alt="Logo" style="width: 150px; height: 150px; display: block;">
                  <h3 class="text-uppercase text-center p-4">CRUD con NodeJS y MySQL</h3>
              </div>
  
              <div class="card-body text-center">
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae nisi, quos officia eos soluta porro sequi quas sit dolore, itaque at repudiandae labore deserunt ipsam?</p>
                  <a class="btn-btn-primary" href="/add">Crear una persona</a>
              </div>
          </card>
      </div>
  </main>
  ```


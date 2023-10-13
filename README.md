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

---

### Conexión con base de datos MySQL:

Todos los endpoints que vayamos a crear en ```personas.route.js``` realizarán un query hacia una base de datos de MySQL. Para éllo, hacemos uso de la dependencia "mysql2". Dentro de la carpeta ```src``` creamos el archivo ```database.js``` que contendrá toda la información necesaria para hacer la conexión con la base de datos, como el nombre del host, el puerto, credenciales del usuario y el nombre de la base de datos. El archivo ```database.js``` tendrá la siguiente configuración:

Nota: En el caso de base de datos local, debemos tener instalado MySQL en nuestra máquina, y ya sea desde el Workbench o desde el Command Line Client, debemos ejecutar los Queries necesarios para crear una base de datos que contenga una tabla para personas. Los Quieries utilizados son los siguientes:

  ```sql
  CREATE database Prueba01;
  
  use Prueba01;
  
  CREATE TABLE persona(
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      lastname VARCHAR(50) NOT NULL,
      age INT
  );
  
  SELECT * FROM persona;
  ```

  Por otro lado, si tenemos una base de datos MySQL en la nube, debemos conectarnos a dicha base de datos de manera remota (podemos hacer uso de [phpMyAdmin](https://www.phpmyadmin.net))  y crear la base de datos con la tabla para personas.

Una vez creada la base de datos y la tabla, configurar el archivo ```database.js``` de la siguiente manera:

```js
import { createPool } from 'mysql2/promise';

const pool = createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'personasdb',
    
});

export default pool;
```

*Éste ejemplo es en el caso de una base de datos en localhost. Para hacer la conexión con una base de datos en la nube, colocar en "host" la dirección externa de la base de datos que nos provee la nube, así como las credenciales especificadas al momento de crear la instancia de base de datos en la nube. El puerto generalmente suele ser el mismo que en localhost, pero se puede ver ésa información en las configuraciones de la instancia de base de datos en la nube*

### Rutas:

1. Dentro de la carpeta ```routes``` creamos el archivo ```personas.route.js``` que será el que contendrá todos los endpoints. Cada uno de los endpoints ejecutarán una query hacia la base de datos, por lo que es importante previamente haber creado la base de datos y haber configurado la conexión hacia la misma (Paso anterior).

2. Debemos inportar dentro de ```personas.route.js``` dos cosas: Primero, la dependencia "Router" de express, con la cual definimos una constante "router", y luego la configuración de ```database.js```:

  ```js
  import { Router } from 'express';
  import pool from '../database.js';
  
  const router = Router();
  ```

3. Creamos los Endpoint necesarios para la aplicación:

#### Listar Personas:

- En ```personas.route.js``` primero hacemos la consulta a la base de datos, almacenando la respuesta en una constante. Una vez tenemos la respuesta, renderizamos la vista de la lista de personas, enviándole el resultado de la consulta a la base de datos de manera desestructurada:

  ```js
  router.get('/list', async (req, res) => {
      try {
          const [result] = await pool.query("SELECT * FROM persona"); // HACEMOS LA CONSULTA A LA BASE DE DATOS. GUARDAMOS LA RESPUESTA EN LA CONSTANTE [result]
          res.render('personas/list', {personas: result}); // UNA VEZ TENEMOS LA RESPUESTA DESDE LA BD, RENDERIZAMOS LA VISTA DE LISTA DE PERSONAS, ENVIÁNDOLE LA RESPUESTA
      } catch (error) {
          res.status(500).json({message: error.message});
      }
  });
  ```

- En ```views``` creamos la carpeta ```personas``` que contendrá todas las vistas del CRUD de personas. Dentro, creamos el archivo ```list.hbs``` el cual contendrá la siguiente estructura:

  ```hbs
  <div class="container">
    <div class="row mt-5">
        <h3 class="text-center text-uppercase p-2">Lista de personas</h3>
        {{#if personas}}
                <table class="table text-center mx-auto">
                    <thead>
                        <tr class="table-dark">
                            <th scope="col">Nombre</th>
                            <th scope="col">Apellido</th>
                            <th scope="col">Edad</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{#each personas}}
                        <tr>
                            <td>{{name}}</td>
                            <td>{{lastname}}</td>
                            <td>{{age}}</td>
                            <td>
                                <div class="btn-group">
                                    <a href="/edit/{{id}}" class="btn btn-warning">
                                        <i class="fa-regular fa-pen-to-square"></i>
                                    </a>
                                    <a href="/delete/{{id}}" class="btn btn-danger">
                                        <i class="fa-solid fa-trash"></i>
                                    </a>
                                </div>
                            </td>

                        </tr>
                        {{/each}}
                    </tbody>
                    <tfoot>
                        <tr class="table-dark">
                            <td colspan="4">REGISTRO DE PERSONAS</td>
                        </tr>
                    </tfoot>
                </table>
        {{else}}
            <div class="card text-center mx-auto" style="width: 350px;">
                <div class="card-header">
                    <h3>Debes crear una persona</h3>
                </div>
                <div class="card-body">
                    <p>Presiona éste botón para que puedas registrar a una persona en la aplicación.</p>
                    <a href="/add" class="btn btn-primary">Ir a Crear</a>
                </div>

            </div>
        {{/if}}
    </div>
  </div>
  ```

  Aquí tenemos una condicional ```{{#if personas}}```, con la cual, si tenemos datos en "personas" recibidos desde ```personas.route.js``` mostramos la tabla de las personas; en el caso de que no haya datos en "personas", mostramos un ```<div>``` con un mensaje de que "Se deben crear personas", seguido de un botón que nos enviará al formulario de creación de personas. En el caso de que si tengamos datos de personas en "personas" se hace un ```{{#each personas}}``` con el cual, para cada persona en "personas" se renderiza una fila de la tabla con la información de dicha persona. En el caso de que "personas" tenga 3 personas almacenadas, éste ```{{#each personas}}``` renderizará 3 filas de la tabla, una para cada persona.

#### Añadir persona:

- En ```personas.route.js``` creamos un endpoint que redireccione al usuario hacia la vista del formulario para añadir personas. En éste endpoint no se realiza ningún query a la base de datos puesto que solo es para redireccionar al usuario a otra vista:

  ```js
  router.get('/add', (req, res) => {
      try {
          res.render('personas/add'); // RENDERIZAMOS LA VISTA "add" CREADA EN "views/personas/".
      } catch (error) {
          res.status(500).json({message: error.message});
      }
  });
  ```
- En ```views/personas``` creamos el archivo ```add.hbs``` que contiene la siguiente estructura:

  ```hbs
  <div class="container p-4">
      <div class="row">
          <div class="col-md-4 mx-auto">
              <div class="card text-center">
                  <div class="card-header">
                      <h3 class="text-uppercase">CREAR NUEVA PERSONA</h3>
                  </div>
                  <div class="card-body"></div>
                  <form action="/add" method="post">
                  <div class="input-group mt-2">
                      <label class="input-group-text" for="name">Nombres</label>
                      <input class="form-control" type="text" name="name" id="name" placeholder="Ejemplo: Luis David" autofocus required>
                  </div>
                  <div class="input-group mt-2">
                      <label class="input-group-text" for="lastname">Apellidos</label>
                      <input class="form-control" type="text" name="lastname" id="lastname" placeholder="Ejemplo: Cornejo Bravo" required>
                  </div>
                  <div class="input-group mt-2">
                      <label class="input-group-text" for="age">Edad</label>
                      <input class="form-control" type="number" name="age" id="age" required>
                  </div>
                  <div class="form-group mt-4 d-grid gap-2">
                      <button class="btn btn-success">Crear</button>
                  </div>
                  </form>
              </div>
          </div>
      </div>
  </div>
  ```

  Se trata de un formulario para ingresar los datos de una persona. Al dar click al botón "Crear" de dicho formulario, se hace una petición "post" al endpoint con la ruta "/add" para insertar los datos de ésa persona en la base de datos. Para éllo es necesario configurar a ```<form>``` con los siguientes parámetros: ```<form action="/add" method="post">```.
  
- Una vez creado el formulario, creamos el endpoint para la petición "post" que insertará los datos en la base de datos. Ésto lo hacemos igualmente en ```personas.route.js``` de la siguiente manera:

  ```js
  router.post('/add', async (req, res) => {
    try {
        const {name, lastname, age} = req.body; // DESESTRUCTURAMOS EL CONTENIDO ENVIADO DESDE EL FORMULARIO DE AÑADIR PERSONA.
        const newPersona = { // CREAMOS UN OBJETO CON LOS DATOS TRAÍDOS DESDE EL FORMULARIO DE AÑADIR PERSONA
            name, lastname, age
        }
        await pool.query("INSERT INTO persona SET ?", [newPersona]); // HACEMOS UN QUERY DE "INSERT INTO" EN LA TABLA persona DE LA BASE DE DATOS
        res.redirect('/list'); // UNA VEZ INSERTADA LA PERSONA EN LA BASE DE DATOS, REDIRECCIONAMOS AL USUARIO A LA VISTA "LIST" PARA QUE PUEDA VER LA NUEVA PERSONA INSERTADA
    } catch (error) {
        res.status(500).json({message: error.message});
    }
  });
  ```

#### Editar una persona mediante su id:

- En ```personas.route.js``` creamos el siguiente endpoint:

  ```js
  router.get('/edit/:id', async(req, res) => {
    try {
        const {id} = req.params; // GUARDAMOS LA ID RECIBIDA COMO QUERY PARAM EN UNA CONSTANTE
        const [persona] = await pool.query("SELECT * FROM persona WHERE id = ?", [id]); // HACEMOS UN "SELECT" A LA BASE DE DATOS, CON LA ID RECIBIDA. ALMACENAMOS LA RESPUESTA EN UNA CONSTANTE
        const personaEdit = persona[0];
        res.render('personas/edit', {persona: personaEdit}); // RENDERIZAMOS LA VISTA DE EDICIÓN DE PERSONA, ENVIÁNDOLE LA CONSTANTE CON TODOS LOS DATOS DE LA PERSONA A EDITAR
    } catch (error) {
        res.status(500).json({message: error.message});

    }
  });
  ```

  - En ```views/personas``` creamos el archivo ```edit.hbs``` con la siguiente estructura:

    ```hbs
    <div class="container p-4">
      <div class="row">
          <div class="col-md-4 mx-auto">
              <div class="card text-center">
                  <div class="card-header">
                      <h3 class="text-uppercase">EDITAR PERSONA</h3>
                  </div>
                  <div class="card-body"></div>
                  <form action="/edit/{{persona.id}}" method="post">
                  <div class="input-group mt-2">
                      <label class="input-group-text" for="name">Nombres</label>
                      <input class="form-control" type="text" name="name" id="name" value="{{persona.name}}" placeholder="Ejemplo: Luis David" autofocus required>
                  </div>
                  <div class="input-group mt-2">
                      <label class="input-group-text" for="lastname">Apellidos</label>
                      <input class="form-control" type="text" name="lastname" id="lastname" value="{{persona.lastname}}" placeholder="Ejemplo: Cornejo Bravo" required>
                  </div>
                  <div class="input-group mt-2">
                      <label class="input-group-text" for="age">Edad</label>
                      <input class="form-control" type="number" name="age" id="age" value="{{persona.age}}" required>
                  </div>
                  <div class="form-group mt-4 d-grid gap-2">
                      <button class="btn btn-success">Actualizar</button>
                  </div>
                  </form>
              </div>
          </div>
      </div>
    </div>
    ```

    Se trata básicamente de un formulario igual al de "add", en el que cambia únicamente la configuración del ```<form>``` de la siguiente manera: ```<form action="/edit/{{persona.id}}" method="post">``` lo que significa que, al dar click en el botón "Actualizar" de éste formulario, se llamará al endpoint "post" de "/edit/:id", en donde "id" corresponde al id de la persona cuyos datos han sido editados.

- Creamos el endpoint en ```personas.route.js``` que actualizará los datos de la persona en la base de datos:

  ```js
  router.post('/edit/:id', async(req, res) => {
    try {
        const {name, lastname, age} = req.body; // RECIBIMOS EN EL BODY DESDE EL FORMULARIO DE EDITAR, TODOS LOS DATOS DE PERSONA, INCLUYENDO OBVIAMENTE LOS EDITADOS
        const {id} = req.params; // GUARDAMOS EN UNA CONSTANTE LA ID DE LA PERSONA EDITADA, RECIBIDA COMO QUERY PARAM
        const editPersona = {name, lastname, age}; // CREAMOS UN NUEVO OBJETO CON LOS NUEVOS DATOS
        await pool.query("UPDATE persona SET ? WHERE id = ?", [editPersona, id]); // HACEMOS UN "UPDATE" EN LA BASE DE DATOS, CON LOS DATOS ACTUALIZADOS Y LA ID DE LA PERSONA A ACTUALIZAR
        res.redirect('/list'); // REDIRECCIONAMOS A LA VISTA DE LISTA DE PERSONAS
    } catch (error) {
        res.status(500).json({message: error.message});

    }
  });
  ```

#### Eliminar personas por su id:

- En ```personas.route.js``` creamos el endpoint que eliminará de la base de datos una persona por su id, que será recibida como query param:
  ```js
  router.get('/delete/:id', async(req, res) => {
    try {
        const {id} = req.params; // ALMACENAMOS EN UNA CONSTANTE LA ID RECIBIDA COMO QUERY PARAM
        await pool.query("DELETE FROM persona WHERE id = ?", [id]); // HACEMOS UN "DELETE FROM" EN LA BASE DE DATOS, CON LA ID RECIBIDA
        res.redirect('/list'); // NUEVAMENTE RENDERIZAMOS LA LISTA DE PERSONAS, PARA QUE ÉSTA SE ACTUALICE Y YA NO MUESTRE A LA PERSONA ELIMINADA.
    } catch (error) {
        res.status(500).json({message: error.message});
    }
  });
  ```

  Cabe mencionar que tanto éste endpoint, como el endpoint de "actualizar", son invocados desde los botones de "actualizar" y "aliminar" renderizados en la vista ```list.hbs``` para cada persona. Los botones están configurados de la siguiente manera:

  ```hbs
  ...
  ...
  <td>
    <div class="btn-group">
      <a href="/edit/{{id}}" class="btn btn-warning">
        <i class="fa-regular fa-pen-to-square"></i>
      </a>
      <a href="/delete/{{id}}" class="btn btn-danger">
        <i class="fa-solid fa-trash"></i>
      </a>
    </div>
  </td>
  ...
  ...
  ```



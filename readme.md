# Vite + Bootstrap + Supabase Tutorial

## Inidice

- [Introducción](#introducción)
- [Instalacion Inicial](#instalacion-inicial)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Configuracion de Vite](#configuracion-de-vite)
- [Previo a Supabase](#previo-a-supabase)
- [Supabase](#supabase)
- [Versiones](#versiones)
- [Documentacion](#documentacion)

## Introducción

Bienvenido a este repositorio de ejemplo, creado para ilustrar la implementación práctica descrita en la guía. Aunque el proyecto no se completará totalmente, aquí encontrarás un código base que demuestra cómo integrar Vite, Bootstrap y Supabase utilizando HTML y CSS.

Esta guía básica te permitirá:

- Crear un proyecto inicial con Vite y Bootstrap.
- Integrar Supabase como backend.
- Implementar un sencillo sistema de autenticación que incluye creación de usuarios, inicio de sesión y cierre de sesión.

Este repositorio es ideal como punto de partida para aprender a combinar estas tecnologías y desarrollar proyectos más completos en el futuro.

## Instalacion Inicial

Para crear el proyecto se ejecutarán una serie de comandos en terminal.

- Primero deberemos crear la carpeta del proyecto y entrar en la misma.

```bash
mkdir mi-proyecto && cd mi-proyecto
```

- Segundo deberemos inicializar el proyecto con Node, personalmente recomiendo usar nvm si no lo tienes instalado.

```bash
npm init -y
```

- Tercero deberemos instalar Vite

```bash
npm i --save-dev vite
```

- Cuarto instalamos bootstrap y popperjs

```bash
npm i --save bootstrap @popperjs/core
```

- Instalamos depedencia Sass, nos hace falta para importar y compilar correctamente el CSS de Bootstrap junto con Vite

```bash
npm i --save-dev sass
```

## Estructura del proyecto

Ejecutaremos el siguiente comando para crear la estructura de carpetas del proyecto

```bash
mkdir {src,src/js,src/scss}
touch src/index.html src/js/main.js src/scss/styles.scss vite.config.js
```

Posteriormente deberias tener la siguiente estructura de carpetas o similar.

```bash
mi-proyecto/
├── package-lock.json
├── package.json
├── readme.md
├── src
│   ├── index.html
│   ├── js
│   │   └── main.js
│   └── scss
│       └── styles.scss
└── vite.config.js
```

## Configuracion de Vite

Para poder usar Vite en nuestro proyecto debemos crear el archivo vite.config.js y agregar el siguiente codigo.

```javascript
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: resolve(__dirname, "src"),
  envDir: resolve(__dirname), // Configura la ruta de la carpeta donde se encuentran tus variables de entorno. (fichero .env)
  build: {
    outDir: "../dist",
  },
  server: {
    port: 8080,
  },
  // Esta configuración es para que no se muestre el mensaje de advertencia de Sass, me fue necesario para ocultar warnings sobre algunas funciones internas de bootstrap que estan deprecated.
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        logger: {
          warn: () => {},
        },
      },
    },
  },
});
```

A continuacion, modificaremos el index.html para que use estilos de Bootstrap, aunque todavia no estara funcionando.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bootstrap w/ Vite</title>
    <script type="module" src="./js/main.js"></script>
  </head>
  <body>
    <div class="container py-4 px-3 mx-auto">
      <h1>Hello, Bootstrap and Vite!</h1>
      <button class="btn btn-primary">Primary button</button>
    </div>
  </body>
</html>
```

### Añadimos comandos de vite a package.json

```json
{
  // ...
  "scripts": {
    "start": "vite",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
  // ...
}
```

Por ultimo, ejecutamos el comando para iniciar el servidor de desarrollo.

```bash
npm start
```

Al iniciarlo deberia abrirse en el navegador la pagina de ejemplo, sin aplicarse los estilos de Bootstrap, como se muestra en la siguiente imagen.
![Pagina web sin estilos de Bootstrap](<assets/images(readme)/serverSinEstilo.png>)

Vamos a arreglarlo

- Primero modificamos el archivo styles.scss dentro de src/scss.

```scss
// Replace the @import with @use
@use "bootstrap/scss/bootstrap" as *;
```

- A continuacion, modificamos el archivo main.js dentro de src/js.

```javascript
import "../scss/styles.scss";
import * as bootstrap from "bootstrap";
```

Ahora deberia funcionar correctamente y verse similar a esto.
![Pagina web con estilos de Bootstrap](<assets/images(readme)/serverBootstrap.png>)

Si es así, felcidades, has terminado la configuración inicial de Vite, Bootstrap y Sass.

## Previo a Supabase

Antes de integrar Supabase, e indicar que pasos se deben seguir, primero crearemos las distintas vistas en html que tendremos en nuestra aplicación, para asi, posteriormente, crear las funciones de javascript que se encargaran de realizar las peticiones a la base de datos. Para ello modificaremos el index.html, y crearemos 2 mas llamados registro.html y perfil.html

### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bootstrap w/ Vite</title>
    <script type="module" src="./js/main.js"></script>
  </head>

  <body>
    <div class="container">
      <div class="row min-vh-100 justify-content-center align-items-center">
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body">
              <h2 class="text-center mb-4">Login</h2>
              <form>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    placeholder="Enter your email"
                  />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    placeholder="Enter your password"
                  />
                </div>
                <button type="submit" class="btn btn-primary w-100">
                  Login
                </button>
                <div class="text-center mt-3">
                  <a href="registro.html">Don't have an account? Register</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
```

### registro.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Register - Bootstrap w/ Vite</title>
    <script type="module" src="./js/registro.js"></script>
  </head>
  <body>
    <div class="container">
      <div class="row min-vh-100 justify-content-center align-items-center">
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body">
              <h2 class="text-center mb-4">Register</h2>
              <form id="register-form">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    required
                    placeholder="Enter your email"
                  />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    required
                    placeholder="Enter your password"
                  />
                </div>
                <div class="mb-3">
                  <label for="confirm-password" class="form-label"
                    >Confirm Password</label
                  >
                  <input
                    type="password"
                    class="form-control"
                    id="confirm-password"
                    required
                    placeholder="Confirm your password"
                  />
                </div>
                <button type="submit" class="btn btn-primary w-100">
                  Register
                </button>
                <div class="text-center mt-3">
                  <a href="index.html">Already have an account? Login</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
```

### perfil.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Profile - Bootstrap w/ Vite</title>
    <script type="module" src="./js/perfil.js"></script>
  </head>
  <body>
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow">
            <div class="card-body">
              <h2 class="text-center mb-4">Profile</h2>
              <div id="profile-info">
                <div class="mb-3">
                  <label class="fw-bold">Email:</label>
                  <p id="user-email"></p>
                </div>
                <div class="mb-3">
                  <label class="fw-bold">User ID:</label>
                  <p id="user-id"></p>
                </div>
                <div class="mb-3">
                  <label class="fw-bold">Last Sign In:</label>
                  <p id="last-signin"></p>
                </div>
              </div>
              <button id="logout-btn" class="btn btn-danger">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
```

## Supabase

Lo primero, es crear una cuenta en Supabase si no tienen una, luego, crear un nuevo proyecto. y copiar las credenciales del proyecto.
Para ello deben entrar en "Project Settings", y luego en el menu lateral izquierdo, dentro de la sección de "CONFIGURATION", encontrarán un enlace llamado "Data API", una vez dentro deberan localizar 2 valores, la URL y la anon key.

Deberemos crear un archivo .env en la raiz del proyecto y agregar las credenciales de Supabase.

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Sustituir los valores por los que tienen en su proyecto de Supabase.

A continuacion, instalaremos el cliente de Supabase para JavaScript.

```bash
npm i @supabase/supabase-js
```

Una vez instalado, podemos crear un archivo llamado supabase.js en la carpeta src/js y agregar el siguiente código para terminar con la configuración de Supabase.

```javascript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Ahora podemos usar el cliente de Supabase en cualquier archivo de JavaScript de nuestra aplicación. Pero como recomendacion, es mejor crear un archivo para cada servicio, uno para auth, otro para database y otro para storage,estos son los principales servicios que nos proporciona Supabase, aunque para este proyecto solo usaremos auth.

Dentro de src/js crearemos una carpeta llamada services y dentro de ella crearemos un archivo llamado authService.js y este fichero nos permitira hacer implementar las funciones de autenticacion que creamos necesarios, esto es util para la abstraccion. Imagina que en un futuro decides usar otro servicio de autenticacion, solo tendras que modificar este archivo y no tener que modificar el resto de codigo.

```javascript
import { supabase } from "../supabase";

export const authService = {
  // Sign up new user
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  // Sign in existing user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  },
};
```

A continuacion, modificaremos el fichero main.js, ya que es el fichero que se ejecutara al iniciar la aplicacion, y en el index.html tenemos el formulario de login.

### main.js

```javascript
import "../scss/styles.scss";
import * as bootstrap from "bootstrap";
import { authService } from "./services/authService";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const { data, error } = await authService.signIn(email, password);

      if (error) throw error;

      console.log("Logged in successfully:", data);
      window.location.href = "perfil.html";
      // Handle successful login (e.g., redirect to dashboard)
    } catch (error) {
      console.error("Error logging in:", error.message);
      // Handle error (e.g., show error message to user)
    }
  });
});
```

### registro.js

```javascript
import "../scss/styles.scss";
import * as bootstrap from "bootstrap";
import { authService } from "./services/authService";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
      console.error("Passwords don't match");
      return;
    }

    try {
      const { data, error } = await authService.signUp(email, password);

      if (error) throw error;

      console.log("Registered successfully:", data);
      window.location.href = "perfil.html";
    } catch (error) {
      console.error("Error registering:", error.message);
    }
  });
});
```

### perfil.js

```javascript
import "../scss/styles.scss";
import * as bootstrap from "bootstrap";
import { authService } from "./services/authService";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const { user, error } = await authService.getCurrentUser();

    if (error || !user) {
      window.location.href = "index.html";
      return;
    }

    // Display user information
    document.getElementById("user-email").textContent = user.email;
    document.getElementById("user-id").textContent = user.id;
    document.getElementById("last-signin").textContent = new Date(
      user.last_sign_in_at
    ).toLocaleString();

    // Handle logout
    document
      .getElementById("logout-btn")
      .addEventListener("click", async () => {
        try {
          const { error } = await authService.signOut();
          if (error) throw error;
          window.location.href = "index.html";
        } catch (error) {
          console.error("Error logging out:", error.message);
        }
      });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    window.location.href = "index.html";
  }
});
```

Deberiamos tener una estrucura en el proyecto similar a esta

```bash
mi-proyecto/
├── src
│   ├── js
│   │   ├── services
│   │   │   └── authService.js
│   │   ├── main.js
│   │   ├── perfil.js
│   │   ├── registro.js
│   │   └── supabase.js
│   ├── scss
│   │   └── styles.scss
│   ├── index.html
│   ├── perfil.html
│   └── registro.html
├── .env
├── .gitignore
├── .sassrc
├── package-lock.json
├── package.json
├── readme.md
└── vite.config.js
```

Si ahora entramos en la pagina web, deberiamos poder registrarnos, logearnos, ver nuestro perfil y cerrar sesion. Deberia verse asi la aplicación.

![Login](<assets/images(readme)/loginFinal.png>)
![Registro](<assets/images(readme)/registroFinal.png>)
![Perfil](<assets/images(readme)/perfilFinal.png>)

## Versiones

Es posible que si la version mayor de alguna de las tecnologias difiera la guia no sirva en su totalidad, en ese caso, se recomienda buscar la guia de la version mayor de la tecnologia que se esta utilizando. Puedes ver la documentacion que se uso para elaborar esta guía [aquí](#documentacion)

- "vite": "^6.2.5"
- "@popperjs/core": "^2.11.8"
- "@supabase/supabase-js": "^2.49.4"
- "bootstrap": "^5.3.4"

## Documentacion

- Supabase: [ https://supabase.com/docs](https://supabase.com/docs)
- Vite: [ https://vite.dev/guide/](https://vite.dev/guide/)
- Bootstrap + Vite: [ https://getbootstrap.com/docs/5.3/getting-started/vite/](https://getbootstrap.com/docs/5.3/getting-started/vite/)

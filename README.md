## neat-crypto-exchange-api

Para correr este proyecto hay que seguir los siguientes pasos:
 1. Clonar este repositorio en tu local
 2. Ir al directorio functions
 3. Instalar las dependencias
 ```bash
npm install
``` 
 
 4. Levantar el servidor de forma local
```bash
firebase emulators:start
```
En la consola aparecerá el endpoint de la cloud function. Para poder probarla con algún cliente, se utiliza esa ruta como raíz. La api está en el endpoint `/api`.

Por lo tanto, si la consola dice que la function se inicializa en `http://127.0.0.1:5001/neat-crypto-exchange/us-central1/function`, para acceder a la api basta con agregar `/api` a la ruta.

NOTA: Los request tienen que ser autenticados con un token válido utilizando autenticación tipo `Beaerer` en la cabezera.


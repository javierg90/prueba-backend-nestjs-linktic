# Prueba Técnica Backend — Microservicios Inventario y Productos

---

## 1. **Descripción general**

Este proyecto implementa **dos microservicios independientes** usando **NestJS**, **Sequelize** y **MySQL** para la gestión de productos e inventarios. Ambos se orquestan usando **Docker Compose** y siguen principios de clean architecture, desacoplamiento y buenas prácticas modernas de desarrollo backend.

---

## 2. **Arquitectura general**

### **Resumen**

- **products-service**: Gestiona productos (CRUD, consulta y administración).
- **inventory-service**: Gestiona inventarios y consulta productos vía HTTP al otro microservicio.
- **MySQL**: Base de datos compartida, crea y mantiene las tablas necesarias para ambos microservicios.
- **Docker Compose**: Orquesta el despliegue y la comunicación de los servicios.

### **Puntos clave de la arquitectura**

- **Cada microservicio es autónomo y puede escalarse de forma independiente.**
- **La comunicación entre microservicios es por HTTP RESTful**, siguiendo buenas prácticas de integración.
- **Ambos servicios comparten la base de datos**, pero cada uno gestiona solo su propio esquema y lógica de datos.
- **Migraciones y seeds automáticos:** Al iniciar, cada microservicio espera a que la base esté lista, aplica migraciones y carga datos iniciales.

---

## 3. **Decisiones técnicas y justificaciones**

| Decisión                                       | Justificación                                                                                                       |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **NestJS como framework**                      | Permite construir servicios desacoplados, escalables y fácilmente testeables.                                       |
| **Sequelize como ORM**                         | Soporte maduro para MySQL, integración sencilla con NestJS y manejo robusto de migraciones y seeds.                 |
| **MySQL**                                      | Base relacional clásica, rápida para prototipado, ampliamente conocida y usada en la industria colombiana.          |
| **Docker y Docker Compose**                    | Garantiza portabilidad, aislamiento y despliegue homogéneo entre diferentes ambientes y equipos.                    |
| \`\`\*\* para espera activa\*\*                | Evita errores de conexión prematura y garantiza que los servicios sólo arranquen cuando MySQL realmente esté listo. |
| **Separación estricta de migraciones y seeds** | Reduce errores, mantiene claridad entre responsabilidades de cada microservicio y mejora mantenibilidad.            |
| **.env/configuración por variables**           | Permite flexibilidad y portabilidad entre ambientes sin cambiar el código.                                          |
| **Seeds y migraciones en cada inicio**         | Acelera las pruebas y asegura bases limpias para cada test/revisión. Ideal para pruebas técnicas y desarrollo.      |

---

## 4. **Diagrama de interacción entre servicios**

A continuación se muestra un diagrama de interacción de alto nivel:

```
┌─────────────────────┐      HTTP        ┌──────────────────────┐
│  products-service   │◀───────────────▶│  inventory-service   │
│ (Puerto 3000)       │                │  (Puerto 3001)        │
│                     │                │                      │
│   Sequelize + MySQL │                │   Sequelize + MySQL  │
└─────────┬───────────┘                └──────────┬────────────┘
          │                                         │
          └───────────┬─────────────────────────────┘
                      │
                  ┌────▼────┐
                  │ MySQL   │
                  │ 8.x     │
                  │ (3307)  │
                  └─────────┘
```

- **products-service** gestiona productos y responde a solicitudes de inventory-service.
- **inventory-service** realiza operaciones de inventario y consulta a products-service por HTTP cuando necesita datos de producto.
- Ambos servicios comparten una misma instancia de **MySQL**, pero cada uno mantiene su dominio.

---

## 5. **Instrucciones de instalación y ejecución**

### **Prerrequisitos**

- Docker y Docker Compose instalados en la máquina.
- (Opcional) Node.js 20.x para ejecutar fuera de Docker.

---

### **Ejecución con Docker Compose (recomendado)**

1. Clona el repositorio y entra al directorio principal:
   ```bash
   git clone <repo-url>
   cd prueba-nestjs
   ```
2. Ejecuta:
   ```bash
   docker compose up --build
   ```
   - Esto construirá las imágenes y levantará la base de datos junto a ambos microservicios.
   - Cada servicio esperará que MySQL esté listo antes de migrar y seedear automáticamente.

---

### **Parar y limpiar los servicios**

Para detener y limpiar el entorno completamente (incluyendo los datos):

```bash
docker compose down -v
```

---

### **Acceso a la base de datos (opcional)**

- **Host:** `localhost`
- **Puerto:** `3307`
- **Usuario:** `admin`
- **Contraseña:** `password*`
- **Base de datos:** `db_linktic`

---

### **Pruebas de los endpoints**

Puedes usar [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/) o `curl`.

#### **Products-service** (`http://localhost:3000/products`)

| Método | Endpoint       | Descripción               | Body/Params Ejemplo                         |
| ------ | -------------- | ------------------------- | ------------------------------------------- |
| GET    | /products      | Lista todos los productos |                                             |
| GET    | /products/\:id | Detalle de un producto    | /products/1                                 |
| POST   | /products      | Crea un producto          | `{ "nombre": "Camiseta", "precio": 89000 }` |
| PATCH  | /products/\:id | Actualiza un producto     | `{ "precio": 79000 }`                       |
| DELETE | /products/\:id | Elimina un producto       |                                             |

#### **Inventory-service** (`http://localhost:3001/inventories`)

| Método | Endpoint                  | Descripción                                  | Body/Params Ejemplo                    |
| ------ | ------------------------- | -------------------------------------------- | -------------------------------------- |
| GET    | /inventories/\:productoId | Consulta el inventario de un producto        | /inventories/1                         |
| POST   | /inventories              | Crea un registro de inventario               | `{ "producto_id": 1, "cantidad": 50 }` |
| PATCH  | /inventories/\:productoId | Actualiza cantidad disponible de un producto | `{ "cantidad": 45 }`                   |

---

## **Pruebas de los endpoints**

Puedes probar los endpoints con [Postman](https://www.postman.com/) o [Insomnia](https://insomnia.rest/).\
A continuación, se describen las peticiones que debes realizar, indicando claramente el método, la URL y el body requerido:

---

### **Products-service** (`http://localhost:3000/products`)

#### 1. **Listar productos**

- **Método:** `GET`
- **URL:** `http://localhost:3000/products`

---

#### 2. **Consultar detalle de un producto**

- **Método:** `GET`
- **URL:** `http://localhost:3000/products/1`

---

#### 3. **Crear un producto**

- **Método:** `POST`
- **URL:** `http://localhost:3000/products`
- **Body (JSON):**
  ```json
  {
    "nombre": "Camiseta",
    "precio": 89000
  }
  ```

---

#### 4. **Actualizar un producto**

- **Método:** `PATCH`
- **URL:** `http://localhost:3000/products/1`
- **Body (JSON):**
  ```json
  {
    "precio": 79000
  }
  ```

---

#### 5. **Eliminar un producto**

- **Método:** `DELETE`
- **URL:** `http://localhost:3000/products/1`

---

### **Inventory-service** (`http://localhost:3001/inventories`)

#### 1. **Consultar inventario de un producto**

- **Método:** `GET`
- **URL:** `http://localhost:3001/inventories/1`

---

#### 2. **Crear inventario para un producto**

- **Método:** `POST`
- **URL:** `http://localhost:3001/inventories`
- **Body (JSON):**
  ```json
  {
    "producto_id": 1,
    "cantidad": 50
  }
  ```

---

#### 3. **Actualizar cantidad disponible de un producto**

- **Método:** `PATCH`
- **URL:** `http://localhost:3001/inventories/1`
- **Body (JSON):**
  ```json
  {
    "cantidad": 45
  }
  ```

---

## 6. **Notas técnicas y extensibilidad**

- La solución incluye scripts de espera (`wait-port`) para un arranque seguro y sin errores de conexión.
- Seeds y migraciones se aplican automáticamente, facilitando el testing y la revisión.
- Fácilmente extensible a más microservicios o a infraestructura en la nube (ECS, GKE, Azure, etc.).
- El código es compatible con CI/CD y testing automatizado.

---

## 7. **Contacto**

**Javier Garcia Mora**\
**javier.garcia9611@gmail.com**\

---

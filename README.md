# MiTienda (app móvil)

App móvil de **MiTienda**, una tienda virtual de ropa, calzado y accesorios. El comprador ve el catálogo, arma su carrito y envía el pedido **sin crear una cuenta**. El administrador inicia sesión para gestionar los productos y revisar los pedidos.

Proyecto final de la materia **Desarrollo de Aplicaciones en Dispositivos Móviles**. Está construida con React Native + Expo y consume la API del repositorio [mitienda-api](https://github.com/DanielArango457/mitienda-api).

## Enlaces

| Qué | Dónde |
|---|---|
| Documentación completa (Wiki) | https://github.com/DanielArango457/mitienda-app/wiki |
| APK para instalar en Android | https://github.com/DanielArango457/mitienda-app/releases/tag/v1.0.0 |
| API en producción | https://mitienda-api-5561.onrender.com/api/v1/productos |
| Repositorio de la API | https://github.com/DanielArango457/mitienda-api |

> La API usa el plan gratuito de Render: si lleva 15 minutos sin uso se duerme y la primera petición puede tardar cerca de 1 minuto. Abre el enlace de la API en el navegador y espera a que salgan los productos antes de usar la app.

## Funcionalidades

**Comprador (sin registro)**
- Catálogo con foto, precio, categoría y stock; búsqueda por nombre y filtro por categoría. Los productos sin stock se muestran como *Agotado*.
- Detalle del producto y carrito, que se conserva aunque se cierre la app.
- El carrito se sincroniza con el stock y los precios actuales.
- Pedido con nombre y teléfono, con validaciones. Si falta stock, la app lo avisa.
- Si la API no responde, muestra un error claro con la opción de reintentar.

**Administrador (con sesión)**
- Acceso con correo y contraseña (sesión de 8 horas).
- Panel para crear, editar y eliminar productos.
- Lista de pedidos recibidos.

## Tecnologías

- React Native 0.86 y Expo (SDK 57), con TypeScript
- React Navigation (pila nativa)
- Context API (sesión y carrito)
- Axios (cliente de la API)
- AsyncStorage (carrito y usuario) y expo-secure-store (token de sesión)

## Requisitos

- Node.js (se desarrolló con la versión 24) y npm
- La app **Expo Go** (SDK 57) en el celular, con el celular y el computador en la misma red WiFi
- Para generar el APK: una cuenta gratuita de Expo

## Instalación y ejecución

```
git clone https://github.com/DanielArango457/mitienda-app.git
cd mitienda-app
npm install
npx expo start
```

Escanea el código QR con Expo Go.

### Dirección de la API

La dirección de la API está en un solo archivo: `src/constants/config.ts`.

- Producción (por defecto): `https://mitienda-api-5561.onrender.com/api/v1`
- API local: cambia el valor por la IP de tu computador, por ejemplo `http://192.168.1.7:3000/api/v1` (la IP se consulta con `ipconfig`; sin espacios después de `http://`).

### Usuario de prueba (administrador)

Correo `admin@mitienda.com`. La contraseña se entrega por separado. Los compradores no necesitan usuario.

## Generar el APK

```
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

- El perfil `preview` genera un **APK** instalable directamente. El perfil `production` genera un **AAB**, el formato que pide Google Play.
- Antes de compilar, comprueba que `API_URL` apunte a la API de producción: el APK lleva esa dirección dentro.
- El identificador de la app es `com.danielarango.mitienda` (`app.json`) y la configuración de EAS está en `eas.json`.

## Estructura del proyecto

```
App.tsx                 Punto de entrada (AuthProvider > CartProvider > AppNavigator)
src/
  components/           Componentes reutilizables (ProductoImagen, CustomInputField)
  constants/            Configuración (config.ts con la dirección de la API)
  context/              AuthContext (sesión) y CartContext (carrito)
  navigation/           AppNavigator (pantallas y navegación)
  screens/              Las 8 pantallas
  services/             api.ts (Axios), auth.service.ts, productos.ts, pedidos.ts, storage.ts
  styles/               Colores
  types/                Tipos de navegación
  utils/                Formato de precios
```

## Pantallas

Catálogo, Detalle del producto, Carrito, Finalizar compra, Pedido confirmado, Acceso administrador, Panel de administrador y Pedidos recibidos. Capturas y flujo de navegación en la [Wiki](https://github.com/DanielArango457/mitienda-app/wiki/3-Pantallas-y-flujo).

## Calidad

El código se analiza con SonarQube Cloud: *quality gate* aprobado y calificación A en seguridad, fiabilidad y mantenibilidad. Detalle en la [Wiki](https://github.com/DanielArango457/mitienda-app/wiki/9-Calidad-y-seguridad).

## Licencia

MIT (ver `LICENSE`).

import { Product, Customer, Cook } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Tacos al Pastor',
    price: 18,
    category: 'tacos',
    image: '/src/assets/images/tacos_al_pastor_1779764327802.png',
    description: 'Carne adobada al pastor en tortilla de maíz, piña, cilantro y cebolla recién cortados.',
  },
  {
    id: 'prod-2',
    name: 'Tacos de Carne Asada',
    price: 22,
    category: 'tacos',
    image: '/src/assets/images/tacos_de_carne_asada_1779764342405.png',
    description: 'Tradicional bistec de res asado al carbón, tierno y jugoso sobre tortillas calientes.',
  },
  {
    id: 'prod-3',
    name: 'Tacos Campechanos',
    price: 20,
    category: 'tacos',
    image: '/src/assets/images/tacos_campechanos_1779764359612.png',
    description: 'Exquisita combinación de asada, chorizo y chicharrón crujiente con su salsa verde.',
  },
  {
    id: 'prod-4',
    name: 'Agua de Horchata',
    price: 25,
    category: 'bebidas',
    image: '/src/assets/images/agua_de_horchata_1779764373781.png',
    description: 'Refrescante agua tradicional de arroz con un toque cremoso de leche y canela.',
  },
  {
    id: 'prod-5',
    name: 'Gringa de Pastor',
    price: 35,
    category: 'tacos',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    description: 'Tortilla de harina grande rellena de delicioso queso derretido y carne al pastor.',
  },
  {
    id: 'prod-6',
    name: 'Agua de Jamaica',
    price: 25,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=600&q=80',
    description: 'Limonada de flor de hibisco (jamaica) 100% natural y endulzada perfectamente.',
  },
  {
    id: 'prod-7',
    name: 'Guacamole con Totopos',
    price: 45,
    category: 'adicionales',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80',
    description: 'Guacamole fresco preparado al momento con aguacates de Michoacán y totopos crujientes.',
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Carlos Mendoza',
    phone: '5512345678',
    email: 'carlos.m@mail.com',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    acceptedPrivacy: true,
  },
  {
    id: 'cust-2',
    name: 'Sofía Rodríguez',
    phone: '5598765432',
    email: 'sofia.rod@mail.com',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 hour ago
    acceptedPrivacy: true,
  },
];

export const INITIAL_COOKS: Cook[] = [
  {
    id: 'cook-1',
    name: 'Don Chuy',
    avatar: '👨‍🍳',
    specialty: 'Maestro Taquero de Pastor y Asada',
  },
  {
    id: 'cook-2',
    name: 'Doña Mary',
    avatar: '👩‍🍳',
    specialty: 'Reina de las Gringas y Salsas Especiales',
  },
];

export const PRIVACY_CONTRACT_TEXT = `CONTRATO DE AVISO DE PRIVACIDAD PARA CLIENTES DE LA TAQUERÍA
--------------------------------------------------------------------------------

De conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (en adelante, la "Ley"), nuestra Taquería manifiesta su compromiso absoluto con la privacidad, seguridad y confidencialidad en el tratamiento de los datos personales de nuestros distinguidos clientes.

1. Identidad y Domicilio del Responsable:
La Taquería, con domicilio en Av. Revolución #456, Ciudad de México, es la entidad responsable de recabar, procesar y resguardar sus datos de carácter personal.

2. Obtención de Datos:
Los datos personales que se recaban incluyen de manera única y exclusiva:
- Nombre y Apellido: Para identificación individual del pedido.
- Teléfono de Contacto: Para notificaciones sobre el estado de la preparación.
- Correo Electrónico: Para el envío de promociones, encuestas de satisfacción y confirmación de órdenes.

3. Finalidades Primarias del Tratamiento de Datos:
Los datos proporcionados serán utilizados estrictamente para:
a) Levantar y registrar su orden en nuestro sistema de cocina.
b) Asignar un cocinero para el procesamiento higiénico de su pedido.
c) Facilitar el cobro final en caja mediante los métodos autorizados: efectivo, tarjeta o transferencia interbancaria.
d) Permitir el seguimiento en tiempo real de su orden desde que se manda a preparación hasta que es entregada.

4. Finalidades Secundarias:
- De manera opcional, para enviarle ofertas especiales en días festivos y promociones semanales. Usted puede solicitar la baja de estos comunicados en cualquier momento.

5. Seguridad y Resguardo:
Nos comprometemos a que toda la información transferida estará protegida bajo estrictas medidas de seguridad técnica, administrativa y física para prevenir cualquier alteración, robo, pérdida o acceso no deseado. Sus datos jamás serán compartidos o vendidos a terceras empresas comerciales con fines ajenos a los servicios propios de la Taquería.

6. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición):
Usted tiene pleno derecho de acceder, rectificar o cancelar el uso de sus datos en nuestro software escribiéndonos directamente en la sección del perfil de cliente o solicitándolo al encargado de caja.

Al registrarse y presionar "Aceptar Aviso de Privacidad", usted manifiesta su consentimiento libre, expreso e informado de que conservemos sus datos con el único propósito de brindarle los mejores tacos de la ciudad con un servicio de alta tecnología.`;

import React, { useState } from "react";
import TokyoMetroGuide from "./TokyoMetroGuide";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Calendar, MapPin } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Constantes para conversión de monedas
const YEN_TO_USD = 1 / 149.93;
const USD_TO_MXN = 20.36;

// Formatear monedas
const formatYen = (amount) => `¥${Math.round(amount).toLocaleString()}`;
const formatUSD = (amount) => `$${amount.toFixed(2)} USD`;
const formatMXN = (amount) => `$${Math.round(amount).toLocaleString()} MXN`;

// Convertir monedas
const convertCurrency = (amount, from, to) => {
  if (from === "JPY" && to === "USD") return amount * YEN_TO_USD;
  if (from === "JPY" && to === "MXN") return amount * YEN_TO_USD * USD_TO_MXN;
  if (from === "USD" && to === "JPY") return amount / YEN_TO_USD;
  if (from === "USD" && to === "MXN") return amount * USD_TO_MXN;
  if (from === "MXN" && to === "JPY") return amount / USD_TO_MXN / YEN_TO_USD;
  if (from === "MXN" && to === "USD") return amount / USD_TO_MXN;
  return amount; // Misma moneda
};

// Fechas del viaje
const startDate = new Date(2025, 6, 3);
const endDate = new Date(2025, 6, 28);

// Ciudades recomendadas con información detallada
const cities = [
  {
    id: 1,
    name: "Tokio",
    description:
      "Capital de Japón que combina modernidad y tradición. Desde rascacielos futuristas hasta templos antiguos, Tokio ofrece una experiencia única.",
    image:
      "https://www.cloud-europamundo.com/img/carousel/hd/Tokio_20210324155519.jpg",
    days: 5,
    startDate: new Date(2025, 6, 3),
    endDate: new Date(2025, 6, 8),
    weather: "Cálido y húmedo, 25-32°C, posibilidad de lluvias",
    accommodation: {
      hostel: 3500,
      airbnb: 7000,
      hotel3: 12000,
      hotel4: 20000,
      hotel5: 35000,
    },
    festivals: [
      "Tanabata (Festival de las Estrellas) - 7 de julio",
      "Mitama Matsuri - 13-16 de julio",
    ],
    attractions: [
      {
        name: "Shibuya Crossing",
        category: "Urbana",
        price: 0,
        timeNeeded: "1 hora",
        hours: "24 horas",
        description:
          "El cruce peatonal más famoso del mundo, perfecto para experimentar el pulso de Tokio.",
      },
      {
        name: "Shibuya Sky",
        category: "Urbana",
        price: 2000,
        timeNeeded: "2 horas",
        hours: "10:00 - 22:00",
        description:
          "Mirador espectacular con vistas panorámicas de 360° sobre la ciudad.",
      },
      {
        name: "Santuario Meiji",
        category: "Cultural",
        price: 0,
        timeNeeded: "2 horas",
        hours: "5:00 - 18:00",
        description:
          "Impresionante santuario sintoísta dedicado al Emperador Meiji y la Emperatriz Shoken.",
      },
      {
        name: "Shinjuku",
        category: "Urbana",
        price: 1800,
        timeNeeded: "4 horas",
        hours: "5:00 - 18:00",
        description:
          "Observatorio del Gobierno Metropolitano (gratis) y el vibrante barrio de Kabukicho",
      },
      {
        name: "teamLab Planets/Borderless",
        category: "Urbana",
        price: 3200,
        timeNeeded: "3 horas",
        hours: "5:00 - 18:00",
        description:
          "Museo de arte digital inmersivo, imprescindible para fotografías espectaculares",
      },
      {
        name: "Barrio de Akihabara",
        category: "Urbana",
        price: 0,
        timeNeeded: "3-4 horas",
        hours: "Tiendas 10:00 - 20:00",
        description:
          "El paraíso de la electrónica y la cultura otaku en Tokio.",
      },
      {
        name: "Torre Skytree",
        category: "Urbana",
        price: 2100,
        timeNeeded: "2 horas",
        hours: "8:00 - 22:00",
        description:
          "La torre más alta de Japón con vistas panorámicas de la ciudad.",
      },
      {
        name: "Parque Ueno",
        category: "Natural",
        price: 0,
        timeNeeded: "3 horas",
        hours: "5:00 - 23:00",
        description:
          "Extenso parque con museos, zoológico y hermosos jardines.",
      },
      {
        name: "Mercado Tsukiji Outer",
        category: "Urbana",
        price: 0,
        timeNeeded: "3 horas",
        hours: "5:00 - 14:00",
        description:
          "Experiencia gastronómica con puestos de comida fresca y tradicional.",
      },
      {
        name: "Palacio Imperial",
        category: "Cultural",
        price: 0,
        timeNeeded: "2 horas",
        hours: "9:00 - 17:00",
        description: "Residencia de la familia imperial con hermosos jardines.",
      },
      {
        name: "Jardines Shinjuku Gyoen",
        category: "Natural",
        price: 500,
        timeNeeded: "2 horas",
        hours: "9:00 - 16:30",
        description:
          "Oasis verde en el centro de Tokio con áreas japonesas, francesas e inglesas.",
      },
      {
        name: "Crucero por el Río Sumida",
        category: "Natural",
        price: 1000,
        timeNeeded: "1 hora",
        hours: "10:00 - 18:00",
        description: "Perspectiva diferente de Tokio desde el agua.",
      },
      {
        name: "Odaiba",
        category: "Urbana",
        price: 0,
        timeNeeded: "Medio día",
        hours: "Centros comerciales 10:00 - 21:00",
        description:
          "Isla artificial con centros comerciales, entretenimiento y Estatua de la Libertad.",
      },
      {
        name: "Museo Ghibli",
        category: "Cultural",
        price: 1000,
        timeNeeded: "2-3 horas",
        hours: "10:00 - 18:00",
        description:
          "Museo dedicado a las películas del estudio de animación Studio Ghibli.",
      },
    ],
  },
  {
    id: 3,
    name: "Kawaguchiko",
    description:
      "Pintoresco pueblo junto a un lago con impresionantes vistas del Monte Fuji. Ofrece aguas termales, naturaleza y actividades al aire libre.",
    image:
      "https://images.pexels.com/photos/2451043/pexels-photo-2451043.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    days: 1,
    startDate: new Date(2025, 6, 9),
    endDate: new Date(2025, 6, 10),
    weather:
      "Cálido, 20-28°C, más fresco que Tokio, posibilidad de niebla matutina",
    accommodation: {
      hostel: 3200,
      airbnb: 7000,
      hotel3: 12000,
      hotel4: 20000,
      hotel5: 35000,
    },
    festivals: [],
    attractions: [
      {
        name: "Lago Kawaguchiko",
        category: "Natural",
        price: 0,
        timeNeeded: "2-3 horas",
        hours: "24 horas",
        description:
          "Hermoso lago con vistas espectaculares del Monte Fuji, perfecto para fotografía y paseos.",
      },
      {
        name: "Teleférico del Monte Kachi Kachi",
        category: "Natural",
        price: 900,
        timeNeeded: "1-2 horas",
        hours: "9:00 - 17:00",
        description:
          "Teleférico que ofrece vistas panorámicas del lago y el Monte Fuji.",
      },
      {
        name: "Museo Kubota Itchiku",
        category: "Cultural",
        price: 1300,
        timeNeeded: "1 hora",
        hours: "9:00 - 17:30",
        description:
          "Museo dedicado a los kimonos teñidos con la técnica tsujigahana, en un hermoso edificio.",
      },
      {
        name: "Onsen (baños termales)",
        category: "Natural",
        price: 1000,
        timeNeeded: "1-2 horas",
        hours: "Varía según establecimiento",
        description: "Relajantes baños termales con vistas al Monte Fuji.",
      },
    ],
  },
  {
    id: 4,
    name: "Kioto",
    description:
      "Antigua capital imperial con más de 1,600 templos budistas y 400 santuarios sintoístas. Una ciudad que conserva la esencia tradicional japonesa.",
    image:
      "https://images.pexels.com/photos/30406585/pexels-photo-30406585/free-photo-of-historic-himeji-castle-in-kyoto-japan.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    days: 5,
    startDate: new Date(2025, 6, 10),
    endDate: new Date(2025, 6, 15),
    weather: "Cálido y húmedo, 24-34°C, alta probabilidad de lluvias",
    accommodation: {
      hostel: 3000,
      airbnb: 6500,
      hotel3: 11000,
      hotel4: 18000,
      hotel5: 30000,
    },
    festivals: ["Gion Matsuri - todo julio (principal 17-24 julio)"],
    attractions: [
      {
        name: "Fushimi Inari Taisha",
        category: "Cultural",
        price: 0,
        timeNeeded: "3 horas",
        hours: "24 horas",
        description:
          "Famoso por sus miles de puertas torii naranjas que forman un camino a través de la montaña.",
      },
      {
        name: "Pabellón Dorado (Kinkaku-ji)",
        category: "Cultural",
        price: 500,
        timeNeeded: "1 hora",
        hours: "9:00 - 17:00",
        description:
          "Templo zen cubierto con hojas de oro, rodeado de un hermoso jardín y estanque.",
      },
      {
        name: "Distrito de Gion",
        category: "Urbana",
        price: 0,
        timeNeeded: "2-3 horas",
        hours: "Mejor por la tarde-noche",
        description:
          "Famoso distrito de geishas con calles tradicionales y casas de té.",
      },
      {
        name: "Bosque de Bambú de Arashiyama",
        category: "Natural",
        price: 0,
        timeNeeded: "1-2 horas",
        hours: "24 horas",
        description: "Mágico sendero a través de un denso bosque de bambú.",
      },
      {
        name: "Castillo Nijo",
        category: "Cultural",
        price: 1000,
        timeNeeded: "2 horas",
        hours: "8:45 - 17:00",
        description:
          "Castillo con 'pisos de ruiseñor' que chirrían como sistema de seguridad.",
      },
      {
        name: "Mercado de Nishiki",
        category: "Urbana",
        price: 0,
        timeNeeded: "2 horas",
        hours: "9:00 - 18:00",
        description:
          "Callejón de 400m con más de 100 tiendas y puestos de comida.",
      },
      {
        name: "Jardín Zen de Ryoan-ji",
        category: "Cultural",
        price: 500,
        timeNeeded: "1 hora",
        hours: "8:00 - 17:00",
        description: "El jardín seco más famoso de Japón.",
      },
      {
        name: "Paseo del Filósofo",
        category: "Natural",
        price: 0,
        timeNeeded: "2 horas",
        hours: "24 horas",
        description:
          "Camino junto a un canal bordeado de cerezos (no floridos en julio).",
      },
      {
        name: "Parque de los Monos de Arashiyama",
        category: "Natural",
        price: 550,
        timeNeeded: "2 horas",
        hours: "9:00 - 16:30",
        description: "Santuario natural de macacos japoneses.",
      },
    ],
  },
  {
    id: 5,
    name: "Osaka",
    description:
      "Ciudad conocida por su deliciosa gastronomía, ambiente desenfadado y vida nocturna vibrante. Los locales son abiertos y directos.",
    image:
      "https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    days: 2,
    startDate: new Date(2025, 6, 15),
    endDate: new Date(2025, 6, 17),
    weather: "Cálido y húmedo, 25-33°C, posibilidad de lluvias fuertes",
    accommodation: {
      hostel: 2800,
      airbnb: 6000,
      hotel3: 10000,
      hotel4: 17000,
      hotel5: 28000,
    },
    festivals: [
      "Tenjin Matsuri - 24-25 de julio (uno de los festivales más grandes de Japón)",
    ],
    attractions: [
      {
        name: "Castillo de Osaka",
        category: "Cultural",
        price: 600,
        timeNeeded: "2-3 horas",
        hours: "9:00 - 17:00",
        description:
          "Impresionante castillo histórico rodeado de jardines y foso.",
      },
      {
        name: "Dotonbori",
        category: "Urbana",
        price: 0,
        timeNeeded: "3-4 horas",
        hours: "Mejor por la noche",
        description:
          "Zona comercial y de entretenimiento famosa por sus letreros de neón y comida callejera.",
      },
      {
        name: "Acuario Kaiyukan",
        category: "Urbana",
        price: 2400,
        timeNeeded: "2-3 horas",
        hours: "10:00 - 20:00",
        description:
          "Uno de los acuarios más grandes del mundo con especies del Pacífico.",
      },
      {
        name: "Universal Studios Japan",
        category: "Urbana",
        price: 8400,
        timeNeeded: "Todo el día",
        hours: "9:00 - 21:00",
        description:
          "Parque temático con atracciones basadas en películas populares y Super Nintendo World.",
      },
      {
        name: "Distrito Shinsaibashi",
        category: "Urbana",
        price: 0,
        timeNeeded: "2 horas",
        hours: "10:00 - 20:00",
        description: "Principal zona comercial de Osaka.",
      },
      {
        name: "Parque del Castillo",
        category: "Natural",
        price: 0,
        timeNeeded: "1 hora",
        hours: "24 horas",
        description:
          "Extenso parque que rodea el castillo, popular para picnics.",
      },
      {
        name: "Jardín Expo '70",
        category: "Natural",
        price: 250,
        timeNeeded: "2 horas",
        hours: "9:30 - 17:00",
        description:
          "Parque conmemorativo de la Expo de 1970 con la Torre del Sol.",
      },
    ],
  },
  {
    id: 6,
    name: "Kobe",
    description:
      "Ciudad portuaria conocida por su famosa carne de res Kobe, arquitectura internacional y hermosas vistas nocturnas desde el Monte Rokko.",
    image:
      "https://images.pexels.com/photos/460738/pexels-photo-460738.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    days: 1,
    startDate: new Date(2025, 6, 17),
    endDate: new Date(2025, 6, 18),
    weather: "Cálido y húmedo, 24-32°C, posibilidad de lluvias",
    accommodation: {
      hostel: 3000,
      airbnb: 6500,
      hotel3: 11000,
      hotel4: 18000,
      hotel5: 28000,
    },
    festivals: [],
    attractions: [
      {
        name: "Puerto de Kobe y Harborland",
        category: "Urbana",
        price: 0,
        timeNeeded: "2-3 horas",
        hours: "Tiendas 10:00 - 21:00",
        description:
          "Zona portuaria con centros comerciales, restaurantes y la icónica noria Kobe Port Tower.",
      },
      {
        name: "Barrio de Kitano",
        category: "Cultural",
        price: 500,
        timeNeeded: "2 horas",
        hours: "Casas históricas 9:00 - 18:00",
        description:
          "Área con mansiones históricas de estilo occidental (ijinkan) construidas por comerciantes extranjeros.",
      },
      {
        name: "Monte Rokko",
        category: "Natural",
        price: 1800,
        timeNeeded: "3-4 horas",
        hours: "Teleférico 10:00 - 17:00",
        description:
          "Montaña con miradores que ofrecen vistas panorámicas de la ciudad y la bahía, especialmente al atardecer.",
      },
      {
        name: "Sake Breweries (Nada Gogo)",
        category: "Cultural",
        price: 400,
        timeNeeded: "2 horas",
        hours: "10:00 - 16:00",
        description:
          "Distrito de destilerías de sake donde puedes aprender sobre el proceso de elaboración y degustar.",
      },
    ],
  },
  {
    id: 7,
    name: "Hiroshima",
    description:
      "Ciudad con un pasado conmovedor que se ha transformado en un símbolo de paz. Moderna, verde y acogedora.",
    image:
      "https://images.pexels.com/photos/31355867/pexels-photo-31355867/free-photo-of-majestic-red-torii-gate-at-miyajima-island.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    days: 2,
    startDate: new Date(2025, 6, 18),
    endDate: new Date(2025, 6, 20),
    weather: "Cálido y húmedo, 24-32°C, humedad alta",
    accommodation: {
      hostel: 2500,
      airbnb: 5500,
      hotel3: 9000,
      hotel4: 15000,
      hotel5: 25000,
    },
    festivals: [],
    attractions: [
      {
        name: "Parque Conmemorativo de la Paz",
        category: "Cultural",
        price: 0,
        timeNeeded: "2-3 horas",
        hours: "24 horas (museo 8:30 - 18:00)",
        description:
          "Sitio histórico dedicado a las víctimas de la bomba atómica con museo.",
      },
      {
        name: "Isla de Miyajima (Itsukushima)",
        category: "Natural",
        price: 300,
        timeNeeded: "Medio día o día completo",
        hours: "Ferry 6:25 - 22:15",
        description:
          "Isla sagrada con el famoso torii flotante y templo de Itsukushima.",
      },
      {
        name: "Museo Memorial de la Paz",
        category: "Cultural",
        price: 200,
        timeNeeded: "2 horas",
        hours: "8:30 - 18:00",
        description:
          "Conmovedor museo dedicado a las víctimas de la bomba atómica.",
      },
      {
        name: "Cúpula de la Bomba Atómica",
        category: "Cultural",
        price: 0,
        timeNeeded: "30 min",
        hours: "24 horas",
        description:
          "Edificio preservado como estaba tras la explosión, Patrimonio UNESCO.",
      },
      {
        name: "Castillo de Hiroshima",
        category: "Cultural",
        price: 370,
        timeNeeded: "1 hora",
        hours: "9:00 - 17:00",
        description: "Reconstrucción del castillo destruido en 1945.",
      },
      {
        name: "Santuario Itsukushima",
        category: "Cultural",
        price: 300,
        timeNeeded: "2 horas",
        hours: "6:30 - 18:00",
        description:
          "Famoso por su torii 'flotante' en el mar durante la marea alta.",
      },
      {
        name: "Monte Misen",
        category: "Natural",
        price: 1800,
        timeNeeded: "4 horas",
        hours: "9:00 - 17:00 (teleférico)",
        description: "Vistas panorámicas desde la montaña sagrada de la isla.",
      },
    ],
  },
  {
    id: 8,
    name: "Hakone",
    description:
      "Destino de aguas termales (onsen) cerca de Tokio, con vistas al Monte Fuji y naturaleza excepcional.",
    image:
      "https://images.pexels.com/photos/18882602/pexels-photo-18882602/free-photo-of-lake-and-fuji-mountain-behind.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    days: 2,
    startDate: new Date(2025, 6, 20),
    endDate: new Date(2025, 6, 22),
    weather: "Cálido, 22-28°C, más fresco que Tokio, posibilidad de niebla",
    accommodation: {
      hostel: 3500,
      airbnb: 8000,
      hotel3: 15000,
      hotel4: 25000,
      hotel5: 40000,
    },
    festivals: [],
    attractions: [
      {
        name: "Lago Ashi",
        category: "Natural",
        price: 1000,
        timeNeeded: "2-3 horas",
        hours: "Cruceros 9:00 - 17:00",
        description: "Lago volcánico con cruceros y vistas al Monte Fuji.",
      },
      {
        name: "Museo al Aire Libre de Hakone",
        category: "Cultural",
        price: 1600,
        timeNeeded: "3-4 horas",
        hours: "9:00 - 17:00",
        description:
          "Museo de arte contemporáneo en un parque natural con esculturas.",
      },
      {
        name: "Valle Owakudani",
        category: "Natural",
        price: 0,
        timeNeeded: "2 horas",
        hours: "9:00 - 17:00",
        description:
          "Valle volcánico activo con fuentes termales y los famosos huevos negros.",
      },
      {
        name: "Onsen (baños termales)",
        category: "Natural",
        price: 1000,
        timeNeeded: "2 horas",
        hours: "Varía según establecimiento",
        description: "Relajantes baños termales con vistas al Monte Fuji.",
      },
      {
        name: "Hakone Free Pass",
        category: "Transporte",
        price: 5000,
        timeNeeded: "2 días",
        hours: "24 horas",
        description:
          "Acceso a teleféricos, funiculares, barcos y autobuses de la zona.",
      },
    ],
  },
  {
    id: 9,
    name: "Nikko",
    description:
      "Ciudad santuario en las montañas con templos Patrimonio de la Humanidad y naturaleza imponente.",
    image:
      "https://www.exoticca.com/_next/image?url=https%3A%2F%2Fuploads.exoticca.com%2Fglobal%2Fdestination%2Fpoi%2Fnikko.png&w=3840&q=75",
    days: 2,
    startDate: new Date(2025, 6, 22),
    endDate: new Date(2025, 6, 24),
    weather: "Más fresco, 20-27°C, posibilidad de lluvia, humedad alta",
    accommodation: {
      hostel: 3000,
      airbnb: 6000,
      hotel3: 10000,
      hotel4: 18000,
      hotel5: 30000,
    },
    festivals: [],
    attractions: [
      {
        name: "Santuario Toshogu",
        category: "Cultural",
        price: 1300,
        timeNeeded: "2-3 horas",
        hours: "8:00 - 17:00",
        description:
          "Elaborado complejo de santuarios dedicado a Tokugawa Ieyasu.",
      },
      {
        name: "Cascadas de Kegon",
        category: "Natural",
        price: 550,
        timeNeeded: "1 hora",
        hours: "8:00 - 17:00",
        description: "Impresionante cascada de 97 metros con mirador.",
      },
      {
        name: "Lago Chuzenji",
        category: "Natural",
        price: 0,
        timeNeeded: "2-3 horas",
        hours: "24 horas",
        description:
          "Lago de montaña formado por una erupción volcánica del Monte Nantai.",
      },
      {
        name: "Puente Shinkyo",
        category: "Cultural",
        price: 300,
        timeNeeded: "30 min",
        hours: "8:00 - 17:00",
        description: "Puente sagrado rojo sobre el río Daiya.",
      },
    ],
  },
  {
    id: 10,
    name: "Narita",
    description:
      "Ciudad tradicional cerca del aeropuerto internacional con templos históricos, calles antiguas y deliciosos pescados de río.",
    image:
      "https://images.pexels.com/photos/27500519/pexels-photo-27500519/free-photo-of-templos-en-japon.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    days: 2,
    startDate: new Date(2025, 6, 24),
    endDate: new Date(2025, 6, 26),
    weather: "Cálido y húmedo, 24-30°C, posibilidad de lluvias",
    accommodation: {
      hostel: 2500,
      airbnb: 5000,
      hotel3: 8000,
      hotel4: 12000,
      hotel5: 20000,
    },
    festivals: [],
    attractions: [
      {
        name: "Templo Todai-ji",
        category: "Cultural",
        price: 600,
        timeNeeded: "2 horas",
        hours: "8:00 - 17:00",
        description: "Alberga el Gran Buda de bronce más grande del mundo.",
      },
      {
        name: "Kasuga Taisha",
        category: "Cultural",
        price: 500,
        timeNeeded: "1 hora",
        hours: "6:30 - 17:30",
        description:
          "Santuario famoso por sus miles de linternas de piedra y bronce.",
      },
      {
        name: "Parque de Nara",
        category: "Natural",
        price: 0,
        timeNeeded: "3 horas",
        hours: "24 horas",
        description:
          "Más de 1,200 ciervos sagrados en libertad que pueden ser alimentados.",
      },
    ],
  },
  {
    id: 11,
    name: "Tokio (regreso)",
    description:
      "Regreso a Tokio para últimas compras, experiencias pendientes y preparación para el viaje de vuelta.",
    image:
      "https://www.cloud-europamundo.com/img/carousel/hd/Tokio_20210324155519.jpg",
    days: 2,
    startDate: new Date(2025, 6, 26),
    endDate: new Date(2025, 6, 28),
    weather: "Cálido y húmedo, 25-32°C, posibilidad de lluvias",
    accommodation: {
      hostel: 3500,
      airbnb: 7000,
      hotel3: 12000,
      hotel4: 20000,
      hotel5: 35000,
    },
    festivals: [],
    attractions: [
      {
        name: "Odaiba",
        category: "Urbana",
        price: 0,
        timeNeeded: "Medio día",
        hours: "Centros comerciales 10:00 - 21:00",
        description:
          "Isla artificial con centros comerciales, entretenimiento y Estatua de la Libertad.",
      },
      {
        name: "Museo Ghibli",
        category: "Cultural",
        price: 1000,
        timeNeeded: "2-3 horas",
        hours: "10:00 - 18:00",
        description:
          "Museo dedicado a las películas del estudio de animación Studio Ghibli.",
      },
    ],
  },
];

// Opciones de transporte entre ciudades
const transportOptions = [
  {
    from: "Tokio",
    to: "Kamakura",
    options: [
      {
        type: "Tren JR",
        duration: "1h",
        price: 920,
        comfort: "Alto",
        frequency: "Cada 20 minutos",
      },
      {
        type: "Tren Enoshima-Kamakura Pass",
        duration: "1h 10m",
        price: 1520,
        comfort: "Alto",
        frequency: "Válido todo el día",
      },
    ],
  },
  {
    from: "Kamakura",
    to: "Kawaguchiko",
    options: [
      {
        type: "Tren + Bus",
        duration: "3h 30m",
        price: 3500,
        comfort: "Medio",
        frequency: "Varias opciones al día",
      },
    ],
  },
  {
    from: "Kawaguchiko",
    to: "Kioto",
    options: [
      {
        type: "Bus + Tren Bala",
        duration: "4h",
        price: 15000,
        comfort: "Alto",
        frequency: "Varias opciones diarias",
      },
    ],
  },
  {
    from: "Tokio",
    to: "Kioto",
    options: [
      {
        type: "Tren Bala (Shinkansen)",
        duration: "2h 15m",
        price: 13850,
        comfort: "Alto",
        frequency: "Cada 10-15 minutos",
      },
      {
        type: "Autobús nocturno",
        duration: "8h",
        price: 4500,
        comfort: "Medio",
        frequency: "Varios por noche",
      },
      {
        type: "Avión",
        duration: "1h 15m (más tiempo de aeropuerto)",
        price: 15000,
        comfort: "Alto",
        frequency: "Varios al día",
      },
    ],
  },
  {
    from: "Kioto",
    to: "Osaka",
    options: [
      {
        type: "Tren JR",
        duration: "30m",
        price: 570,
        comfort: "Alto",
        frequency: "Cada 15 minutos",
      },
      {
        type: "Metro",
        duration: "45m",
        price: 400,
        comfort: "Medio",
        frequency: "Cada 10 minutos",
      },
    ],
  },
  {
    from: "Osaka",
    to: "Kobe",
    options: [
      {
        type: "Tren JR",
        duration: "20m",
        price: 410,
        comfort: "Alto",
        frequency: "Cada 10 minutos",
      },
      {
        type: "Tren Hanshin",
        duration: "30m",
        price: 320,
        comfort: "Alto",
        frequency: "Cada 10 minutos",
      },
    ],
  },
  {
    from: "Kobe",
    to: "Hiroshima",
    options: [
      {
        type: "Tren Bala (Shinkansen)",
        duration: "1h 15m",
        price: 10270,
        comfort: "Alto",
        frequency: "Cada hora",
      },
    ],
  },
  {
    from: "Hiroshima",
    to: "Hakone",
    options: [
      {
        type: "Tren Bala + Tren Local",
        duration: "4h 30m",
        price: 16500,
        comfort: "Alto",
        frequency: "Varias opciones diarias",
      },
    ],
  },
  {
    from: "Hakone",
    to: "Nikko",
    options: [
      {
        type: "Tren + Tren",
        duration: "5h",
        price: 8000,
        comfort: "Medio",
        frequency: "Varias opciones diarias",
      },
    ],
  },
  {
    from: "Nikko",
    to: "Narita",
    options: [
      {
        type: "Tren + Tren",
        duration: "3h 30m",
        price: 6000,
        comfort: "Medio",
        frequency: "Varias opciones diarias",
      },
    ],
  },
  {
    from: "Narita",
    to: "Tokio",
    options: [
      {
        type: "Tren Skyliner",
        duration: "40m",
        price: 2570,
        comfort: "Alto",
        frequency: "Cada 20-40 minutos",
      },
      {
        type: "Tren Narita Express",
        duration: "1h",
        price: 3070,
        comfort: "Alto",
        frequency: "Cada 30-60 minutos",
      },
      {
        type: "Autobús",
        duration: "1h 30m",
        price: 1000,
        comfort: "Medio",
        frequency: "Cada 20 minutos",
      },
    ],
  },
];

// Datos para Japan Rail Pass
const jrPassOptions = [
  { type: "7 días", price: 33610 },
  { type: "14 días", price: 52960 },
  { type: "21 días", price: 66200 },
];

// Frases útiles en japonés
const usefulPhrases = [
  { phrase: "Hola", japanese: "Konnichiwa", pronunciation: "Kon-nee-chee-wah" },
  {
    phrase: "Gracias",
    japanese: "Arigatou gozaimasu",
    pronunciation: "Ah-ree-gah-toh go-zai-mass",
  },
  {
    phrase: "Por favor",
    japanese: "Onegaishimasu",
    pronunciation: "Oh-neh-gai-she-mass",
  },
  {
    phrase: "Disculpe",
    japanese: "Sumimasen",
    pronunciation: "Sue-me-mah-sen",
  },
  {
    phrase: "¿Dónde está...?",
    japanese: "...wa doko desu ka?",
    pronunciation: "...wah doh-koh dess-kah?",
  },
  {
    phrase: "¿Cuánto cuesta?",
    japanese: "Ikura desu ka?",
    pronunciation: "Ee-koo-rah dess-kah?",
  },
  {
    phrase: "No entiendo",
    japanese: "Wakarimasen",
    pronunciation: "Wah-kah-ree-mah-sen",
  },
  { phrase: "Estación de tren", japanese: "Eki", pronunciation: "Eh-kee" },
  { phrase: "Baño", japanese: "Toire", pronunciation: "Toi-reh" },
  { phrase: "Delicioso", japanese: "Oishii", pronunciation: "Oy-shee" },
];

// Consejos para viajar en grupo
const groupTravelTips = [
  "Compren una tarjeta IC (PASMO o Suica) para cada miembro del grupo para facilitar el uso del transporte público.",
  "Designen un punto de encuentro en caso de separarse en lugares concurridos.",
  "Consideren alquilar un pocket WiFi para compartir entre todos y mantenerse conectados.",
  "Reserven con anticipación hospedaje para 5 personas, especialmente en habitaciones tradicionales ryokan.",
  "En restaurantes populares, lleguen temprano o hagan reservaciones, ya que grupos grandes pueden tener dificultades.",
  "Utilicen la aplicación LINE que es muy popular en Japón para comunicarse entre ustedes.",
  "Para ahorrar, consideren alojamientos tipo apartamento donde pueden cocinar algunas comidas.",
  "Dividan responsabilidades: alguien a cargo de navegación, otro de traducciones, otro de presupuesto, etc.",
];

// Lista de verificación para preparativos
const travelChecklist = [
  {
    item: "Pasaporte con validez mínima de 6 meses",
    category: "Documentos",
    essential: true,
  },
  {
    item: "Visa (verificar requisitos según nacionalidad)",
    category: "Documentos",
    essential: true,
  },
  {
    item: "Reservas de vuelos impresas",
    category: "Documentos",
    essential: true,
  },
  {
    item: "Reservas de hoteles impresas",
    category: "Documentos",
    essential: true,
  },
  { item: "Seguro de viaje", category: "Documentos", essential: true },
  {
    item: "Japan Rail Pass (comprar antes de llegar a Japón)",
    category: "Transporte",
    essential: false,
  },
  {
    item: "Adaptador de enchufe (tipo A - dos clavijas planas)",
    category: "Electrónicos",
    essential: true,
  },
  {
    item: "Pocket WiFi o tarjeta SIM (reservar con anticipación)",
    category: "Electrónicos",
    essential: false,
  },
  { item: "Calzado cómodo para caminar", category: "Ropa", essential: true },
  { item: "Ropa ligera para verano", category: "Ropa", essential: true },
  { item: "Paraguas o impermeable ligero", category: "Ropa", essential: true },
  {
    item: "Toalla pequeña (los japoneses llevan una para secarse las manos)",
    category: "Varios",
    essential: false,
  },
  { item: "Medicamentos básicos", category: "Salud", essential: true },
  {
    item: "Tarjetas de crédito y algo de efectivo",
    category: "Financiero",
    essential: true,
  },
  {
    item: "Descarga de mapas offline",
    category: "Aplicaciones",
    essential: false,
  },
  {
    item: "Traductor japonés-español offline",
    category: "Aplicaciones",
    essential: false,
  },
];

// Componente personalizado de pestañas
const CustomTabs = ({ children, activeTab, setActiveTab }) => {
  const tabs = React.Children.toArray(children).filter(
    (child) => child.type === TabItem
  );
  const panels = React.Children.toArray(children).filter(
    (child) => child.type === TabPanel
  );

  return (
    <div className="custom-tabs">
      <div className="flex flex-wrap border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-2 md:px-4 py-2 text-sm md:text-base font-medium cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === index
                ? "border-red-600 text-red-600"
                : "border-transparent hover:text-red-600 hover:border-red-600 transition-colors duration-200"
            } mr-1 md:mr-2`}
            onClick={() => setActiveTab(index)}
          >
            {tab.props.children}
          </button>
        ))}
      </div>
      <div className="tab-content p-2 md:p-6">{panels[activeTab]}</div>
    </div>
  );
};

const TabItem = ({ children }) => {
  return <>{children}</>;
};

const TabPanel = ({ children }) => {
  return <div className="tab-panel">{children}</div>;
};

// Componente simplificado de calendario
const SimpleCalendar = ({ month = 6, year = 2025 }) => {
  // Crear un array de días del mes
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // Nombres de los días
  const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  // Crear calendario
  const calendar = [];
  let day = 1;

  // Generar semanas
  for (let i = 0; i < 6; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      if ((i === 0 && j < firstDay) || day > daysInMonth) {
        week.push(null);
      } else {
        // Buscar si este día tiene algún evento (ciudad o viaje)
        const currentDate = new Date(year, month, day);
        const cityEvent = cities.find(
          (city) => currentDate >= city.startDate && currentDate <= city.endDate
        );

        week.push({
          day,
          event: cityEvent ? cityEvent.name : null,
        });
        day++;
      }
    }
    calendar.push(week);
    if (day > daysInMonth) break;
  }

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="text-center mb-4 font-bold">Julio 2025</div>
      <div className="grid grid-cols-7 gap-1">
        {weekdays.map((day) => (
          <div key={day} className="text-center font-medium text-sm p-1">
            {day}
          </div>
        ))}

        {calendar.flatMap((week, i) =>
          week.map((day, j) => (
            <div
              key={`${i}-${j}`}
              className={`text-center p-1 text-sm min-h-8 ${
                day
                  ? day.event
                    ? "bg-red-100 rounded"
                    : "hover:bg-gray-100 rounded"
                  : ""
              }`}
            >
              {day && (
                <>
                  <div>{day.day}</div>
                  {day.event && (
                    <div className="text-xs text-red-700 truncate">
                      {day.event}
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Componente de conversor de moneda
const CurrencyConverter = () => {
  const [inputValue, setInputValue] = useState("");
  const [fromCurrency, setFromCurrency] = useState("JPY");
  const [convertedValues, setConvertedValues] = useState(null);

  // Función directa para manejar la conversión
  const handleClick = () => {
    // Validar entrada
    const amount = parseFloat(inputValue);
    if (isNaN(amount) || amount <= 0) {
      alert("Por favor ingresa una cantidad válida");
      return;
    }

    // Calcular conversiones
    let yenAmount, usdAmount, mxnAmount;

    if (fromCurrency === "JPY") {
      yenAmount = amount;
      usdAmount = amount * YEN_TO_USD;
      mxnAmount = usdAmount * USD_TO_MXN;
    } else if (fromCurrency === "USD") {
      usdAmount = amount;
      yenAmount = amount / YEN_TO_USD;
      mxnAmount = amount * USD_TO_MXN;
    } else {
      // MXN
      mxnAmount = amount;
      usdAmount = amount / USD_TO_MXN;
      yenAmount = usdAmount / YEN_TO_USD;
    }

    // Actualizar estado con los resultados
    setConvertedValues({
      JPY: yenAmount,
      USD: usdAmount,
      MXN: mxnAmount,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="bg-gray-100 p-3 rounded-t-lg">
        <h4 className="font-semibold">Convertidor de Moneda</h4>
      </div>
      <div className="p-4">
        {/* Formulario simplificado sin usar submit */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">
            Ingresa la cantidad a convertir:
          </label>

          <div className="flex flex-col md:flex-row items-stretch mb-4">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="p-2 border border-gray-300 rounded-t-md md:rounded-l-md md:rounded-t-none w-full md:w-auto"
            >
              <option value="JPY">Yenes (¥)</option>
              <option value="USD">Dólares ($)</option>
              <option value="MXN">Pesos (MXN)</option>
            </select>

            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Cantidad"
              className="flex-1 p-2 border-x border-y border-gray-300 w-full"
              min="0"
              step="any"
            />

            <button
              onClick={handleClick}
              className="bg-red-600 text-white p-2 rounded-b-md md:rounded-r-md md:rounded-b-none hover:bg-red-700 w-full md:w-auto"
              type="button"
            >
              Convertir
            </button>
          </div>
        </div>

        {/* Resultados */}
        {convertedValues && (
          <div className="mt-4">
            <h5 className="font-medium mb-2">Resultados:</h5>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <tbody>
                  <tr
                    className={`${
                      fromCurrency === "JPY" ? "bg-red-50" : "bg-gray-50"
                    } border-b`}
                  >
                    <th className="p-3 text-left">Yenes (JPY)</th>
                    <td className="p-3 text-right font-medium">
                      {formatYen(convertedValues.JPY)}
                    </td>
                  </tr>
                  <tr
                    className={`${
                      fromCurrency === "USD" ? "bg-red-50" : ""
                    } border-b`}
                  >
                    <th className="p-3 text-left">Dólares (USD)</th>
                    <td className="p-3 text-right font-medium">
                      {formatUSD(convertedValues.USD)}
                    </td>
                  </tr>
                  <tr
                    className={`${
                      fromCurrency === "MXN" ? "bg-red-50" : "bg-gray-50"
                    }`}
                  >
                    <th className="p-3 text-left">Pesos Mexicanos (MXN)</th>
                    <td className="p-3 text-right font-medium">
                      {formatMXN(convertedValues.MXN)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          <p>Tipo de cambio: 1 USD = ¥149.93 = $20.36 MXN</p>
          <p className="italic">
            Utiliza este convertidor para estimar gastos durante tu viaje.
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente principal de la aplicación
const JapanTripPlanner = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCity, setSelectedCity] = useState(null);
  const [attractionFilter, setAttractionFilter] = useState("Todas");
  const [accommodationType, setAccommodationType] = useState("hotel3");
  const [mealBudget, setMealBudget] = useState("moderado");
  const [selectedAttractions, setSelectedAttractions] = useState([]);
  const [jrPassType, setJrPassType] = useState("14 días");
  const [expandedCity, setExpandedCity] = useState(null);

  // Cálculos para presupuesto
  const calculateAccommodationCost = () => {
    return cities.reduce((total, city) => {
      return total + city.accommodation[accommodationType] * city.days * 5; // 5 personas
    }, 0);
  };

  const calculateMealCost = () => {
    const mealCosts = {
      economico: 1500, // Por persona por día
      moderado: 3000,
      lujoso: 6000,
    };

    const totalDays = cities.reduce((total, city) => total + city.days, 0);
    return mealCosts[mealBudget] * totalDays * 5; // 5 personas
  };

  const calculateTransportCost = () => {
    // Costo del JR Pass
    const jrPassCost =
      jrPassOptions.find((option) => option.type === jrPassType).price * 5; // 5 personas

    // Transporte local (estimado)
    const localTransportPerDay = 1000; // Por persona por día
    const totalDays = cities.reduce((total, city) => total + city.days, 0);
    const localTransportCost = localTransportPerDay * totalDays * 5; // 5 personas

    return jrPassCost + localTransportCost;
  };

  const calculateAttractionsCost = () => {
    return selectedAttractions.reduce((total, attraction) => {
      return total + attraction.price * 5; // 5 personas
    }, 0);
  };

  const calculateTotalCost = () => {
    return (
      calculateAccommodationCost() +
      calculateMealCost() +
      calculateTransportCost() +
      calculateAttractionsCost()
    );
  };

  // Datos para gráficos de presupuesto
  const budgetData = [
    { name: "Alojamiento", value: calculateAccommodationCost() },
    { name: "Comidas", value: calculateMealCost() },
    { name: "Transporte", value: calculateTransportCost() },
    { name: "Atracciones", value: calculateAttractionsCost() },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Verificar si el JR Pass es conveniente
  const calculateJRPassValue = () => {
    // Costo de todos los viajes elegibles para JR Pass
    let jrEligibleCost = 0;

    transportOptions.forEach((route) => {
      const shinkansenOption = route.options.find(
        (opt) =>
          opt.type.includes("Shinkansen") ||
          opt.type.includes("Tren JR") ||
          opt.type.includes("Tren expreso")
      );
      if (shinkansenOption) {
        jrEligibleCost += shinkansenOption.price * 5; // 5 personas
      }
    });

    // Comparar con costo del JR Pass
    const jrPass7Cost = jrPassOptions[0].price * 5;
    const jrPass14Cost = jrPassOptions[1].price * 5;
    const jrPass21Cost = jrPassOptions[2].price * 5;

    return {
      eligibleCost: jrEligibleCost,
      pass7: { cost: jrPass7Cost, savings: jrEligibleCost - jrPass7Cost },
      pass14: { cost: jrPass14Cost, savings: jrEligibleCost - jrPass14Cost },
      pass21: { cost: jrPass21Cost, savings: jrEligibleCost - jrPass21Cost },
    };
  };

  const jrPassValue = calculateJRPassValue();
  const recommendedPass =
    jrPassValue.pass21.savings > 0
      ? "21 días"
      : jrPassValue.pass14.savings > 0
      ? "14 días"
      : jrPassValue.pass7.savings > 0
      ? "7 días"
      : "Ninguno";

  const generatePDF = () => {
    try {
      const totalCost = calculateTotalCost();
      const costPerPerson = totalCost / 5;
      const costPerDay = totalCost / 26;

      // Crear contenido del PDF como texto plano
      const content = `
PRESUPUESTO DE VIAJE A JAPÓN
3 de julio - 28 de julio, 2025 | Grupo de 5 personas

RESUMEN DE GASTOS
===============================
Hospedaje:    ${formatYen(calculateAccommodationCost())}
Comidas:      ${formatYen(calculateMealCost())}
Transporte:   ${formatYen(calculateTransportCost())}
Atracciones:  ${formatYen(calculateAttractionsCost())}
-------------------------------
TOTAL:        ${formatYen(totalCost)}

DETALLES
===============================
Costo por persona: ${formatYen(costPerPerson)}
Costo por día:     ${formatYen(costPerDay)}

CONFIGURACIÓN
===============================
Tipo de hospedaje: ${accommodationType.replace("hotel", "Hotel ")}
Presupuesto comidas: ${mealBudget}
Japan Rail Pass: ${jrPassType}
      `;

      // Crear el PDF
      const doc = new jsPDF();

      // Configurar fuente
      doc.setFont("helvetica");
      doc.setFontSize(10);

      // Agregar el contenido
      const lines = content.split("\n");
      let y = 20;
      lines.forEach((line) => {
        if (line.trim()) {
          doc.text(line.trim(), 20, y);
          y += 6;
        } else {
          y += 3;
        }
      });

      // Guardar el PDF
      doc.save("presupuesto-japon-2025.pdf");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Hubo un error al generar el PDF. Por favor, intenta de nuevo.");
    }
  };

  const generateShareableLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}?plan=japan2025`;
  };

  const shareViaWhatsApp = () => {
    const text = `¡Mira nuestro plan de viaje a Japón 2025! 🗾\n\nFechas: 3 de julio - 28 de julio\nPresupuesto total: ¥${calculateTotalCost().toLocaleString()}\n\nVer detalles: ${generateShareableLink()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  const shareViaEmail = () => {
    const subject = "Plan de Viaje a Japón 2025";
    const body = `¡Hola!\n\nComparto contigo nuestro plan de viaje a Japón:\n\nFechas: 3 de julio - 28 de julio, 2025\nPresupuesto total: ¥${calculateTotalCost().toLocaleString()}\n\nPuedes ver todos los detalles aquí: ${generateShareableLink()}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const generateCompletePDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    // Título y fechas
    doc.setFontSize(20);
    doc.setTextColor(220, 38, 38); // Color rojo
    doc.text("Viaje a Japón 2025", 105, yPos, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(0);
    yPos += 10;
    doc.text("3 de julio - 28 de julio, 2025", 105, yPos, { align: "center" });

    // Resumen del presupuesto
    yPos += 20;
    doc.setFontSize(16);
    doc.text("Resumen del Presupuesto", 20, yPos);

    yPos += 10;
    doc.setFontSize(12);
    const totalCost = calculateTotalCost();
    doc.text(
      `Presupuesto Total: ¥${totalCost.toLocaleString()} (≈ $${(
        totalCost * YEN_TO_USD
      ).toFixed(2)} USD)`,
      20,
      yPos
    );

    // Desglose por categoría
    yPos += 15;
    const categories = [
      ["Alojamiento", calculateAccommodationCost()],
      ["Comidas", calculateMealCost()],
      ["Transporte", calculateTransportCost()],
      ["Atracciones", calculateAttractionsCost()],
    ];

    categories.forEach(([category, cost]) => {
      doc.text(`${category}: ¥${cost.toLocaleString()}`, 30, yPos);
      yPos += 8;
    });

    // Itinerario por ciudad
    yPos += 15;
    doc.setFontSize(16);
    doc.text("Itinerario por Ciudad", 20, yPos);

    cities.forEach((city) => {
      yPos += 15;
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.text(city.name, 20, yPos);

      yPos += 8;
      doc.setFontSize(12);
      doc.text(
        `Fechas: ${city.startDate.toLocaleDateString()} - ${city.endDate.toLocaleDateString()}`,
        30,
        yPos
      );

      yPos += 8;
      doc.text(`Clima: ${city.weather}`, 30, yPos);

      // Atracciones seleccionadas
      const cityAttractions = selectedAttractions.filter((attr) =>
        city.attractions.some((cityAttr) => cityAttr.name === attr.name)
      );

      if (cityAttractions.length > 0) {
        yPos += 10;
        doc.text("Atracciones seleccionadas:", 30, yPos);
        cityAttractions.forEach((attr) => {
          yPos += 8;
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(
            `• ${attr.name} - ¥${attr.price} - ${attr.timeNeeded}`,
            40,
            yPos
          );
        });
      }
    });

    // Información práctica
    doc.addPage();
    yPos = 20;
    doc.setFontSize(16);
    doc.text("Información Práctica", 20, yPos);

    // Frases útiles
    yPos += 15;
    doc.setFontSize(14);
    doc.text("Frases Útiles en Japonés", 20, yPos);

    usefulPhrases.forEach((phrase) => {
      yPos += 10;
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(12);
      doc.text(
        `${phrase.phrase}: ${phrase.japanese} (${phrase.pronunciation})`,
        30,
        yPos
      );
    });

    // Guardar el PDF
    doc.save("plan-completo-japon-2025.pdf");
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-red-600 text-white p-4 md:p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Bandera de Japón - Ocupa 2 columnas en desktop, full width en mobile */}
            <div className="col-span-1 md:col-span-2 flex justify-center md:justify-start">
              <div className="w-16 h-10 md:w-24 md:h-16 bg-white rounded-sm relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-red-600 rounded-full"></div>
              </div>
            </div>

            {/* Título y subtítulo - Ocupa 7 columnas en desktop, full width en mobile */}
            <div className="col-span-1 md:col-span-7 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">
                Planificador de Viaje a Japón
              </h1>
              <p className="mt-1 md:mt-2 text-sm md:text-base">
                3 de julio - 28 de julio, 2025 | Grupo de 5 personas
              </p>
            </div>

            {/* Información de cambio - Ocupa 3 columnas en desktop, full width en mobile */}
            <div className="col-span-1 md:col-span-3 flex justify-center md:justify-end">
              <div className="bg-white text-red-600 rounded-full px-3 py-1 md:px-4 md:py-2 text-sm md:text-base font-semibold">
                ¥1 = ${YEN_TO_USD.toFixed(6)} USD = $
                {(YEN_TO_USD * USD_TO_MXN).toFixed(2)} MXN
              </div>
            </div>

            {/* Botones de compartir - Nueva sección */}
            <div className="col-span-1 md:col-span-12 flex flex-wrap justify-center gap-2 mt-2 md:mt-4">
              <button
                onClick={shareViaWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm flex items-center"
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm.143 18.536c-1.475 0-2.916-.387-4.186-1.117l-2.957.775.79-2.886c-.818-1.318-1.254-2.845-1.254-4.445 0-4.683 3.813-8.496 8.496-8.496 4.683 0 8.496 3.813 8.496 8.496 0 4.683-3.813 8.496-8.496 8.496zm4.882-6.357c-.255-.127-1.509-.745-1.743-.829-.234-.084-.404-.127-.574.127-.17.254-.66.829-.809.998-.149.17-.298.19-.553.064-.255-.127-1.077-.397-2.051-1.266-.758-.675-1.27-1.508-1.419-1.762-.149-.255-.016-.393.112-.52.114-.114.255-.297.382-.446.127-.149.17-.255.255-.425.085-.17.043-.318-.021-.446-.064-.127-.574-1.383-.786-1.895-.209-.495-.42-.427-.574-.435-.149-.008-.319-.01-.489-.01-.17 0-.446.064-.68.318-.234.255-.893.873-.893 2.128 0 1.256.914 2.472 1.041 2.642.127.17 1.788 2.728 4.33 3.825.604.261 1.075.417 1.442.534.605.192 1.156.165 1.59.1.486-.073 1.509-.617 1.722-1.213.213-.596.213-1.107.149-1.213-.064-.106-.234-.17-.489-.297z" />
                </svg>
                WhatsApp
              </button>
              <button
                onClick={shareViaEmail}
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm flex items-center"
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Email
              </button>
              <button
                onClick={generateCompletePDF}
                className="bg-red-500 hover:bg-red-600 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm flex items-center"
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navegación */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto overflow-x-auto">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab(0)}
              className={`px-4 py-2 text-sm md:text-base font-medium whitespace-nowrap ${
                activeTab === 0
                  ? "border-b-2 border-red-600 text-red-600"
                  : "text-gray-500 hover:text-red-600 hover:border-red-600"
              }`}
            >
              Itinerario
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`px-4 py-2 text-sm md:text-base font-medium whitespace-nowrap ${
                activeTab === 1
                  ? "border-b-2 border-red-600 text-red-600"
                  : "text-gray-500 hover:text-red-600 hover:border-red-600"
              }`}
            >
              Atracciones
            </button>
            <button
              onClick={() => setActiveTab(2)}
              className={`px-4 py-2 text-sm md:text-base font-medium whitespace-nowrap ${
                activeTab === 2
                  ? "border-b-2 border-red-600 text-red-600"
                  : "text-gray-500 hover:text-red-600 hover:border-red-600"
              }`}
            >
              Presupuesto
            </button>
            <button
              onClick={() => setActiveTab(3)}
              className={`px-4 py-2 text-sm md:text-base font-medium whitespace-nowrap ${
                activeTab === 3
                  ? "border-b-2 border-red-600 text-red-600"
                  : "text-gray-500 hover:text-red-600 hover:border-red-600"
              }`}
            >
              Transporte
            </button>
            <button
              onClick={() => setActiveTab(4)}
              className={`px-4 py-2 text-sm md:text-base font-medium whitespace-nowrap ${
                activeTab === 4
                  ? "border-b-2 border-red-600 text-red-600"
                  : "text-gray-500 hover:text-red-600 hover:border-red-600"
              }`}
            >
              Info Práctica
            </button>
            <button
              onClick={() => setActiveTab(5)}
              className={`px-4 py-2 text-sm md:text-base font-medium whitespace-nowrap ${
                activeTab === 5
                  ? "border-b-2 border-red-600 text-red-600"
                  : "text-gray-500 hover:text-red-600 hover:border-red-600"
              }`}
            >
              Metro de Tokio
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <div className="max-w-6xl mx-auto p-4">
        {activeTab === 0 && (
          // Contenido de Itinerario
          <div className="grid grid-cols-1 gap-4 md:gap-8">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-red-700">
                Itinerario de Ciudades
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {/* Conversor de Moneda */}
                <CurrencyConverter />

                {/* Calendario de itinerario */}
                <div className="bg-gray-100 rounded-lg p-4">
                  <SimpleCalendar />
                </div>
              </div>

              {/* Lista de ciudades */}
              <div className="mt-6 md:mt-8">
                <h3 className="text-lg md:text-xl font-semibold mb-4">
                  Ciudades Recomendadas
                </h3>
                <div className="space-y-4 md:space-y-6">
                  {cities.map((city) => (
                    <div
                      key={city.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="bg-white p-4">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <h4 className="text-base md:text-lg font-semibold">
                            {city.name}
                          </h4>
                          <div className="text-xs md:text-sm text-gray-600 mt-1 md:mt-0">
                            {city.startDate.toLocaleDateString("es-ES")} -{" "}
                            {city.endDate.toLocaleDateString("es-ES")} (
                            {city.days} días)
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="col-span-1">
                            <img
                              src={city.image}
                              alt={city.name}
                              className="w-full h-32 md:h-40 object-cover rounded"
                            />
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <p className="text-sm md:text-base text-gray-700">
                              {city.description}
                            </p>
                            <button
                              className="mt-4 px-3 py-1 md:px-4 md:py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm md:text-base"
                              onClick={() =>
                                setExpandedCity(
                                  expandedCity === city.id ? null : city.id
                                )
                              }
                            >
                              {expandedCity === city.id
                                ? "Ocultar detalles"
                                : "Ver detalles"}
                            </button>
                          </div>
                        </div>

                        {expandedCity === city.id && (
                          <div className="mt-4 border-t pt-4">
                            <h5 className="font-medium mb-2">
                              Clima en julio:
                            </h5>
                            <p className="text-gray-600 mb-4">{city.weather}</p>

                            {city.festivals && city.festivals.length > 0 && (
                              <>
                                <h5 className="font-medium mb-2">
                                  Festivales y eventos:
                                </h5>
                                <ul className="list-disc pl-5 mb-4">
                                  {city.festivals.map((festival, idx) => (
                                    <li key={idx} className="text-gray-600">
                                      {festival}
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}

                            <h5 className="font-medium mb-2">
                              Atracciones destacadas:
                            </h5>
                            <ul className="list-disc pl-5">
                              {city.attractions
                                .slice(0, 3)
                                .map((attraction, idx) => (
                                  <li key={idx} className="text-gray-600">
                                    {attraction.name}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          // Contenido de Atracciones
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-red-700">
                Atracciones por Ciudad
              </h2>

              {/* Selección de ciudad */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">
                  Selecciona una ciudad:
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedCity || ""}
                  onChange={(e) =>
                    setSelectedCity(
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                >
                  <option value="">-- Seleccionar ciudad --</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtros de categoría */}
              {selectedCity && (
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Filtrar por categoría:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`px-4 py-2 rounded-full ${
                        attractionFilter === "Todas"
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => setAttractionFilter("Todas")}
                    >
                      Todas
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full ${
                        attractionFilter === "Urbana"
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => setAttractionFilter("Urbana")}
                    >
                      Urbanas
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full ${
                        attractionFilter === "Cultural"
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => setAttractionFilter("Cultural")}
                    >
                      Culturales
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full ${
                        attractionFilter === "Natural"
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => setAttractionFilter("Natural")}
                    >
                      Naturales
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de atracciones */}
              {selectedCity ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cities
                    .find((c) => c.id === selectedCity)
                    .attractions.filter(
                      (attr) =>
                        attractionFilter === "Todas" ||
                        attr.category === attractionFilter
                    )
                    .map((attraction, idx) => {
                      const isSelected = selectedAttractions.some(
                        (a) =>
                          a.name === attraction.name &&
                          a.cityId === selectedCity
                      );

                      return (
                        <div
                          key={idx}
                          className={`border rounded-lg overflow-hidden transition-all ${
                            isSelected
                              ? "border-red-500 shadow-md"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <h4 className="text-lg font-semibold mb-2">
                                {attraction.name}
                              </h4>
                              <span
                                className={`px-2 py-1 text-xs rounded ${
                                  attraction.category === "Urbana"
                                    ? "bg-blue-100 text-blue-800"
                                    : attraction.category === "Cultural"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {attraction.category}
                              </span>
                            </div>

                            <p className="text-gray-600 text-sm mb-4">
                              {attraction.description}
                            </p>

                            <div className="text-sm text-gray-700 space-y-1">
                              <div className="flex justify-between">
                                <span>Precio:</span>
                                <span className="font-medium">
                                  {attraction.price > 0 ? (
                                    <>{formatYen(attraction.price)}</>
                                  ) : (
                                    "Gratis"
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Tiempo:</span>
                                <span>{attraction.timeNeeded}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Horario:</span>
                                <span>{attraction.hours}</span>
                              </div>
                            </div>

                            <div className="mt-4">
                              <button
                                className={`w-full py-2 rounded-md ${
                                  isSelected
                                    ? "bg-red-100 text-red-700 border border-red-300"
                                    : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                                }`}
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedAttractions(
                                      selectedAttractions.filter(
                                        (a) =>
                                          !(
                                            a.name === attraction.name &&
                                            a.cityId === selectedCity
                                          )
                                      )
                                    );
                                  } else {
                                    setSelectedAttractions([
                                      ...selectedAttractions,
                                      {
                                        ...attraction,
                                        cityId: selectedCity,
                                        cityName: cities.find(
                                          (c) => c.id === selectedCity
                                        ).name,
                                      },
                                    ]);
                                  }
                                }}
                              >
                                {isSelected
                                  ? "Quitar de favoritos"
                                  : "Añadir a favoritos"}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Por favor, selecciona una ciudad para ver sus atracciones
                </div>
              )}

              {/* Atracciones seleccionadas */}
              {selectedAttractions.length > 0 && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Tus Atracciones Favoritas
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700">
                          <th className="py-2 px-4 text-left">Atracción</th>
                          <th className="py-2 px-4 text-left">Ciudad</th>
                          <th className="py-2 px-4 text-left">Categoría</th>
                          <th className="py-2 px-4 text-right">Precio (¥)</th>
                          <th className="py-2 px-4 text-right">Precio (MXN)</th>
                          <th className="py-2 px-4 text-right">Precio (USD)</th>
                          <th className="py-2 px-4 text-center">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAttractions.map((attraction, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="py-2 px-4">{attraction.name}</td>
                            <td className="py-2 px-4">{attraction.cityName}</td>
                            <td className="py-2 px-4">{attraction.category}</td>
                            <td className="py-2 px-4 text-right">
                              {attraction.price > 0
                                ? formatYen(attraction.price)
                                : "Gratis"}
                            </td>
                            <td className="py-2 px-4 text-right">
                              {attraction.price > 0
                                ? formatMXN(
                                    convertCurrency(
                                      attraction.price,
                                      "JPY",
                                      "MXN"
                                    )
                                  )
                                : "Gratis"}
                            </td>
                            <td className="py-2 px-4 text-right">
                              {attraction.price > 0
                                ? formatUSD(
                                    convertCurrency(
                                      attraction.price,
                                      "JPY",
                                      "USD"
                                    )
                                  )
                                : "Gratis"}
                            </td>
                            <td className="py-2 px-4 text-center">
                              <button
                                className="text-red-600 hover:text-red-800"
                                onClick={() => {
                                  setSelectedAttractions(
                                    selectedAttractions.filter(
                                      (_, i) => i !== idx
                                    )
                                  );
                                }}
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 font-semibold">
                          <td colSpan="3" className="py-2 px-4 text-right">
                            Total (5 personas):
                          </td>
                          <td className="py-2 px-4 text-right">
                            {formatYen(calculateAttractionsCost())}
                          </td>
                          <td className="py-2 px-4 text-right">
                            {formatMXN(
                              convertCurrency(
                                calculateAttractionsCost(),
                                "JPY",
                                "MXN"
                              )
                            )}
                          </td>
                          <td className="py-2 px-4 text-right">
                            {formatUSD(
                              convertCurrency(
                                calculateAttractionsCost(),
                                "JPY",
                                "USD"
                              )
                            )}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 2 && (
          // Contenido de Presupuesto
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-red-700">
                Presupuesto Interactivo
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Opciones de presupuesto */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Ajusta tu Presupuesto
                  </h3>

                  {/* Hospedaje */}
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-medium">
                      Tipo de hospedaje:
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={accommodationType}
                      onChange={(e) => setAccommodationType(e.target.value)}
                    >
                      <option value="hostel">Hostel (económico)</option>
                      <option value="airbnb">
                        Airbnb (económico/moderado)
                      </option>
                      <option value="hotel3">
                        Hotel 3 estrellas (moderado)
                      </option>
                      <option value="hotel4">
                        Hotel 4 estrellas (confort)
                      </option>
                      <option value="hotel5">Hotel 5 estrellas (lujo)</option>
                    </select>
                  </div>

                  {/* Comidas */}
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-medium">
                      Presupuesto para comidas:
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={mealBudget}
                      onChange={(e) => setMealBudget(e.target.value)}
                    >
                      <option value="economico">Económico (¥1,500/día)</option>
                      <option value="moderado">Moderado (¥3,000/día)</option>
                      <option value="lujoso">Lujoso (¥6,000/día)</option>
                    </select>
                  </div>

                  {/* Japan Rail Pass */}
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-medium">
                      Japan Rail Pass:
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={jrPassType}
                      onChange={(e) => setJrPassType(e.target.value)}
                    >
                      <option value="7 días">7 días (¥33,610/persona)</option>
                      <option value="14 días">14 días (¥52,960/persona)</option>
                      <option value="21 días">21 días (¥66,200/persona)</option>
                    </select>
                    <p className="mt-2 text-sm text-gray-600">
                      JR Pass recomendado:{" "}
                      <span className="font-semibold">{recommendedPass}</span>
                    </p>
                  </div>

                  {/* Resumen total */}
                  <div className="bg-gray-50 p-4 rounded-lg mt-8">
                    <h4 className="font-semibold text-lg mb-4">
                      Resumen de Presupuesto (5 personas)
                    </h4>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Hospedaje:</span>
                        <span className="font-medium">
                          {formatYen(calculateAccommodationCost())}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Comidas:</span>
                        <span className="font-medium">
                          {formatYen(calculateMealCost())}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transporte:</span>
                        <span className="font-medium">
                          {formatYen(calculateTransportCost())}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Atracciones:</span>
                        <span className="font-medium">
                          {formatYen(calculateAttractionsCost())}
                        </span>
                      </div>
                    </div>

                    <div className="border-t mt-4 pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>TOTAL:</span>
                        <span>{formatYen(calculateTotalCost())}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span></span>
                        <span>
                          {formatUSD(
                            convertCurrency(calculateTotalCost(), "JPY", "USD")
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span></span>
                        <span>
                          {formatMXN(
                            convertCurrency(calculateTotalCost(), "JPY", "MXN")
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                      <p>
                        Costo por persona: {formatYen(calculateTotalCost() / 5)}
                      </p>
                      <p>
                        Costo por día: {formatYen(calculateTotalCost() / 26)}
                      </p>
                    </div>

                    <button
                      onClick={generatePDF}
                      className="mt-4 w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Generar PDF del Presupuesto
                    </button>
                  </div>
                </div>

                {/* Gráficos de presupuesto */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Distribución del Presupuesto
                  </h3>

                  <div className="bg-white p-4 rounded-lg border mb-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={budgetData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {budgetData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatYen(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold mb-4">Costo por Ciudad</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={cities.map((city) => ({
                          name: city.name,
                          costo:
                            city.days *
                            (city.accommodation[accommodationType] * 5 +
                              (mealBudget === "economico"
                                ? 1500
                                : mealBudget === "moderado"
                                ? 3000
                                : 6000) *
                                5),
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `¥${value / 1000}k`} />
                        <Tooltip formatter={(value) => formatYen(value)} />
                        <Bar
                          dataKey="costo"
                          fill="#FF4B4B"
                          name="Costo estimado"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 3 && (
          // Contenido de Transporte
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-red-700">
                Transporte en Japón
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Japan Rail Pass */}
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-semibold mb-4">
                    Calculadora de Japan Rail Pass
                  </h3>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-4">
                      ¿Vale la pena comprar JR Pass?
                    </h4>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Costo de viajes elegibles para JR Pass:</span>
                        <span className="font-medium">
                          {formatYen(jrPassValue.eligibleCost)}
                        </span>
                      </div>

                      <div className="border-t pt-3">
                        <div className="mb-2">
                          <span className="font-medium">JR Pass de 7 días</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Costo:</span>
                          <span>{formatYen(jrPassValue.pass7.cost)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Ahorro:</span>
                          <span
                            className={
                              jrPassValue.pass7.savings > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {jrPassValue.pass7.savings > 0
                              ? `${formatYen(
                                  jrPassValue.pass7.savings
                                )} (${Math.round(
                                  (jrPassValue.pass7.savings /
                                    jrPassValue.pass7.cost) *
                                    100
                                )}%)`
                              : "No rentable"}
                          </span>
                        </div>
                      </div>

                      <div className="border-t pt-3">
                        <div className="mb-2">
                          <span className="font-medium">
                            JR Pass de 14 días
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Costo:</span>
                          <span>{formatYen(jrPassValue.pass14.cost)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Ahorro:</span>
                          <span
                            className={
                              jrPassValue.pass14.savings > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {jrPassValue.pass14.savings > 0
                              ? `${formatYen(
                                  jrPassValue.pass14.savings
                                )} (${Math.round(
                                  (jrPassValue.pass14.savings /
                                    jrPassValue.pass14.cost) *
                                    100
                                )}%)`
                              : "No rentable"}
                          </span>
                        </div>
                      </div>

                      <div className="border-t pt-3">
                        <div className="mb-2">
                          <span className="font-medium">
                            JR Pass de 21 días
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Costo:</span>
                          <span>{formatYen(jrPassValue.pass21.cost)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Ahorro:</span>
                          <span
                            className={
                              jrPassValue.pass21.savings > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {jrPassValue.pass21.savings > 0
                              ? `${formatYen(
                                  jrPassValue.pass21.savings
                                )} (${Math.round(
                                  (jrPassValue.pass21.savings /
                                    jrPassValue.pass21.cost) *
                                    100
                                )}%)`
                              : "No rentable"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-3 bg-blue-50 text-blue-800 rounded-lg">
                      <p className="font-medium">Recomendación:</p>
                      <p className="mt-1">
                        {recommendedPass === "Ninguno"
                          ? "Basado en tu itinerario, no es rentable comprar un JR Pass. Es mejor comprar billetes individuales."
                          : `Te recomendamos comprar el JR Pass de ${recommendedPass} para maximizar el ahorro en tu itinerario.`}
                      </p>
                      <p className="mt-2 text-sm">
                        <strong>Importante:</strong> El JR Pass debe comprarse
                        antes de llegar a Japón.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Opciones de transporte */}
                <div className="lg:col-span-3">
                  <h3 className="text-xl font-semibold mb-4">
                    Opciones de Transporte entre Ciudades
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700">
                          <th className="py-2 px-4 text-left border-b">Ruta</th>
                          <th className="py-2 px-4 text-left border-b">Tipo</th>
                          <th className="py-2 px-4 text-left border-b">
                            Duración
                          </th>
                          <th className="py-2 px-4 text-right border-b">
                            Precio (¥)
                          </th>
                          <th className="py-2 px-4 text-center border-b">
                            Confort
                          </th>
                          <th className="py-2 px-4 text-left border-b">
                            Frecuencia
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transportOptions.map((route, idx) =>
                          route.options.map((option, optIdx) => (
                            <tr
                              key={`${idx}-${optIdx}`}
                              className="border-b hover:bg-gray-50"
                            >
                              {optIdx === 0 && (
                                <td
                                  className="py-2 px-4 border-r"
                                  rowSpan={route.options.length}
                                >
                                  {route.from} → {route.to}
                                </td>
                              )}
                              <td className="py-2 px-4">{option.type}</td>
                              <td className="py-2 px-4">{option.duration}</td>
                              <td className="py-2 px-4 text-right">
                                {formatYen(option.price)}
                              </td>
                              <td className="py-2 px-4 text-center">
                                <span
                                  className={`px-2 py-1 text-xs rounded ${
                                    option.comfort === "Alto"
                                      ? "bg-green-100 text-green-800"
                                      : option.comfort === "Medio"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {option.comfort}
                                </span>
                              </td>
                              <td className="py-2 px-4">{option.frequency}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 space-y-4">
                    <h4 className="font-semibold">Consejos de Transporte:</h4>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">
                        Tarjetas IC (PASMO/Suica)
                      </h5>
                      <p className="text-sm text-gray-700">
                        Recomendamos que cada miembro del grupo compre una
                        tarjeta IC (PASMO o Suica) para facilitar el uso del
                        transporte público dentro de las ciudades. Cuesta ¥2,000
                        (con ¥1,500 de saldo y ¥500 de depósito reembolsable).
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">
                        Activación del JR Pass
                      </h5>
                      <p className="text-sm text-gray-700">
                        Si compras el JR Pass, recomendamos activarlo el día que
                        viajes de Tokio a Kioto (10 de julio) para maximizar su
                        uso en los días de viajes largos.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">
                        Transporte desde/hacia aeropuerto
                      </h5>
                      <p className="text-sm text-gray-700">
                        Desde el Aeropuerto de Narita a Tokio:
                      </p>
                      <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
                        <li>
                          Narita Express (N'EX): ¥3,070 por persona, 60 minutos
                          hasta la estación de Tokio
                        </li>
                        <li>
                          Skyliner: ¥2,570 por persona, 40 minutos hasta la
                          estación de Ueno
                        </li>
                        <li>
                          Airport Limousine Bus: ¥3,100 por persona, 75-120
                          minutos según el destino
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 4 && (
          // Contenido de Info Práctica
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-red-700">
                Información Práctica
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Clima */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Clima en Julio</h3>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-4">
                      Julio es temporada de lluvias (tsuyu) y principios de
                      verano en Japón. El clima es generalmente cálido y húmedo.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">
                          Tokio y alrededores
                        </h4>
                        <ul className="list-disc pl-5 text-sm text-gray-700">
                          <li>Temperatura: 25-32°C</li>
                          <li>Humedad: Alta (60-80%)</li>
                          <li>Precipitación: Frecuente, lluvias repentinas</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">
                          Kioto/Osaka (Kansai)
                        </h4>
                        <ul className="list-disc pl-5 text-sm text-gray-700">
                          <li>Temperatura: 24-34°C</li>
                          <li>Humedad: Muy alta (70-90%)</li>
                          <li>Precipitación: Alta, posibles lluvias fuertes</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Recomendaciones</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-700">
                          <li>Lleva ropa ligera y transpirable</li>
                          <li>Paraguas plegable o impermeable ligero</li>
                          <li>Protector solar y gorra</li>
                          <li>
                            Toalla pequeña (tenugui) para secarse el sudor
                          </li>
                          <li>
                            Aplicación de clima para estar al tanto de lluvias
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Eventos culturales */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Eventos Culturales y Festivales
                  </h3>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">
                        Tanabata (Festival de las Estrellas)
                      </h4>
                      <p className="text-sm text-gray-700">
                        7 de julio en todo Japón. Celebración donde la gente
                        escribe deseos en tiras de papel y las cuelga en árboles
                        de bambú.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Gion Matsuri (Kioto)</h4>
                      <p className="text-sm text-gray-700">
                        Todo el mes de julio, con desfiles principales el 17 y
                        24. Uno de los festivales más famosos de Japón, con
                        carrozas enormes y eventos durante todo el mes.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">
                        Mitama Matsuri (Tokio)
                      </h4>
                      <p className="text-sm text-gray-700">
                        13-16 de julio en el Santuario Yasukuni. Festival con
                        30,000 linternas iluminando el camino y puestos de
                        comida.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">
                        Tenjin Matsuri (Osaka)
                      </h4>
                      <p className="text-sm text-gray-700">
                        24-25 de julio. Uno de los tres grandes festivales de
                        Japón, con desfiles terrestres y fluviales, y fuegos
                        artificiales.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Consejos para viajar en grupo */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Consejos para Viajar en Grupo
                  </h3>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {groupTravelTips.map((tip, idx) => (
                        <li key={idx} className="flex">
                          <span className="mr-2">•</span>
                          <span className="text-sm text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Frases útiles */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Frases Útiles en Japonés
                  </h3>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="py-2 px-4 text-left">Español</th>
                            <th className="py-2 px-4 text-left">Japonés</th>
                            <th className="py-2 px-4 text-left">
                              Pronunciación
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {usefulPhrases.map((phrase, idx) => (
                            <tr
                              key={idx}
                              className={
                                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              <td className="py-2 px-4">{phrase.phrase}</td>
                              <td className="py-2 px-4 font-medium">
                                {phrase.japanese}
                              </td>
                              <td className="py-2 px-4 text-sm text-gray-600">
                                {phrase.pronunciation}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de verificación */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">
                  Lista de Verificación para el Viaje
                </h3>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      "Documentos",
                      "Transporte",
                      "Electrónicos",
                      "Ropa",
                      "Salud",
                      "Financiero",
                      "Aplicaciones",
                      "Varios",
                    ].map((category) => (
                      <div
                        key={category}
                        className="bg-white p-4 rounded shadow-sm"
                      >
                        <h4 className="font-medium mb-3">{category}</h4>
                        <ul className="space-y-2">
                          {travelChecklist
                            .filter((item) => item.category === category)
                            .map((item, idx) => (
                              <li key={idx} className="flex items-start">
                                <input type="checkbox" className="mt-1 mr-2" />
                                <span className="text-sm">
                                  {item.item}
                                  {item.essential && (
                                    <span className="text-red-600 ml-1">*</span>
                                  )}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-sm text-gray-600">
                    <span className="text-red-600">*</span> Elementos esenciales
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 5 && (
          // Contenido de Metro de Tokio
          <TokyoMetroGuide />
        )}
      </div>
    </div>
  );
};

export default JapanTripPlanner;

import React, { useState } from "react";

// Información del sistema de metro de Tokio
const tokyoMetroLines = [
  {
    name: "Marunouchi",
    color: "#e60012",
    letter: "M",
    stations: 25,
    length: 27.4,
    route: "Ogikubo - Ikebukuro - Tokyo - Ginza - Kasumigaseki",
    description: "Línea roja que conecta áreas centrales como Shinjuku y Ginza",
    keyStations: [
      "Tokyo (conexión con JR)",
      "Ginza (zona comercial)",
      "Shinjuku-sanchome (entretenimiento)"
    ],
    tips: "Útil para llegar a áreas comerciales y a la estación principal de Tokyo"
  },
  {
    name: "Hibiya",
    color: "#9caeb7",
    letter: "H",
    stations: 21,
    length: 20.3,
    route: "Naka-Meguro - Ebisu - Roppongi - Ginza - Ueno - Kita-Senju",
    description: "Línea gris plateada que conecta Roppongi con el norte y sur de Tokyo",
    keyStations: [
      "Roppongi (vida nocturna)",
      "Ginza (zona comercial)",
      "Ueno (parques y museos)"
    ],
    tips: "Excelente para turistas, conecta zonas de entretenimiento con sitios culturales"
  },
  {
    name: "Ginza",
    color: "#f39700",
    letter: "G",
    stations: 19,
    length: 14.3,
    route: "Shibuya - Omotesando - Aoyama-itchome - Ginza - Ueno - Asakusa",
    description: "Línea naranja que recorre importantes zonas turísticas",
    keyStations: [
      "Shibuya (cruce famoso)",
      "Ginza (compras de lujo)",
      "Asakusa (templo Senso-ji)"
    ],
    tips: "Ideal para turistas, conecta Shibuya con Asakusa pasando por Ginza"
  },
  {
    name: "Hanzomon",
    color: "#8f76d6",
    letter: "Z",
    stations: 14,
    length: 16.8,
    route: "Shibuya - Omotesando - Nagatacho - Kudanshita - Otemachi - Oshiage",
    description: "Línea púrpura que conecta Shibuya con Oshiage (Tokyo Skytree)",
    keyStations: [
      "Shibuya (centro comercial)",
      "Otemachi (distrito financiero)",
      "Oshiage (Tokyo Skytree)"
    ],
    tips: "Práctica para ir desde Shibuya hasta la Torre Skytree"
  },
  {
    name: "Tozai",
    color: "#00a7db",
    letter: "T",
    stations: 23,
    length: 30.8,
    route: "Nakano - Takadanobaba - Iidabashi - Nihombashi - Otemachi - Nishi-Kasai",
    description: "Línea azul claro que cruza Tokyo de este a oeste (su nombre significa 'Este-Oeste')",
    keyStations: [
      "Nihombashi (distrito comercial histórico)",
      "Takadanobaba (zona universitaria)",
      "Otemachi (distrito de negocios)"
    ],
    tips: "Una de las líneas más concurridas, especialmente en hora punta"
  },
  {
    name: "Chiyoda",
    color: "#00a650",
    letter: "C",
    stations: 20,
    length: 24.0,
    route: "Yoyogi-Uehara - Omotesando - Kasumigaseki - Hibiya - Otemachi - Kita-Senju",
    description: "Línea verde que conecta el suroeste con el noreste de la ciudad",
    keyStations: [
      "Omote-sando (moda y cafés)",
      "Hibiya (parque y teatros)",
      "Yoyogi-Koen (parque Yoyogi)"
    ],
    tips: "Buena opción para acceder al parque Yoyogi y Meiji Jingu"
  },
  {
    name: "Yurakucho",
    color: "#d7c447",
    letter: "Y",
    stations: 24,
    length: 28.3,
    route: "Wakoshi - Ikebukuro - Iidabashi - Yurakucho - Toyosu",
    description: "Línea amarilla que conecta Ikebukuro con la bahía de Tokyo",
    keyStations: [
      "Ikebukuro (comercio y entretenimiento)",
      "Yurakucho (cerca del Palacio Imperial)",
      "Toyosu (nuevo mercado de pescado)"
    ],
    tips: "Útil para visitar el nuevo mercado de Toyosu, sucesor de Tsukiji"
  },
  {
    name: "Namboku",
    color: "#00ada9",
    letter: "N",
    stations: 19,
    length: 21.3,
    route: "Meguro - Roppongi-itchome - Iidabashi - Komagome - Akabane-Iwabuchi",
    description: "Línea turquesa que conecta el sur con el norte de Tokyo",
    keyStations: [
      "Roppongi-ichome (distrito gubernamental)",
      "Komagome (jardín Rikugien)",
      "Meguro (canal para ver cerezos)"
    ],
    tips: "Menos concurrida que otras líneas, buena para evitar multitudes"
  },
  {
    name: "Fukutoshin",
    color: "#9b7cb6",
    letter: "F",
    stations: 16,
    length: 20.2,
    route: "Shibuya - Shinjuku-sanchome - Ikebukuro - Wakoshi",
    description: "Línea marrón violácea, la más nueva del metro de Tokyo",
    keyStations: [
      "Shibuya (centro comercial)",
      "Shinjuku-sanchome (entretenimiento)",
      "Ikebukuro (compras y entretenimiento)"
    ],
    tips: "Conecta los tres grandes centros: Shibuya, Shinjuku e Ikebukuro"
  },
  {
    name: "JR Yamanote",
    color: "#9acd32",
    letter: "JY",
    stations: 30,
    length: 34.5,
    route: "Circular: Tokyo - Akihabara - Ueno - Ikebukuro - Shinjuku - Shibuya - Shinagawa - Tokyo",
    description: "Línea circular verde claro, no es parte del metro pero es esencial para moverse por Tokyo",
    keyStations: [
      "Tokyo (estación principal)",
      "Shinjuku (distrito comercial más grande)",
      "Shibuya (cruce famoso)",
      "Akihabara (electrónica y cultura otaku)"
    ],
    tips: "No es parte del metro sino del JR (cubierto por JR Pass), pero es esencial para moverse"
  }
];

// Tips generales para el metro de Tokio
const metroTips = [
  "Las estaciones grandes como Shinjuku o Tokyo tienen múltiples salidas numeradas. Verifica qué salida te conviene antes de llegar.",
  "El metro funciona aproximadamente desde las 5:00 AM hasta la 1:00 AM del día siguiente.",
  "Durante las horas punta (7:30-9:30 AM y 5:30-7:30 PM) los trenes van extremadamente llenos.",
  "Existe personal especial (uniformados con guantes blancos) que ayudan a empujar a los pasajeros durante las horas más concurridas.",
  "Los trenes son extremadamente puntuales. Si el horario dice 10:05, el tren llegará a las 10:05.",
  "Mantén silencio en los vagones. No está bien visto hablar por teléfono o mantener conversaciones ruidosas.",
  "Si llevas mochila, colócala frente a ti o en el portaequipajes superior para no molestar a otros pasajeros.",
  "Hay vagones exclusivos para mujeres durante las horas punta, marcados con señales rosadas.",
  "Está prohibido comer o beber en el metro (aunque algunas personas beben discretamente).",
  "Los mapas en las estaciones y trenes están en japonés e inglés. También hay anuncios en inglés en las líneas principales."
];

// Tarifas del metro
const metroFares = [
  { distance: "1-6 km", adult: 170, child: 90 },
  { distance: "7-11 km", adult: 200, child: 100 },
  { distance: "12-19 km", adult: 240, child: 120 },
  { distance: "20-27 km", adult: 280, child: 140 },
  { distance: "28-40 km", adult: 310, child: 160 },
  { distance: "Más de 40 km", adult: 340, child: 170 }
];

// Pases de metro para turistas
const metroPasses = [
  {
    name: "Tokyo Subway Ticket",
    duration: "24 horas",
    price: 800,
    coverage: "Todas las líneas de Tokyo Metro y Toei Subway",
    benefits: "Ilimitados viajes en todas las líneas de metro de Tokio"
  },
  {
    name: "Tokyo Subway Ticket",
    duration: "48 horas",
    price: 1200,
    coverage: "Todas las líneas de Tokyo Metro y Toei Subway",
    benefits: "Ilimitados viajes en todas las líneas de metro de Tokio"
  },
  {
    name: "Tokyo Subway Ticket",
    duration: "72 horas",
    price: 1500,
    coverage: "Todas las líneas de Tokyo Metro y Toei Subway",
    benefits: "Ilimitados viajes en todas las líneas de metro de Tokio"
  },
  {
    name: "Greater Tokyo Pass",
    duration: "3 días",
    price: 7200,
    coverage: "Sistemas de transporte en Tokyo, Kanagawa, Saitama y Chiba",
    benefits: "Ideal para excursiones fuera de Tokyo central"
  },
  {
    name: "Welcome Tokyo Subway Pass",
    duration: "24-72 horas",
    price: "800-1500",
    coverage: "Todas las líneas de metro + descuentos en atracciones",
    benefits: "Incluye descuentos en más de 350 tiendas, restaurantes y atracciones"
  }
];

// Componente principal del Metro de Tokio
const TokyoMetroGuide = () => {
  const [activeTab, setActiveTab] = useState('lines');
  const [expandedLine, setExpandedLine] = useState(null);

  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-red-700">
          Metro de Tokio
        </h2>

        {/* Introducción */}
        <div className="bg-white rounded-lg mb-8">
          <p className="mb-4">El sistema de metro de Tokio es uno de los más eficientes y extensos del mundo. Con más de 13 líneas y 285 estaciones, transporta diariamente a millones de personas a través de la metrópolis japonesa.</p>
          
          <p className="mb-4">El sistema está dividido en dos redes principales:</p>
          
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li><span className="font-medium">Tokyo Metro:</span> Operado por Tokyo Metro Co., Ltd. Incluye 9 líneas identificadas con letras (M, H, G, etc.) y colores distintivos.</li>
            <li><span className="font-medium">Toei Subway:</span> Operado por el gobierno metropolitano de Tokyo (Toei). Incluye 4 líneas adicionales.</li>
            <li><span className="font-medium">JR (Japan Railways):</span> Aunque técnicamente no es metro, la línea circular JR Yamanote y otras líneas JR son esenciales para moverse por Tokyo.</li>
          </ul>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-bold text-red-700 mb-2">¿Por qué es importante conocer el metro de Tokio?</h3>
            <p>El sistema de transporte público es la forma más eficiente de moverse por Tokio. Los taxis son caros y el tráfico puede ser intenso. Comprender el sistema de metro te permitirá moverte con facilidad, ahorrar tiempo y dinero, y llegar a prácticamente cualquier punto de interés en la ciudad.</p>
          </div>
        </div>

        {/* Pestañas de navegación */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button 
              className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'lines' ? 'border-red-600 text-red-600' : 'border-transparent hover:text-red-600'} mr-2`}
              onClick={() => setActiveTab('lines')}
            >
              Líneas de Metro
            </button>
            <button 
              className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'tips' ? 'border-red-600 text-red-600' : 'border-transparent hover:text-red-600'} mr-2`}
              onClick={() => setActiveTab('tips')}
            >
              Consejos Prácticos
            </button>
            <button 
              className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'fares' ? 'border-red-600 text-red-600' : 'border-transparent hover:text-red-600'} mr-2`}
              onClick={() => setActiveTab('fares')}
            >
              Tarifas y Pases
            </button>
          </div>
        </div>

        {/* Contenido según la pestaña activa */}
        {activeTab === 'lines' && (
          <div>
            <h3 className="text-xl font-bold mb-6 text-red-700">Líneas Principales del Metro</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {tokyoMetroLines.map((line, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div 
                    className="p-4 cursor-pointer"
                    style={{ borderLeft: `6px solid ${line.color}` }}
                    onClick={() => setExpandedLine(expandedLine === index ? null : index)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div 
                          className="w-8 h-8 flex items-center justify-center rounded-full text-white font-bold mr-3"
                          style={{ backgroundColor: line.color }}
                        >
                          {line.letter}
                        </div>
                        <h3 className="font-bold text-lg">{line.name}</h3>
                      </div>
                      <div className="text-sm">
                        {line.stations} estaciones | {line.length} km
                      </div>
                    </div>
                  </div>
                  
                  {expandedLine === index && (
                    <div className="p-4 bg-gray-50 border-t">
                      <p className="mb-3">{line.description}</p>
                      
                      <div className="mb-3">
                        <h4 className="font-medium mb-1">Ruta principal:</h4>
                        <p className="text-sm">{line.route}</p>
                      </div>
                      
                      <div className="mb-3">
                        <h4 className="font-medium mb-1">Estaciones clave:</h4>
                        <ul className="list-disc pl-5 text-sm">
                          {line.keyStations.map((station, idx) => (
                            <li key={idx}>{station}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded text-sm">
                        <span className="font-medium">Consejo:</span> {line.tips}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-bold text-lg mb-2">¿Cómo leer los mapas del metro?</h3>
              <p className="mb-3">Los mapas del metro de Tokio utilizan un sistema de códigos de colores y letras para identificar cada línea:</p>
              <ul className="list-disc pl-5 space-y-1 mb-3">
                <li>Cada línea tiene un color distintivo y una letra asignada (por ejemplo, M para Marunouchi).</li>
                <li>Las estaciones en cada línea están numeradas (por ejemplo, M08 es la estación número 8 en la línea Marunouchi).</li>
                <li>Las estaciones de conexión muestran todas las letras de las líneas que se cruzan allí.</li>
              </ul>
              <p>Este sistema hace que sea fácil navegar incluso sin hablar japonés, simplemente siguiendo los colores y números.</p>
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div>
            <h3 className="text-xl font-bold mb-6 text-red-700">Consejos para Usar el Metro de Tokio</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-lg mb-3">Etiqueta en el Metro</h4>
                <ul className="space-y-2">
                  {metroTips.slice(0, 5).map((tip, idx) => (
                    <li key={idx} className="flex">
                      <span className="mr-2">•</span>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-lg mb-3">Consejos Prácticos</h4>
                <ul className="space-y-2">
                  {metroTips.slice(5).map((tip, idx) => (
                    <li key={idx} className="flex">
                      <span className="mr-2">•</span>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
              <h4 className="font-bold text-lg mb-2">Cómo Usar las Máquinas Expendedoras de Boletos</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Localiza tu destino en el mapa sobre las máquinas y verifica el precio.</li>
                <li>Presiona el botón de idioma para cambiar a inglés (disponible en la mayoría de máquinas).</li>
                <li>Selecciona la cantidad de boletos y la tarifa correspondiente.</li>
                <li>Inserta el dinero (las máquinas aceptan monedas y billetes).</li>
                <li>Recoge tu boleto y cambio.</li>
              </ol>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-bold text-lg mb-2">Tarjetas IC: Suica y PASMO</h4>
              <p className="mb-3">Las tarjetas IC son la forma más conveniente de pagar el transporte público en Tokio:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Suica (JR) y PASMO (Metro y Toei) son tarjetas recargables que se pueden usar en todos los trenes, metros y buses.</li>
                <li>Cuesta ¥2,000 (incluye ¥1,500 de saldo y ¥500 de depósito reembolsable).</li>
                <li>Simplemente tócala en los lectores al entrar y salir de las estaciones.</li>
                <li>También puedes usarla para comprar en máquinas expendedoras, tiendas de conveniencia y muchas tiendas.</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'fares' && (
          <div>
            <h3 className="text-xl font-bold mb-6 text-red-700">Tarifas y Pases Turísticos</h3>
            
            <div className="mb-8">
              <h4 className="font-bold text-lg mb-3">Tarifas Básicas del Metro de Tokio</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="py-2 px-4 text-left border">Distancia</th>
                      <th className="py-2 px-4 text-center border">Adulto (¥)</th>
                      <th className="py-2 px-4 text-center border">Niño (¥)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metroFares.map((fare, idx) => (
                      <tr key={idx} className="border">
                        <td className="py-2 px-4 border">{fare.distance}</td>
                        <td className="py-2 px-4 text-center border">{fare.adult}</td>
                        <td className="py-2 px-4 text-center border">{fare.child}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-600 mt-2">Las tarifas pueden variar ligeramente entre Tokyo Metro y Toei Subway.</p>
            </div>
            
            <div className="mb-8">
              <h4 className="font-bold text-lg mb-3">Pases Recomendados para Turistas</h4>
              <div className="space-y-4">
                {metroPasses.map((pass, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h5 className="font-bold">{pass.name} ({pass.duration})</h5>
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">¥{pass.price}</span>
                    </div>
                    <p className="text-sm mt-2">Cobertura: {pass.coverage}</p>
                    <p className="text-sm text-gray-600 mt-1">{pass.benefits}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-bold text-lg mb-2">¿Vale la pena comprar un pase de metro?</h4>
              <p className="mb-3">Para decidir si un pase turístico te conviene:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>El Tokyo Subway Ticket de 72 horas (¥1,500) comienza a ser rentable si realizas más de 7-8 viajes en metro durante 3 días.</li>
                <li>Si planeas visitar mayormente atracciones dentro de Tokio central, el Tokyo Subway Ticket es ideal.</li>
                <li>Si harás excursiones a los alrededores de Tokio (Yokohama, Kamakura, etc.), considera el Greater Tokyo Pass.</li>
                <li>El Japan Rail Pass no cubre el metro de Tokio, solo las líneas JR como la Yamanote.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokyoMetroGuide;
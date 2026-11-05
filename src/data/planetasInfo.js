// src/data/planetasInfo.js
// Ficha divulgativa de cada planeta del catalogo compartido.
// Las claves coinciden con `PLANETAS[].key` (nombres de astronomy-engine).

export const PLANETAS_INFO = {
  Jupiter: {
    key: 'Jupiter',
    label: 'Júpiter',
    tipo: 'Gigante gaseoso',
    color: '#DDA15E',
    colorSuave: '#f4c78a',
    resumen:
      'El planeta más grande del sistema solar. Su atmósfera de hidrógeno y helio forma bandas de nubes y la Gran Mancha Roja, una tormenta más ancha que la Tierra.',
    observacion:
      'Con binoculares ya se distinguen sus cuatro lunas galileanas (Ío, Europa, Ganímedes y Calisto) como puntos alineados. Un telescopio de 100 mm o más permite ver las bandas ecuatoriales y, en buenas noches, la Gran Mancha Roja.',
    mejorEpoca:
      'Durante su oposición, cuando sale al atardecer y permanece visible toda la noche.',
    dato: 'Su Gran Mancha Roja lleva observándose al menos desde 1665 y podría caber en ella más de una Tierra.',
    magnitud: '−2.2 (media)',
    distancia: '778.5 millones km',
    diametro: '139,820 km',
    dia: '9 h 56 min',
    ano: '11.86 años',
    lunas: '95 confirmadas',
    temperatura: '−145 °C en las nubes',
  },
  Saturn: {
    key: 'Saturn',
    label: 'Saturno',
    tipo: 'Gigante gaseoso',
    color: '#E3C98D',
    colorSuave: '#f6e6bb',
    resumen:
      'El señor de los anillos. Sus anillos están formados por miles de millones de fragmentos de hielo y roca, y son tan delgados que desde el borde casi desaparecen.',
    observacion:
      'Es el objeto más espectacular para un primer telescopio. Con 80-150 mm se resuelven los anillos y su sombra sobre el planeta; Titán aparece como una pequeña luna cercana. Con binoculares se ve como un disco alargado.',
    mejorEpoca:
      'En oposición, cuando está más cerca y brilla más. Los anillos se ven mejor cuando su inclinación es amplia.',
    dato: 'Saturno es tan poco denso que, en un océano suficientemente grande, flotaría.',
    magnitud: '0.5 (media)',
    distancia: '1,434 millones km',
    diametro: '116,460 km',
    dia: '10 h 42 min',
    ano: '29.45 años',
    lunas: '274 confirmadas',
    temperatura: '−178 °C en las nubes',
  },
  Mars: {
    key: 'Mars',
    label: 'Marte',
    tipo: 'Planeta rocoso',
    color: '#E05A3A',
    colorSuave: '#f59e7d',
    resumen:
      'El planeta rojo debe su color al óxido de hierro de su superficie. Alberga el Monte Olimpo, el volcán más alto del sistema solar, y el cañón Valles Marineris.',
    observacion:
      'A simple vista destaca por su tono anaranjado y su brillo variable. Con un telescopio de 150 mm o más, en una oposición favorable, se aprecian los casquetes polares y las manchas oscuras de su superficie.',
    mejorEpoca:
      'Las oposiciones, que ocurren cada 26 meses. Las más favorables son las oposiciones perihelicas, cada 15-17 años.',
    dato: 'Un año marciano dura casi dos años terrestres, pero un sol (día solar) dura solo 24 h 39 min.',
    magnitud: '−0.3 (media)',
    distancia: '227.9 millones km del Sol',
    diametro: '6,779 km',
    dia: '24 h 37 min',
    ano: '687 días terrestres',
    lunas: '2 (Fobos y Deimos)',
    temperatura: '−63 °C de media',
  },
  Venus: {
    key: 'Venus',
    label: 'Venus',
    tipo: 'Planeta rocoso',
    color: '#F2D98A',
    colorSuave: '#fff3c4',
    resumen:
      'El mundo más caliente del sistema solar: su densa atmósfera de CO₂ atrapa el calor y las nubes de ácido sulfúrico lo cubren por completo. Es el objeto más brillante del cielo después del Sol y la Luna.',
    observacion:
      'Se ve fácilmente al amanecer o al atardecer como el “lucero”. Con un telescopio muestra fases como la Luna, aunque su superficie nunca es visible. Conviene observarlo antes de que el cielo esté completamente oscuro.',
    mejorEpoca:
      'En sus elongaciones máximas, cuando se aleja más del Sol y permanece más tiempo sobre el horizonte.',
    dato: 'Venus gira en sentido contrario al resto de los planetas y su día (243 días) es más largo que su año (225 días).',
    magnitud: '−4.6 (media)',
    distancia: '108.2 millones km del Sol',
    diametro: '12,104 km',
    dia: '243 días terrestres',
    ano: '225 días terrestres',
    lunas: 'Sin lunas',
    temperatura: '≈ 465 °C en superficie',
  },
  Mercury: {
    key: 'Mercury',
    label: 'Mercurio',
    tipo: 'Planeta rocoso',
    color: '#A8B0C2',
    colorSuave: '#d7dce8',
    resumen:
      'El planeta más pequeño y más cercano al Sol. Su superficie, cubierta de cráteres, recuerda a la Luna y sufre oscilaciones térmicas extremas entre el día y la noche.',
    observacion:
      'Es el más difícil de los cinco: siempre está cerca del Sol y solo se ve en crepúsculos muy breves, con un horizonte este u oeste totalmente despejado. Nunca se aleja más de 28° del Sol.',
    mejorEpoca:
      'En sus mayores elongaciones, sobre todo si coinciden con una buena altura sobre el horizonte. Hay que buscar un lugar sin obstáculos hacia el amanecer o el atardecer.',
    dato: 'Un día solar en Mercurio dura 176 días terrestres: tres días mercurianos por cada dos años del planeta.',
    magnitud: '−0.4 (media)',
    distancia: '57.9 millones km del Sol',
    diametro: '4,879 km',
    dia: '58.6 días terrestres',
    ano: '88 días terrestres',
    lunas: 'Sin lunas',
    temperatura: '−180 °C a 430 °C',
  },
};

export const getInfoPlaneta = (key) =>
  PLANETAS_INFO[key] ?? {
    key,
    label: key,
    tipo: 'Planeta',
    color: '#c084fc',
    colorSuave: '#e0e7ff',
    resumen: '',
    observacion: '',
    mejorEpoca: '',
    dato: '',
    magnitud: '—',
    distancia: '—',
    diametro: '—',
    dia: '—',
    ano: '—',
    lunas: '—',
    temperatura: '—',
  };

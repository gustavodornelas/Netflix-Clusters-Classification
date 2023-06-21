// Clusters retornados pela IA
const kMedoids = [
    [0                  , 0, 0.000305622934296786   , 0                         ],  // 0
    [0                  , 0, 0.00158132384421761    , 0.7                       ],  // 1
    [0.6875             , 0.0000265884298486072     , 0.000687321793245865, 0   ],  // 2
    [0.5625             , 0.0014828498089338        , 0.00688904876071, 0.58    ],  // 3
    [0.6875             , 0.00730876707707288       , 0.00632925308393329, 0.68 ],  // 4 
    [0.791666666666667  , 0.00469961394471612       , 0.00698403373021806, 0.77 ],  // 5

];



const kMeans = [
    [0.013000328083989501   , 7.030386525446399E-5  , 0.00621939197804035   , 0.5665547244094488    ], // 0
    [0.5582625724065307     , 0.0029494854475714508 , 0.007427859975771132  , 0.43780110584518145   ], // 1
    [0.7183330263588739     , 0.012501518404522937  , 0.010992534010682216  , 0.7217912328094294    ]  // 2
];



// Função para calcular a distância entre dois pontos 4D
function calcularDistancia(objeto, cluster) {
    let distancia = 0;
    for (let i = 0; i < objeto.length; i++) {
        distancia += Math.pow(objeto[i] - cluster[i], 2);
    }

    return Math.sqrt(distancia);
}

// Função para encontrar o cluster mais próximo do objeto
function encontrarClusterMaisProximoKmedoids(objeto) {
    let distanciaMinima = Number.MAX_VALUE;
    let indiceClusterMaisProximo = -1;

    for (let i = 0; i < kMedoids.length; i++) {
        let distancia = calcularDistancia(objeto, kMedoids[i]);
        console.log(distancia);
        if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            indiceClusterMaisProximo = i;
        }
    }

    return indiceClusterMaisProximo;
}

// Função para encontrar o cluster mais próximo do objeto
function encontrarClusterMaisProximoKmeans(objeto) {
    let distanciaMinima = Number.MAX_VALUE;
    let indiceClusterMaisProximo = -1;

    for (let i = 0; i < kMeans.length; i++) {
        let distancia = calcularDistancia(objeto, kMeans[i]);
        console.log(distancia);
        if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            indiceClusterMaisProximo = i;
        }
    }

    return indiceClusterMaisProximo;
}



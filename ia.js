// Clusters retornados pela IA
const clusters = [
    [0, 0, 0, 0],               // 0
    [0, 0, 0.002, 0.7],         // 1
    [0.668, 0, 0.001, 0],       // 2
    [0.563, 0.001, 0.007, 0.58],// 3
    [0.668, 0.007, 0.006, 0.68],// 4 
    [0.792, 0.005, 0.007, 0.77],// 5

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
function encontrarClusterMaisProximo(objeto) {
    let distanciaMinima = Number.MAX_VALUE;
    let indiceClusterMaisProximo = -1;

    for (let i = 0; i < clusters.length; i++) {
        const distancia = calcularDistancia(objeto, clusters[i]);
        console.log(distancia);
        if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            indiceClusterMaisProximo = i;
        }
    }

    return indiceClusterMaisProximo;
}

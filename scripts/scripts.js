var filmes = []; // Vetor de filmes
var filmesPorPagina = 50; // Número de filmes por página
var paginaAtual = 1; // Página atual
var paginasVisiveis = 11; // Quantidade de páginas visíveis na barra de paginação

// Constantes para criação de página
const moviesContainer = document.getElementById('featured-movies');
const searchInput = document.getElementById('search-input');
const menuGeneros = document.getElementById('menu-generos');
const menuIcon = document.getElementById('menuIcon');
const pagination = document.getElementById('pagination');
const documento = document.documentElement;


// Função para voltar para o inicio da pagina
function scrollToTop() {
    if (document.documentElement.scrollTop > 0) {
        window.scrollBy(0, -50); // Quantidade de pixels a serem rolados a cada quadro
        requestAnimationFrame(scrollToTop);
    }
}

function pesquisar() {
    document.getElementById('search-input').focus();
}

// Funcao para carregar filme
async function carregarFilme(filme) {
    // Consulta à API do TMDb apenas para os filmes exibidos na página atual
    filme.poster_path = await fetch('https://api.themoviedb.org/3/search/movie?api_key=0a84662f8eea5b3755c500c3602df4d8&language=en-US&query=' + encodeURIComponent(filme.title))
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                var movieData = data.results[0];

                return (movieData) ? movieData.poster_path : null;
            } else {
                return null;
            }
        })
        .catch(error => {
            console.error('Erro ao carregar a imagem do filme:', error);
        });

    var movieDiv = document.createElement('div');
    movieDiv.className = 'movie';

    var movieBoxDiv = document.createElement('div');
    movieBoxDiv.className = 'movie-box';

    var movieImage = document.createElement('img');
    movieImage.className = 'movie-image';
    movieImage.alt = filme.title;
    movieImage.src = (filme.poster_path) ? 'https://image.tmdb.org/t/p/w500' + filme.poster_path : 'images/image-not-found.png';

    var movieTitle = document.createElement('div');
    movieTitle.className = 'movie-title';
    movieTitle.textContent = filme.title;

    // Adiciona evento de clique na div do filme
    movieDiv.addEventListener('click', function () {
        exibirDetalhesFilme(filme);
    });

    movieBoxDiv.appendChild(movieImage);
    movieBoxDiv.appendChild(movieTitle);
    movieDiv.appendChild(movieBoxDiv);
    moviesContainer.appendChild(movieDiv);
}

// Função para exibir os filmes na página atual
async function exibirFilmes() {
    var startIndex = (paginaAtual - 1) * filmesPorPagina;
    var endIndex = startIndex + filmesPorPagina;

    moviesContainer.innerHTML = '';

    for (var i = startIndex; i < endIndex && i < filmes.length; i++) {
        await carregarFilme(filmes[i]);
    }
}

// Função para exibir os detalhes do filme na janela pop-up
function exibirDetalhesFilme(filme) {
    // Cria a janela pop-up
    var popup = document.createElement('div');
    popup.className = 'popup';

    // Cria o conteúdo da janela pop-up
    var popupContent = document.createElement('div');
    popupContent.className = 'popup-content';

    //cria a div com imagem do filme
    var posterContainer = document.createElement('div');
    posterContainer.className = 'poster-container';

    var movieImage = document.createElement('img');
    movieImage.className = 'movie-image';
    movieImage.alt = filme.title;
    movieImage.src = (filme.poster_path) ? 'https://image.tmdb.org/t/p/w500' + filme.poster_path : 'image-not-found.png';
    posterContainer.appendChild(movieImage);

    // Cria a div com as informações do filme
    var infoContainer = document.createElement('div');
    infoContainer.className = 'info-container';

    // Cria o título do filme na janela pop-up
    var popupTitle = document.createElement('h2');
    popupTitle.textContent = filme.title;

    // Cria os elementos para exibir as informações do filme
    var popupInfo = document.createElement('ul');
    popupInfo.className = 'popup-info';

    // Exibindo score do filme de acordo com Cluster retornado pela IA

    var popupScoreTitle = document.createElement('h3');
    popupScoreTitle.textContent = 'Score according to AI calculations';

    score = [
        filme.imdb_score,
        filme.imdb_votes,
        filme.tmdb_popularity,
        filme.tmdb_score
    ]

    // Classificar por K-Medoids
    var kmedoids = encontrarClusterMaisProximoKmedoids(score);
    console.log("K-Medoids Cluster: " + kmedoids);
    var popupStars = document.createElement('div');
    popupStars.className = 'stars';
    for (let i = 0; i < 5; i++) {
        
        let star = document.createElement('i');
        star.className = 'fa-solid fa-star';
        if (i < kmedoids) {
            star.className = 'fa-solid fa-star yellow-star';
        }

        popupStars.appendChild(star);
    }

    // Classificar por K-Means
    var kmeans = encontrarClusterMaisProximoKmeans(score);
    console.log("K-Means Cluster: " + kmeans);
    var popupClassification = document.createElement('p');
    popupClassification.className = 'popup-classification';

    if (kmeans == 0) {
        popupClassification.textContent = 'this movie has a bad rating or the data is not filled in correctly!';
    } else if (kmeans == 1) {
        popupClassification.textContent = 'This movie has a regular rating!';
    } else if (kmeans == 2) {
        popupClassification.textContent = 'This movie has a god rating!';
    } else {
        popupClassification.textContent = 'this movie data is not filled in correctly!';

    }

    
    var infoItems = [
        { label: 'Type', value: filme.type },
        { label: 'Description', value: filme.description },
        { label: 'Release Year', value: filme.release_year },
        { label: 'GE Certification', value: filme.ge_certification },
        { label: 'Runtime', value: filme.runtime },
        { label: 'Genres', value: filme.genres.join(', ') },
        { label: 'Production Countries', value: filme.production_countries },
        { label: 'IMDb ID', value: filme.imdb_id },
        { label: 'IMDb Score', value: filme.imdb_score },
        { label: 'IMDb Votes', value: filme.imdb_votes },
        { label: 'TMDb Popularity', value: filme.tmdb_popularity },
        { label: 'TMDb Score', value: filme.tmdb_score }
    ];

    infoItems.forEach(item => {
        if (item.value) {
            var listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${item.label}:</strong> ${item.value}`;
            popupInfo.appendChild(listItem);
        }
    });

    // Adiciona os elementos à janela pop-up
    popupContent.appendChild(posterContainer);
    infoContainer.appendChild(popupTitle);
    infoContainer.appendChild(popupInfo);
    infoContainer.appendChild(popupScoreTitle);
    infoContainer.appendChild(popupStars);
    infoContainer.appendChild(popupClassification);
    popupContent.appendChild(infoContainer);
    popup.appendChild(popupContent);
    document.body.appendChild(popup);

    // Adiciona evento de clique fora da janela pop-up para fechá-la
    popup.addEventListener('click', function (event) {
        if (event.target === popup) {
            popup.remove();
        }
    });
}

// Função para exibir somente os filmes do gênero escolhido
async function exibirFilmesPorGenero(genero) {

    var filmesFiltrados = filmes.filter(filme => filme.genres.includes(genero));

    var startIndex = (paginaAtual - 1) * filmesPorPagina;
    var endIndex = startIndex + filmesPorPagina;

    var moviesContainer = document.getElementById('featured-movies');
    moviesContainer.innerHTML = '';

    for (var i = startIndex; i < endIndex && i < filmes.length; i++) {
        await carregarFilme(filmesFiltrados[i]);
    }

    exibirPaginacao(filmesFiltrados, genero);
}

searchInput.addEventListener('keyup', async function (e) {
    var key = e.which || e.keyCode;
    if (key == 13) { // codigo da tecla enter
        var searchTerm = searchInput.value.trim().toLowerCase();
        await filtrarFilmesPorTermo(searchTerm);
    }
});


async function filtrarFilmesPorTermo(termo) {

    var filmesFiltrados = await filmes.filter((filme) => {
        const string = "" + filme.title;
        if (string.toLowerCase().indexOf(termo) > -1 && string != "") {
            return filme;
        }
    });

    // Organização dos filmes
    filmesFiltrados.sort((a, b) => {
        var x = a.title.toLowerCase();
        var y = b.title.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
    });

    console.log(filmesFiltrados);

    moviesContainer.innerHTML = '';
    pagination.innerHTML = '';

    filmesFiltrados.forEach((filme) => {
        carregarFilme(filme);
    });

}

// Função para exibir a paginação
function exibirPaginacao(listaFilmes, genero) {
    
    pagination.innerHTML = '';

    var numPaginas = Math.ceil(listaFilmes.length / filmesPorPagina);
    var startPage, endPage;

    if (numPaginas <= paginasVisiveis) {
        // Se o número total de páginas for menor ou igual à quantidade de páginas visíveis, mostra todas as páginas
        startPage = 1;
        endPage = numPaginas;
    } else {
        // Caso contrário, exibe a faixa de páginas ao redor da página atual
        var halfPages = Math.floor(paginasVisiveis / 2);
        if (paginaAtual <= halfPages) {
            startPage = 1;
            endPage = paginasVisiveis;
        } else if (paginaAtual + halfPages >= numPaginas) {
            startPage = numPaginas - paginasVisiveis + 1;
            endPage = numPaginas;
        } else {
            startPage = paginaAtual - halfPages;
            endPage = paginaAtual + halfPages;
        }
    }

    for (var i = startPage; i <= endPage; i++) {

        var pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = i;
        pageLink.className = 'page-link';

        if (i === paginaAtual) {
            pageLink.classList.add('current');
        }

        pageLink.onclick = function (page) {
            return function () {
                paginaAtual = page;

                if (genero) {
                    exibirFilmesPorGenero(genero)
                }
                else {
                    exibirFilmes();
                }

                exibirPaginacao(listaFilmes);

                scrollToTop();
                return false;
            };
        }(i);

        pagination.appendChild(pageLink);
    }
}

// Função para criar o menu lateral com os gêneros
function criarMenuGeneros(generos) {

    menuGeneros.innerHTML = '';

    generos.forEach(genero => {
        var generoItem = document.createElement('div');
        generoItem.textContent = genero;
        generoItem.className = 'genero-item';
        generoItem.id = 'item-menu-' + genero;
        generoItem.onclick = function () {
            paginaAtual = 1;
            exibirFilmesPorGenero(genero);
        };

        menuGeneros.appendChild(generoItem);
    });
}

// Funções para abrir ou fechar o menu lateral
function toggleMenu() {
    menuGeneros.classList.toggle('show');
}

documento.addEventListener('click', function (event) {
    var target = event.target;

    // Verifica se o clique ocorreu fora do menu hamburguer e do ícone do menu
    if (!menuGeneros.contains(target) && target !== menuIcon) {
        // Oculta o menu hamburguer
        if (menuGeneros.classList.contains('show'))
            menuGeneros.classList.toggle('show');
    }
});

function saiu(target) {
    menuGeneros.classList.toggle('hide');
}

// Função para ler o arquivo JSON e salvar os filmes no vetor
function carregarFilmes() {
    fetch('scripts/filmes.json') // Substitua 'filmes.json' pelo caminho correto do seu arquivo JSON
        .then(response => response.json())
        .then(data => {
            filmes = data;
            // Criar vetor de gêneros em ordem alfabética
            var generos = [];
            filmes.forEach(filme => {

                if (filme.genres.length > 0) {
                    // Removendo os caracteres de colchetes e aspas
                    var genres = filme.genres.replace("[", "").replace("]", "").replaceAll("'", "").split(',');

                    //salvando o vetor no objeto filme
                    filme.genres = genres;

                    filme.genres.forEach(genero => {
                        if (!generos.includes(genero)) {
                            generos.push(genero);
                        }
                    });
                }

                if (filme.production_countries.length > 0) {
                    // Removendo os caracteres de colchetes e aspas
                    var movieCountries = filme.production_countries.replace("[", "").replace("]", "").replaceAll("'", "").split(',');

                    //salvando o vetor no objeto filme
                    filme.production_countries = movieCountries;
                }
            });

            generos.sort();
            console.log('Filmes carregados:', filmes);
            console.log('Gêneros em ordem alfabética:', generos);

            exibirFilmes();
            exibirPaginacao(filmes, null);

            // Criar menu lateral de gêneros
            criarMenuGeneros(generos);
        })
        .catch(error => {
            console.error('Erro ao carregar os filmes:', error);
        });
}

// Chamada da função para carregar os filmes ao carregar a página
carregarFilmes();
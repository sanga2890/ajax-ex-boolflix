// Predisporre quindi un layout molto semplice con una barra di ricerca e un pulsante: al click sul pulsante fare partire una chiamata ajax a tmdb per recuperare i film che corrispondo alla query di ricerca inserita dall'utente.
// Ciclare i risultati e per ogni film restituito, stamparne in pagina:
// titolo
// titolo originale
// lingua
// voto


// aggancio il click al bottone per eseguire la ricerca;
$('.button-search').click(function(){
    // vado a leggere quello che l'utente ha scritto nella barra di ricerca e lo salvo in una variabile;
    var input_utente = $('.input-search').val().toLowerCase();

    // richiamo la funzione per richiedere i dati all'API di Tmdb;
    richiesta_dati(input_utente)
});

$('.input-search').keypress(function (e) {
    // vado a leggere quello che l'utente ha scritto nella barra di ricerca e lo salvo in una variabile;
    var input_utente = $('.input-search').val().toLowerCase();
    
  if (e.which == 13)  {
      // richiamo la funzione per richiedere i dati all'API di Tmdb;
      richiesta_dati(input_utente)
  }
});

// creo una funzione per far partire la chiamata ajax al database di TMDB per richiamare l'API contenente le info dei film;
function richiesta_dati(input){
    $.ajax({
            'url': 'https://api.themoviedb.org/3/search/movie',
            'method': 'GET',
            'data': {
                'api_key': '395a702f508318066d7e0e361a459f06',
                'query': input
            },
            'success': function(answer) {
                var movies = answer.results
                // inseriscon la funzione per ciclare i film in basa al risultato della ricerca;
                gestione_dati(movies)
            },
        'error': function() {
            alert('si è verificato un errore');
        }
    });
}
// funzione per ciclare tutti i film trovati;
function gestione_dati(film) {
    for (var i = 0; i < film.length; i++) {
        var current_movie = film[i]
        // inserisco la funzione per la stampa in pagina;
        stampa_movies(current_movie)
    }
}

// funzione per stampare in pagina solo le informazioni che mi interessano per ciascun film trovato
function stampa_movies(info) {
    var titolo = info.title
    // $('.movie-list').append('<li><span>Titolo: </span>' + titolo + '</li>')
    var titolo_originale = info.original_title
    // $('.movie-list').append('<li><span>Titolo originale: </span>' + titolo_originale + '</li>')
    var lingua = info.original_language
    // $('.movie-list').append('<li><span>Lingua originale: </span>' + lingua + '</li>')
    var voto = info.vote_average
    // $('.movie-list').append('<li><span>Voto: </span>' + voto + '</li>')

    $('main.container').append('<ul><li><span>Titolo: </span>' + titolo + '</li><li><span>Titolo originale: </span>' + titolo_originale + '</li><li><span>Lingua originale: </span>' + lingua + '</li><li><span>Voto: </span>' + voto + '</li></ul>')
}

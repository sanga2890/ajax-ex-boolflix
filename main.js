// Predisporre quindi un layout molto semplice con una barra di ricerca e un pulsante: al click sul pulsante fare partire una chiamata ajax a tmdb per recuperare i film che corrispondo alla query di ricerca inserita dall'utente.
// Ciclare i risultati e per ogni film restituito, stamparne in pagina:
// titolo
// titolo originale
// lingua
// voto


// aggancio il click al bottone per eseguire la ricerca;
$('.button-search').click(function(){
    // pulisco la pagina da risultati pecedenti;
    $('.results').text('')

    // vado a leggere quello che l'utente ha scritto nella barra di ricerca e lo salvo in una variabile;
    var input_utente = $('.input-search').val().toLowerCase();

    // richiamo la funzione per richiedere i dati all'API di Tmdb;
    richiesta_dati(input_utente)
});

$('.input-search').keypress(function (e) {
    // pulisco la pagina da risultati pecedenti;
    $('.results').text('')

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
    // uso handlebars per clonare il template
    var source = $("#my-template").html();
        var template = Handlebars.compile(source);
        var context = {
            // recupero il titolo;
            'titolo' : info.title,
            // recupero il titiolo originale;
            'titolo_originale' : info.original_title,
            // recupero la lingua originale;
            'lingua' :info.original_language,
            // recupero il voto;
            'voto' : info.vote_average
        }

        var html = template(context);
        // stampo tutto in pagina nell'apposito container;
        $('.results').append(html);
}

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
    var input_utente = $('.input-search').val().trim().toLowerCase();

    // verifico che siano stati inseriti almeno 2 caratteri;
    if (input_utente.length > 1 ){

        // richiamo le funzioni per richiedere i dati all'API di Tmdb;
        richiesta_dati(input_utente)
        richiesta_serie(input_utente)
    } else {

      // avviso che indica il numero minimo di caratteri da digitare;
      alert('Caratteri insufficienti! Inserisci almeno 2 lettere per poter effettuare una ricerca.');
  }



});

$('.input-search').keyup(function (e) {
    // pulisco la pagina da risultati pecedenti;
    $('.results').text('')


    // vado a leggere quello che l'utente ha scritto nella barra di ricerca e lo salvo in una variabile;
    var input_utente = $('.input-search').val().trim().toLowerCase();

  if (e.which == 13)  {

      // verifico che siano stati inseriti almeno 2 caratteri;
      if (input_utente.length > 1 ){

          // richiamo le funzioni per richiedere i dati all'API di Tmdb;
          richiesta_dati(input_utente)
          richiesta_serie(input_utente)
        } else {

        // avviso che indica il numero minimo di caratteri da digitare;
        alert('Caratteri insufficienti! Inserisci almeno 2 lettere per poter effettuare una ricerca.');
    }

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

                // inseriscon la funzione per ciclare i film in base al risultato della ricerca;
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

    // faccio diventare il voto da 1 a 5 al posto di 1 a 10 e arrotondo;
    var rounded = Math.round(info.vote_average / 2);

    // uso handlebars per clonare il template
    var source = $("#movie-template").html();
        var template = Handlebars.compile(source);
        var context = {

            // recupero la locandina;
            'img' : stampa_poster(info.backdrop_path),

            // recupero il titolo;
            'titolo' : info.title,

            // recupero il titiolo originale;
            'titolo_originale' : info.original_title,

            // recupero la lingua originale;
            'lingua' :flags(info.original_language),

            // recupero il voto arrotondato;
            'voto' : rating_stars(rounded)
        }

        var html = template(context);

        // stampo tutto in pagina nell'apposito container;
        $('.results').append(html);
}

// funzione per effettuare una chiamata all'api di tmdb per la ricerca delle serie TV;
function richiesta_serie(input){
    $.ajax({
            'url': 'https://api.themoviedb.org/3/search/tv',
            'method': 'GET',
            'data': {
                'api_key': '395a702f508318066d7e0e361a459f06',
                'query': input
            },
            'success': function(answer) {
                var series = answer.results

                // inseriscon la funzione per ciclare le serie tv in base al risultato della ricerca;
                gestione_dati_serie(series)
            },
        'error': function() {
            alert('si è verificato un errore');
        }
    });
}

function gestione_dati_serie(serie) {
    for (var i = 0; i < serie.length; i++) {
        var current_serie = serie[i]

        // stampo la serie corrente
        stampa_series(current_serie)
    }

}

function stampa_series(info) {

    // faccio diventare il voto da 1 a 5 al posto di 1 a 10 e arrotondo;
    var rounded = Math.round(info.vote_average / 2);

    // uso handlebars per clonare il template
    var source = $("#serie-template").html();
        var template = Handlebars.compile(source);
        var context = {

            // recupero la locandina;
            'img' : stampa_poster(info.backdrop_path),

            // recupero il titolo;
            'titolo' : info.name,

            // recupero il titiolo originale;
            'titolo_originale' : info.original_name,

            // recupero la lingua originale;
            'lingua' :flags(info.original_language),

            // recupero il voto arrotondato;
            'voto' : rating_stars(rounded)
        }

        var html = template(context);

        // stampo tutto in pagina nell'apposito container;
        $('.results').append(html);
}

// funzione per sostitutire la lingua con la rispettiva bandiera;
function flags(lingua) {

    // recupero il template con handlebars;
    var source = $("#flag-template").html();
    var template = Handlebars.compile(source);

    // dichiaro una variabile con un array contenente le immagini delle bandiere che ho a disposizione;
    var bandiere = ['en', 'it', 'de', 'fr', 'es'];

    // verifico che la lingua inserita sia presente nell'array bandiere;
    if (bandiere.includes(lingua)){
        var context = {
            'flag' : lingua

        };

        var html = template(context);
        return html;

    }

    return lingua;
};

// funzione per sositire il voto con delle stelline;
function rating_stars(rating) {

    // dichiaro una variabile vuota;
    var stars = '';

    // ciclo per 5 volte (la votazione va da 1 a 5);
    for (var i = 0; i < 5; i++) {

        // in base al numero che sta ad indicare il voto vado a stampare un numero di stelline piene, pari al voto recuperato dall'api;
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {

            // se il voto è inferiore a 5, stampo le restanti stelline vuote;
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
};

// Creo funzione per recuperare il poster del film/serieTV
function stampa_poster(poster) {
    // verifico che il risultato della richiesta sia diverso da 'null';
    if (poster != null) {
        var img = 'https://image.tmdb.org/t/p/w342' + poster
        // in caso contrario stampo un immagine che mi indica che la foto non è disponibile;
    } else {
        var img = 'https://montagnolirino.it/wp-content/uploads/2015/12/immagine-non-disponibile.png'
    }
    return img
}

// BOOLFLIX
// riproduzione della schermata principale di Netflix, con ricerca film e serie tv, immagini di copertina, info ecc...

// aggancio il click al bottone per eseguire la ricerca;
$('.button-search').click(function(){
        // richiamo le funzioni per richiedere i dati all'API di Tmdb;
        richiesta_dati();
});

// intercette il click sull'icona per aprire l'input per la ricerca;
$('.search .open-input').click(function(){
    $('.input-search, .button-search').removeClass('hidden');
    $('.input-search').focus();
    $('.open-input').addClass('hidden');
    $('.search').css({"width" : "300px", "border" : "1px solid #fff", "border-radius" : "2px"});
})

// richiudo l'input per la ricerca se clicco in un qualsiasi punto fuori;
$(document).click(function(event){
    var target = $(event.target);
    if (!target.hasClass('input-search') && !target.hasClass('open-input') && !target.hasClass('button-search') && !target.hasClass('search')) {

        // richiudo l'input ricerca;
        $('.input-search, .button-search').addClass('hidden');
        $('.open-input').removeClass('hidden');
        $('.search').css("width", "40px");
        var time = setTimeout(border_none, 400);
        function border_none(){
            $('.search').css("border", "none");
        }
    }
});

$('.input-search').keyup(function (e) {

    // verifico che il premuto sia Enter/Invio;
    if (e.which == 13)  {

          // richiamo le funzioni per richiedere i dati all'API di Tmdb;
          richiesta_dati();
      }
});

// creo una funzione per far partire la chiamata ajax al database di TMDB per richiamare l'API contenente le varie info;

// richiesta dati film;
function richiesta_dati(){

    // vado a leggere quello che l'utente ha scritto nella barra di ricerca e lo salvo in una variabile;
    var input_utente = $('.input-search').val().trim().toLowerCase();

    // verifico che siano stati inseriti almeno 2 caratteri;
    if (input_utente.length > 1 ){

        // pulisco la pagina da risultati pecedenti;
        $('.results').text('')

    $.ajax({
            'url': 'https://api.themoviedb.org/3/search/movie',
            'method': 'GET',
            'data': {
                'api_key': '395a702f508318066d7e0e361a459f06',
                'query': input_utente
            },
            'success': function(answer) {
                var movies = answer.results;

                risultati_ricerca(input_utente);

                // inseriscon la funzione per ciclare i film in base al risultato della ricerca;
                gestione_dati(movies, 'Movie');
            },
        'error': function() {
            alert('si è verificato un errore');
        }
    });

// chiamata all'api di tmdb per la ricerca delle serie TV;
    $.ajax({
            'url': 'https://api.themoviedb.org/3/search/tv',
            'method': 'GET',
            'data': {
                'api_key': '395a702f508318066d7e0e361a459f06',
                'query': input_utente
            },
            'success': function(answer) {
                var series = answer.results;

                risultati_ricerca(input_utente);

                // inseriscon la funzione per ciclare le serie tv in base al risultato della ricerca;
                gestione_dati(series, 'TV');
            },
        'error': function() {
            alert('si è verificato un errore');
        }
    });

} else {

    // avviso che indica il numero minimo di caratteri da digitare;
    alert('Caratteri insufficienti! Inserisci almeno 2 lettere per poter effettuare una ricerca.');
    }

    // pulisco l'input;
    $('.input-search').val('');
}

// funzione per visulizzare la parola cercata;
    function risultati_ricerca(testo_utente) {
        // inserisco il testo cercato dall'utente nel titolo della pagina
        $('.risultato').text(testo_utente);
        // visualizzo il titolo della pagina
        $('.ricerca').removeClass('hidden');
    }

// funzione per ciclare tutti i film trovati;
function gestione_dati(contenuto, type) {
    for (var i = 0; i < contenuto.length; i++) {
        var current_contenuto = contenuto[i]

        // inserisco la funzione per la stampa in pagina;
        stampa(current_contenuto, type)
    }
}

// funzione per stampare in pagina solo le informazioni che mi interessano per ciascun film trovato
function stampa(info, type) {

    // faccio diventare il voto da 1 a 5 al posto di 1 a 10 e arrotondo;
    var rounded = Math.round(info.vote_average / 2);

    // uso handlebars per clonare il template
    var source = $("#movie-template").html();
        var template = Handlebars.compile(source);
        var context = {

            // recupero la locandina;
            'img' : stampa_poster(info.backdrop_path),

            // recupero il titolo;
            'titolo' : info.title || info.name,

            // recupero il titiolo originale;
            'titolo_originale' : info.original_title || info.original_name,

            // recupero la lingua originale;
            'lingua' :flags(info.original_language),

            // recupero il voto arrotondato;
            'voto' : rating_stars(rounded),

            // recupero l'overview;
            'overview' : info.overview,

            // È un film o una serie tv?
            'type' : type
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
            stars += '<span class="material-icons">star</span>';
        } else {

            // se il voto è inferiore a 5, stampo le restanti stelline vuote;
            stars += '<span class="material-icons">star_border</span>';
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
        var img = 'img/nondisponibile.png'
    }
    return img
}

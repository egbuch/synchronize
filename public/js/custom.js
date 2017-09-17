// var Handlebars = require('handlebars');
//
// Handlebars.registerHelper('ifNE', function(v1, v2, options) {
//   if(v1 !== v2) {
//     return options.fn(this);
//   }
//   return options.inverse(this);
// });

$(document).ready(function() {
    if (top.location.pathname === '/users/myprofile') {
        console.log("why is this connecting");
        const socket = io.connect("http://localhost:3000");
        socket.on('update-listening', function(listening){
            console.log("New update!")

            var title = listening.title;
            var artists = listening.artists;
            var time = listening.progressTime;
            var isPlaying = listening.isPlaying;
            var imageUrl = listening.imageUrl;

            $('#listeningTitle').text(title);
            $('#listeningArtists').empty();

            var p = document.createElement('p');
            artists.forEach(function(artist) {
                var p = $('<p>', {
                    class: 'centered-text lead',
                    text: artist,
                });

                $('#listeningArtists').append(p);
            });

            $('#listeningProgressTime').text(time);

            $('#listeningImage').attr("src",imageUrl.url);
        });
    };
});

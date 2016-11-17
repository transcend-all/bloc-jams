var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        {title: 'Blue', duration: '4:26'},
        {title: 'Green', duration: '3:14'},
        {title: 'Red' , duration: '5:01'},
        {title: 'Pink' , duration: '3:21'},
        {title: 'Magenta' , duration: '2:15'},
    ]
};

var albumMarconi = {
    title: 'The Telephone',
    artist: 'Gugliermo Marconi',
    label: 'EM',
    year: '1989',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        {title: 'Hello, Operator?', duration: '1:01'},
        {title: 'Ring, ring, ring', duration: '5:01'},
        {title: 'Fits in your pocket' , duration: '3:21'},
        {title: 'Can you hear me now?' , duration: '3:14'},
        {title: 'Wrong phone number' , duration: '2:15'},
    ]
};

var albumEinstein = {
    title: 'Relativity',
    artist: 'Albert Einstein',
    label: 'Physics',
    year: '1915',
    albumArtUrl: 'assets/images/album_covers/19.png',
    songs: [
        {title: 'Geometry', duration: '1:21'},
        {title: 'Tensors', duration: '3:54'},
        {title: 'Calculus' , duration: '4:15'},
        {title: 'Quasar' , duration: '1:15'},
        {title: 'Black Hole' , duration: 'Infinity'},
    ]
};


var createSongRow = function(songNumber, songName, songLength){
    var template = 
        '<tr class="album-view-song-item">' 
         + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        +' <td class="song-item-title">' + songName + '</td>'
        +' <td class="song-item-duration">' + songLength + '</td>'
        + '</tr>'
    ;
    return template;
    
};

var setCurrentAlbum = function(album){
    //#1
    var albumTitle = document.getElementsByClassName('album-view-title')[0];
    var albumArtist = document.getElementsByClassName('album-view-artist')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
    //#2
    albumTitle.firstChild.nodeValue = album.title;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);
    //#3
    albumSongList.innerHTML = '';
    //#4
    for (var i=0;i<album.songs.length;i++){
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    }
};

 var songListContainer = document.getElementsByClassName('album-view-song-list')[0];

 var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

var switchAlbum = 0;

var switcheroo = function(){
    if (switchAlbum == 1){
    setCurrentAlbum(albumMarconi);
    switchAlbum = 2;
    } else if (switchAlbum == 2){
        setCurrentAlbum(albumEinstein);
        switchAlbum = 3;
    } else if(switchAlbum == 3){
        setCurrentAlbum(albumPicasso);
        switchAlbum = 1;
    }
}

document.getElementById('albumSwitch').addEventListener('click', switcheroo);

window.onload = function(){
    setCurrentAlbum(albumPicasso);
    switchAlbum = 1;
  
    songListContainer.addEventListener('mouseover', function(event) {
        if (event.target.parentElement.className === 'album-view-song-item') {
             event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
         }
     });
    
    
    
    
    
    
    for (var i = 0; i < songRows.length; i++) { songRows[i].addEventListener('mouseleave', function(event) {
             this.children[0].innerHTML = this.children[0].getAttribute('data-song-number');
         });
     }
}


document.querySelector('.column half').innerHTML("FUCK!!!!");













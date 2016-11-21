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
    var $row = $(template);
    
    var clickHandler = function(){
        var songNumber = $(this).attr('data-song-number');
        
        if (currentlyPlayingSong !== null){
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
           currentlyPlayingCell.html(currentlyPlayingSong);
        }
        
        if(currentlyPlayingSong !== songNumber){
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSong = songNumber;
        } else if(currentlyPlayingSong === songNumber) {
            $(this).html(playButtonTemplate);
            currentlyPlayingSong = null;
        }
            
    }
    
    var onHover = function(event){
        var songNumberCell = 
            $(this).find('song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');
        
        if (songNumber !== currentlyPlayingSong){  songNumberCell.html(playButtonTemplate);
        }
    }
    
    var offHover = function(event){
        var songNumberCell = $(this).find('song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');
        
        if(songNumber !== currentlyPlayingSong){
            songNumberCell.html(songNumber);
        }
    }
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
    
};

var setCurrentAlbum = function(album){
    //#1
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    //#2
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    //#3
    $albumSongList.empty();
    //#4
    for (var i=0;i<album.songs.length;i++){
        var $newRow = createSongRow(i+1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentlyPlayingSong = null;

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



$(document).ready(function(){
    setCurrentAlbum(albumPicasso);
});














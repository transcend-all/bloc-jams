var setSong = function(songNumber){
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
}

var getSongNumberCell = function(number){
    return $('.song-item-number[data-song-number="' + number + '"]');
}

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
        var songNumber = parseInt($(this).attr('data-song-number'));
        
        if (currentlyPlayingSongNumber !== null){
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
           currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        
        if(currentlyPlayingSongNumber !== songNumber){
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            setSong(currentAlbum.songs[songNumber - 1]);
            updatePlayerBarSong();
        } else if(currentlyPlayingSongNumber === songNumber) {
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            setSong(null);
        }
            
    }
    
    
    
    
    var onHover = function(event){
        var songNumberCell = 
            $(this).find('song-item-number');
        
        var songNumber = songNumberCell.attr('data-song-number');
        console.log(songNumber);
        
        if (songNumber !== currentlyPlayingSongNumber){  $(songNumberCell).html('playButtonTemplate');
        }
    }
    
    var offHover = function(event){
        var songNumberCell = parseInt($(this).find('song-item-number'));
        var songNumber = parseInt($(songNumberCell).attr('data-song-number'));
        
        if(songNumber !== currentlyPlayingSongNumber){
            $(songNumberCell).html(songNumber);
        }
        
        //console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
    }
    
    
    
    $row.find('.song-item-number').click(clickHandler);
    
    $row.hover(onHover, offHover);
    return $row;
    
};

var setCurrentAlbum = function(album){
    //#1
    currentAlbum = album;
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

var trackIndex = function(album, song){
    return album.songs.indexOf(song);
}

var nextSong = function(){
    var getLastSongNumber = function(index){
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    
    currentSongIndex++;
    
    if(currentSongIndex >= currentAlbum.songs.length){
        currentSongIndex = 0;
    }
    
    //set the current song
    setSong(currentSongIndex + 1);
    setSong(currentAlbum.songs[currentSongIndex]);
    
    //player bar
    $('.currently-playing .song-name').text(currentAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = parseInt(getLastSongNumber(currentSongIndex));
    var $nextSongNumberCell = parseInt(getSongNumberCell(currentlyPlayingSongNumber));
    var $lastSongNumberCell = parseInt(getSongNumberCell(lastSongNumber));
    
    $($nextSongNumberCell).html(pauseButtonTemplate);
    $($lastSongNumberCell).html(lastSongNumber);
}

var previousSong = function(){
    var getLastSongNumber = function(index){
        return index == (currentAlbum.songs.length - 1) ? 1 : index +2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    
    currentSongIndex--;
    
    if(currentSongIndex < 0){
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    //set the current song
    setSong(currentSongIndex + 1);
    setSong(currentAlbum.songs[currentSongIndex]);
    
    //player bar
    $('.currently-playing .song-name').text(currentAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = parseInt(getLastSongNumber(currentSongIndex));
    var $previousSongNumberCell = parseInt(getSongNumberCell(currentlyPlayingSongNumber));
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $($previousSongNumberCell).html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
}

var updatePlayerBarSong = function(){
    $('.currently-playing .song-name').text(currentAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentAlbum.title + " - " + currentAlbum.artist);
    
    $('.main-controls .play-pause').html(playerBarPauseButton);
}





var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

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
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    
});














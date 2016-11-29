var setSong = function(songNumber){
    if(currentSoundFile){
        currentSoundFile.stop();
    }
     currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: ['mp3'],
        preload: true
    });
    
    
    
    setVolume(currentVolume);
};

//uses the Buzz setTime() method to change the position in the song to a certain time
    var seek = function(time){
        if(currentSoundFile){
            currentSoundFile.setTime(time);
        }
    };

var setVolume = function(volume){
    if(currentSoundFile){
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function(number){
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength){
    var template = 
        '<tr class="album-view-song-item">' 
         + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        +' <td class="song-item-title">' + songName + '</td>'
        +' <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
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
        setSong(songNumber);    
          currentSoundFile.play();
            updateSeekBarWhileSongPlays();
          
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});
            
            
            $(this).html(pauseButtonTemplate);
            
//            setSong(currentAlbum.songs[songNumber - 1]);
            updatePlayerBarSong();
        } else if(currentlyPlayingSongNumber === songNumber) {
          if(currentSoundFile.isPaused())  $(this).html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButton);
            currentSoundFile.play();
        } else{
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentoundFile.pause();
        };
            
    };
    
    
    
    
    var onHover = function(event){
        var songNumberCell = $(this).find('.song-item-number');
        
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if (songNumber !== currentlyPlayingSongNumber){  songNumberCell.html(playButtonTemplate);
        }
    }
    
    var offHover = function(event){
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if(songNumber !== currentlyPlayingSongNumber){
            songNumberCell.html(songNumber);
        };
        
        //console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
    };
    
    
    
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

var setCurrentTimeInPlayerBar = function(currentTime){
    $('.current-time').text(filterTimeCode(currentTime));
};

var setTotalTimeInPlayerBar = function(totalTime){
    $('.current-time').text(filterTimeCode(totalTime));
};

var filterTimeCode = function(timeInSeconds){
    timeInSeconds = parseFloat(timeInSeconds);
    wholeMins = Math.floor(timeInSeconds / 60);
    wholeSecs = Math.floor(timeInSeconds % 60);
    if(wholeSecs < 10){
        wholeSecs = "0" + wholeSecs;
    }
    return wholeMins + ":" + wholeSecs;
}

var updateSeekBarWhileSongPlays = function(){
    if(currentSoundFile){
      
    //bind the Buzz event timeupdate (updates the elapsed time of the song) to currentSoundFile    
        currentSoundFile.bind('timeupdate', function(event){
            
            //take Buzz's getTime() method to get the time and the getDuration() method to get the total length of the song, in seconds, then send that information through updateSeekPercentage()
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
            setCurrentTimeInPlayerBar(currentSoundFile.getTime())
        });
    }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio){
    var offsetXPercent = seekBarFillRatio * 100;
    //determine that the seek bar is between 0 and 100
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    
    //convert the seek bar values to percentages for CSS
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left:percentageString});
};

var setupSeekBars = function(){
    var $seekBars = $('.player-bar .seek-bar');
    
    //pageX is an event object that holds the horizontal coordinate
    $seekBars.click(function(event){
        var offsetX = event.pageX - $(this).offset().left;
        
        var barWidth = $(this).width();
        
        //divide the offset by the width of the bar
        var seekBarFillRatio = offsetX / barWidth;
        
        if($(this).parent().attr('class') == 'seek-control'){
            seek(seekBarFillRatio*currentSoundFile.getDuration());
        }else{
            setVolume(seekBarFillRatio*100);
        };
        
        //pass $this as the $seekBar argument and seekBarFillRatio as the seekBarFillRatio argument in updateSeekPercentage
        updateSeekPercentage($(this), seekBarFillRatio);
        
        
    });
    
    
    $seekBars.find('.thumb').mousedown(function(event){
        
        //takes the context of the event and wraps it in jQuery
        var $seekBar = $(this).parent();
        
      //attach movement of the mouse to movement of the seek bar. bind acts similarly to onclick.
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX/barWidth;
            
            if($(this).parent().attr('class') == 'seek-control'){
            seek(seekBarFillRatio*currentSoundFile.getDuration());
        }else{
            setVolume(seekBarFillRatio*100);
        };
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
        
        //tells the page to stop moving the bar when the mouse button is released. Removes previous event listeners.
        $(document).bind('mouseup.thumb', function(){
           $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
        
    });
    
    
    
};

var trackIndex = function(album, song){
    return album.songs.indexOf(song);
};

var nextSong = function(){
    var getLastSongNumber = function(index){
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    
    currentSongIndex++;
    
    if(currentSongIndex >= currentAlbum.songs.length){
        currentSongIndex = 0;
    };
    
    //set the current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    
    //player bar
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function(){
    var getLastSongNumber = function(index){
        return index == (currentAlbum.songs.length - 1) ? 1 : index +2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    
    currentSongIndex--;
    
    if(currentSongIndex < 0){
        currentSongIndex = currentAlbum.songs.length - 1;
    };
    
    //set the current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    
    //player bar
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var updatePlayerBarSong = function(){
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    
    $('.main-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
};







var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPause = $('.main-controls .play-pause');

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
    };
};


document.getElementById('albumSwitch').addEventListener('click', switcheroo);

var togglePlayFromPlayerBar = function(){
    
    if(currentSoundFile){
        if(currentSoundFile.isPaused()){
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
            currentlyPlayingCell.html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButton);
            currentSoundFile.play();
        }else{
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentSoundFile.pause();
        };
    };
};



$(document).ready(function(){
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playPause.click(togglePlayFromPlayerBar);
    
});














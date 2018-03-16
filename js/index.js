$(function(){
	var video = $('#video');

	//显示或隐藏标题栏和控制栏
	function showTitleAndController(flag){
		if(flag){
			$('.vContainer').find('.caption').stop().animate({'top':0},500);
			$('.vContainer').find('.controller').stop().animate({'bottom':0},500);
		}else{
			$('.vContainer').find('.caption').stop().animate({'top':'-50px'},500);
			$('.vContainer').find('.controller').stop().animate({'bottom':'-50px'},500);
		}
	}

	//second -> 00:00
	function timeFormat(time){
		var minute = Math.floor(time / 60);
		var second = Math.floor(time % 60);
		if (minute < 10) {
			minute = "0" + minute;
		}
		if (second < 10) {
			second = "0" + second;
		}
		return minute + ":" + second;
	}

	//播放或暂停
	function playOrPause(){
		if(video[0].paused || video[0].ended){
			video[0].play();
			$('#play').removeClass('play').addClass('pause');
		}else{
			video[0].pause();
			$('#play').removeClass('pause').addClass('play');
		}
	}

	//静音切换
	function soundOrMute(){
		var sound = $('#sound');
		if(video[0].muted){
			video[0].muted = false;
			sound.removeClass('mute').addClass('sound');
			$('#volumeBar').css({
				'width' : video[0].volume * 100 + '%'
			});
		}else{
			video[0].muted = true;
			sound.removeClass('sound').addClass('mute');
			$('#volumeBar').css({
				'width' : 0
			});
		}
	}

	//设置播放速率
	function setSpeed(speed){
		if(speed == 1){
			$('#speed1').addClass('active');
			$('#speed3').removeClass('active');
		}else{
			$('#speed3').addClass('active');
			$('#speed1').removeClass('active');
		}
		video[0].playbackRate = speed;
	}

	//播放进度拖拽
	function enableProgressDrag(){
		var progressDrag = false;
		$('#progress').on('mousedown',function(e){
			progressDrag = true;
			updateProgress(e.pageX);
		});
		$(document).on('mousemove',function(e){
			if(progressDrag){
				updateProgress(e.pageX);
			}
			
		});
		$(document).on('mouseup',function(e){
			if(progressDrag){
				progressDrag = false;
				updateProgress(e.pageX);
			}
		});
	}

	//更新播放进度
	function updateProgress(x){
		var progress = $('#progress');
		var percent = ((x - progress.offset().left) / progress.width()) * 100;
		if(percent < 0){
			percent = 0;
		}
		if(percent > 100){
			percent = 100;
		}
		$('#timeBar').css({
			'width' : percent + '%'
		});
		var duration = video[0].duration;
		var currentTime = duration * (percent / 100);
		video[0].currentTime = currentTime;
	}

	//声音大小拖拽
	function enableVolumeDrag(){
		var volumeDrag = false;
		$('#volume').on('mousedown',function(e){
			volumeDrag = true;
			updateVolume(e.pageX);
			$('#sound').removeClass('mute').addClass('sound');
			video[0].muted = false;
		});
		$(document).on('mousemove',function(e){
			if(volumeDrag){
				updateVolume(e.pageX);
			}
			
		});
		$(document).on('mouseup',function(e){
			if(volumeDrag){
				volumeDrag = false;
				updateVolume(e.pageX);
			}
		});
	}

	//更新声音大小
	function updateVolume(x,vol){
		var volume = $('#volume');
		var percent;
		if(vol){
			percent = vol * 100;
		}else{
			percent = ((x - volume.offset().left) / volume.width()) * 100;
			if(percent < 0){
				percent = 0;
			}
			if(percent > 100){
				percent = 100;
			}
		}
		$('#volumeBar').css({
			'width' : percent + '%'
		});
		video[0].volume = percent / 100;
	}

	//鼠标进出事件
	$('.vContainer').hover(function(){
		showTitleAndController(true);
	},function(){
		showTitleAndController(false);
	});

	//加载完视频元数据后
	video.on('loadedmetadata',function(){
		//隐藏标题栏和控制栏
		showTitleAndController(false);
		//加载总时长
		$('#duration').html(timeFormat(video[0].duration));
		//设置当前播放时间
		$('#currentTime').html(timeFormat(0));
		//设置播放按钮
		$('#play').on('click',function(){
			playOrPause();
		});
		//设置停止按钮
		$('#stop').on('click',function(){
			video[0].pause();
			$('#play').removeClass('pause').addClass('play');
			updateProgress($('#progress').offset().left);
		});
		//设置播放速率按钮
		$('#speed1').on('click',function(){
			setSpeed(1);
		});
		$('#speed3').on('click',function(){
			setSpeed(3);
		});
		//设置进度条拖拽
		enableProgressDrag();
		//设置声音拖拽
		enableVolumeDrag();
		//初始化声音大小
		updateVolume(null,0.7);
		//设置静音按钮
		$('#sound').on('click',function(){
			soundOrMute();
		});
	});

	//当视频可以播放后
	video.on('canplay',function(){
		//隐藏缓冲GIF
		$('#loading').hide(100);
	});

	//实时更新播放进度
	//缓冲定时器
	var loadingTimer = null;
	video.on('timeupdate',function(){
		var currentTime = video[0].currentTime;
		var duration = video[0].duration;
		var percent = (currentTime / duration) * 100;
		$('#timeBar').css({
			'width' : percent + '%'
		});
		$('#currentTime').html(timeFormat(currentTime));

		$('#loading').hide(100);
		clearTimeout(loadingTimer);
		loadingTimer = setTimeout(function(){
			if(!video[0].paused && !video[0].ended){
				$('#loading').show(100);
			}	
		},500);
	});

	//视频播放结束
	video.on('ended',function(){
		$('#play').removeClass('pause').addClass('play');
		video[0].currentTime = 0;
	});
});
app.controller('songsController', ['$scope', '$resource', 
function($scope, $resource){


		var Song = $resource('/api/songs/');
		var mainsong=[];

		function shuffle(o){ //v1.0
    		//for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    		return o;
			};

		Song.query(function(results){
			$scope.songs = shuffle(results);
		})

		angular.element(document).ready(function(){
		var loopstart;
		var pauseaudio;
		var nexttime;
		var mainsong=[];
		var loopsong=[];

		var audio;
		var audio2;
		var audio3;
		
		var effectheat= new Audio(['assets/effects/heat2.mp3']);
		effectheat.volume=0.7;
		var timeouts= [];
		var playingSong=-1;
		var playtype;
		var pausetime;
		var routesong;
		var interval1;
		var interval2;
		var intervals=[];
		var offsetplay;
		var volume=1;
		var output=$scope.songs;

		$scope.startAt= function(){
			for(var i=0;i<timeouts.length;i++)
				{clearTimeout(timeouts[i]);}
			for(var i=0;i<intervals.length;i++){
				clearInterval(intervals[i]);
				intervals.shift();
			}
			stopplaying(mainsong.length);
			stoploops(loopsong.length);
			console.log($("#seekbar").val());
			var starthere=($("#seekbar").val()/1000)*($scope.songs[playingSong]['endsongafterbeat']/1000);
			var startit = Math.floor(starthere)
			console.log(startit);
			console.log(playingSong);
			StartSong(playingSong, startit);
			playingSong-=1
		}

		$scope.clicksong=function(id){
			for(var i=0;i<timeouts.length;i++)
				{clearTimeout(timeouts[i]);}
			for(var i=0;i<intervals.length;i++){
				clearInterval(intervals[i]);
				intervals.shift();
			}
			stopplaying(mainsong.length);
			stoploops(loopsong.length);
			playingSong=id-1;
			StartSong(id-1,0);
		}

		$scope.changevol=function()
			{
				volume=($scope.volumeChange)/100;
				for(var song=0;song<mainsong.length;song++)
				{
					mainsong[song].volume=($scope.volumeChange)/100;
				}

				for(var song=0;song<loopsong.length;song++)
				{
					if(!loopsong[song].paused && loopsong[song].paused!='undefined'){
						loopsong[song].pause();
						loopsong[song].volume=(($scope.volumeChange/100)*0.6);
						loopsong[song].play();
					}
					else{
						loopsong[song].pause();
						loopsong[song].volume=(($scope.volumeChange/100)*0.6);
						

					}
				}
			}

		$(document).on('click',"#next",function()
		{	
			for(var i=0;i<timeouts.length;i++)
				{clearTimeout(timeouts[i]);}
			for(var i=0;i<intervals.length;i++){
				clearInterval(intervals[i]);
				intervals.shift();
			}
			clearInterval(interval1);
			stopplaying(mainsong.length);
			stoploops(loopsong.length);
			playingSong=playingSong+1;
			StartSong(playingSong+1,0);});

		$(document).on('click',"#previous",function()
		{	
			for(var i=0;i<timeouts.length;i++)
				{clearTimeout(timeouts[i]);}
			for(var i=0;i<intervals.length;i++){
			clearInterval(intervals[i]);}
			clearInterval(interval1);
			stopplaying(mainsong.length);
			stoploops(loopsong.length);

			if(currentSong!=0){playingSong=playingSong-1; StartSong(playingSong,0,routesong);}
			else if(playingSong===0){StartSong(0,0,routesong)}
		});

		$(document).on('click',"#pause",function()
		{	
			for(var i=0;i<timeouts.length;i++)
				{clearTimeout(timeouts[i]);}
			for(var i=0;i<intervals.length;i++){
			clearInterval(intervals[i]);}
			clearInterval(interval1);
			stopplaying(mainsong.length);
			stoploops(loopsong.length);
			pausetime=mainsong[mainsong.length-1].currentTime;
		});

		$(document).on('click',"#stop",function()
		{	
			for(var i=0;i<timeouts.length;i++)
				{clearTimeout(timeouts[i]);}
			for(var i=0;i<intervals.length;i++){
			clearInterval(intervals[i]);}
			clearInterval(interval1);
			stopplaying(mainsong.length);
			stoploops(loopsong.length);
			pausetime=0;playingSong=0;
		});

		$(document).on('click',"#play",function()
		{
			StartSong(playingSong,pausetime,routesong);
			pausetime=0;
		});
		$("#volumebar").val(volume*100);
		$(document).ready(function(){StartSong(0,0);})

function StartSong(i,time){
		{
		changeseek();
		playtype="start";
		currentSong=i;
		playingSong+=1
		var songindex=mainsong.length;
		mainsong.push(new Audio($scope.songs[i]['url']));
		mainsong[songindex].currentTime=time;
		mainsong[songindex].volume=volume;
		mainsong[songindex].play();
		unselectAll(output);
		console.log(output[currentSong]);
		var id= output[i]['ID'];
		var element=document.getElementById(output[currentSong]['songname']);
		element.setAttribute("class","selected");
		$("#songname").fadeOut(500,function(){
				$("#songname").html(output[i]['songname']).fadeIn(500)});
				$("#artist").fadeOut(500, function(){
				$("#artist").html(output[i]['artist']).fadeIn(500)});
		if(output[currentSong+1]){var rate= output[currentSong]['bpm']/output[currentSong+1]['bpm'];
		
		if(rate<1.20 && rate>0.80){
		playLoop(mainsong[songindex],parseInt(output[currentSong]['endsongshort']),parseInt(output[currentSong]['endsongafterbeat']),currentSong+1,output,'loop');}
	}
		stopCurrent(mainsong[songindex],parseInt(output[currentSong]['endsongafterbeat']),currentSong,output);
		
	;;}}
	


function unselectAll(output){
	for (var everysong=0;everysong<output.length;everysong++)
	{
		var element=document.getElementById(output[everysong]['songname']);
		element.setAttribute("class","notselected");
	}
}

function changeseek(){
	setInterval(function(){
		var seektime= parseInt((mainsong[mainsong.length-1].currentTime));
		seektime1=seektime/parseInt(($scope.songs[playingSong]['endsongafterbeat'])/1000);
		seektime2=parseInt(seektime1*1000);
		$("#seekbar").val(seektime2);
	},1000)
}

function stopplaying(numsongs)
{
	for(var song=0;song<numsongs;song++)
	{
		mainsong[song].pause();
	}
}

function stoploops(numloops)
{
	for(var song=0;song<numloops;song++)
	{
		loopsong[song].pause();
	}
}


function playLoop(audiovar,time,endtime,i,output,type){
	var ran=1;
	var stopinterval=1;
	var rate= output[i-1]['bpm']/output[i]['bpm'];
		var loopindex=loopsong.length;
		loopsong.push(new Audio(output[i]['loop']));
		loopsong[loopindex].playbackRate=rate;
	inverval1=setInterval(function(){

		var num=audiovar.currentTime; 
		num=num*1000;
		num=Math.floor(num);
		
		if(num>(time-2000) && num<time && ran===1){
			console.log(num, time-1000);
			ran="yes";
			setTimeout(function(){
			loopsong[loopindex].volume=volume*0.6;
			loopsong[loopindex].play();
			console.log(num-time);
			stopinterval="yes";	
			}, Math.abs(num-time+100) )}
		else if(num>time && ran===1){
			ran="yes";
			loopsong[loopindex].currentTime=(num-time)/1000;
			loopsong[loopindex].playbackRate=rate;
			loopsong[loopindex].volume=volume*0.6;
			loopsong[loopindex].play();
			stopinterval="yes";
			}}
	
		,16)
}

function stopCurrent(audiovar,endtime,currentSong,output){
	var stopinterval2=1;
	var ran=1;
	var ran2=1;
	var ran3=1;
	var ran4=1;
	var songchange=0;

	intervals.push(setInterval(function(){
		var num=audiovar.currentTime; 
		num=num*1000;
		num=Math.floor(num);
		
		if(songchange===0){currentSong+=1;
		console.log(currentSong);
		songchange="done";}
		if(output[currentSong]){	var rate= output[currentSong-1]['bpm']/output[currentSong]['bpm']};
		if(output[currentSong] && num>endtime-(parseInt(output[currentSong]['beginoffset'])/rate)-100  && ran2===1){
			offsetplay.pause();
			offsetplay.volume=volume;
			offsetplay.currentTime=(((parseInt(output[currentSong]['startsong1']))-(parseInt(output[currentSong]['beginoffset']))))/1000; 
			offsetplay.play();
			stoploops(loopsong.length);
			ran2="yes";
		}
		
		if(num>endtime-5889 && ran3===1)
		{
			effectheat.play();
			ran3="yes";
			offsetplay = new Audio(output[currentSong]['url']);
			var rate= output[currentSong-1]['bpm']/output[currentSong]['bpm'];
			offsetplay.playbackRate=rate;
			offsetplay.volume=0;
			offsetplay.play();
		}

		if(num>endtime-600 && ran4===1){
			StartSong(currentSong,(	output[currentSong]['startsong1'])/1000);
			ran4="yes"
			}
		if(num>endtime-10 && ran===1){
			for(var z=0;z<intervals.length;z++){
			clearInterval(intervals[z]);
			intervals.shift();
			}
			offsetplay.pause();
			clearInterval(interval1);
			ran="yes";
			stopplaying(mainsong.length-1);
			stopinterval="yes";

			}
		},16))
}
			
})
;
}
])

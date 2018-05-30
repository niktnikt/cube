var timer = {
	interval: null,
	minutes: 0,
	seconds: 0,
	startStopTimer: function(){
		if(this.interval === null){ //if there is no interval yet start timer
			document.getElementById('startStopButton').textContent = 'Stop';
			this.minutes = 0;
			this.seconds = 0;
			var min = this.minutes.toString();
			var sec = this.seconds.toString();
			var displayPlace = document.getElementById('displayTime');
			displayPlace.innerHTML = min + ':' + sec; //everytime the timer is restarted the coutup will start from 0
			this.interval = setInterval(function(){
				if(timer.seconds < 59){
					timer.seconds++;
					var min = timer.minutes.toString();
					var sec = timer.seconds.toString();
					displayPlace.innerHTML = min + ':' + sec;
				}else{
					timer.minutes++;
					timer.seconds = 0;
					var min = timer.minutes.toString();
					var sec = timer.seconds.toString();
					displayPlace.innerHTML = min + ':' + sec;
				}
			}, 1000);
		}else{ //if interval was set stop timer
			clearInterval(this.interval);
			var currentTime = document.getElementById('displayTime').textContent;
			this.interval = null; //set interval to null so that timer will be started on next click
			document.getElementById('startStopButton').textContent = 'Start';
			//Jquery for ajax
			$(document).ready(function(){
				$.ajax({
					type: 'POST',
					url: '/',
					data: {
						time: currentTime,
						sec: timer.seconds,
						min: timer.minutes
					},
					success: function(data){
          			//do something with the data via front-end framework
          			location.reload();
          			}
          		});
			})
		}
	},
	clearTimes: function(){
		this.solves = [];
		$(document).ready(function(){
			$.ajax({
				type: 'DELETE',
				url: '/',
				success: function(data){
	          			//do something with the data via front-end framework
	          			location.reload();
	          		}
	          	})
		})
	},
}

var scramble = {
	notation: [
	{letter: 'U', class: 'up'},
	{letter: "U'", class: 'up'},
	{letter: "U2", class: 'up'},
	{letter: 'D', class: 'down'},
	{letter: "D'", class: 'down'},
	{letter: "D2", class: 'down'},
	{letter: 'F2', class: 'front'},
	{letter: "F", class: 'front'},
	{letter: "F'", class: 'front'},
	{letter: "B", class: 'back'},
	{letter: "B'", class: 'back'},
	{letter: "B2", class: 'back'}
	],
	scrambledArray: [],
	randomArray: function(){
		randomArray = [];
		for (var i = 0; i < 25; i++){ //25 is the scramble length
			var random = Math.floor(Math.random() * this.notation.length);
			randomArray.push(random);
		}
		return randomArray;
	},
	oneRandomNumber: function(){
		randomNumber = Math.floor(Math.random() * this.notation.length);
		return randomNumber
	},
	generateScramble: function(){
		this.scrambledArray = [];
		var random = this.randomArray();
		for (var i = 0; i < random.length; i++){
			if (i === 0){
				this.scrambledArray.push(this.notation[random[i]].letter);
			}else{
				if(this.notation[random[i - 1]].class === this.notation[random[i]].class){
					random.push(this.oneRandomNumber());
				}else{
					this.scrambledArray.push(this.notation[random[i]].letter)
				}
			}
		}
	}
}

var view = {
	displayScramble: function(){
		scramble.generateScramble();
		var displayPlace = document.getElementById('displayScramble');
		var result = scramble.scrambledArray.join(' ');
		displayPlace.innerHTML = result;
	},
	setUpDeleteEventListeners: function(){
		var list = document.getElementById('solves');
		list.addEventListener('click', function(event){ //event delegation
			// the event is always passed but if we want to have access to it we have to give it as an argument
			var elementClicked = event.target;
			var id = elementClicked.id;
			$(document).ready(function(){
				$.ajax({
					type: 'DELETE',
					url: '/' + id,
					success: function(data){
	          			//do something with the data via front-end framework
	          			location.reload();
	          		}
	          	})
			})
		})
	}, 
}
view.displayScramble();
view.setUpDeleteEventListeners();


var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var mongoose = require('mongoose');

mongoose.connect('mongodb://admin:admin@ds237610.mlab.com:37610/times');

//creste a schema for database - this is like a blue print for our data
var timeSchema = new mongoose.Schema({
	time: String,
	sec: Number,
	min: Number
});

//create model so we can kind of edit this schema, 
//first parameter is name of collection and the second one the name of the schema we want to use
var Time = mongoose.model('Time', timeSchema);

// crete an array of total seconds in each time - used for Ao5, Ao12, best and worst
function sumOfSeconds(){
	return new Promise(function(resolve, reject){
		Time.find({}, function(err, data){
			if(err) throw err;
			var sumOfSolves = [];
			for(var i = 0; i < data.length; i++){
				sum = data[i].min * 60 + data[i].sec;
				sumOfSolves.push(sum);
			}
			resolve(sumOfSolves)
		})

	})
}


function best(){
	return new Promise(function(resolve, reject){
		sumOfSeconds().then(function(result){
			var best = Math.min(...result);
			var position = result.indexOf(best);
			Time.find({}, function(err, data){
				if(err) throw err;
				if(data.length === 0){
					var bestTime = '-';
				}else{
					var bestTime = data[position].time;
				}
				resolve(bestTime);
			})
		})
	})
}
function worst(){
	return new Promise(function(resolve, reject){
		sumOfSeconds().then(function(result){
			var worst = Math.max(...result);
			var position = result.indexOf(worst);
			Time.find({}, function(err, data){
				if(err) throw err;
				if(data.length === 0){
					var worstTime = '-';
				}else{
					var worstTime = data[position].time;
				}
				resolve(worstTime);
			})
		})
	})
}
function Ao5(){
	return new Promise(function(resolve, reject){
		sumOfSeconds().then(function(result){
		var length = result.length - 1;
		var sum = 0;
		for(var i = 0; i < 5; i++){
			sum = sum + result[length - i];
		}
		var Ao5 = sum / 5;
		var min = Math.floor(Ao5 / 60);
		var sec = Ao5 % 60;
		var minString = min.toString();
		var secString = sec.toString();
		if(result.length > 4){
			var Ao5Displayed = minString + ':' + secString;
		}else{
			var Ao5Displayed = '-'
		}
		resolve(Ao5Displayed);
		})
	})
}
function Ao12(){
	return new Promise(function(resolve, reject){
		sumOfSeconds().then(function(result){
		var length = result.length - 1;
		var sum = 0;
		for(var i = 0; i < 12; i++){
			sum = sum + result[length - i];
		}
		var Ao12 = sum / 12;
		var min = Math.floor(Ao12 / 60);
		var sec = Ao12 % 60;
		var minString = min.toString();
		var secString = sec.toString();
		if(result.length > 11){
			var Ao12Displayed = minString + ':' + secString;
		}else{
			var Ao12Displayed = '-'
		}
		resolve(Ao12Displayed);
		})
	})
}

module.exports = function(app){
	app.get('/', function(req, res){
		best().then(function(result){
			var timeBest = result;
			worst().then(function(result1){
				var timeWorst = result1;
				Ao5().then(function(result2){
					var Average5 = result2;
					Ao12().then(function(result3){
						var Average12 = result3;
						Time.find({}, function(err, data){
							if(err) throw err;
							res.render('index', {times: data, bestSolve: timeBest, worstSolve: timeWorst, AverageOf5: Average5, AverageOf12: Average12});
						})
					})
				})

			})
		});
	});
	app.post('/', urlencodedParser, function(req, res){
		Time(req.body).save(function(err, data){
			if(err) throw err;
			res.json(data);
		})

	});
	app.delete('/:id', function(req, res){
		Time.find({}, function(err, data){
			if(err) throw err;
			var deleteItem = data[req.params.id]
			deleteItem.remove(function(err, data){
				if(err) throw err;
				res.json(data)
			})
		})

	});
	app.delete('/', function(req, res){
		Time.remove({}, function(err, data){
			if(err) throw err;
			res.json(data);
		})
	})
}
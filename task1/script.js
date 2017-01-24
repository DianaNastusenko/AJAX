var currDate;
var currDateTime;

var getCoordinates =function(){
  var deffered = $.Deferred();
  var url = 'https://api.darksky.net/forecast/6a3aba3ad081c6168090c7305525e0c9/';
  
  navigator.geolocation.getCurrentPosition(function(position){
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    url+=latitude + ',' + longitude;
    deffered.resolve(url);
  });
  return deffered.promise();
}

getCoordinates().then(function(data) {
  $.ajax({
    url: data,
    dataType: 'jsonp'
  }).done(function(data) {
    currDate = new Date();
    getLocation(data);
    getTemp(data);
    var weather = setWeather(data);
    setImage(weather);
    setDate(data);
    startTime();
  })
});

function getLocation(data) {
  var location = data.timezone; 
  $('h1').text(data.timezone); 
}

function getTemp(data){
  var tempF = data.currently.temperature;
  var tempC = Math.round((tempF - 32) * 5/9); 
  $('h2').text(tempC); //add temp
}

function setWeather(data) {
  var type = data.currently.icon;
  $('h3').text(type);
  return type;
}

function setImage(wether){

  document.body.style.background = 'url(http://loremflickr.com/1280/1024/'+wether+') no-repeat center top';
  document.body.style.backgroundSize = "cover";
}


function setDate(data) {
  var date = new Date(data.currently.time * 1000);
  $('.day').text(date.getDate());
  
  var monthArr=['Junuary', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var month = date.getMonth();
  $('.month').text('' + monthArr[month]);
  
  $('.year').text(date.getFullYear());
}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('txt').innerHTML =
    h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};
    return i;
}


//previous button
$('#previous').click(function () {
  document.getElementById("next").classList.remove('disabled');
  var prevDay = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate() - 1);
  var prevDayTime = prevDay.getTime() / 1000;
  currDateTime = prevDayTime;
  currDate = new Date(currDateTime * 1000);
  
  getCoordinates().then(function (data) {
    $.ajax({
      url: data + ',' + currDateTime,
      dataType: 'jsonp'
  }).done(function (data) {
      getLocation(data);
      getTemp(data);
      setWeather(data);
      setDate(data);
    })
  });
});

//next button
$('#next').click(function(data) {
  var nextDay = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate() + 1);
  
  var today = new Date();  
  if(nextDay>=today){
    alert('You can not watch the weather for tomorrow');
   document.getElementById("next").classList.add('disabled');
    return;
  }
  
  var nextDayTime = nextDay.getTime() / 1000;
  currDateTime = nextDayTime;
  currDate = new Date(currDateTime * 1000);

  
  
  getCoordinates().then(function(data) {
    $.ajax({
    url: data + ',' + currDateTime,
    dataType: 'jsonp'
    }).done(function(data) {
      getLocation(data);
      setDate(data);
      getTemp(data);
      setWeather(data);
    })
  });     
});
var page = 0;

function getEvents(page) {

  $('#events-panel').show();
  $('#attraction-panel').hide();

  if (page < 0) {
    page = 0;
    return;
  }
  if (page > 0) {
    if (page > getEvents.json.page.totalPages-1) {
      page=0;
      return;
    }
  }
  
  $.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/events.json?apikey=5QGCEXAsJowiCI4n1uAwMlCGAcSNAEmG&source=ticketmaster&startDateTime=2016-11-20T15:34:00Z&&page="+page,
    async:true,
    dataType: "json",
    success: function(json) {
          getEvents.json = json;
  			  showEvents(json);
  		   },
    error: function(xhr, status, err) {
  			  console.log(err);
  		   }
  });
}

function disp(json,item){
 
//console.log(json.name+" "+json.main.temp);
//item.children('.temp').text(output.name+" in  "+output.main.temp); 
}

function showEvents(json) {
  var items = $('#events .list-group-item');
  items.hide();
  var events = json._embedded.events;
  var item = items.first();
  for (var i=0;i<events.length;i++) {
    item.children('.list-group-item-heading').text(events[i].name);
    item.children('.list-group-item-text').text(events[i].dates.start.localDate);
    try {
      item.children('.venue').text(events[i]._embedded.venues[0].name + " in " + events[i]._embedded.venues[0].city.name);
      var input = "http://api.openweathermap.org/data/2.5/weather?q="+ events[i]._embedded.venues[0].city.name +"&APPID=41093a8b3392d7e12814e026e2f1f856";
      var json1; var json2;
      $.getJSON(input,function(json){
                // console.log(json.name+" "+json.main.temp); 
                  json1 = json.name;
                  json2 = json.main.temp;
                  item.children('.temp').text("Vahiniiiiiiiiiii");
                  return json;
                });
     
      //item.children('.venue').text(json1.name+" in  "+json1.main.temp); 
     $.ajax({
  url: input,
  async: false,
  dataType: 'json',
  success: function (json) {
    json1 = json.name;
    json2 = json.main.temp;
       }
       //item.children('.imagg').text(events[i].name);
    });

     console.log(json1+" "+parseInt(json2)-250+"K");  
     item.children('.temp').text(json1+" in  "+(parseInt(json2)-273)+"C"); 
    } catch (err) {
      console.log(err);
    }
    item.show();
    item.off("click");
    item.click(events[i], function(eventObject) {
      console.log(eventObject.data);
      try {
        getAttraction(eventObject.data._embedded.attractions[0].id);
      } catch (err) {
      console.log(err);
      }
    });
    item=item.next();
  }
}

$('#prev').click(function() {
  getEvents(--page);
});

$('#next').click(function() {
  getEvents(++page);
});

function getAttraction(id) {
  $.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/attractions/"+id+".json?apikey=5QGCEXAsJowiCI4n1uAwMlCGAcSNAEmG",
    async:true,
    dataType: "json",
    success: function(json) {
          showAttraction(json);
  		   },
    error: function(xhr, status, err) {
  			  console.log(err);
  		   }
  });
}

function showAttraction(json) {
  $('#events-panel').hide();
  $('#attraction-panel').show();
  
  $('#attraction-panel').click(function() {
    getEvents(page);
  });
  
  $('#attraction .list-group-item-heading').first().text(json.name);
  $('#attraction img').first().attr('src',json.images[0].url);
  $('#classification').text(json.classifications[0].segment.name + " - " + json.classifications[0].genre.name + " - " + json.classifications[0].subGenre.name);
}

getEvents(page);
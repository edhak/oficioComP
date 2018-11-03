var db = firebase.firestore();

db.settings({
  timestampsInSnapshots: true
});

var usuarios = [];

var oficioBuscado = 'profesor';

db.collection("users").where("oficio", "==", oficioBuscado)
  .get()
  .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
           //console.log(doc.id, " => ", doc.data());
          usuarios.push( {
            img : doc.data().img,
            nombre : doc.data().nombre,
            apellido : doc.data().apellido,
            dni : doc.data().dni,
            oficio : doc.data().oficio,
            coord : doc.data().coordenadas
          });
      });
  })
  .then(function(){
    console.log(usuarios.length);
    console.log(usuarios);
    initMap(usuarios);
  })
  .catch(function(error) {
      console.log("Error getting documents: ", error);
  });


//Posición Actual
navigator.geolocation.getCurrentPosition(fn_ok, fn_mal);

function fn_mal(){
  console.log("algo anda mal, no se obtine las localización");
}

var posicion_inicio;

function fn_ok(rta){
  posicion_inicio = {lat: rta.coords.latitude, lng:rta.coords.longitude}
  console.log(posicion_inicio);
}


function initMap(datos) {
  // var posicion = {lat: latitud, lng: longitud};
  // var bounds = new google.maps.LatLngBounds();
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: posicion_inicio
  });

  var marker = new google.maps.Marker({
    position: posicion_inicio,
    map: map,
    title: 'YO'
  });

  var infoWindowContent = [];
  var infoWindow = new google.maps.InfoWindow(),marker,i;

  for(i = 0; i< datos.length; i++){
      infoWindowContent.push('<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<img src="'+datos[i].img+'" style="width: 50px; height: 50px;">'+
        '<h1 id="firstHeading" class="firstHeading">'+datos[i].nombre+'</h1>'+
        '<div id="bodyContent">'+
        '<br/>'+
        'nombre:'+ datos[i].nombre+
        '<br/>'+
        'apellido:'+ datos[i].apellido+
        '<br/>'+
        'dni:'+ datos[i].dni+
        '<br/>'+
        'estrellas:'+ '2 estrellas'+
        '<p>'+
        '<a href="#">contactar</a>'+
        '</p>'+
        '</div>'+
        '</div>')
    }

    for(i = 0; i<datos.length; i++){
      var position = new google.maps.LatLng(
                    datos[i].coord.latitud,
                    datos[i].coord.longitud);
                  // console.log(datos[i].coord.latitud);
      // bounds.extend(position);
      marker = new google.maps.Marker({
        position: position,
        map: map,
        title: datos[i].nombre+ '=>'+ datos[i].oficio
      });

      //añadiendo información a nuetrp markador
      google.maps.event.addListener(marker,'click',(function(marker, i) {
        return function(){
          infoWindow.setContent(infoWindowContent[i]);
          infoWindow.open(map, marker);
        }
      }) (marker, i));
      // map.fitBounds(bounds)
    }
}

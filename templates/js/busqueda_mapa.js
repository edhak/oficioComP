var db = firebase.firestore();

db.settings({
  timestampsInSnapshots: true
});

var oficioBuscado = "profesor";
var idUserDoc;
var mapaInicial = map;
//usar el navegador para encontra la posició actual
navigator.geolocation.getCurrentPosition(fn_ok, fn_mal);

function fn_mal(){
  console.log("algo anda mal, no se obtine las localización");
}


usuarios = [];

function fn_ok(rta){
  var latitud = rta.coords.latitude;
  var longitud = rta.coords.longitude;
  console.log(latitud,longitud);
  // initMap(lat,lon);
  //=====================inicializamos el mapa
  var posicion = {lat: latitud, lng: longitud};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: posicion
  });
  //===========================finalizamos el mapa


  db.collection("users").where("oficio", "==", oficioBuscado)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            lat = doc.data().coordenadas.latitud;
            lon = doc.data().coordenadas.longitud;
            usuarios.push({
              img:doc.data().img,
              nombre:doc.data().nombre,
              apellido:doc.data().apellido,
              dni:doc.data().dni,
              oficio:doc.data().oficio,
              coord: coordenadas}
            )
            console.log(usuarios);

        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}



function initMap(latitud,longitud) {
  var posicion = {lat: latitud, lng: longitud};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: posicion
  });

  var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<img src="'+img+ '" style="width: 50px; height: 50px;">'+
      '<h1 id="firstHeading" class="firstHeading">' + nombre + '</h1>'+
      '<div id="bodyContent">'+
      '<br/>'+
      'apellido:'+apellido+
      '<br/>'+
      'dni:'+dni+
      '<br/>'+
      'estrellas:'+'esperando'
      '<p>'+
        + oficio + '<a href="#">'+
        'contactar' + '</a>'
      '</p>'+
      '</div>';

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  var marker = usuarios.map( lugar => {

    return new google.maps.Marker({
    position: usuarios.coord,
    map: map,
    title: 'tu mismo (oficio)'
  });
}
)

  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}

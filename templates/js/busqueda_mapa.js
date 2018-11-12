// var db = firebase.firestore();
//
// db.settings({
//   timestampsInSnapshots: true
// });

var usuarios = [];



 // var oficioBuscado = "profesor"
// oficio.addEventListener("click", canalizando,true)


//funcion para canalizar los datos de labase datos y mostrarlos en pantalla
function canalizando(){
  var db = firebase.firestore();

  db.settings({
    timestampsInSnapshots: true

  });


  var oficioBuscado = document.getElementById('textoBuscar').value;
  oficioBuscado = oficioBuscado.toLowerCase();

  console.log(oficioBuscado);
  // var oficioBuscado = 'profesor';
    var usuarios = [];

     db.collection("users").where("oficio", "==", oficioBuscado)
       .get()
       .then(function(querySnapshot) {
           querySnapshot.forEach(function(doc) {
               // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                // console.log(doc.data().coordenadas);
                if(doc.data().coordenadas != undefined){
                  usuarios.push( {
                    img : doc.data().img,
                    nombre : doc.data().nombre,
                    apellido : doc.data().apellido,
                    dni : doc.data().dni,
                    oficio : doc.data().oficio,
                    coord : doc.data().coordenadas
                    });
                }
           });
       })
       .then(function(){
         console.log(usuarios.length);
         console.log(usuarios);
           // $('#exampleModal1').on('shown.bs.modal', function () {
             initMap(usuarios);
           // })

       })
       .catch(function(error) {
           console.log("Error getting documents: ", error);
       });

}

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
      infoWindowContent.push(`
        <div class="card text-white bg-dark mb-3" style="width: 8rem; margin:auto;">
          <img class="card-img-top" src=${datos[i].img} alt="Card image cap">
          <div class="card-body">
            <h5 class="card-title" >${datos[i].nombre}</h5>
            <span class="card-text" style="width: 2.6rem"><i class="fa fa-user"></i> ${datos[i].apellido}</span><br>
            <span class="card-text" style="width: 2.6rem"><i class="far fa-address-card"></i> ${datos[i].dni}</span><br>
            <span class="card-text" style="width: 2.6rem"><i class="fas fa-briefcase"></i> ${datos[i].oficio}</span><br>
            <!-- buttom modal  -->
            <button onclick="contactar1()" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
              Contactar
            </button>

          </div>
        </div>



        <!-- Modal -->
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalCenterTitle">Modal title</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div id="notificacion" class="modal-body">

              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button onclick="confirmar_contacto1()" type="button" class="btn btn-primary">Confirmar</button>
              </div>
            </div>
          </div>
        </div>

        `)
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


function contactar1(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      //console.log(user)
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;

      document.getElementById('notificacion').innerHTML =`
      Nos comunicaremos con uste dentro de los proximos 10 minutos, Le recomendamos ver
      el perfil del trabajadora antes de confirmar. ¿Desea confirmar el pedido?
      `;
      console.log("ustede esta contactando");
    } else {
      // User is signed out.
      document.getElementById('notificacion').innerHTML =`
        necesita iniciar sesion o registrarse para poder contactar al trabajador
      `;
      // ...
    }
  });
}


function confirmar_contacto1(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      //console.log(user)
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;

      console.log("por ver y mandar datos a index1");

    } else {
      // User is signed out.
      window.location.href = "http://127.0.0.1:8887/templates/eleccionRegistro.html"
      // ...
    }
  });

}


//inicializanod firestore
var db = firebase.firestore();

//
db.settings({
timestampsInSnapshots: true
});

var refContacto = db.collection("contacto");
var refUser = db.collection("users");



var idQueContacta;
//
function buscar(){
    document.getElementById('datos_usurios').innerHTML = '';

   var palabraBuscada = document.getElementById('textoBuscar').value;
   palabraBuscada = palabraBuscada.toLowerCase();

   var datos = [ "nombre","apellido", "dni", "oficio"];

//   for (let i = 0; i < datos.lengh; i+=1){
//realizando consulta
    db.collection("users").where(datos[3], "==", palabraBuscada)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              //console.log(doc.id, " => ", doc.data());
                console.log(doc.id + " " + idQueContacta);

                if(doc.id !== idQueContacta){
                  var mostrarUsuarios = document.getElementById('datos_usurios');

                  mostrarUsuarios.innerHTML +=`

                  <div class="card mt-2" style="width: 15rem; margin:auto;">
                    <img class="card-img-top" src=${doc.data().img} alt="Card image cap">
                    <div class="card-body">
                      <h5 class="card-title" >${doc.data().nombre}</h5>
                      <span class="card-text" style="width: 2.6rem"><i class="fa fa-user"></i>${doc.data().apellido}</span><br>
                      <span class="card-text" style="width: 2.6rem"><i class="far fa-address-card"></i>${doc.data().dni}</span><br>
                      <span class="card-text" style="width: 2.6rem"><i class="fas fa-briefcase"></i>${doc.data().oficio}</span><br>
                      <!-- buttom modal  -->
                      <button onclick="contactar('${doc.id}')" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                        Contactar
                      </button>
                      <button onclick="ver_perfil('${doc.id}')" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter1">
                      Ver Perfil
                      </button>
                    </div>
                  </div>
                  `;
                }

            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
}


var idContactado;

function contactar(id){
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

      idContactado = id;

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



// el que confirma el contacto tiene el id que contacta
function confirmar_contacto(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      //console.log(user)
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid; //este usuairo tiene el docid que contacta
      var providerData = user.providerData;


      refUser.where("autor","==",uid).get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            idQueContacta = doc.id;
//agrengando pediod (agrando al colletion contacto)
            refContacto.add({
              atendido:false,
              estado: false,
              idQueContacta: idQueContacta,
              idContactado:idContactado,
              tiempo: new Date().getTime()
            })
            .then(function(docRef) {
              console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
              console.error("Error adding document: ", error);
            });


        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });



    } else {
      // User is signed out.
      window.location.href = "http://127.0.0.1:8887/templates/eleccionRegistro.html"
      // ...
    }
  });
}




//función para ver perfil de un tercero
function ver_perfil(id){

  // var verPerfil = document.getElementById("v_perfil");
  var verPerfil = document.getElementById("verPerfil");

  console.log("entranod entreando entrando entrando ble ble");
  console.log(id);

  db.collection("users").doc(id)
  .get().then(function(doc) {
      if (doc.exists) {

          console.log("Document data:", doc.data());
          console.log(doc.data().nombre + " " + doc.data().apellido);

            verPerfil.innerHTML = `
                <div class="card mt-2" style="width: 15rem; margin:auto;">
                  <img class="card-img-top" src=${doc.data().img} alt="Card image cap">
                  <div class="card-body">
                    <h5 class="card-title" >${doc.data().nombre}</h5>
                    <a src=${doc.data().cv}>Ver CV aquí</a><br>
                    <a src=${doc.data().antecedentes}>Ver Antecedentes Penales</a> <br>
                    <span class="card-text" style="width: 2.6rem"><i class="fa fa-user"></i>${doc.data().apellido}</span><br>
                    <span class="card-text" style="width: 2.6rem"><i class="far fa-address-card"></i>${doc.data().dni}</span><br>
                    <span class="card-text" style="width: 2.6rem"><i class="fas fa-briefcase"></i>${doc.data().oficio}</span><br>
                    <!-- buttom modal  -->
                  </div>
                </div>
            `;

      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });


}

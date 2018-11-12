// REGISTRO COMO COMO USUARIO NORMAL
function registrar(){
//datos para al utentificación
  var email = document.getElementById('emailUser').value;
  var contrasena = document.getElementById('passUser').value;

  //id Usuarios
  //var idUser; //uid es id del usuario
  console.log(email+' '+ contrasena);

//registro de autentificación
  firebase.auth().createUserWithEmailAndPassword(email, contrasena)
  .then(function(){
    verificar();  //verificación de usuario mediante envio de correo electronico
    datosGenerales();

  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    console.log(errorCode)
    console.log(errorMessage)
  });
}


//inicializanod firestore
var db = firebase.firestore();

db.settings({
  timestampsInSnapshots: true
});


// function datos_coord(lat,lng){
//   db.collection('users').add()
//   coord_lng = coord_lng;
// }
//=========================================================================

//para registrar los datos generales ======================================
function datosGenerales(){
  // var img = document.getElementById('imgUser').value;
  var nombre = document.getElementById('nombreUser').value;
  var apellido = document.getElementById('apellidoUser').value;
  var dni = document.getElementById('dniUser').value;
  // var oficio = document.getElementById('oficioUser').value;

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      ingresarDatos (nombre,apellido,dni,user.uid)
       // User is signed in.
    } else {
      // No user is signed in.
      console.log("Error al logearse");
    }
  });
}
//=========================================================================

//agregar los datos en la base de datos (utilizado en datos generales)
function ingresarDatos (nombre,apellido,dni,idUser){
  //registro de datos generales
  db.collection("users").add({
    nombre: nombre,
    apellido: apellido,
    dni: dni,
    autor: idUser,
    trabajador: false
    // coordenadas:{
      // latitud:latitud,
    //   longitud:longitud
    // }
  })
  .then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
    // console.log(docRef.coordenadas);
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
}


//usarndo un observador para capataer el varo de uid
function valorUID(){
  var valor;
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      valor = user.uid;
      console.log(valor);
      // User is signed in.
    } else {
      // No user is signed in.
      console.log("Error al logearse");
    }
  });
  return valor;
}

// funcion de verificación mediante correo electronico
function verificar(){
  var user = firebase.auth().currentUser;
  // console.log(user);
  // console.log("el usuario esta activo", user.uid);
  user.sendEmailVerification().then(function() {
    // Email sent.
    console.log('Envinado correo')
  }).catch(function(error) {
    // An error happened.
    consolo.log(error)
  });
}

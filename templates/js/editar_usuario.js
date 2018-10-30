
var db = firebase.firestore();
//var user = firebase.auth().currentUser; //referencia a usuario

db.settings({
  timestampsInSnapshots: true
});

//verificando si el usuario esta con inicio de sesion
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    capturar_datos(user);
  } else {
    // No user is signed in.
  }
});

//var para capturar el documento que contiene el uid del usuario
var idDocUser;
var emailUser;

//captura los datos de la base de datos
function capturar_datos(user){

  datos_usurio = db.collection("users").where("autor","==",user.uid);
  datos_usurio.get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            idDocUser = doc.id;
            emailUser = user.email;
            console.log(idDocUser);

            mostrar_datos_usuario(
              doc.data().nombre,
              doc.data().apellido,
              doc.data().dni,
              doc.data().oficio,
              user.email
            );
          });
  })
  .catch(function(error) {
    console.log("Error getting documents: ", error);
  });
}


//funcion mostrar los datos de usuario en perfil_usuario
function mostrar_datos_usuario(nombre,apellido, dni, oficio,email){
  document.getElementById('nombreUser').value = nombre;
  document.getElementById('apellidoUser').value = apellido;
  document.getElementById('dniUser').value = dni;
  document.getElementById('oficioUser').value = oficio
  document.getElementById('emailUser').value = email;

}

//abilita el html para la edicion
function abilitar_edicion(){
  document.getElementById('nombreUser').disabled = false;
  document.getElementById('apellidoUser').disabled = false;
  document.getElementById('dniUser').disabled = false;
  document.getElementById('oficioUser').disabled = false;
  // document.getElementById('emailUser').disabled = false;
}



//funcion editar usuario
function editar(){

  var boton = document.getElementById('botonEditar');
  boton.innerHTML = '';
  boton.innerHTML = 'Guardar Edicion';

  abilitar_edicion();

  boton.onclick = function(){
    console.log(idDocUser);
    datoUsuario = db.collection("users").doc(idDocUser);
    console.log(datoUsuario);
    var nombre = document.getElementById('nombreUser').value;
    var apellido = document.getElementById('apellidoUser').value;
    var dni = document.getElementById('dniUser').value;
    var oficio = document.getElementById('oficioUser').value;
    // var email = document.getElementById('emailUser').value;

      return datoUsuario.update({
        nombre: nombre,
        apellido: apellido,
        dni: dni,
        oficio: oficio
      })
      .then(function() {
          console.log("Document successfully updated!");
          mostrar_datos_usuario(nombre,apellido, dni, oficio, emailUser);
          boton.innerHTML = 'Edicion';
      })
      .catch(function(error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
      });
  }
}

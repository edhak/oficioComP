//AGREGAR IMAGEN
//referencia a faribase storage

var db = firebase.firestore();
var storageRef = db.ref()
//var user = firebase.auth().currentUser; //referencia a usuario
db.settings({
  timestampsInSnapshots: true
});


//EDITAR USUARIO
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


//editar Foto
var urlImgUser;

function subir_foto(){
  //referencia a firebase storage
  var imgStorage = firebase.storage();
  var imgRef = imgStorage.ref();

  console.log(imgRef.name);

  var img = document.querySelector('#imgUser').files[0];
  var name = (+new Date()) + '-' + img.name;
  var metadata =  {contentType: img.type};

  var task =imgRef.child(name).put(img, metadata);

  task.on('state_changed', function(snapshot){
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, function(error) {
    // Handle unsuccessful uploads
  }, function() {
      task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      console.log('File available at', downloadURL);
      ref_img(downloadURL, idDocUser);
      //actualizar se actualiza el z
      document.getElementById('imagen1').src = downloadURL;
    });
  });

//   if()
// //eliminar la imagen anterios de la base da datos
//     var desertRef = storageRef.child();
//     // Delete the file
//     desertRef.delete().then(function() {
//       // File deleted successfully
//     }).catch(function(error) {
//       // Uh-oh, an error occurred!
//   });

}


//referencial la url de img obetenida a nuestra base de datos
function ref_img(url, idDocUser){

  datoUsuario = db.collection("users").doc(idDocUser);

  return datoUsuario.update({
    img:url //url de la imgen
  })
  .then(function() {
    console.log(url);
  })
  .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });
}


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
            urlImgUser = doc.data().img;
            mostrar_datos_usuario(doc.data().img,
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
function mostrar_datos_usuario(img,nombre,apellido, dni, oficio,email){
  document.getElementById('imagen1').src = img;
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

function desabilitar_edicion(){
  document.getElementById('nombreUser').disabled = true;
  document.getElementById('apellidoUser').disabled = true;
  document.getElementById('dniUser').disabled = true;
  document.getElementById('oficioUser').disabled = true;
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
        oficio: oficio,
      })
      .then(function() {
          console.log("Document successfully updated!");
          mostrar_datos_usuario(urlImgUser,nombre,apellido, dni, oficio, emailUser);
          boton.innerHTML = 'Editar'
          // boton.onclick() = editar();
          desabilitar_edicion();
      })
      .catch(function(error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
      });
  }
}

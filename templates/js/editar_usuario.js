//AGREGAR IMAGEN
//referencia a faribase storage

var db = firebase.firestore();
// var storageRef = db.ref()
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
var docStorage = firebase.storage();

var idDocUser;
var emailUser;


//editar Foto
var urlImgUser;

function subir_foto(){
  //referencia a firebase storage
  var docStorage = firebase.storage();
  var imgRef = docStorage.ref("/img");

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
}

//Subir imagen o pdf de antecedentes PENALES
var anUser;

function subir_an(){
  //referencia a firebase storage
  var docStorage = firebase.storage();
  var anRef = docStorage.ref("/antecedente");

  console.log(anRef.name);

  var an = document.querySelector('#anUser').files[0];
  var name = (+new Date()) + '-' + an.name;
  var metadata =  {contentType: an.type};

  var task =anRef.child(name).put(an, metadata);

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
      ref_an(downloadURL, idDocUser);
      //actualizar se actualiza el z
      document.getElementById('antecedente1').href = downloadURL;
    });
  });
}

//SUBIR CV EN PDF

var cvUser;

function subir_cv(){
  //referencia a firebase storage
  // var cvStorage = firebase.storage();
  var docStorage = firebase.storage();
  var cvRef = docStorage.ref("/cv");

  console.log(cvRef.name);

  var cv = document.querySelector('#cvUser').files[0];
  var name = (+new Date()) + '-' + cv.name;
  var metadata =  {contentType: cv.type};

  var task =cvRef.child(name).put(cv, metadata);

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
      ref_cv(downloadURL, idDocUser);
      //actualizar se actualiza el z
      document.getElementById('cv1').href = downloadURL;
    });
  });

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

//REFRENCIA AL curriculum Vitae
function ref_cv(url, idDocUser){

  datoUsuario = db.collection("users").doc(idDocUser);

  return datoUsuario.update({
    cv:url //url de la imgen
  })
  .then(function() {
    console.log(url);
  })
  .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });
}

function ref_an(url, idDocUser){

  datoUsuario = db.collection("users").doc(idDocUser);

  return datoUsuario.update({
    antedecentes:url //url de la imgen
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
            console.log(doc.id, " => ", doc.data());
            idDocUser = doc.id;
            emailUser = user.email;
            console.log(idDocUser);
            urlImgUser = doc.data().img;
            cvUser = doc.data().cv;
            anUser = doc.data().antedecentes;

            mostrar_datos_usuario(doc.data().img,
              doc.data().nombre,
              doc.data().apellido,
              doc.data().dni,
              doc.data().oficio,
              user.email,
              doc.data().cv,
              doc.data().antecedentes,
              doc.data().numTelefono
            );
          });
  })
  .catch(function(error) {
    console.log("Error getting documents: ", error);
  });
}


//funcion mostrar los datos de usuario en perfil_usuario
function mostrar_datos_usuario(img,nombre,apellido, dni, oficio,email,cv,antecedentes,numero){
  document.getElementById('cv1').href = cv;
  document.getElementById('antecedente1').href = antecedentes;
  document.getElementById('imagen1').src = img;
  document.getElementById('nombreUser').value = nombre;
  document.getElementById('apellidoUser').value = apellido;
  document.getElementById('dniUser').value = dni;
  document.getElementById('numeroUser').value = numero;
  document.getElementById('oficioUser').value = oficio;
  document.getElementById('emailUser').value = email;
}

//abilita el html para la edicion
function abilitar_edicion(){
  document.getElementById('nombreUser').disabled = false;
  document.getElementById('apellidoUser').disabled = false;
  document.getElementById('dniUser').disabled = false;
  document.getElementById('numeroUser').disabled = false;
  document.getElementById('oficioUser').disabled = false;
  // document.getElementById('emailUser').disabled = false;
}

function desabilitar_edicion(){
  document.getElementById('nombreUser').disabled = true;
  document.getElementById('apellidoUser').disabled = true;
  document.getElementById('dniUser').disabled = true;
  document.getElementById('numeroUser').disabled = true;
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
    var numero =   document.getElementById('numeroUser').value;
    var oficio = document.getElementById('oficioUser').value;
    // var email = document.getElementById('emailUser').value;

      return datoUsuario.update({
        nombre: nombre,
        apellido: apellido,
        dni: dni,
        oficio: oficio,
        numTelefono: numero
      })
      .then(function() {
          console.log("Document successfully updated!");
          mostrar_datos_usuario(urlImgUser,nombre,apellido, dni, oficio, emailUser,cvUser,anUser,numero);
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

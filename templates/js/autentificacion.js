
var db = firebase.firestore();

db.settings({
timestampsInSnapshots: true
});



function ingresar(){
  var email = document.getElementById('emailUser').value;
  var contrasena = document.getElementById('passUser').value;

  firebase.auth().signInWithEmailAndPassword(email, contrasena)
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    console.log(errorCode);
    console.log(errorMessage);

  });
}


//cada ves que ingrese el obsevador verifica cuando se ingresar()
function observador(){
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


      var idAux;
      db.collection('users').where("tipo", "==", "admin").get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            idAux = doc.data().autor;
            // console.log(uid);
            // console.log(idAux == uid);
                if (uid == idAux) {
                  window.location.href = "http://127.0.0.1:8887/index1.html"
                } else {
                  // window.location.href = ""
                  aparecer(user);
                }
            })
          })

    } else {
      // User is signed out.
        blanco();
      // ...
    }
  });
}

//se ejecula el observado (verificando el inicio de session)
observador();


//funcion que oculta los botones ingresar y registrarse
function ocultar(){
  var sesion = document.getElementById('sesion');
  sesion.style.display = 'none';
}

//desarrollo de saludo
function cuerpo(user){
  var saludo = document.getElementById("bienvenido");
  saludo.innerHTML = `
  <ul class="navbar-nav mr-auto">
    <li class="nav-item">
      <a class="text-dark" href="#">Hola {${user.email}}</a>
    </li>
  </ul>
  `;
}

//funcion de crea los botones perfil y cerrar sesion
function aparecer(user){
  var user = user;

  var perfil = document.getElementById('v_perfil');
  var cerrar_sesion = document.getElementById('v_cerrar_sesion');
  var historialUsuario = document.getElementById('v_historial')
  if(user.emailVerified){
    ocultar();
    cuerpo(user);

    perfil.innerHTML = `
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <a class="nav-link" href="./templates/perfil_usuario.html">Perfil</a>
        </li>
      </ul>
    `;

    historialUsuario.innerHTML = `
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a class="nav-link" href="./templates/historialUsuario.html">Historial</a>
      </li>
    </ul>
    `;

    cerrar_sesion.innerHTML =`
    <button id="v_cerrar" onclick="cerrar()" type="button" class="btn btn-outline-success my-2 my-sm-0" data-toggle="modal" data-target="#exampleModal">
      Cerrar Sesion
    </button>
    `;
  }
}


// restaura asu forma inicial de inicial sesion
function blanco(){
  var perfil = document.getElementById('v_perfil');
  var cerrar_sesion = document.getElementById('v_cerrar_sesion');
  var saludo = document.getElementById("bienvenido");
  var historial = document.getElementById("v_historial")

  perfil.innerHTML = ``;
  cerrar_sesion.innerHTML =``;
  saludo.innerHTML = ``;
  historial.innerHTML = ``;

  // a la normalidad
  document.getElementById('sesion').style.display = 'block';
}



//cierrra la sesion del usuario
function cerrar(){
  firebase.auth().signOut().then(function(){
    console.log('Saliendo')
  })
  .catch(function(error){
    console.log(error);
  });
};

console.log( firebase.auth().currentUser); //referencia a usuario

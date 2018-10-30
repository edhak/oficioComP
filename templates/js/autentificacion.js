
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

      aparecer(user);

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
  <h4 >Bienvenido! ${user.email}</h4>
  <p>solo es una prueba </p>
  <hr>
  <p >Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
  `;
}





//funcion de crea los botones perfil y cerrar sesion
function aparecer(user){
  var user = user;

  var perfil = document.getElementById('v_perfil');
  var cerrar_sesion = document.getElementById('v_cerrar_sesion');
  if(user.emailVerified){
    ocultar();
    cuerpo(user);

    perfil.innerHTML = `
      <a href="./templates/perfil_usuario.html">Perfil</a>
      <p></p>
    `;

    cerrar_sesion.innerHTML =`
      <button  id="v_cerrar" onclick="cerrar()">Cerrar Sesion</button>
      <p></p>
    `;
  }
}




// restaura asu forma inicial de inicial sesion
function blanco(){
  var perfil = document.getElementById('v_perfil');
  var cerrar_sesion = document.getElementById('v_cerrar_sesion');
  var saludo = document.getElementById("bienvenido");

  perfil.innerHTML = ``;
  cerrar_sesion.innerHTML =``;
  saludo.innerHTML = ``;

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

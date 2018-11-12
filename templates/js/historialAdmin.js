var db = firebase.firestore()

db.settings({
timestampsInSnapshots: true
});


var refContacto = db.collection("contacto");
var refUser = db.collection("users");


function obs_notificaciones(){
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

      console.log(user);
      ver_notificaciones(); //notificaciones dell historial
      // document.getElementById('hola').innerHTML = "hola pinche mundo"
    } else {
      // User is signed out
      console.log("error xd");

      // ...
    }
  });
}

obs_notificaciones();

function ver_notificaciones(){

  refContacto.orderBy("tiempo","desc")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(cntDoc) {
            // doc.data() is never undefined for query doc snapshots
          // console.log(cntDoc.id, " => ", cntDoc.data());
          agregarPendientes(cntDoc.data().idQueContacta, cntDoc.data().idContactado,
                            cntDoc.id, cntDoc.data().atendido, cntDoc.data().estado)

        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
  });
}


// agregar los datos en la tabla de HISTORIAL ADMIN
function agregarPendientes(QueContacta,Contactado,idContacto,atendido,estado){
  var nombreQueContacta;
  var numeroQueContacta;
  var nombreContactado;
  var numeroContactado;
  var estadoEscribir;
  if(estado){
    estadoEscribir = "Es usuario fue atendido";
  }else{
    estadoEscribir = "El contacto Cancelo Pedido"
  }

  if(QueContacta && Contactado && atendido){
    var userQueContacta = refUser.doc(QueContacta);
          userQueContacta.get().then(function(doc) {
            if (doc.exists) {
              nombreQueContacta = doc.data().nombre + doc.data().apellido;
              numeroQueContacta = doc.data().numTelefono;
              console.log("Document data:", doc.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
            }).catch(function(error) {
              console.log("Error getting document:", error);
            });

    // obteniendo datos del usuario
    var userContactado = refUser.doc(Contactado);
          userContactado.get().then(function(doc) {
            if (doc.exists) {
              nombreContactado = doc.data().nombre + doc.data().apellido;
              numeroContactado = doc.data().numTelefono;

              // colocamos aqui esta inserción de datos por que la funcion es asincrona y nodara udifined
                    document.getElementById('tablaNotificaciones').innerHTML += `
                        <tr>
                          <td scope="col">${nombreQueContacta}</td>
                          <td scope="col">${numeroQueContacta}</td>
                          <td scope="col">${nombreContactado}</td>
                          <td scope="col">${numeroContactado}</td>
                          <td scope="col">${estadoEscribir}</td>
                        </tr>
                      `;
                console.log("Document data:", doc.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document y o ya esta atendido");
            }
            }).catch(function(error) {
            console.log("Error getting document:", error);
            });
        }else{
          console.log("error al consegir datos de contacto funcntion ver_notificacion() quizas Contacdato este vacio XD");
        }
}

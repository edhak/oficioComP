var db = firebase.firestore()

db.settings({
timestampsInSnapshots: true
});


var refContacto = db.collection("contacto");
var refUser = db.collection("users");

var docUserActual;


obs_historial();

function obs_historial(){
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

      console.log(uid);
      // tomando el valor del documento actual
      refUser.where("autor", "==", uid)
          .get()
          .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                  // doc.data() is never undefined for query doc snapshots
                  // console.log(doc.id, " => ", doc.data());
                  docUserActual = doc.id;
              });
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error);
      });
      //fin de tomar el dato del doc actual

      ver_notificaciones(); //notificaciones dell historial
      // document.getElementById('hola').innerHTML = "hola pinche mundo"
    } else {
      // User is signed out
      console.log("error xd");
      // ...
    }
  });
}



function ver_notificaciones(){

  refContacto.orderBy("tiempo","desc")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(cntDoc) {
            // doc.data() is never undefined for query doc snapshots
          // console.log(cntDoc.id, " => ", cntDoc.data());
          agregarPendientes(cntDoc.data().idQueContacta, cntDoc.data().idContactado,
                            cntDoc.id, cntDoc.data().atendido, cntDoc.data().estado, docUserActual)

        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
  });
}


function agregarPendientes(QueContacta,Contactado,idContacto,atendido,estado,id){
  var nombreQueContacta;
  // var numeroQueContacta;
  var nombreContactado;
  // var numeroContactado;
  var estadoEscribir;
  // var atendidoEscribir;

  // solo pasan los atendidos que son verdaderos los demas no todo depende a atendidos
  if(estado){
    estadoEscribir = "Fue Culminado";
    // atendidoEscribir = "fue tendido";
  }else{
    estadoEscribir = "Fue Cancelado o No fue Atendido";
    // atendidoEscribir = "no se le Atendío";
  }

  console.log(Contactado + " " + id);
  console.log(atendido);
  console.log(estado);

  console.log(QueContacta + " "+ id);
  console.log(atendido);
  console.log(estado);
  
  var insertarHtml = document.getElementById('tablaHistorial');

  if(atendido){
        if(Contactado == id){
          var userQueContacta = refUser.doc(QueContacta);
                userQueContacta.get().then(function(doc) {
                  if (doc.exists) {
                    nombreQueContacta = doc.data().nombre + doc.data().apellido;
                    // numeroQueContacta = doc.data().numTelefono;
                    // colocamos aqui esta inserción de datos por que la funcion es asincrona y nodara udifined
                          insertarHtml.innerHTML += `
                              <tr>
                                <td scope="col">${nombreQueContacta}</td>
                                <td scope="col">${"Usted Requirio Trabajador"}</td>
                                <td scope="col">${estadoEscribir}</td>
                              </tr>
                            `;
                      // console.log("Document data:", doc.data());
                  } else {
                      // doc.data() will be undefined in this case
                      console.log("No such document!");
                  }
                  }).catch(function(error) {
                    console.log("Error getting document:", error);
                  });

        }

        if(QueContacta == id){
          // obteniendo datos del usuario
          var userContactado = refUser.doc(Contactado);
            userContactado.get().then(function(doc) {
              if (doc.exists) {
                nombreContactado = doc.data().nombre + doc.data().apellido;
                  // numeroContactado = doc.data().numTelefono;
                    // colocamos aqui esta inserción de datos por que la funcion es asincrona y nodara udifined
                    insertarHtml.innerHTML +=`
                      <tr>
                        <td scope="col">${nombreContactado}</td>
                          <td scope="col">${"Usted Trabajo Para cliente"}</td>
                          <td scope="col">${estadoEscribir}</td>
                      </tr>
                      `;
                      // console.log("Document data:", doc.data());
                  } else {
                      // doc.data() will be undefined in this case
                      console.log("No such document y o ya esta atendido");
                  }
                  }).catch(function(error) {
                  console.log("Error getting document:", error);
                  });

            }

      }else{
        console.log("error al consegir datos de contacto funcntion ver_notificacion() quizas Contacdato este vacio XD");
      }
}

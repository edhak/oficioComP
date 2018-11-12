// Initialize Cloud Firestore through Firebase
  var db = firebase.firestore();

  // db.settings({
  // timestampsInSnapshots: true
  // });

  //Agregar documentos
  function guardar(){

    var nombre = document.getElementById('nombreUser').value;
    var apellido = document.getElementById('apellidoUser').value;
    var dni = document.getElementById('dniUser').value;
    var oficio = document.getElementById('oficioUser').value;

    db.collection("users").add({
        nombre: nombre,
        apellido: apellido,
        dni: dni,
        oficio: oficio
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        document.getElementById('nombreUser').value = '';
        document.getElementById('apellidoUser').value = '';
        document.getElementById('dniUser').value = '';
        document.getElementById('oficioUser').value = '';
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

//Leer documentos
var tabla = document.getElementById('tabla');
db.collection("users").onSnapshot((querySnapshot) => {
  tabla.innerHTML='';
  querySnapshot.forEach((doc) => {
    if(doc.data().trabajador){
      console.log(`${doc.id} => ${doc.data().nombre}`);
      tabla.innerHTML += `
            <tr>
              <td>${doc.data().nombre}</td>
              <td>${doc.data().apellido}</td>
              <td>${doc.data().dni}</td>
              <td>${doc.data().oficio}</td>
              <td><button class="btn btn-danger" onclick="eliminar('${doc.id}')">Eliminar</button></td>
              <td><button class="btn btn-warning" onclick="editar('${doc.id}','${doc.data().nombre}','${doc.data().apellido}','${doc.data().dni}','${doc.data().oficio}')">Editar</button></td>
            </tr>`
    }
  });
});

//Borrar documentos
function eliminar(id){
    db.collection("users").doc(id).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}

//Editar documento
function editar(id,nombre,apellido,dni,oficio){

    document.getElementById('nombreUser').value = nombre;
    document.getElementById('apellidoUser').value = apellido;
    document.getElementById('dniUser').value = dni;
    document.getElementById('oficioUser').value = oficio;
    var boton = document.getElementById('boton');
    boton.innerHTML = 'Editar';

    boton.onclick = function(){
        var washingtonRef = db.collection("users").doc(id);
        // Set the "capital" field of the city 'DC'

        var nombre = document.getElementById('nombreUser').value;
        var apellido = document.getElementById('apellidoUser').value;
        var dni = document.getElementById('dniUser').value;
        var oficio = document.getElementById('oficioUser').value;


        return washingtonRef.update({
            nombre: nombre,
            apellido: apellido,
            dni: dni,
            oficio: oficio
    })
    .then(function() {
        console.log("Document successfully updated!");
        boton.innerHTML = 'Guardar';
        document.getElementById('nombreUser').value = '';
        document.getElementById('apellidoUser').value = '';
        document.getElementById('dniUser').value = '';
        document.getElementById('oficioUser').value = '';
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
    }
}

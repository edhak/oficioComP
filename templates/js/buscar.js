// var config = {
// apiKey: "AIzaSyBoaIjKLidgOaIFYkBkQLBDNPqBNMuvoz0",
// authDomain: "oficiocom-7f4e8.firebaseapp.com",
// databaseURL: "https://oficiocom-7f4e8.firebaseio.com",
// projectId: "oficiocom-7f4e8",
// storageBucket: "oficiocom-7f4e8.appspot.com",
// messagingSenderId: "309534032949"
// };
// firebase.initializeApp(config);

//==========================================
//inicializanod firestore
var db = firebase.firestore();
//
db.settings({
timestampsInSnapshots: true
});


//
 function buscar(){

   var palabraBuscada = document.getElementById('textoBuscar').value;
   var datos = [ "nombre","apellido", "dni", "oficio"];
//
//   for (let i = 0; i < datos.lengh; i+=1){
//realizando consulta
    db.collection("users").where(datos[3], "==", palabraBuscada)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());

                  var mostrarUsuarios = document.getElementById('datos_usurios');

                  mostrarUsuarios.innerHTML +=`
                      <ul>
                        <li href='#'>id: ${doc.data().apellido}</li>
                        <li>nombre: ${doc.data().nombre}</li>
                        <li>oficio: ${doc.data().oficio}</li>
                        <li>dni: ${doc.data().dni}</li>
                      </ul>
                  `;

                // mostrarBusqueda(
                //   doc.data().nombre,
                //   doc.data().apellido,
                //   doc.data().dni
                // );

            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    // }
}


//funcion que escribe los datos en la pagina resultados_busqueda
// function mostrarBusqueda(nombre, apellido,dni){
//   var mostrarUsuarios = document.getElementById('datos_usurios');
//
//   mostrarUsuarios.innerHTML +=`
//       <ul>
//         <li>id: ${apellido}</li>
//         <li>nombre: ${nombre}</li>
//       </ul>
//   `;
// }


//inicializanod firestore
var db = firebase.firestore();
//
db.settings({
timestampsInSnapshots: true
});


//
function buscar(){
    document.getElementById('datos_usurios').innerHTML = '';

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
                    <div>
                      <img src=${doc.data().img} style="width: 50px; height: 50px;">
                    </div>
                      <li>nombre: ${doc.data().nombre}</li>
                      <li>oficio: ${doc.data().oficio}</li>
                      <li>dni: ${doc.data().dni}</li>
                      <li><a href="#">contactar</a></li>
                      <li>################</li>
                    </ul>
                `;
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
}

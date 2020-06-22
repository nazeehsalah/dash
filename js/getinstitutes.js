$(function () {
    
    var query = firebase.database().ref("institutes").orderByKey();
    query.once("value")
        .then(function (snapshot) {
            var content=""
            snapshot.forEach(function (childSnapshot) {
                
                var childData = childSnapshot.val();
                content+='<tr><td>'+childData.name+'</td><td>'+childData.nameInEnglish+'</td></tr>'
            });
            $("#datatable-buttons tbody").append(content)
            $("#datatable-buttons").length && $("#datatable-buttons").DataTable({
                displayLength: 50,
                dom: "Blfrtip",
                buttons: [{
                    extend: "copy",
                    className: "btn-sm"
                }, {
                    extend: "csv",
                    className: "btn-sm"
                }, {
                    extend: "excel",
                    className: "btn-sm"
                }, {
                    extend: "pdfHtml5",
                    className: "btn-sm"
                }, {
                    extend: "print",
                    className: "btn-sm"
                }],
                responsive: !0
            })
            
        });

    /* var ref = firebase.database().ref("institutes").orderByKey();
    ref.once("value")
        .then(function (snapshot) {
            console.log(snapshot.child("nameInEnglish").exportVal())
            console.log(snapshot)
        }); */

})
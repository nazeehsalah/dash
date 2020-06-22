$(function () {
  var insList = []
  firebase.database().ref("institutes").orderByKey()
    .once("value").then(function (s) {
      insList = s.val();
      var query = firebase.database().ref("users").orderByKey();
      query.once("value")
        .then(function (snapshot) {
          var content = ""
          snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            var companyName;
            Object.keys(insList).forEach(function(ins){
              if(ins==childData.company){
                companyName=insList[ins].name
              }
            })
            content += '<tr><td>' + childData.name + '</td>' +
              '<td>' + childData.nameInEnglish + '</td>' +
              '<td>' + childData.identity + '</td>' +
              '<td>' + childData.email + '</td>' +
              '<td>' + childData.number + '</td>' +
              '<td>' + companyName + '</td>' +
              '<td>' + childData.stauts + '</td></tr>'
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

    })
})

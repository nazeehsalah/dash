$(function () {
  var query = firebase.database().ref("courses").orderByKey();
  query.once("value")
    .then(function (snapshot) {
      var content = ""
      snapshot.forEach(function (childSnapshot) {

        var childData = childSnapshot.val();
        content += '<tr><td>' + childData.code + '</td>' +
          '<td>' + childData.name + '</td>' +
          '<td>' + childData.nameInEnglish + '</td>' +
          '<td>' + childData.type + '</td>' +
          '<td>' + childData.startDate + '</td>' +
          '<td>' + childData.endDate + '</td>' +
          '<td>' + childData.deprt + '</td>' +
          '<td>' + childData.dayAbsance + '</td>' +
          '<td>' + childData.lastTime + '</td>'+
          '<td>' + (childData.run?"فعال" : "غير فعال")+ '</td></tr>'
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
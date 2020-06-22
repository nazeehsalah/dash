var insdata
$(function () {
  var couresList = []
  var query = firebase.database().ref("courses").orderByKey();
  query.once("value")
    .then(function (snapshot) {
      var options = "",
        index = 0
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        couresList.push({
          key: childSnapshot.key,
          data: childData
        })
        options += '<option value="' + index + '">' + childData.name + '</option>'
        index++;
      });
      $("#sel1").append(options)
      firebase.database().ref("institutes/")
        .once("value")
        .then(function (ins) {
          insdata = ins.val()
        })
    })
  $("#sel1").change(function () {
    $("#datatable-buttons").DataTable().destroy();
    $("#datatable-buttons tbody").children().remove()
    var
      datesList = getDates(new Date(couresList[$(this).val()].data.startDate), new Date()),
      tabelContent = "",
      index = 1,
      courseInfo = couresList[$(this).val()]
    /* datesList.forEach(function (d) {
      tabelHeader += '<th class="center">' + d + '</th>'
    }) */
    /* $("#datatable-buttons thead tr").append(tabelHeader) */
    firebase.database().ref("courseInfo/" + couresList[$(this).val()].key)
      .once("value")
      .then(function (s) {
        if (s.val() != null) {
          Object.keys(s.val().users).forEach(function (userKey) {
            firebase.database().ref("users/" + userKey)
              .once("value")
              .then(function (userdata) {
                console.log(userdata.val())
                if (userdata.val() != null) {
                  tabelContent += '<tr>' +
                    '<td>' + index + '</td>' +
                    '<td>' + userdata.val().name + '</td>' +
                    '<td>' + userdata.val().nameInEnglish + '</td>' +
                    '<td>' + courseInfo.data.name + '</td>' +
                    '<td>' + userdata.val().email + '</td>' +
                    '<td>' + userdata.val().identity + '</td>' +
                    '<td>' + userdata.val().number + '</td>' +
                    '<td>' + userdata.val().stauts + '</td>' +
                    '<td>' + insdata[userdata.val().company].name + '</td>'
                  tabelContent += '</tr>'
                  index++;
                }
              }).then(function () {
                if (Object.keys(s.val().users).indexOf(userKey) == Object.keys(s.val().users).length - 1) {
                  $("#datatable-buttons tbody").append(tabelContent)
                  $("#datatable-buttons").length && $("#datatable-buttons").DataTable({
                    displayLength: 50,
                    dom: "Blfrtip",
                    buttons: [
                      {
                        extend: 'print',
                        exportOptions: {
                          stripHtml: false,
                          format: {
                            body: function (inner, coldex, rowdex) {
                              if (inner.length &= 0) return inner;
                              var el = $.parseHTML(inner);
                              var result = '';
                              $.each(el, function (index, item) {
                                if (item.nodeName == '#text') result = result + item.textContent;
                                else if (item.nodeName == 'SUP') result = result + item.outerHTML;
                                else if (item.nodeName == 'STRONG') result = result + item.outerHTML;
                                else if (item.nodeName == 'IMG') result = result + item.outerHTML;
                                else result = result + item.innerText;
                              });
                              return result;
                            }
                          }
                        }
                      },
                      {
                        extend: 'csv',
                        exportOptions: {
                          stripHtml: false,
                          format: {
                            body: function (inner, coldex, rowdex) {
                              if (inner.length &= 0) return inner;
                              var el = $.parseHTML(inner);
                              var result = '';
                              $.each(el, function (index, item) {
                                if (item.nodeName == '#text') result = result + item.textContent;
                                else if (item.nodeName == 'SUP') result = result + item.outerHTML;
                                else if (item.nodeName == 'STRONG') result = result + item.outerHTML;
                                else if (item.nodeName == 'IMG') result = result + item.src;
                                else result = result + item.innerText;
                              });
                              return result;
                            }
                          }
                        }
                      },
                    ],
                    responsive: !0
                  })
                  $("#datatable-buttons").css("width", "100%")
                  $(".x_panel").css("display", "inline-block");
                }
              })

          })
        }
      })
  })


})

function getDates(startDate, endDate) {
  var dates = [],
    currentDate = startDate,
    addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate).toDateString());
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
}
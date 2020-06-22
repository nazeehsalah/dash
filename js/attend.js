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
          console.log(ins.val())
        })
    })
  $("#sel1").change(function () {
    $("#datatable-buttons").DataTable().destroy();
    $("#datatable-buttons thead tr .added").remove()
    console.log($("#datatable-buttons thead tr .added"))
    $("#datatable-buttons tbody").children().remove();
    var tabelHeader = "",
      datesList = getDates(new Date(couresList[$(this).val()].data.startDate), new Date()),
      tabelContent = "",
      index = 1
    /* datesList.forEach(function (d) {
      tabelHeader += '<th class="center">' + d + '</th>'
    }) */
    /* $("#datatable-buttons thead tr").append(tabelHeader) */
    firebase.database().ref("courseInfo/" + couresList[$(this).val()].key)
      .once("value")
      .then(function (s) {
        console.log(s.val())
        if (s.val() != null) {
          if (s.val().attendence != null) {
            s.val().attendence;
            var sortedAttendence = [];
            Object.keys(s.val().attendence).forEach(function (dayKey) {
              sortedAttendence.push(new Date(dayKey));
            })
            sortedAttendence.sort((a, b) => a.getTime() - b.getTime())
            sortedAttendence.forEach(function (dayKey, i) {
              //console.log(i)
              dayKey = dayKey.toDateString()
              //console.log(dayKey)
              sortedAttendence[i] = dayKey
            })
            console.log(sortedAttendence)
            sortedAttendence.forEach(function (dayKey) {
              console.log(dayKey);
              tabelHeader += '<th class="center added">' + dayKey + '</th>'
            })
            Object.keys(s.val().users).forEach(function (userKey) {

              firebase.database().ref("users/" + userKey)
                .once("value")
                .then(function (userdata) {
                  /* console.log(userKey)
                  console.log(userdata.val()) */
                  if (userdata.val() != null) {
                    tabelContent += '<tr>' +
                      '<td>' + index + '</td>' +
                      '<td>' + userdata.val().name + '</td>' +
                      '<td>' + userdata.val().nameInEnglish + '</td>' +
                      '<td>' + userdata.val().identity + '</td>' +
                      '<td>' + insdata[userdata.val().company].name + '</td>'
                    sortedAttendence.forEach(function (dayKey) {
                      tabelContent += '<td>' + (s.val().attendence[dayKey][userKey] != undefined ? '<img src="' + s.val().attendence[dayKey][userKey].atteendSign +
                        '" style="width: 75px;display:block">' : "لم يحضر") + '</td>'

                      //<p>' + s.val().attendence[dayKey][userKey].attendTime + ' </p>
                    })
                    tabelContent += '</tr>'
                    index++;
                  }
                }).then(function () {
                  if (Object.keys(s.val().users).indexOf(userKey) == Object.keys(s.val().users).length - 1) {
                    $("#datatable-buttons thead tr").append(tabelHeader)
                    $("#datatable-buttons tbody").append(tabelContent)
                    $("#datatable-buttons").length && $("#datatable-buttons").DataTable({
                      displayLength: 50,
                      dom: "Blfrtip",
                      buttons: [{
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
var couresList = [],
  colors = ['rgba(34, 102, 102,1)', 'rgba(0,196,194,1)', 'rgba(60,141,188,0.9)', 'rgba(47,94,117,1)', 'rgba(51,34,136,1)', 'rgba(33,151,238)', 'rgba(255,63,121,1)', "rgba(255,211,70,1)", 'rgba(0,104,185,1)', 'rgba(46,135,190,1)', 'rgba(1,7,102,1)', 'rgba(30,132,208,1)', 'rgba(255,63,121,1)', 'rgba(92,0,32,1)']
firebase.database().ref("courses").orderByKey().once("value")
  .then(function (snapshot) {
    index = 0
    options = "",
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        couresList.push({
          key: childSnapshot.key,
          data: childData
        })
        options += '<option value="' + index + '">' + childData.name + '</option>'
        index++;
      });
    $("#prog").append(options)
  })


$(function () {
  $("#report").submit(function (e) {
    e.preventDefault();
    if ($("#prog").val() == null || $("#lang").val() == null) {
      alert("يجب عليك اختيار البرنامج ولغه التقرير")
    } else {
      var lang
      if ($("#lang").val() == "ar") {
        $("#datatable-buttons_wrapper table").css("direction", "rtl");
        lang = "feedbackArbic";
      } else {
        $("#datatable-buttons_wrapper table").css("direction", "ltr");
        lang = "feedbackEnglish"
      }
      report(couresList[$("#prog").val()].key, lang)
    }
  });

});

function report(courseKey, lang) {
  $("#datatable-buttons").DataTable().destroy();
  $("#datatable-buttons tbody").children().remove();

  var articalQuestions = [],
    chooseQuestions = []
  firebase.database().ref("courseInfo/" + courseKey + "/" + lang).once("value")
    .then(function (snap) {
      if (snap.val() != null) {

        Object.keys(snap.val()).forEach(key => {
          let question = {
              text: key,
              answers: []
            },
            labels = [],
            values = [],
            article = false,
            questionInfo = snap.val()[key]
          Object.keys(questionInfo).forEach(ansKey => {
            if (questionInfo[ansKey].type == "article") {
              article = true
              question.answers.push(questionInfo[ansKey].ans)

            } else {
              for (let i = 0; i < questionInfo[ansKey].answers.length; i++) {
                if (questionInfo[ansKey].ans == questionInfo[ansKey].answers[i]) {
                  if (labels.indexOf(questionInfo[ansKey].ans) == -1) {

                    labels.push(questionInfo[ansKey].ans)
                    values.push(1)
                  } else {

                    values[labels.indexOf(questionInfo[ansKey].ans)] = parseInt(values[labels.indexOf(questionInfo[ansKey].ans)]) + 1

                  }
                }
              }
            }

          })

          if (article)
            articalQuestions.push(question)
          else {
            question.answers.push({
              labels: labels,
              values: values
            })
            chooseQuestions.push(question)
          }

        })
        document.getElementById("test")
        var index = 0
        chooseQuestions.forEach(function (question, j) {
          index++;
          var rowcontent = "<tr>"
          rowcontent += "<td>" + index + "</td>" +
            "<td>" + question.text + "</td><td>"
          rowcontent += "<canvas width=100 height=100 id='can" + j + "'></canvas>"
          rowcontent += "</td><td>" + (lang == "feedbackArbic" ? "اختيارى" : "Choose") + "</td>"
          $("#datatable-buttons tbody").append(rowcontent)
          var can = document.getElementById("can" + j).getContext('2d');
          var myChart = new Chart(can, {
            type: 'bar',
            data: {
              labels: question.answers[0].labels,
              datasets: [{
                label: '# of Votes',
                data: question.answers[0].values,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              bezierCurve: false,
              animation: {
                onComplete: function () {
                  var ctx = document.getElementById('can' + j);
                  var img = new Image();
                  img.id = 'img' + j
                  img.src = ctx.toDataURL("image/png");

                  ctx.parentNode.append(img)
                  ctx.remove();
                  img.previousSibling.remove()
                  img.classList = "code128"

                }
              },
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }
          });
        })

        articalQuestions.forEach(function (question) {
          index++;
          var rowcontent = "<tr>"
          rowcontent += "<td>" + index + "</td>" +
            "<td>" + question.text + "</td>" + "<td><ol class='list-ulnstyled'>"
          for (let i = 0; i < question.answers.length; i++) {
            rowcontent += "<li>" + question.answers[i] + " <hr></li>"
          }
          rowcontent += "</ol></td><td>" + (lang == "feedbackArbic" ? "مقالى" : "Article") + "</td></tr>"
          $("#datatable-buttons tbody").append(rowcontent)
        })
        $("#tabledata").fadeIn()
        $("#datatable-buttons").length && $("#datatable-buttons").DataTable({
          displayLength: 50,
          dom: "Blfrtip",
          buttons: [{
              extend: 'print',
              exportOptions: {
                columns: ':visible',
                stripHtml: false,
                format: {
                  body: function (inner, coldex, rowdex) {

                    console.log(inner)
                    if (inner.length &= 0) return inner;
                    var el = $.parseHTML(inner);
                    var result = '';
                    $.each(el, function (index, item) {
                      console.log(item.nodeName)
                      if (item.nodeName == '#text') {
                        console.log("imf1")
                        result = result + item.textContent;
                      } else if (item.nodeName == 'SUP') {
                        result = result + item.outerHTML;
                        console.log("imf2")
                      } else if (item.nodeName == 'STRONG') {
                        console.log("imf3")
                        result = result + item.outerHTML;
                      } else if (item.nodeName == "IMG") {
                        console.log("imf4")
                        result = result + item.outerHTML;
                        console.log(result)
                      } else {
                        result = result + item.innerText;
                        console.log("imf5")
                      }
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

              }
            },
          ],
          responsive: !0
        })
        chooseQuestions.forEach(function (question, j) {

        })
      } else {
        $("#notfound").fadeIn()
        $("#tabledata").hide()
      }
    })
}
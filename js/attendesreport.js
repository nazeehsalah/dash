$(function () {
  $("#today_date").html("تاريخ اليوم : " + new Date().toLocaleDateString())
  content()
  setInterval(content, 900000);
})

function content() {
  $("#content").empty();
  var found = true,
    today = new Date() //new Date(),
  coursesData = []
  // this code get run courses
  firebase.database().ref("/courses")
    .orderByChild("run")
    .equalTo(true)
    .once("value")
    .then(function (snapshot) {
      Object.keys(snapshot.val()).forEach(function (key, i) {
        if (new Date(snapshot.val()[key].startDate) < new Date(today) && new Date(snapshot.val()[key].endDate) > new Date(today)) {
          found = false;
          firebase.database().ref("/courseInfo/" + key)
            .once("value")
            .then(function (snap) {
              console.log(snap.val())
              var courseObj = {}
              courseObj.name = snapshot.val()[key]["name"]
              courseObj.endDate = snapshot.val()[key]["endDate"]
              courseObj.startDate = snapshot.val()[key]["startDate"]
              courseObj.total = Object.keys(snap.val().users).length;
              if (snap.val().attendence != undefined)
                courseObj.attende = snap.val().attendence[today.toDateString()] == undefined ? 0 : Object.keys(snap.val().attendence[today.toDateString()]).length;
              else
                courseObj.attende = 0
              courseObj.absance = courseObj.total - courseObj.attende
              coursesData.push(courseObj);
              var content = ''
              content = '<div class="col-md-6"><div class="x_panel"><div class="x_title text-center"><h2 class="text-center" style="float: none">' + courseObj.name + '</h2><div class="clearfix"></div></div><div class="x_content"><div class="col-md-12 col-sm-12 col-xs-12"><ul class="stats-overview"><li><span class="name"> عدد الحضور</span><span class="value text-success"> ' + courseObj.attende + ' </span></li><li class="hidden-phone"><span class="name"> عدد الغياب</span><span class="value text-success"> ' + courseObj.absance + ' </span></li><li><span class="name"> عدد المشتركين </span><span class="value text-success"> ' + courseObj.total + ' </span></li></ul><br /><div class="row"><p class = "col-xs-6 text-right" >تاريخ نهاية البرنامج : <strong >' + courseObj.endDate + '</strong> </p> <p class = "col-xs-6 text-right" > تاريخ بدايه البرنامج: <strong > ' + courseObj.startDate + ' </strong> </p > </div></div > </div></div > </div>'
              $("#content").append(content);
              if (i == Object.keys(snapshot.val()).length - 1) {
                if (coursesData.length == 0) {
                  $("#content").append("<h1 class=text-center style='margin-top:100px'>لا توجد برامج تعمل اليوم جرب غدا</h1>")
                }
              }
            })
        } else {
          if (found && i == Object.keys(snapshot.val()).length - 1) {
            $("#content").append("<h1 class=text-center style='margin-top:100px'>لا توجد برامج تعمل اليوم جرب غدا</h1>")
          }

        }
      })

    })
}
var newUser = true
$(function () {
  $(".main_container .right_col").attr("style", "min-height: 0;")
  //get courses list
  firebase.database()
    .ref("courses")
    .orderByChild("run")
    .equalTo(true)
    .once("value")
    .then(function (snapshot) {
      Object.keys(snapshot.val()).forEach(function (key, i) {
        $("#course-name").append("<option value='" + key + "'>" + snapshot.val()[key].name + "</option>");
        Object.keys(snapshot.val()).forEach(function (key, i) {
          console.log(key)
          $("#course-name").append("<option value='" + key + "'>" + snapshot.val()[key].name + "</option>");

        })
        $("#course-name").attr("data-live-search", "true");
        $("#course-name").attr("class", $("#ins-name").attr("class") + " selectpicker1");
        //enable select search
        $('.selectpicker1').selectpicker();

      })
    })
  //get institutes list
  firebase.database()
    .ref("institutes")
    .orderByKey()
    .once("value")
    .then(function (snapshot) {
      Object.keys(snapshot.val()).forEach(function (key, i) {
        $("#ins-name").append("<option value='" + key + "'>" + snapshot.val()[key].name + "</option>");

      })
      $("#ins-name").attr("data-live-search", "true");
      $("#ins-name").attr("class", $("#ins-name").attr("class") + " selectpicker");
      //enable select search
      $('.selectpicker').selectpicker();
    })

  //check youser registered or not
  $("input[name='civil-no']").blur(function (e) {
    let civilNo = $("input[name='civil-no']").val()
    //get courses list
    if (civilNo != '') {
      firebase.database()
        .ref("users")
        .child(civilNo)
        .once("value")
        .then(function (userSnap) {
          console.log(userSnap.exists())
          if (userSnap.exists()) {
            firebase.database()
              .ref("courses")
              .child(userSnap.val().courseKey)
              .once("value")
              .then(function (coursesnap) {
                console.log(coursesnap.val())
                if (coursesnap.val().run) {
                  $(".item .alert").fadeIn();
                  $("#saveuserbtn").attr("disabled", "disabled")
                } else {
                  $(".item .alert").hide();
                  $("#saveuserbtn").attr("disabled", "false")
                }
              })
          } else {
            $(".item .alert").fadeOut();
            $("#saveuserbtn").removeAttr("disabled")
          }
        })
    }
  });
  $('#user').removeAttr('onsubmit');
  // add user Actions
  $("#user").submit(function (e) {
    e.preventDefault();
    console.log(e)
    firebase.database()
      .ref("users")
      .child($("input[name='civil-no']").val())
      .update({
        courseKey: $("#course-name").val(),
        company: $("#ins-name").val(),
        identity: $("input[name='civil-no']").val(),
        name: $("input[name='arabic-name']").val(),
        nameInEnglish: $("input[name='english-name']").val(),
        number: $("input[name='phone']").val(),
        email: $("input[name='email']").val(),
        stauts: $("#stauts").val(),
      }).then(function (snap) {
        console.log(snap)
        firebase.database()
          .ref("institutesInfo")
          .child($("#ins-name").val())
          .child($("input[name='civil-no']").val())
          .update({
            uid: $("input[name='civil-no']").val(),
          }).then(function (snap2) {
            console.log(snap2)
            firebase.database()
              .ref("courseInfo")
              .child($("#course-name").val())
              .child("users")
              .child($("input[name='civil-no']").val())
              .update({
                uid: $("input[name='civil-no']").val(),
              }).then(function (snap3) {
                console.log(snap3)
                firebase.database()
                  .ref("usersCourses")
                  .child($("input[name='civil-no']").val())
                  .child($("#course-name").val())
                  .update({
                    feedback: false,
                    coursekey: $("#course-name").val()
                  }).then(function (snap4) {
                    console.log(snap4)
                    location.reload()
                  })

              })
          })
      })
    e.preventDefault();
    return false


  })
  //add institutes Actions
  $("#saveIns").click(function () {
    let ins = {
      name: '',
      nameEn: "",
    };
    ins.name = $('input[name="insNameAr"]').val();
    ins.nameEn = $('input[name="insNameEn"]').val()
    if (ins.name != '' && ins.nameEn != '') {
      $(".modal-body .item .alert").fadeOut();
      addins(ins);
      $('.bs-example-modal-lg').modal('toggle');

    } else {
      $(".modal-body .item .alert").fadeIn();
    }


  })

  function addins(ins) {
    firebase.database().ref("institutes").push({
      name: ins.name,
      nameInEnglish: ins.nameEn
    })
  }
})

var couresList = [],
  insdata = []
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
    $("#sel1").append(options)
  })
firebase.database().ref("institutes")
  .orderByKey()
  .once("value")
  .then(function (snapshot) {
    index = 0
    options = "",
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        insdata.push({
          key: childSnapshot.key,
          data: childData
        })
        options += '<option value="' + index + '">' + childData.name + '</option>'
        index++;
      });
    $("#institutes").append(options)
  })
$("#my_file_output").hide()
$(function () {
  alert("قبل رفع الملف يجب عليك اختيار البرنامج والجهه التابعه لها")
  var filepath,
    filedata
  $('#my_file_input').change(function (e) {
    filepath = URL.createObjectURL(e.target.files[0])
  })
  $("#upload").submit(function (e) {
    e.preventDefault();
    var oReq = new XMLHttpRequest();
    oReq.open("GET", filepath, true);
    oReq.responseType = "arraybuffer";
    oReq.onload = function (e) {
      var arraybuffer = oReq.response;
      /* convert data to binary string */
      var data = new Uint8Array(arraybuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      /* Call XLSX */
      var workbook = XLSX.read(bstr, {
        type: "binary"
      });
      /* DO SOMETHING WITH workbook HERE */
      var first_sheet_name = workbook.SheetNames[0];
      /* Get worksheet */
      var worksheet = workbook.Sheets[first_sheet_name];
      filedata = XLSX.utils.sheet_to_json(worksheet, {
        raw: true
      });
      var tabcontene = "", index = 0
      filedata.forEach(function (item) {
        index++
        item.company = insdata[$("#upload [name=institute]").val()].key
        console.log(couresList)
        item.courseKey = couresList[$("#upload [name=program]").val()].key
        console.log(item)
        tabcontene += "<tr>" +
          "<td>" + index + "</td>" +
          "<td>" + item.name + "</td>"
          + "<td>" + item.nameInEnglish + "</td>"
          + "<td>" + item.identity + "</td>"
          + "<td>" + item.email + "</td>"
          + "<td>" + item.number + "</td>"
          + "<td>" + couresList[$("#upload [name=program]").val()].data.name + "</td>"
          + "<td>" + insdata[$("#upload [name=institute]").val()].data.name + "</td>"
          + "<td>" + item.stauts + "</td>"
          + "</tr>"
        /*  firebase.database().ref("users/"+item.identity) */
      })
      $("#my_file_output tbody").html(tabcontene);
      $("#my_file_output").fadeIn();

    }
    oReq.send();
  });
  $("#add").click(function (e) {
    e.preventDefault();
    console.log($('#check_identity').is(":checked"))
    if($('#check_identity').is(":checked")){
      filedata.forEach(function (item) {
      firebase.database().ref("users/" + item.identity).update(item)
        .then(function (res) {
          console.log(res)
          firebase.database().ref("institutesInfo/" + item.company + "/" + item.identity)
            .update({ uid: item.identity })
            .then(function (res) {
              console.log(res)
            })
          firebase.database().ref("courseInfo/"+item.courseKey+"/users/" + item.identity)
            .update({ uid: item.identity })
            .then(function (res) {
              console.log(res)
            })
          firebase.database().ref("usersCourses/" + item.identity+"/"+item.courseKey)
            .update({
              feedback: false,
              coursekey: item.courseKey
            })
            .then(function (res) {
              console.log(res)
            })
        })
    })
    }else{
      alert("يجب عليك التاكد من البيانات المضافه والارقام المدنيه")
    }
    
  })
});

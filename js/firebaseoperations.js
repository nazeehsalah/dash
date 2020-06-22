$(function () {
  
  // Initialize Firebase
 
  $("#login").click(function () {
    firebase.auth().signInWithEmailAndPassword($("#email").val(), $("#pass").val())
      .then(function (res) {
        console.log(res)
        console.log("done")
        $(location).attr('href', "institutes.html");
      })
      .catch(function (err) {
        // Handle errors
        console.log(err)
        $(".alert-danger").show();
      });
  })
})
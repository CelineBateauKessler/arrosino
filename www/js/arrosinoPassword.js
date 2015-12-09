function processPassword() {
  var password = $('#password');
  password.removeClass("alert-danger");

  if (password.val() == ''){
    password.focus() ;
    password.addClass("alert-danger");
  }
  else
  {
  // Check password and enter connected mode
  $.ajax({type : 'POST',
          data : {password : password.val()},
          url  : 'php/processConnection.php'
        })
        .done(function(reponse) {
          console.log(reponse);
          if (reponse === 'CONNECTED') {
            window.location = 'index.php';
          }
          else {
            password.prev().html('Try again');
            password.addClass("alert-danger");
            password.val('');
          }
      	})
      	.fail(function() {
      		console.log("error");
      	})
      	.always(function() {
      		return false;
      	});
  }
}

$("#enterPassword").click(function(){
  processPassword();
})

$("body").on('keyup', "#password", function(key){
	var theKey = key.which || key.keyCode; // le code est compatible tous navigateurs grâce à ces deux propriétés
	if(theKey == 13){
		processPassword();
	}
})

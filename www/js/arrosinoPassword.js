$("#enterPassword").click(function(){
  var password = $('#password');
  password.removeClass("alert alert-danger");
  console.log(password.val());

  if (password.val() == ''){
    password.focus() ;
    password.addClass("alert alert-danger");
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
          //window.location = '/sd/arrosino/index.php';
      	})
      	.fail(function() {
      		console.log("error");
      	})
      	.always(function() {
      		return false;
      	});
  }
})

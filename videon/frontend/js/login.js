/*jshint esversion: 6 */ 

(function(){
    "use strict";

    window.addEventListener('load', function(){

        api.getCurrentUser(function(user) {
            if (user) location.href = "/";
        });
        function submit(){
            console.log(document.querySelector("form").checkValidity());
            if (document.querySelector("form").checkValidity()){
                var username = document.querySelector("form [name=username]").value;
                var password =document.querySelector("form [name=password]").value;
                api.login(username, password, function(err, res){
                    if (err) document.querySelector('.alert').innerHTML = err;
                    else window.location = '/';
                });
            }
        }

        document.querySelector("#login_button").addEventListener("click", function(e) {
            e.preventDefault();
            submit();
        });
    });
}());
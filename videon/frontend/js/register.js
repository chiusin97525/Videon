/*jshint esversion: 6 */ 

(function(){
    "use strict";

    window.addEventListener('load', function(){

        if (api.getCurrentUser()) {
            location.href = "/";
        }

        function submit(){
            console.log(document.querySelector("form").checkValidity());
            if (document.querySelector("form").checkValidity()){
                var username = document.querySelector("form [name=username]").value;
                var email = document.querySelector("form [name=email]").value;
                var password =document.querySelector("form [name=password]").value;
                var repassword =document.querySelector("form [name=repassword]").value;
                if (password !== repassword) document.querySelector('.alert').innerHTML = "Passwords do not match.";
                else {
                    api.register(email, username, password, function(err, res){
                        if (err) document.querySelector('.alert').innerHTML = err;
                        else window.location = '/';
                    });
                }
            }
        }

        document.querySelector("#register_button").addEventListener("click", function(e) {
            e.preventDefault();
            submit();
        });
    });
}());
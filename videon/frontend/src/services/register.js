import api from '@/services/api'

export default {
	register: function(event, email, username, password) {
		api().post('/register/', {email: email, username: username, password: password})
		.then(response => {
			if (response.status == '200') {
				window.location.href = "/login";
				//event.$router.push('/')
			}
		})
		.catch(function(e) {
            if (e.response) {
                event.message = e.response.data;
            }
		})
	}
}
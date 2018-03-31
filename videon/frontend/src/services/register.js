import api from '@/services/api'

export default {
	register: function(event, email, username, password) {
		api().post('/register/', {email: email, username: username, password: password})
		.then(response => {
			if (response.status == '200') {
				//event.$router.push('/')
				window.location.href = "/";
			}
		})
		.catch(function(e) {
            if (e.response) {
                event.message = e.response.data;
            }
		})
	}
}
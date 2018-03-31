import api from '@/services/api'

export default {
	login: function(event, username, password) {
		api().post('/login/', {username: username, password: password})
		.then(response => {
			if (response.status == '200') {
				document.getElementById("navbar").classList.remove("hidden");
				event.$router.push('/');
			}
		})
		.catch(function(e) {
			if (e.response) {
				event.message = e.response.data;
			}
		})
	}
}
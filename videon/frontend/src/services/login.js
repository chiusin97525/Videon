import api from '@/services/api'

export default {
	login: function(event, username, password) {
		api().post('/login/', {username: username, password: password})
		.then(response => {
			document.getElementById("navbar").classList.remove("hidden");
			window.location.href = '/';
		})
		.catch(function(e) {
			if (e.response) {
				event.message = e.response.data;
			}
		})
	}
}
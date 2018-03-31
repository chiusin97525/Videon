import api from '@/services/api'

export default {
	redirect: function(event) {
		api().get('/currentUser/')
		.then(response => {
			if (response.data) {
				document.getElementById("navbar").classList.remove("hidden");
				event.$router.push('/');
			} else {
				document.getElementById("navbar").classList.add("hidden");
				event.$router.push('/login');
			}
		})
		.catch (function(e) {
			if (e.response) {
				console.log(e.response.data);
			}
		})
	},

	logout: function(event) {
		api().get('logout')
		.then(response => {
			event.$router.push('/login');
		})
		.catch (function(e) {
			if (e.response) {
				console.log(e.response.data);
			}
		})
	}
}
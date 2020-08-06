var input = document.getElementById("usrMessageInput");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13 && input.value !== '') {
    event.preventDefault();
    send()
  }
});

var session_id = '';

function send(){
	var txtVal = document.getElementById('usrMessageInput').value,
		listNode = document.getElementById('messages'),
		liNode = document.createElement("li")
		txtNode = document.createTextNode(txtVal+'\u200E');

	liNode.className = "usrMessage";
	liNode.appendChild(txtNode);
	listNode.appendChild(liNode);

	local = window.location.href;
	if (local.includes('#')){
		local = local.split('#')[0];
	}
	const url = local + '/input?msg=' + txtVal+'|'+session_id;
	document.getElementById('usrMessageInput').value = '';
	var request = new Request(url, {method: 'GET'});
	console.log('request =', request);
	var responseVal;
	fetch(request)
		.then(function(response) {
			console.log('response =', response);
			return response.text();
		})
		.then(function(data) {
			responseVal = data.split('|')[0];
			session_id = data.split('|')[1];
			if (session_id === null){
				session_id = '';
			}
			console.log(responseVal)
			console.log(session_id)

			if (responseVal.includes("Repl")){
				responseVal = "Lo sentimos hubo un error al procesar tu mensaje, intente de nuevo."
			}
			if (responseVal.includes("Internal")){
				responseVal = "Lo sentimos hubo un error al procesar tu mensaje, intente de nuevo."
			}
			
			var liNode2 = document.createElement("li"),
				txtNode2 = document.createTextNode(responseVal);
				liNode2.className = "botMessage";
				liNode2.appendChild(txtNode2);
				listNode.appendChild(liNode2);
		})
		.catch(function(err) {
			console.error(err);
		});
}
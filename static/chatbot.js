
//Send message on enter key up.
var input = document.getElementById("usrMessageInput");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13 && input.value !== '') {
    event.preventDefault();
    send()
  }
});

//Initiate session_id for watson session.
var session_id = '';

function send(){

	//Obtain user message and create message node for display.
	var txtVal = document.getElementById('usrMessageInput').value,
		listNode = document.getElementById('messages'),
		liNode = document.createElement("li")
		txtNode = document.createTextNode(txtVal+'\u200E');

	//Add and display user message
	liNode.className = "usrMessage";
	liNode.appendChild(txtNode);
	listNode.appendChild(liNode);

	//Define current path
	local = window.location.href;
	if (local.includes('#')){
		local = local.split('#')[0];
	}

	//Append user message and session_id to be sent to server.
	const url = local + '/input?msg=' + txtVal+'|'+session_id;

	//Clear Text Box
	document.getElementById('usrMessageInput').value = '';
	
	//Make GET Request to server with message and session_id as parameters
	var request = new Request(url, {method: 'GET'});
	console.log('request =', request);
	var responseVal;
	fetch(request)
		.then(function(response) {
			console.log('response =', response);
			return response.text();
		})
		.then(function(data) {

			//Separate and extract text answer and session_id from response
			responseVal = data.split('|')[0];
			session_id = data.split('|')[1];
			if (session_id === null){
				session_id = '';
			}

			//Debugging
			console.log(responseVal)
			console.log(session_id)

			//Contingency for server down or unavailable.
			if (responseVal.includes("Repl")){
				responseVal = "Server Error."
			}
			if (responseVal.includes("Internal")){
				responseVal = "Server Error."
			}
			
			//Create and add to chat watsons text response.
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
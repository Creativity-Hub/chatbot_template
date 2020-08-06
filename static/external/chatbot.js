document.getElementById('chatbot').style.display = "none";

function openChatbot(){
	console.log('clicked')
	document.getElementById('chatbot').style.display = "block";
	document.getElementById('chatbot_floating_button').style.display = "none";
	return false;
}

function closeChatbot(){
	console.log('clicked')
	document.getElementById('chatbot').style.display = "none";
	document.getElementById('chatbot_floating_button').style.display = "block";
	return false;
}


var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
}
else{
	document.getElementById('usrMessageInput').focus();
}

function downloadInnerHtml(filename, elId, mimeType) {
    filename = 'chat.html';
		mimeType = 'text/html';
		var elHtml = document.getElementById('messages').innerHTML;
    var link = document.createElement('a');
    mimeType = mimeType || 'text/plain';
    link.setAttribute('download', filename);
    link.setAttribute('href', 'data:' + mimeType  +  ';charset=utf-8,' + encodeURIComponent(elHtml));
    link.click(); 
}

var session_id = '';

var input = document.getElementById("usrMessageInput");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13 && input.value !== '') {
    event.preventDefault();
    send()
  }
});

function send(){
	var check = document.getElementById('usrMessageInput').value;
	if (check === 'export'){
		downloadInnerHtml();
	}
	else if (check != ''){
		sendForReals();
	}
}
var listNode = document.getElementById('messages');

function createBubble(text, clase){

	if (text.includes('<')){
		listNode.innerHTML += '<div class="botMessage">'+text+'</div>';
	}
	else if (text.includes('http')){
		listNode.innerHTML += '<a href="'+text+'"><div class=" frame"><img class="media" src="'+text+'"></div></a>';
	}
	else{
		var liNode2 = document.createElement("div"),
					txtNode2 = document.createTextNode(text);
					liNode2.className = clase;
		liNode2.appendChild(txtNode2);
		listNode.appendChild(liNode2);
	}
	listNode.innerHTML += '<div class="divider"></div>';
}

function sendForReals(){
	if (isMobile)
		document.getElementById('usrMessageInput').blur();
	var txtVal = document.getElementById('usrMessageInput').value;
	createBubble(txtVal+'\u200E', "usrMessage" );
	
	//Agrego bubble con texto ingresado por el usr
	
	listNode.innerHTML += '<div id="loadingLi"><img class="loading" src="static/loading.gif"></div>';
	listNode.scrollIntoView({ behavior: 'smooth', block: 'end' });
	//call a nuestra api
	//const url = window.location.href + 'input?msg=' + txtVal+'|'+session_id;

	const external_url = "https://chatbot.ignaciopardo.repl.co/"
	const url = "https://cors-anywhere.herokuapp.com/" + external_url + 'input?msg=' + txtVal + '|' + session_id;

	document.getElementById('usrMessageInput').value = '';

	var request = new Request(url, {method: 'GET'});
	//console.log('request =', request);
	var responseVal;
	fetch(request)
		.then(function(response) {
			//console.log('response =', response);
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
			
			var loading = document.getElementById('loadingLi');
			loading.parentNode.removeChild(loading);

			var res = responseVal.split("\n");
			for (var i = 0; i<res.length; i++){
				createBubble(res[i], "botMessage");
			}
			listNode.scrollIntoView({ behavior: 'smooth', block: 'end' });
		})
		.catch(function(err) {
			console.error(err);
		});
}
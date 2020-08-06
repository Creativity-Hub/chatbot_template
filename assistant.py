#IBM Watson dependencies
from ibm_watson import AssistantV2
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

#Disables https for watson calls.
import ssl
https_context = ssl._create_unverified_context
import os

def sendToAssistant(textInput):

	assistant_apiKey = os.getenv("assistant_apiKey")
	assistant_url = os.getenv("assistant_url")
	assistant_id = os.getenv("assistant_id")

	authenticator = IAMAuthenticator(assistant_apiKey)
	assistant = AssistantV2(
	    version='2020-02-05',
	    authenticator=authenticator
	)
	assistant.set_service_url(assistant_url)
	assistant.set_disable_ssl_verification(True)
	
	if '|' in textInput:
		#'|' is use on GET query to divide between usr message and session_id
		params = textInput.split('|')
		textInput = params[0]
		
		if params[1] == '':
			#No session_id was previously established
			#session_id is created
			session_id = assistant.create_session(
					assistant_id=assistant_id
			).get_result()['session_id']
			
		else:
			#Obtains existing session_id
			session_id = params[1]
		
		#Calls for Watsons message interpretation
		response = assistant.message(
				assistant_id=assistant_id,
				session_id=session_id,
				input={
						'message_type': 'text',
						'text': textInput,
						'options': {
							'return_context': True
					}
				}
		).get_result()
		#Returns both Watsons response and current session_id
		return response, session_id
	
	#session_id is created
	session_id = assistant.create_session(
					assistant_id=assistant_id
			).get_result()['session_id']

	#Calls for Watsons message interpretation
	response = assistant.message(
				assistant_id=assistant_id,
				session_id=session_id,
				input={
						'message_type': 'text',
						'text': textInput
					}
		).get_result()
	
	#Returns Watsons response, and invalid session_id
	return response, 0
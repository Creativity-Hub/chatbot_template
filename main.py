#Server dependencies
from gevent.pywsgi import WSGIServer
from threading import Thread
from flask import Flask, request, send_from_directory
from flask_mobility import Mobility
import os

#Apis used
from assistant import sendToAssistant

#File management
from bs4 import BeautifulSoup
import codecs
import re
import json
import logging

#Miscelaneous
from datetime import datetime

#Warnings
import warnings
#warnings.filterwarnings("ignore")

#Logging configuration set to debug on history.log file
#logging.basicConfig(filename='history.log', level=logging.DEBUG)
#logging.basicConfig(
#    format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p')


def run():
    #Flask built in deploy for development (lazy loading)
    app.run(host='0.0.0.0',port=8081)

    #WSGIServer deploy for production.
    #WSGIServer(('', 8081), app).serve_forever()


#Cache reloading medthod
def cacheWorkaround(file):
    date = datetime.today().strftime('%Y-%m-%d')
    return file.read().replace('REPLACE', date)


#Open html files
def loadPage(src):
    return codecs.open(src, "r", "utf-8").read()


#Designated thread for server proccess
def keep_alive():
    t = Thread(target=run)
    t.start()


#Flask app
app = Flask(__name__)
Mobility(app)


#Disable unneeded dependencies logging
#werkzeugLog = logging.getLogger('werkzeug')
#werkzeugLog.disabled = True
#requestsLog = logging.getLogger("urllib3.connectionpool")
#requestsLog.disabled = True


@app.route('/')
def main():
    #Main endpoint corresponds to index.html
		site = loadPage("index.html")
		return site


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, 'static'),
        'favicon.ico',
        mimetype='image/vnd.microsoft.icon')


@app.route('/input', methods=['GET'])
@app.route('/demo/input', methods=['GET'])
def web():
    #server endpoint for client-watson connection
    msg = request.args.get('msg')
    if '\n' in msg:
        msg = msg.replace('\n', '')
    #logging.info('Incoming: ' + msg)
    session_id = ''
    try:
        #sends input to watson for message analize
        response, session_id = sendToAssistant(msg)
        #logging.info('Watson: ' + str(response))

    except:
        #Critical error, either watsons response was uncall for, or server error.
        response = "Lo sentimos hubo un error al procesar tu mensaje, intenta refrasearlo."

    #logging.info('Out: ' + response)

    return json.dumps(response)+'|'+str(session_id)

if __name__ == '__main__':
    keep_alive()

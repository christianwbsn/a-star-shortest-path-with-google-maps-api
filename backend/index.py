from flask import Flask
from flask import jsonify
from flask import request
from crossdomain import *
import astar

app = Flask(__name__)

@app.route('/a-star', methods=['POST', 'OPTIONS', 'GET'])
@crossdomain(origin='*')
def astarRoute():
	if (request.method == 'POST'):
		print(request.form)
		return jsonify(astar.receive(request.form))
	else:
		return 'ok'
from flask import Flask
from flask import jsonify
from flask import request
from crossdomain import *
import astar

app = Flask(__name__)

@app.route('/a-star', methods=['POST'])
@crossdomain(origin='*')
def hello_world():
    return jsonify(astar.receive(request.form))
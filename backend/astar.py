import json
import heapq
import math

class Graph:
	node = []
	adj = []
	idxStart = 0
	idxEnd = 0

	def __init__(self, _node, _edge, _start, _end):
		self.node = []
		self.adj = [[] for i in _node]
		for n in _node:
			self.node.append((n['lat'], n['lng']))
		for e in _edge:
			self.adj[e['a']].append((e['b'], self.calcDist(e['a'], e['b'])))
			self.adj[e['b']].append((e['a'], self.calcDist(e['a'], e['b'])))
		self.idxStart = _start
		self.idxEnd = _end

	def calcDist(self, a, b):
		return math.sqrt(
			(self.node[a][0] - self.node[b][0]) * (self.node[a][0] - self.node[b][0]) +
			(self.node[a][1] - self.node[b][1]) * (self.node[a][1] - self.node[b][1]))

	def astar(self):
		dist = [-1 for i in self.node]
		pre  = [ i for i in range(len(self.node))]
		pq = []
		# element of pq:
		#   [0] => A* value
		#   [1] => actual dist
		#   [2] => dest index
		#   [3] => pre index
		heapq.heappush(pq, (0, 0, self.idxStart, self.idxStart))
		while (len(pq) > 0):
			top = heapq.heappop(pq)
			if (dist[top[2]] == -1):
				dist[top[2]] = top[1]
				pre[top[2]] = top[3]
				if (top[2] == self.idxEnd):
					break
				for n in self.adj[top[2]]:
					heapq.heappush(pq, (top[1] + n[1] + self.calcDist(self.idxEnd, n[0]), top[1] + n[1], n[0], top[2]))
		last = self.idxEnd
		route = [last]
		while (last != self.idxStart):
			last = pre[last]
			route = [last] + route
		return route

	def dd(self):
		return {
			'node': self.node,
			'adj' : self.adj,
			'idxStart': self.idxStart,
			'idxEnd'  : self.idxEnd
		}

def receive(req):
	g = Graph(
		json.loads(req['node']),
		json.loads(req['edge']),
		json.loads(req['start']),
		json.loads(req['end'])
	)
	return g.astar()

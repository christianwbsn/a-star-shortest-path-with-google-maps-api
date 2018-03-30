import astar

def main():
	g = astar.Graph(
		[
			{ 'lat':  0, 'lng': 0 },
			{ 'lat':  5, 'lng': 0 },
			{ 'lat': -1, 'lng': 0 },
			{ 'lat': -2, 'lng': 0 },
			{ 'lat': -3, 'lng': 0 },
			{ 'lat': -4, 'lng': 0 }
		], [
			{ 'a': 0, 'b': 2 },
			{ 'a': 0, 'b': 1 },
			{ 'a': 2, 'b': 3 },
			{ 'a': 3, 'b': 4 },
			{ 'a': 4, 'b': 5 }
		], 0, 1
	)
	print(g.astar())

main()
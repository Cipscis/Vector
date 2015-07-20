define([
	'Vector/Vector',
	'Vector/Plane'
], function (Vector, Plane) {

	var Line = function (direction, origin) {
		this.direction = (direction && direction instanceof Vector) ? direction.normalise() : new Vector(0, 0, 1);

		this.origin = (origin && origin instanceof Vector) ? origin : new Vector(0, 0, 0);
	};

	Line.prototype.intersectPlane = function (plane) {
		if (!(plane instanceof Plane)) {
			return undefined;
		}

		var nv = plane.normal.dot(this.direction),
			no = plane.normal.dot(this.origin),

			t = (plane.p - no)/nv,
			i = this.origin.i + this.direction.i * t,
			j = this.origin.j + this.direction.j * t,
			k = this.origin.k + this.direction.k * t;

		return new Vector(i, j, k);
	};

	Line.prototype.intersectLine = function (line) {
		if (!(line instanceof Line)) {
			return undefined;
		}

		// http://mathforum.org/library/drmath/view/62814.html

		// Check V1 x V2 is non-zero
		// a (V1 x V2) = (O2 - O1) x V2
		// P = O1 + a V1

		var cross = this.direction.cross(line.direction);

		if (cross.magnitude() === 0) {
			return undefined;
		}

		var lhs = this.direction.cross(line.direction);
		var rhs = (line.origin.subtract(this.origin)).cross(line.direction);

		// If the cross product was non-zero, these must be parallel but some components may be 0
		var scale = lhs.i/rhs.i || lhs.j/rhs.j || lhs.k/rhs.k;

		var intersect = this.origin.add(this.direction.multiply(scale));

		return intersect;
	};

	Line.prototype.intersectPoint = function (point) {
		if (!(point instanceof Vector)) {
			return undefined;
		}

		// Create orthogonal plane at point, is intersection with plane at point?
		var plane = new Plane(this.direction, new Vector(point.i, point.j, point.k)),
			intersect = this.intersectPlane(plane);

		return (intersect.i === point.i && intersect.j === point.j && intersect.k === point.k);
	};

	Line.prototype.reflect = function (plane) {
		if (!(plane instanceof Plane)) {
			return undefined;
		}

		var direction = this.direction.reflect(plane.normal),
			origin = this.intersectPlane(plane);

		return new Line(direction, origin);
	};

	return Line;

});
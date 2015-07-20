define([
	'Vector/Vector'
], function (Vector) {

	var Plane = function (normal, origin) {
		this.normal = (normal && normal instanceof Vector) ? normal.normalise() : new Vector(0, 0, 1);

		this.origin = (origin && origin instanceof Vector) ? origin : new Vector(0, 0, 0);

		this.a = this.normal.i;
		this.b = this.normal.j;
		this.c = this.normal.k;
		this.p = this.a*this.origin.i + this.b*this.origin.j + this.c*this.origin.k;
	};

	Plane.prototype.angle = function (that) {
		if (!(that instanceof Plane)) {
			return undefined;
		}

		return this.normal.angle(that.normal);
	};

	return Plane;

});
jui.define("chart.brush.splitline", [ "util.base" ], function(_) {

	var SplitLineBrush = function() {

        this.createLine = function(pos, index) {
            var opts = {
                stroke: this.chart.color(index, this.brush),
                "stroke-width": this.chart.theme("lineBorderWidth"),
                fill: "transparent"
            };

            var split = this.brush.split,
                symbol = this.brush.symbol;

            var x = pos.x,
                y = pos.y,
                px, py; // curve에서 사용함

            var g = this.chart.svg.group(),
                p = this.chart.svg.path(opts).MoveTo(x[0], y[0]);

            if(symbol == "curve") {
                px = this.curvePoints(x);
                py = this.curvePoints(y);
            }

            for (var i = 0; i < x.length - 1; i++) {
                if(i == split) {
                    var color = this.chart.theme("lineSplitBorderColor"),
                        opacity = this.chart.theme("lineSplitBorderOpacity");

                    g.append(p);

                    opts["stroke"] = (color != null) ? color : opts["stroke"];
                    opts["stroke-opacity"] = opacity;

                    p = this.chart.svg.path(opts).MoveTo(x[i], y[i]);
                }

                if(symbol == "step") {
                    var sx = x[i] + ((x[i + 1] - x[i]) / 2);

                    p.LineTo(sx, y[i]);
                    p.LineTo(sx, y[i + 1]);
                }

                if(symbol != "curve") {
                    p.LineTo(x[i + 1], y[i + 1]);
                } else {
                    p.CurveTo(px.p1[i], py.p1[i], px.p2[i], py.p2[i], x[i + 1], y[i + 1]);
                }
            }

            g.append(p);

            return g;
        }

        this.drawLine = function(path) {
            var g = this.chart.svg.group();

            for (var k = 0; k < path.length; k++) {
                var p = this.createLine(path[k], k);

                this.addEvent(p, k, null);
                g.append(p);
            }

            return g;
        }

        this.draw = function() {
            return this.drawLine(this.getXY());
        }

        this.drawSetup = function() {
            return this.getOptions({
                symbol: "normal", // normal, curve, step
                split: null
            });
        }
	}

	return SplitLineBrush;
}, "chart.brush.core");
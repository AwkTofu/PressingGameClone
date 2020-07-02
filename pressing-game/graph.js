function Graph(graph_id)
{
	this.graph_id = graph_id || ouuid("graph");

	var self = this;

	this.toggle_state = "closed";

	this.mode = "build";
	this.new_vertex_color = "dark"; // "dark" or "light"
	this.jump_index =- 1;
	this.pressing_sequence = [];

	this.set_mode = function(mode)
	{
		self.mode = mode;
		if (self.mode === "build")
		{
			self.enable_add_vertex();
		}
		else
		{
			self.disable_add_vertex();
		}
		self.change_mode_button_text();
	}

	this.change_mode = function()
	{
		if (self.mode === "build")
		{
			self.mode = "play";
			self.disable_add_vertex();
			self.clear_highlights();
			self.jump_index=self.undo_index;
			self.stash();
			d3.select("#toggleMode")
				.attr("fill", "#008000");
		}
		else
		{
			self.mode = "build";
			self.enable_add_vertex();
			self.jump();
			d3.select("#toggleMode")
				.attr("fill", "#ec0000");
		}
		self.change_mode_button_text();
	}


	this.change_mode_button_text = function()
	{
		if (self.mode === "play")
		{
			d3.selectAll("#mode_mg_text").remove();
			/* should take values from buttonAttrs */
			/* Buttons should be in order of appearance in the hash corresponding to top to bottom order in UI */
			append_text("#mode_mg_g", "PLAY", "mode_mg_text", self.buttonAttrs[0]['text_X_Spacing'], self.buttonAttrs[0]['text_Y_spacing']+ self.UI_top_offset, "black", 3);
		}
		else
		{			d3.selectAll("#mode_mg_text").remove();
			append_text("#mode_mg_g", "BUILD", "mode_mg_text", self.buttonAttrs[0]['text_X_Spacing'], self.buttonAttrs[0]['text_Y_spacing']+ self.UI_top_offset,  "black", 3);
		}
	}

	this.set_color = function(color)
	{
		self.new_vertex_color = color;
	}

	this.toggle_color = function()
	{
		self.change_color_button_text_color(self.new_vertex_color);
		if (self.vertex_highlighted === null)
		{
			if (self.new_vertex_color === "dark")
			{
				self.new_vertex_color = "light";
				d3.select("#toggleIndicator")
					.attr("fill", "#ffffff")
				d3.select("#toggleIndicator1")
					.attr("fill", "#ffffff")
				d3.select("#toggleIndicator2")
					.attr("fill", "#ffffff")
				self.change_color_button_text_color(self.new_vertex_color);
			}
			else
			{
				self.new_vertex_color = "dark";
				d3.select("#toggleIndicator")
					.attr("fill", "#000000")
				d3.select("#toggleIndicator1")
					.attr("fill", "#000000")
				d3.select("#toggleIndicator2")
					.attr("fill", "#000000")
				self.change_color_button_text_color(self.new_vertex_color);
			}
		}
		else
		{
			var v = self.vertices[self.vertex_highlighted];
			self.vertex_highlighted = null;
			v.flip_and_swap_build();
		}
		self.stash();
	}

	this.change_color_button_text_color = function(color)
	{
		var text_color = d3.selectAll("#color_text");
		if (color === "dark")
		{
			text_color.attr("fill", "#ffffff");
			d3.selectAll("#color")
				.attr("fill", "#000000");
		}
		else
		{
			text_color.attr("fill", "#000000");
			d3.selectAll("#color")
				.attr("fill", "#ffffff");
		}
	}

	this.svg_attrs = {
		// Using a 16:9 ratio for a canvas ensures the entire surface is visible on all mobile devices.
		"viewBox":"0 0 " + 1600 + " " + 900,
		"preserveAspectRatio":"xMinYMin meet",
	};

	this.graph_surface_attrs = {
		"id":"bknd",
		"x":50,
		"y":50,
		"width":1500,
		"height":800,
		"fill":"#000000"
	};

	this.vertices = {};
	this.edges = {};
	this.undo_array = [];
	this.undo_index = -1;
	this.bounding_box = [];
	this.toplabel_length;
	this.rowdigits_length;

	this.vertex_highlighted = null;
	this.edge_highlighted = null;

	this.clear_highlights = function()
	{
		this.clear_edge_highlight();
		this.clear_vertex_highlight();
	}

	this.clear_edge_highlight = function()
	{
		if (self.edge_highlighted != null)
 		{
			d3.select("#"+self.edge_highlighted).attr('stroke', '#ffffff');
 			self.edge_highlighted = null;
 		}
	}

	this.clear_vertex_highlight = function()
	{
		if (self.vertex_highlighted != null)
		{
			self.change_color_button_text_color(self.new_vertex_color);
			self.vertices[self.vertex_highlighted].draw("initial");
			self.vertex_highlighted = null;
		}
	}

	this.get_bounding_box = function()
	{
		var offset_for_vertex_stroke = Math.ceil(GRAPH_STROKE_WIDTH/2.0);
		this.bounding_box = [
			this.graph_surface_attrs.x + offset_for_vertex_stroke,
			this.graph_surface_attrs.y + offset_for_vertex_stroke,
			this.graph_surface_attrs.x + this.graph_surface_attrs.width - offset_for_vertex_stroke,
			this.graph_surface_attrs.y + this.graph_surface_attrs.height - offset_for_vertex_stroke,
		];
	}

	this.enable_add_vertex = function()
	{

		d3.select("#bknd").on("click", function()
		{
			var coords = d3.mouse(this);

			//Clear Vertex Highlighted
			if (self.vertex_highlighted !== null)
				self.clear_vertex_highlight();
			//Clear Edge Highlight
			else if (self.edge_highlighted !== null)
				self.clear_edge_highlight();
			else //To make new vertex
				new Vertex(coords[0], coords[1], self, self.new_vertex_color);
			self.stash();
		});
	};

	this.disable_add_vertex = function()
	{
		d3.select("#bknd").on("click", null);
	}

	this.modify_neighborhood = function(clicked_vertex)
	{
		d3.select("#" + "sequence").style("opacity", 1);
		// We can't click a white vertex, but we CAN click a vertex with no edges.
		if (clicked_vertex.state === clicked_vertex.static_state)
		{
			return;
		}

		clicked_vertex.flip_state_play();
		var vn, v = [];
		clicked_vertex.edge_keys().forEach(function(key)
		{
			vn = clicked_vertex.edges[key].vertices_excluding(clicked_vertex.attrs.id);
			v.push(vn);
			vn.flip_state_play();
			clicked_vertex.edges[key].destroy();
		});
		var len = (v.length - 1),
			rest = [],
			vertices_needing_edges = [],
			edge_to_check, connected_vertex,
			e = [];
		for (var n = 0; n < len; n++)
		{
			rest = v.slice(n + 1, v.length); // slice is non-destructive; creates a copy, not a reference
			vertices_needing_edges = rest.slice(0, rest.length);
			v[n].edge_keys().forEach(function(key)
			{
				edge_to_check = v[n].edges[key];
				connected_vertex = edge_to_check.vertices_excluding(v[n].attrs.id);
				// for any given connected Vertex, if the Vertex is a member of the neighborhood in 'rest'...
				if (contains(rest, connected_vertex))
				{
					// then destroy this Edge and all references to it
					edge_to_check.destroy();
					// and remove the vertex from vertices_needing_edges
					vertices_needing_edges.splice(vertices_needing_edges.indexOf(connected_vertex), 1); // splice is destructive
				}
			});
			// Initialize new Edges to be created at end of loop over v[n].edge_keys().
			vertices_needing_edges.forEach(function (cv)
			{
				e.push(new Edge(v[n], cv, self));
			});
		}
		// Create new edges between v[n] and the remaining vertices in rest.
		e.forEach(function (ne)
		{
			ne.create(true);
		});
	};

	this.clear = function()
	{
		for(var vertex in self.vertices) self.vertices[vertex].destroy();
		for(var edge in self.edges) self.edges[edge].destroy();
		self.vertex_highlighted = null;
		self.undo_array = [];
		self.undo_index = -1;
		self.pressing_sequence=[];
		/*
			undo and redo reassign values for the following on import; we need to return to "build" defaults if we press the
			clear button.
		*/
		self.set_mode("build");
		self.set_color("dark");
		self.change_color_button_text_color("dark");
		self.disable_sequence_button();
		self.disable_matrix_button();
		d3.select("#mode_mg_text").text("BUILD");
		d3.select("#toggleMode").attr("fill", "#ec0000");
	};

	this.stash = function()
	{
		var snap = JSON.parse(self.export());
		if(typeof snap !== "undefined" && snap !== null) {
			//When a new action occurs, removes ALL future indexs from array
			self.undo_array.splice(self.undo_index + 1);
			self.undo_index++;
			self.undo_array.push(snap);
		}

		//Enable and disable Matrix Button
		if(Object.keys(self.vertices).length > 0){
			self.enable_matrix_button();
		}
		else{
			self.disable_matrix_button();
		}
	};

	this.undo = function()
	{
		if (self.undo_index != -1)
			self.change_array(-1);
	};

	this.redo = function()
	{
		if (self.undo_index != self.undo_array.length - 1)
			self.change_array(1);
	};

	this.change_array = function(indexchange)
	{
		self.undo_index += indexchange;
		var array = self.undo_array;
		var index = self.undo_index;
		self.import(array[index])
		self.undo_array = array;
		self.undo_index = index;
	}

	this.jump = function()
	{
		self.change_array(self.jump_index - self.undo_index);
	}

	this.get_coordinate = function(num){

		var space = 360/num;
		var start = 0;
		var array =[];
		for (var i = 0; i < num; i++){

		//change the radius before it hits the edge
		var c = polarToRect(380, space * i, 900, 450);
		array.push(c);
		}

		return array;
	}

	this.random = function()
	{
		self.clear();
		var max_random_vertices = 13;
		var subtract_vertex = Math.floor(Math.random() * (max_random_vertices - 1));
		var all_coordinates = self.get_coordinate(max_random_vertices);
		var number_of_vertex = all_coordinates.length - subtract_vertex;
		var maximum_white = Math.ceil(number_of_vertex / 4);
		var white_amount = 0;
		for(var i = 0; i < number_of_vertex; i += 1)
		{
			if(white_amount >= maximum_white)
			{
				var color_number = Math.random() + 1;
			}
			else
			{
				var color_number = Math.random();
			}

			if(color_number < 0.5)
			{
				vertex_color = "light";
				white_amount++;
			}
			else
			{
				vertex_color = "dark";
			}
			var vertex_coordinates = Math.floor(Math.random() * (i - 1));
			cx = all_coordinates[i][0];
			cy = all_coordinates[i][1];
			new Vertex(cx, cy, self, vertex_color);
		}
		self.pick_random_vertex_connections(number_of_vertex);
		self.stash();
	}

	this.pick_random_vertex_connections = function(N)
	{
		/*
		  BELOW: create a continuous graph with the minimum number of connections (at least one connection per vertex --
		  number of connections is equal to N - 1 vertices.
		*/
		var vertices_ids = Object.keys(self.vertices);
		var pair_indices = [0];
		var used_pair_indices = [];
		var pair, edge, random_diff_index, pairs_index;
		var len = 0, offset = 0, pairs = [];
		for (var i = 1; i < N; i++) {
			var j;
			for (j = i + 1; j <= N; j++) {
				pairs.push([i, j]);
			}
			len = j - i - 1;
			pair_index = Math.floor(Math.random() * len) + offset;
			used_pair_indices.push(pair_index);
			pair = pairs[pair_index];
			edge = new Edge(self.vertices[vertices_ids[pair[0] - 1]], self.vertices[vertices_ids[pair[1] - 1]], self);
			edge.create();
			pair_indices.push(i);
			offset += len;
		}
		/* NOTE:
		  *  pair indices is length NC2
		  * used_pair_indices is length N - 1
		  * diff is leftover pair indices within the range 0 - pairs.length
		  BELOW: choose a random number (random_edges) from remaining pairs (diff)
		*/
		var diff = Array.apply(null, Array(pairs.length)).map(function (_, i) {return i;}).filter(
			function(x) {return used_pair_indices.indexOf(x) < 0});
		var random_edges = Math.floor(Math.random() * diff.length);
		for (i = 0; i < random_edges; i++)
		{
			random_diff_index = Math.floor(Math.random() * diff.length);
			pairs_index = diff[random_diff_index];
			pair = pairs[pairs_index];
			edge = new Edge(self.vertices[vertices_ids[pair[0] - 1]], self.vertices[vertices_ids[pair[1] - 1]], self);
			edge.create();
			diff.splice(random_diff_index, 1);
		}
	}

	this.check_dup = function(){
		self.random();
		var e = self.edges;
		var edge_ids = Object.keys(e);
		for( var i = 0; i < edge_ids.length; i++){

			for(var j = i + 1; j < edge_ids.length; j++){

					if(e[edge_ids[i]].vertices_as_array == e[edge_ids[j]].vertices_as_array && e[edge_ids[i]].vertices_as_array == e[edge_ids[j]].vertices_as_array.reverse()){

					return true

				}
			}

		}
		return false;
	}


	this.export = function()
	{
		var data = {
			"graph_id": self.graph_id,
			"graph": [],
			"graph_mode": self.mode,
			"vertex_initial_color": self.new_vertex_color,
			"color_button_text_color": self.new_vertex_color,
			"pressing_sequence": self.pressing_sequence,
			"edge_connectors" : []
		};
		if(self.edges[self.edge_highlighted]) {
 			data["edge_connectors"] = self.edges[self.edge_highlighted].vertices_nums_as_array;
 		}

		for (var v in self.vertices)
		{
			var node = self.vertices[v],
				coll = {
					"vertex_num": node.vertex_num,
					"x": node.attrs.cx,
					"y": node.attrs.cy,
					"state": node.state,
					"static_state": node.static_state,
					"initial_color": node.initial_color,
					"sequence": [],
					"knows": []
				}
			for (var e in node.edges)
			{
				var target = node.edges[e].vertices_excluding(v).vertex_num;
				if (target > self.vertices[v].vertex_num)
				{
					coll["knows"].push(target);
				}
			}
			/*
				We must order the vertices, which come form a potentially unordered collection, so they can be easily accessed
				later in this.import().
			*/
			data.graph[node.vertex_num - 1] = coll;
		}
		return JSON.stringify(data);
	};

	// Temporary function for testing backend.
	this.store = function() {
		var xhr = new XMLHttpRequest();
		xhr.open('POST', "http://localhost:3000/", true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.send(self.export());
	}

	this.draw_matrix = function(target, x, initial_y)
	{

		var m = this.adjacency_matrix();
		var y = initial_y;
		var printed_row;
		var spaces_needed = m.length.toString().length + 1;
		var label_spaces;
		var top_label = make_spaces(spaces_needed);

		var vertex_count = m.length;
		var matrix_string = "";

		var new_g = d3.select("#overlay")
			.append("g")
			.attr("id", "matrix_scroll")
			.attr("transform", "translate(0,0)");

		var x_loc = 190 + 15 * vertex_count.toString().length;

		var row_digits = 0;

		var space_array =[];
 
 		for(var i = 0; i < spaces_needed; i++){
 
 			space_array.push(make_spaces(i));
 		}

		for (var row = 1; row <= m.length; row++) {
			// TODO: clean up and DRY
			y += 45;
			row_digits = row.toString()
			label_spaces = space_array[spaces_needed - row_digits.length];
			printed_row = space_array[row_digits.length] + label_spaces +
				JSON.stringify(m[row - 1]).replace(/\,/g, space_array[spaces_needed - 1])
				.replace("[","").replace("]","").replace(/\"/g,"");
			append_text(target, printed_row, "matrix_row"+row_digits, x, y+70, "white", 2.5);
			append_text(target, row_digits, "matrix_row"+row_digits, x, y+70, "red", 2.5);
			top_label += row_digits + label_spaces;
			matrix_string += ('\n' + row + printed_row.substr(row_digits.length, printed_row.length - row_digits.length));
		}

		append_text(target, top_label, "matrix_top_label", x, initial_y+70, "blue", 2.5);
		var y2 = 180;
		y2 += (45 * row_digits);

		self.toplabel_length = 180 + 15 * top_label.length;
		self.rowdigits_length = y2;

		new_g.append("line")
			.attr("x1", x_loc)
			.attr("y1", "45")
			.attr("x2", x_loc)
			.attr("y2", y2)
			.style("stroke","#fff")
			.style("stroke-width",2);

		new_g.append("line")
			.attr("x1", "136")
			.attr("y1", "180")
			.attr("x2", self.toplabel_length)
			.attr("y2", "180")
			.style("stroke","#fff")
			.style("stroke-width",2);

		d3.select("#overlay").append("g")
			.attr("id", "clipboard");

		d3.select("#clipboard").append("rect")
			.attr("x", "213")
			.attr("y", "65")
			.attr("width", "80")
			.attr("height", "35")
			.attr("fill", "#C0C0C0")
			.attr("rx", "15")
			.attr("ry", "15")
			.on("click", function(d) {
				d3.select(this)
				.attr("fill", "#2db300");

				d3.select(this)
				.transition()
				.duration(1800)
				.attr("fill", "#C0C0C0");

				copy('copyToClipboard');
		});

		append_text("#clipboard", "Copy", "clipboard_text", 228, 90, "black", 2);

		d3.select('body').append("textarea")
			.attr('id', 'copyToClipboard')
			.text(function() {
				return [top_label + matrix_string];
			})
			.style('opacity', 0);
	}

	this.draw_sequence = function(target, x, initial_y)
	{
		var s = this.pressing_sequence;
		var y = initial_y;
		var initial_x = x;
		var spaces_needed = s.length.toString().length;
		var stepCount = s.length;

		var temp = "";
		for (var i = 0; i < s.length - 1; i++)
		{
			temp += (s[i] + ", ")
		}
		temp += s[s.length - 1];

		append_text_w_wrap(target, temp, "seq", x, x + 1150, y, "white", 2.5);
	}

	this.overlay = function(type){ //H = help page; A = about page; M = matrix
		d3.select("#overlay").remove();
		d3.select("#defs").remove();

		d3.select("svg").append("defs").attr("id", "defs")
			.append("clipPath").attr("id", "clipperX")
				.append("rect")
					.attr("x", 136)
					.attr("y", 45)
					.attr("width", 1080)
					.attr("height", 810);

		d3.select("defs")
			.append("clipPath").attr("id", "clipperY")
				.append("rect")
					.attr("x", 136)
					.attr("y", 45)
					.attr("width", 1328)
					.attr("height", 810)
					.style("rx", 25);

		d3.select("svg").append("g")
			.attr("id", "overlay")
			.append("rect")
				.attr("id", "bgBox")
				.attr("x", 136)
				.attr("y", 45)
				.attr("width", 1328)
				.attr("height", 810)
				.attr("fill", "#000")
				.style("rx", 25)
				.style("opacity", 0.8)
 				.style("stroke-width", 3)
 				.style("stroke", "#fff");

		switch(type){
			case 'H':
				var helpTxt = ["Pressing Game ",
				" ",
				"Build mode",
				"- Click or press the background to create a vertex.",
				"- Click or press a vertex to highlight.",
				"- Click or press a highlighted vertex to delete it and all connected edges.",
				"- Clicking or pressing an unhighlighted vertex when a vertex is highlighted connects the pressed vertex and the highlighted vertex with an edge.",
			    "- Clicking or pressing the color button when a vertex is highlighted toggles the highlighted vertex\'s color between white and black.",
				"- Note that the state of the color button applies globally to any newly created vertices.",
				"- The reset button deletes all vertices and edges",
				"- The undo and redo buttons allow navigation of a virtually unlimited undo and redo stack.",
				" ",
				"Play mode",
				"- Only black vertices may be clicked or pressed.",
				"- When a black vertex is pressed it changes color.",
				"- In addition, the color of each vertex in the neighborhood of the pressed vertex (any vertex connected to the pressed vertex) is toggled.",
				"- Finally, edges connecting any pair of vertices in the neighborhood are deleted and any pair of vertices in the neighborhood without edges are connected.",
				"- The objective of the game is to remove all edges and turn all vertices white.",
				"- Clicking or pressing back to build mode resets the graph to its state just before entering play mode."];

				var currentY = 80;
				for(var r = 0; r < helpTxt.length; r ++){
					currentY = append_text_w_wrap("#overlay", helpTxt[r], "helpText", 200, 1300, currentY, "white", 2.2);
				}

				break;

			case 'A': 
				var aboutTxt = ["The \"Pressing Game,\" among other things, is a tool for computational "+
				"phylogenetics. One species\' genetic code maps to another via a sequence of "+
				"swaps of adjacent substrings of genetic \'material\'; the number of swaps it "+
				"takes to go from one species\'code to another is a measure of evolutionary "+
				"distance between those species.",
				" ",
				"Version:1.0, 2017 Developed by students, faculty and staff in the Emerging "+
				"Media program at CUNY New York City College of Technology, including Professor "+ 
				"Adam Wilson, Brian Kriczky, Carlos Viera, Cheng Chin, Danara Matsakova, "+
				"Darya Dubouskaya, Fanzhong Zeng, Gabriel Feliciano-Cruz, Genaurys Vargas, "+ 
				"Jennifer Menjivar, Jonathan Alicea, Juancarlos Ospino, Kenny Chiu, Lindelle Anglin, "+ 
				"Marc Gonzalez, Marvin Clarke, Reno Abraham, Sean Picca, Tamanda Msosa"+
				", Wes Oler, John Cruz-Makuku, Jiaming Feng, Daniel Lux, and Ian Pokorny.",
				" ",
				"Thank you to Santander Bank for supporting this project, "+
				"and Joshua Cooper, Ph.D, professor of mathematics at the University "+
				"of South Carolina, for providing the project."];

				var currentY = 120;
				for(var r = 0; r < aboutTxt.length; r++){
					currentY = append_text_w_wrap("#overlay", aboutTxt[r], "aboutTxt", 200, 1300, currentY, "white", 3);
				}
				break;

			case 'M': var info = self.adjacency_matrix();
				var startX, startY, newX, newY, endX = 0, endY = 0;

				d3.select("#overlay").append("g").attr("id","scrollBox")
					.append("rect")
					.attr("x", 0)
					.attr("y", 0)
					.attr("width", 1488)
					.attr("height", 792)
					.attr("fill", "#08f")
					.style("opacity", 0.0)

					.call(d3.drag().on("start", function(){
						var mPos = d3.mouse(this);
						startX = mPos[0] + endX;
						startY = mPos[1] + endY;

					})
					.on("drag", function(){
						var mPos = d3.mouse(this);
						newX = startX - mPos[0];
						newY = startY - mPos[1];

						//Temporary Variable that we'll have to figure out in future
						var xA = (self.toplabel_length) - 1419;
						if (xA < 0)
							xA = 0;

						var xB = self.rowdigits_length - 792;
						if (xB < 0)
							xB = 0;
						var minX = 0, minY = 0, maxX = xA, maxY = xB;

						//Setting up the Bounding Box here;
						if (newX < minX)
							newX = minX;
						else if (newX > maxX)
							newX = maxX;

						if (newY < minY)
							newY = minY;
						else if (newY > maxY)
							newY = maxY;

						d3.select("#matrix_scroll")
							.attr("transform", "translate("+ -newX +","+ -newY +")");

					})
					.on("end", function(){
						endX = newX;
						endY = newY;
					}));
				this.draw_matrix("#matrix_scroll", 186, 100);
				break;

			case 'S' :
				this.draw_sequence("#overlay", 200, 200);
				break;
			}

			d3.select("#overlay").append("g")
				.attr("id", "exitButton")
				.on("click", function(){
					d3.select("#overlay").remove();
					d3.select("#defs").remove();
					d3.select("#copyToClipboard").remove();
			}).append("rect")
				.attr("x", "1340")
				.attr("y", "70")
				.attr("width", "70")
				.attr("height", "70")
				.style("opacity", "0.0");

			for(var o = 0 ; o < 2 ; o++){
				d3.select("#exitButton")
					.append("line")
						.attr("x1", 1340 + (o * 70) )
						.attr("y1", "70")
						.attr("x2", 1410 - (o * 70) )
						.attr("y2", "140")
						.style("stroke", "#fff")
						.style("stroke-width", "5");
			}
	}

	this.adjacency_matrix = function(data)
	{
		var vertex_hash = JSON.parse(self.export());
		var matrix = [];
		//Loop through the matrix's column
		for (var vertex in vertex_hash.graph)
		{
			var second_dimension_array = [];
			matrix.push(second_dimension_array);
		};

		vertex_hash.graph.forEach(function(vertex_obj)
		{
			//Loop through the matrix's row
			//i.knows.forEach(function(j)
			for (var count = vertex_obj.vertex_num - 1; count < vertex_hash.graph.length; count++)
			{
				if (vertex_obj.vertex_num - 1 === count)
				{
					if (vertex_obj.state === vertex_obj.static_state)
					{
						matrix[vertex_obj.vertex_num - 1].push("0");
					}
					else
					{
						matrix[vertex_obj.vertex_num - 1].push("1");
					}
				}
				else if (contains(vertex_obj.knows, count + 1))
				{
					matrix[vertex_obj.vertex_num - 1].push("1");
					matrix[count].push("1");
				}
				else
				{
					matrix[vertex_obj.vertex_num - 1].push("0");
					matrix[count].push("0");
				}
			};
		});
		return matrix;
	};

	this.assign_info = function(objA, objB)
	{
		var v = new Vertex(objA.x, objA.y, self, objA.initial_color);
		v.vertex_num = objA.vertex_num;
		objB[v.vertex_num] = v;
		v.draw_num();
		v.draw(objA.state);
		// We need to be able act on highlights after stepping back or forward, and clear() in the calling function,
		// this.import(), nulls the highlighted flag.
		if (v.state === "highlighted") (self.vertex_highlighted = v.attrs.id);
		return v;
	};

	this.import = function(data)
	{
		self.clear();
		if (!data) return;
		self.id = data["graph_id"];
		self.set_mode(data["graph_mode"]);
		self.new_vertex_color = data["vertex_initial_color"];
		self.change_color_button_text_color(data["color_button_text_color"]);
		self.pressing_sequence = data["pressing_sequence"];
		if (self.pressing_sequence.length > 0) {self.enable_sequence_button()};
		var temporary_collection = {};
		data.graph.forEach(function(vertex)
		{
			var origin = temporary_collection[vertex.vertex_num] || self.assign_info(vertex, temporary_collection);
			vertex.knows.forEach(function(v)
			{
				/*
					Accessing the target via v - 1 assumes that the vertices are in data.graph are ordered by vertex_num.
					To make sure this is the case, in this.export() we explicitly place each vertex in an an index on data.graph
					corresponging to vertex_num - 1. We must do this instead of pushing onto the array, since the collection we draw
					from is not guaranteed to be ordered.
				*/
				var target = temporary_collection[v] || self.assign_info(data.graph[v - 1], temporary_collection);
				var edge = new Edge(origin, target, self);
				edge.create(true);

				 if(data["edge_connectors"].indexOf(origin.vertex_num) > -1
				 	&& data["edge_connectors"].indexOf(target.vertex_num) > -1)
				 {
				 	edge.draw_highlight(edge.id);0
				 }
				 else if (data.edge_connectors.length == 0)
				 {
				 	self.edge_highlighted = null;
				 }
			});

		});
	};

	this.toggle_bar = function()
	{
		var delay = 100;
		if(self.toggle_state === "closed")
		{
			d3.selectAll("#margin, #margin-texts").transition()
				.delay(delay)
				.attr("transform", "translate(50)")
			d3.select("#toggleBox").transition()
				.delay(delay)
				.attr("transform", "translate(540)")

			d3.select("#toggleMode").transition()
				.delay(delay)
				.attr("transform", "translate(360)")
				.attr("x", 40)
				.attr("y", 438)
				.attr("width", 10)
				.attr("height", 50);

			self.toggle_state = "open";
		}
		else
		{
			//closing margin, text, and togglebox
			d3.selectAll("#margin, #margin-texts, #toggleBox").transition()
				.delay(delay)
				.attr("transform", "translate(-540)")
			//Color Bar
			d3.select("#toggleMode").transition()
				.delay(delay)
				.attr("transform", "translate(0)")
				.attr("x", 40)
				.attr("y", 0)
				.attr("width", 10)
				.attr("height", 900);

			self.toggle_state = "closed";
		}
	}

	this.hover_object = function() {
		d3.select("#" + this.id).style("opacity", .2);
	}

	this.off_hover = function(){
		d3.select("#" + this.id).style("opacity", 1);
	}

	this.enable_sequence_button = function()
	{
		d3.select("#sequence").style("opacity", 1)
			.on("mouseover", self.hover_object)
			.on("mouseout", self.off_hover)
			.on("click", self.sequence_on_click);
	}

	this.disable_sequence_button = function()
	{
		d3.select("#sequence").style("opacity", 0.2)
			.on("mouseover", function(){})
			.on("mouseout", function(){})
			.on("click", function(){});
	}

	this.sequence_on_click = function()
	{
		self.overlay("S");
	}

	this.enable_matrix_button = function()
	{
		d3.select("#matrix").style("opacity", 1)
			.on("mouseover", self.hover_object)
			.on("mouseout", self.off_hover)
			.on("click", self.matrix_on_click);
	}

	this.disable_matrix_button = function()
	{
		d3.select("#matrix").style("opacity", 0.2)
			.on("mouseover", function(){})
			.on("mouseout", function(){})
			.on("click", function(){});
	}

	this.matrix_on_click = function()
	{
		self.overlay("M");
	}

	this.UI_top_offset;
	//new UI spacing function
	this.createUI = function(svg, y_spacing, top_offset) {
		self.UI_top_offset = top_offset;
		var width = 340, height = 60, text_Y_spacing = 42.45, x = 0, sc = 1.0, rx = 25, onMouseOver = self.hover_object;
		this.buttonAttrs = [
			{"id":"mode_mg", textID:"mode_mg_text", text_color:"black", "x":0, text_X_Spacing:116 ,text_Y_spacing: text_Y_spacing * 1, "y":0, width, height, "fill":"#999999", rx, onClick: self.change_mode, onMouseOver: self.hover_object, onMouseOut:self.off_hover, buttonText:"BUILD"},
			{"id":"back",  textID:"back_text", text_color:"black", "x":0, text_X_Spacing:40 ,text_Y_spacing : text_Y_spacing * 3, "y":1, "width":width - 190, height, "fill":"#999999",rx, onClick: self.undo, onMouseOver: self.hover_object, onMouseOut:self.off_hover, buttonText:"UNDO"},
			{"id":"forward", textID:"forward_text", text_color:"black", "x":180, text_X_Spacing:220,text_Y_spacing : text_Y_spacing * 3, "y":1, "width": width - 190, height, "fill":"#999999","rx":25, onClick: self.redo, onMouseOver: self.hover_object, onMouseOut:self.off_hover, buttonText:"REDO"},
			{"id":"color",  textID:"color_text", text_color:"white", "x":0, text_X_Spacing:115,text_Y_spacing : text_Y_spacing * 5, "y":2, width, height, "fill":"#000000", rx, onClick: self.toggle_color, onMouseOver: self.hover_object, onMouseOut:self.off_hover, buttonText:"COLOR"},
			{"id":"reset", textID:"reset_text", text_color:"black",  "x":0, text_X_Spacing:115, text_Y_spacing : text_Y_spacing * 7, "y":3, width, height, "fill":"#999999", rx, onClick: self.clear, onMouseOver, onMouseOut:self.off_hover, buttonText:"RESET"},
			{"id":"random",  textID:"random_text", text_color:"black", "x":0, text_X_Spacing:105, text_Y_spacing : text_Y_spacing * 9, "y":4, width, height, "fill":"#999999", rx, onMouseOver, onMouseOut:self.off_hover, onClick: function(){self.random();},buttonText:"RANDOM"},
			{"id":"store",  textID:"store_text", text_color:"black", "x":0, text_X_Spacing:115, text_Y_spacing : text_Y_spacing * 11, "y":5, width, height, "fill":"#999999",rx, onMouseOver: self.hover_object, onMouseOut:self.hover_object, onClick: function(){},buttonText:"STORE"},
			{"id":"recall",  textID:"recall_text", text_color:"black", "x":0,text_X_Spacing:110, text_Y_spacing : text_Y_spacing * 13, "y":6, width, height, "fill":"#999999",rx, onMouseOver: self.hover_object, onMouseOut:self.hover_object, onClick: function(){},buttonText:"RECALL"},
			{"id":"playback",  textID:"playback_text", text_color:"black", "x":0, text_X_Spacing:90, text_Y_spacing : text_Y_spacing * 15, "y":7, width, height, "fill":"#999999",rx, onMouseOver: self.hover_object, onMouseOut:self.hover_object, onClick: function(){},buttonText:"PLAYBACK"},
			{"id":"matrix",  textID:"matrix_text", text_color:"black", "x":0, text_X_Spacing:110, text_Y_spacing : text_Y_spacing * 17, "y":8, width, height, "fill":"#999999", rx, onMouseOver: self.hover_object, onMouseOut:self.off_hover, onClick: function(){self.matrix_on_click;},buttonText:"MATRIX"},
			{"id":"sequence", textID:"sequence_text", text_color:"black", "x":0, text_X_Spacing:90, text_Y_spacing : text_Y_spacing * 19,"y":9, width, height, "fill":"#999999", rx, onMouseOver:function(){}, onMouseOut:function(){}, onClick:function(){}, buttonText:"SEQUENCE"},
			{"id":"about",  textID:"about_text", text_color:"black", "x":0, text_X_Spacing:90, text_Y_spacing : text_Y_spacing * 21,"y":10, "width": width - 70, height, "fill":"#999999", rx, onMouseOver: self.hover_object, onMouseOut:self.off_hover, onClick: function(){self.overlay("A");},buttonText:"ABOUT"},
			{"id":"help",  textID:"help_text", text_color:"black", "x":275, text_X_Spacing:298, text_Y_spacing : text_Y_spacing * 21, "y":10, "width": height, height, "fill":"#0c69ff", "rx": rx + 25, "ry":50, onMouseOver: self.hover_object, onMouseOut:self.off_hover, onClick: function(){self.overlay("H");},buttonText:"?" }
		];

		var ui = svg.append("g")
			.attr("id", "ui");

		ui.append("rect")
			.attrs(self.toggleBox)
			.style("opacity", 0.3)
			.on("click", self.toggle_bar)
			.on("mouseover", self.hover_object)
			.on("mouseout", self.offObject);

		ui.append("rect")
			.attrs(self.toggleMode)
			.style("opacity", 0.9)
			.on("click", self.toggle_bar);

		ui.append("g")
			.attr("id", "margin")
			.attr("transform","translate(-540, 0)") //this is hiding the margin box
			.selectAll("rect")
			.data(self.buttonAttrs)
			.enter()

			.append("g")
			.attr("id", function(d) { return d.id+"_g"; })
			.on("mouseover", function(d) {d.onMouseOver()})
			.on("mouseout", function(d) {d.onMouseOut()})
			.on("click", function(d) {d.onClick()})
			.style("cursor","pointer")
			.append("rect")
			.attrs({
				id: function(d) { return d.id; },
				x: function(d) { return d.x; },
				y: function(d) { return d.y * y_spacing + top_offset; },
				height: function(d) { return d.height; },
				width: function(d) { return d.width; },
				fill: function(d) { return d.fill; },
				stroke: function(d) {return d.stroke; },
				"stroke-width": function(d) {return d.stroke - width; },
				rx: function(d) { return d.rx; },
				ry: function(d) { return d.ry; },
				stroke: "black",
				'stroke-width': 2

			}).classed("disable_highlight", true) // fixes all browser highlights
			.each(function(buttonAttrs, i) { // adds button texts
				var buttonText = buttonAttrs['buttonText'];
				var selection = '#' + buttonAttrs['id'] + '_g';
				var textID = buttonAttrs['textID'];
				append_text(selection, buttonText, textID, buttonAttrs['text_X_Spacing'], buttonAttrs['y'] * y_spacing + text_Y_spacing + top_offset, buttonAttrs["text_color"], 3);
			});

			ui.append("rect")
				.attrs(self.toggleAttr)//this is the tab
				.on("click", self.toggle_bar)
				.style("opacity", 0.7);

			// temp: non-functional buttons should appear disabled

			[ "sequence", "store", "recall", "playback"].forEach( function(str) {d3.select("#" + str).style("opacity", 0.2);}); 

			// Add Santander logo -- maybe add properties to create_ui_text
			// NOTE: y_spacing multiplier changes with the insertion of new buttons above the logo:
			var logo_y = y_spacing * (self.buttonAttrs.length - 2) + self.UI_top_offset;
			d3.select("#margin").append("g")
				.attr("id", "sponsored_g");
			d3.select("#margin").append("g").attr("id", "santander_logo_g")
				.attr("transform", "translate(13, " + logo_y + ") scale(.5)");
			d3.select("#santander_logo_g").append("rect")
				.attrs(santandar_logo_rect)
				.on("click" , function(){
 				var win = window.open("https://www.santander.com/", '_blank');
 				win.focus();
 			})
 			.style('cursor', "pointer");

			for (var i = 0; i < santandar_logo["paths"].length; i++)
			{
				d3.select("#santander_logo_g").append("path").attr("d", santandar_logo["paths"][i])
					.attr("fill", santandar_logo["fill"] )
 					.attr("pointer-events", "none");
			}

		}

		this.toggleBox = {"id": "toggleBox", "x":-540, "y":0, "width":400, "height":900, "fill":"#A9A9A9", "rx":10}
		this.toggleAttr = {"id": "toggle", "x":-10, "y":0, "width":50, "height":900, "fill":"#2B2B2B"}
		this.toggleMode = {"id": "toggleMode", "x":40, "y":0, "width":10, "height":900, "fill":"#ec0000", "rx":2}


	this.initialize = function()
	{
		var svg = d3.select("body")
			.append("svg")
			.attrs(self.svg_attrs)
			.classed("disable_highlight", true) // fixes all browser highlights

		svg.append("rect")
			.attrs(self.graph_surface_attrs)
			.classed("disable_highlight", true) // fixes all browswer highlights

		svg.append("g").attr("id", "vertex_and_edge");

		this.createUI(svg, 70, 10); // 85 is y_spacing of buttons
		self.enable_add_vertex();
		self.get_bounding_box();
	}

	this.initialize();
};

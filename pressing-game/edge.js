function Edge(vertex_1, vertex_2, graph, edge_id)
{
	var self = this;

	this.vertices = {};
	this.vertex_keys = [];
	this.vertices_as_array = [];
	this.vertices_nums_as_array = [];
	
	this.graph = graph;
	this.id = ouuid("edge");

	this.attrs = {
		"id":this.id,
		"x1":vertex_1.attrs.cx,
		"y1":vertex_1.attrs.cy,
		"x2":vertex_2.attrs.cx,
		"y2":vertex_2.attrs.cy,
		"fill":"#ffffff",
		"stroke":"#ffffff",
		"stroke-width":GRAPH_STROKE_WIDTH * 2.0
	};

	// Useful for skipping Vertex 'A' when looking for the Vertex connected to Vertex 'A' by a particular Edge.
	this.vertices_excluding = function(id_of_vertex_to_be_excluded)
	{
		var connected_vertex;
		self.vertex_keys.forEach(function (key)
		{
			if (key !== id_of_vertex_to_be_excluded)
			{
				connected_vertex = self.vertices[key];
			}
		});
		return connected_vertex;
	};

	this.create = function(preserve_state)
	{
		// Add SVG graphic to the DOM.
		d3.select("#vertex_and_edge")
			.append("line")
			.attrs(this.attrs)
			.on("click", self.edge_click_delete);

		var vertex_draw_func;
		if (preserve_state === true) // For use with import and "play" mode.
		{
			vertex_draw_func = function(vertex) { vertex.draw(vertex.state); };
		}
		else // Only for "build" mode; we always reset a highlighted Vertex of a pair to be connected to its initial state.
		{
			// Resets the flag we use to match selected Vertex pair for connection via this Edge.
			self.graph.vertex_highlighted = null;
			vertex_draw_func = function(vertex) { vertex.draw("initial"); };
		}
		this.vertex_keys.forEach(function(key)
		{
			// Removes and redraws vertices on top of the new Edge.
			var vertex = self.vertices[key];
			vertex_draw_func(vertex);
			// Adds Edge to edges{} on each of self.vertices{}.
			vertex.edges[self.attrs.id] = self;
			self.graph.change_color_button_text_color(self.graph.new_vertex_color); 
		});
		// Add Edge to this.graph.edges{}.
		this.graph.edges[this.attrs.id] = this;
	};

	this.initialize = function(vertex_1, vertex_2, graph)
	{
		this.vertices[vertex_1.attrs["id"]] = vertex_1;
		this.vertices[vertex_2.attrs["id"]] = vertex_2;
		this.vertex_keys = Object.keys(this.vertices);
		for (var key in this.vertex_keys)
		{
			this.vertices_as_array.push(this.vertices[this.vertex_keys[key]]);
			this.vertices_nums_as_array.push(this.vertices[this.vertex_keys[key]].vertex_num)
		}
		vertex_1.edges_endpoints[this.attrs.id] = {"x":"x1", "y":"y1"};
		vertex_2.edges_endpoints[this.attrs.id] = {"x":"x2", "y":"y2"};
		self.graph.edges[this.attrs.id] = this;
	};

	// Destroys all references to this Edge.
	this.destroy = function()
	{
		// Removes SVG graphic from the DOM.
		d3.select("#" + this.attrs.id).remove();
		// Removes each Edge from edges hash on associated vertices.
		for (var i = 0; i < self.vertex_keys.length; i++)
		{
			delete self.vertices[self.vertex_keys[i]].edges[self.attrs.id];
		}
		// Removes this Edge from the associated Graph.
		delete self.graph.edges[self.attrs.id];
	};

	this.edge_click_delete = function()
	{
		if (self.graph.mode === "build")
		{
			if (self.graph.edge_highlighted === self.attrs.id)
			{
				self.graph.edge_highlighted = null;
				self.destroy();
				self.graph.stash();
				return;
			}
			if (self.graph.vertex_highlighted !== null || self.graph.edge_highlighted !== null)
			{
				self.graph.clear_highlights();
				return;
			}
		}
		else
		{
			return;
		}
		self.draw_highlight(self.attrs.id)
	};
	
	this.draw_highlight = function(id) {
			d3.select('#' + id).attr('stroke', '#ff0000');
			self.graph.edge_highlighted = id;
			self.graph.stash();
	}

	this.draw_unhighlight = function(id) {
 			d3.select('#' + id).attr('stroke', '#ffffff');
 	}

	this.initialize(vertex_1, vertex_2, graph);
};
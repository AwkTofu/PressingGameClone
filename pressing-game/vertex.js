function Vertex(x, y, graph, initial_color)
{
	var self = this;
	this.graph = graph;
	this.id = ouuid("vertex");

	this.initial_color; // "dark" or "light"
	this.state = "initial"; // "initial", "highlighted", or "flipped"
	this.static_state; // "initial" or "flipped"
	
	this.initial_appearance;
	this.vertex_highlighted_appearance;
	this.flipped_appearance;
	this.static_state;

	this.colors = function(initial_color) {
		if (initial_color === "dark")
		{
			this.initial_appearance = {"fill":"#000000", "stroke":"#ffffff"};
			this.vertex_highlighted_appearance = {"fill":"#000000", "stroke":"#ff0000"};
			this.flipped_appearance = {"fill":"#ffffff", "stroke":"#ffffff"};
			this.static_state = "flipped";
		}
		else
		{
			this.initial_appearance = {"fill":"#ffffff", "stroke":"#ffffff"};
			this.vertex_highlighted_appearance = {"fill":"#ffffff", "stroke":"#ff0000"};
			this.flipped_appearance = {"fill":"#000000", "stroke":"#ffffff"};
			this.static_state = "initial";
		}
		this.initial_color = initial_color;
	}

	this.colors(initial_color);

	// Attributes for d3 graphics only, initial settings.
	this.attrs = {
		"id":this.id,
		"cx":x,
		"cy":y,
		"r":50,
		"fill":this.initial_appearance["fill"],
		"stroke":this.initial_appearance["stroke"],
		"stroke-width":GRAPH_STROKE_WIDTH
	};

	this.vertex_num = ++Object.keys(self.graph.vertices).length;
	y_offset = 14;

	// Stores a subset of attrs to be modified on create().
	this.appearance_attrs;
	
	this.edges = {};
	this.edges_endpoints = {};

	this.edge_keys = function()
	{
		return Object.keys(self.edges);
	};

	this.edges_as_array = function()
	{
		var ea =[];
		self.edge_keys().forEach(function(key)
		{
			ea.push(self.edges[key]);
		});
		return ea;
	};
	
	this.onClick = function()
	{
		if (self.graph.mode === "build")
		{
			if (self.graph.vertex_highlighted !== null && self.graph.vertex_highlighted === self.attrs.id)
			{
				var keys = self.edge_keys();
				for (var i = 0 ; i < keys.length; i++)
				{
					self.edges[keys[i]].destroy();
				}	
				self.destroy();
				self.graph.stash();
				return;
			}
			// graph.vertex_highlighted is a Vertex.attrs.id
			// graph.vertices is a dictionary of Vertex.attrs.id:Vertex
			if (self.graph.vertex_highlighted !== null && self.graph.vertex_highlighted !== self.attrs.id)
			{
				// Look at all the edges in the second vertex clicked; if one of them already has the highlighted vertex as one of
				// its connections, then we don't make a new edge.
				var vertex_1 = self.graph.vertices[self.graph.vertex_highlighted],
					eaa = self.edges_as_array(),
					eaalen = eaa.length;
				for (var i = 0; i < eaalen; i++)
				{
					if (eaa[i].vertex_keys[0] === self.graph.vertex_highlighted || eaa[i].vertex_keys[1] === self.graph.vertex_highlighted)
					{
						vertex_1.draw("initial")
						self.graph.vertex_highlighted = null;
						self.graph.stash();
						return;
					}
				}
				// Create a new edge.
				var edge = new Edge(vertex_1, self, self.graph);
				edge.create();
				self.graph.stash();
			}
			else if (self.graph.edge_highlighted === null)
			{
				self.draw("highlighted");
				self.graph.stash();
			} else
			{
				self.graph.clear_edge_highlight();
			}
		}
		else
		{
			// When in play mode, adds clicked vertex to pressing_sequence.
			if (self.state !== self.static_state) { 
				self.graph.pressing_sequence[self.graph.pressing_sequence.length] = self.vertex_num;
				self.graph.enable_sequence_button();
				self.graph.modify_neighborhood(self);
				self.graph.stash();
			}
		};
	};
	
	// Flips the color on a highlighted Vertex in build mode.
	this.flip_and_swap_build = function() { 
		if (this.initial_color === "dark") {
			this.colors("flipped");
		} else {
			this.colors("dark");
		}
		this.draw("initial");
	}

	this.flip_state_play = function()
	{
		self.state === "initial" ? self.draw("flipped") : self.draw("initial");
	}

	// Highlightd  the "Color" button text to indicate the flipped color on a highlighted vertex
	this.check_color_button_match = function()
	{
		if (this.flipped_appearance.fill == "#000000" && self.graph.new_vertex_color == "light")
		{
			self.graph.change_color_button_text_color("dark");
		} 
		else if (this.flipped_appearance.fill != "#000000" && self.graph.new_vertex_color =="dark")
		{
			self.graph.change_color_button_text_color("light");
		}
	}
	
	this.draw = function(arg)
	{
		var vertex = d3.select("#" + this.id);
		var vertexG = d3.select("#vertex_group" + this.id);
		switch(arg)
		{
			case "initial":
				this.state = arg;
				this.appearance_attrs = this.initial_appearance;
				vertex.remove();
				vertexG.remove();
				this.create();
				return;
			case "highlighted":
				this.state = arg;
				this.appearance_attrs = this.vertex_highlighted_appearance;
				vertex.remove();
				vertexG.remove();
				this.create();
				this.check_color_button_match();
				this.graph.vertex_highlighted = this.id;
				return;
			case "flipped":
				this.state = arg;
				this.appearance_attrs = this.flipped_appearance;
				vertex.remove();
				vertexG.remove();
				this.create();
				return;
		}
	};

	this.edgeEnds = {}; // Saves state for drag handler in create() below.
	this.dragging = false; // Saves state for drag handler in create() below.
	
	this.delete_g = function()
	{
		d3.select("#vertex_group" + this.id).remove();
	}

	this.add_g = function()
	{	
		this.delete_g();
		d3.select("#vertex_and_edge")
			.append("g")
			.attr("id", "vertex_group" + this.id)
	}

	this.create = function()
	{
		this.add_g();
		// Add SVG graphic to the DOM.
		
		var initPosX = 0;
		var initPosY = 0;
		var initMposX = 0;
		var initMposY = 0;
		var mPos = 0;
		
		d3.select("#vertex_group" + this.id)
			.append("circle")
			.attrs(this.attrs)
			.attrs(this.appearance_attrs)
			.on("click", this.onClick)
			.call(d3.drag(this)
				.on("start", function()
				{
					mPos = d3.mouse(this);
					
					initPosX = self.attrs.cx;
					initPosY = self.attrs.cy;
					
					initMposX = mPos[0];
					initMposY = mPos[1];
				})
				.on("drag", function()
				{
					self.dragging = true;
					mPos = d3.mouse(this);
				
					var mDiffX = initMposX - mPos[0];
					var mDiffY = initMposY - mPos[1]; 
					
					var xCenter = initPosX - mDiffX;	//new center x-position
					var yCenter = initPosY - mDiffY;	//new center y-position
					
					// Stay in bounding box.
					if(xCenter < self.graph.bounding_box[0]) (xCenter = self.graph.bounding_box[0]);
					if(yCenter < self.graph.bounding_box[1]) (yCenter = self.graph.bounding_box[1]);
					if(xCenter > self.graph.bounding_box[2]) (xCenter = self.graph.bounding_box[2]);
					if(yCenter > self.graph.bounding_box[3]) (yCenter = self.graph.bounding_box[3]);
					
					// Drag the Vertex.
					d3.select(this).attrs({cx: xCenter, cy: yCenter});
					// Drag the Vertex_num
					self.drag_number(self.attrs.id, {x: xCenter, y: yCenter});
					
					// Drag the appropriate endpoint of each Edge attached to the Vertex.
					var keys = self.edge_keys();
					for (var i = 0; i < keys.length; i++)
					{
						var x_y_attrs_hash = self.edges_endpoints[keys[i]];
						var nh = {};
						nh[x_y_attrs_hash["x"]] = xCenter;
						nh[x_y_attrs_hash["y"]] = yCenter;
						d3.select("#" + self.edges[keys[i]].attrs.id).attrs(nh);
					}
				})
				.on("end", function()
				{
					// console.log(d);
					/*
						The "click" and "drag end" handlers BOTH fire on click to an object (click last, it seems). The "click" handler
						does not fire when the "drag" handler is invoked. Therefore, we only update the DOM and stash the graph state in
						the event that the "drag" handler is invoked, otherwise we get two stashes on a click to highlight a vertex, for
						example.
					*/
					if (self.dragging === true)
					{
						// On release, set the location attributes are stored outside the SVG representation of the Vertex and Edges.
						self.attrs.cx = d3.select(this).attr("cx");
						self.attrs.cy = d3.select(this).attr("cy");
						
						var keys = self.edge_keys();
						for (var i = 0; i < keys.length; i++)
						{
							var x_y_attrs_hash = self.edges_endpoints[keys[i]];
							self.edges[keys[i]].attrs[x_y_attrs_hash["x"]] = self.attrs.cx;
							self.edges[keys[i]].attrs[x_y_attrs_hash["y"]] = self.attrs.cy;
						}
						edgeEnds = {};
						self.dragging = false;
						self.graph.stash();
					}
				})
			);
		// Adds the Vertex to Graph.vertices{}.
		self.graph.vertices[self.attrs.id] = self;
		self.add_num();
	};

	// Destroy all references to this Vertex.
	// Note that associated Edge objects must be destroyed using Edge.destroy() first.
	this.destroy = function()
	{
		this.remove_num();
		var num = self.vertex_num;
		this.renumber_num(num);
		// Removes SVG graphic from the DOM.
		self.graph.change_color_button_text_color(initial_color);
		d3.select("#" + this.attrs.id).remove();
		// Removes this Vertex from the associated Graph.
		delete self.graph.vertices[self.attrs.id];
		self.graph.vertex_highlighted = null;
		this.delete_g();
	};

	this.drag_number = function(id, mPos)
	{
		var num_array = self.vertex_num.toString().split('').reverse();
		for (var i = 0; i <= num_array.length; i++)
		{
			var ver_num_id = this.id + i;
			var x_offset = -20;
			x_offset += (num_array.length * 10);

			d3.select("#vertex-number" + ver_num_id)
				.attr("transform", "translate(" + (mPos.x - (i * 21) + x_offset) + "," + (mPos.y + y_offset) + ")scale(3)");
		}
	}

	this.spacing_num = function()
	{
		var num_array = self.vertex_num.toString().split('').reverse();

		for (var i = 0; i <= num_array.length; i++)
		{
			var ver_num_id = this.id + i;
			var x_offset = -20;
			x_offset += (num_array.length * 10);

			var y_location = y_offset + +self.attrs.cy;
			
			d3.select("#vertex_group" + this.id)
				.append("path")
				.attr("id", "vertex-number" + ver_num_id)
				.attr("d", character_array[ num_array[i] ]) 
				.attr("fill", "red")
				.attr("stroke-width", 2)
				.attr("pointer-events", "none")
				.attr("transform", "translate(" + (self.attrs.cx - (i * 21) + x_offset) + "," + y_location + ")scale(3)");
		}
	}

	this.add_num = function()
	{
		self.remove_num();
		this.spacing_num();
	}

	this.remove_num = function()
	{		
		// Removes SVG text/number self.ic
		var num_array = self.vertex_num.toString().split('').reverse();
		for (var i = 0; i <= num_array.length; i++)
		{
			d3.select("#vertex-number" + this.attrs.id + i).remove();
		}
	}

	this.renumber_num = function(num)
	{
		for(vertex in self.graph.vertices){
			if (self.graph.vertices[vertex].vertex_num > num)
			{
				self.graph.vertices[vertex].vertex_num--; 
				self.graph.vertices[vertex].draw_num();
			}
		}
	}

	this.draw_num = function()
	{
		self.remove_num();
		self.add_num();
	}

	this.create();
}
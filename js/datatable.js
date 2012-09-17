(function($) {
	
	var DataTable = function (element, options) {
    	this.$element = $(element)
    	this.options = $.extend({}, $.fn.datatable.defaults, options);
    	this.init();
 	 }
 	 
 	 DataTable.prototype = {
 	 	init: function() {
 	 		this.$table = $("<table />").appendTo(this.$element)
 	 							.addClass("table table-striped datatable")
 	 							.addClass(this.options['class'])
 	 							.width(this.options.width);
 	 		this.rows = [];
 	 		this.addHeaders();
 	 		this.addBody();
 	 		this.addSelection();
 	 		this.addSorting();
 	 	},
 	 	
 	 	addHeaders: function() {
 	 		var grid = this;
 	 		var thead = $("<thead />").appendTo(this.$table);
 	 		grid.$headers = $("<tr />").appendTo(thead);
			$.each(this.options.cols, function(i, col) {
				var $header = $("<th />").appendTo(grid.$headers)
										.html(col.title)
										.addClass(col['class'])
										.addClass("header")
										.data("col_id", i);
			});
 	 		return this;
 	 	},
 	 	addBody: function() {
 	 		this.$body = $("<tbody />").appendTo(this.$table);
			if(this.options.data){
				this.setData(this.options.data);			
			}	 		
 	 	},
 	 	getColumn: function(index) {
 	 		return this.options.cols[parseInt(index)];
 	 	},

 	 	setData: function(data) {
	 	 	var	grid = this;
			$.each(data, function(i, rowdata) {
				var row = $("<tr />").appendTo(grid.$body)
									.data("row-id", i);
				$.each(rowdata, function(i, coldata) {
					$("<td />").appendTo(row).html(coldata);
				})					
				grid.$body.append(row);	
				grid.rows.push(row);					
			})
		},
		
		addSelection: function() {
			var	grid = this;
			grid.$headers.prepend("<th><input class=\"grid-select-all\" type=\"checkbox\" /></th>");
			grid.$body.find("tr").each(function(i) {
				$(this).prepend("<td><input class=\"grid-select-row\" type=\"checkbox\" /></td>");
			});
			grid.$element.find(".grid-select-row").click(function() {
				// trigger selectRow event
			});
			grid.$element.find(".grid-select-all").click(function() {
				grid.$element.find(".grid-select-row").prop("checked", $(this).get(0).checked);
			});
		},
		addSorting: function(){
			var	grid = this;
			grid.$headers.find(".header").each(function(){
				var colIndex = $(this).data("col_id");
				var col = grid.getColumn(colIndex);
				if(col.sortable) {
					$(this).addClass("sortable sort-down");									
				}
			});
			grid.$element.find(".sortable").click(function() {
				$(this).toggleClass("sort-down").toggleClass("sort-up");
				var col = $(this).data("col_id");
				grid.sortTable(col, $(this).hasClass("sort-up"));
			});
		},
		
		getSelectedRows: function() {
			
			
		},
		deleteSelectedRows: function() {
			var rows = this.getSelectedRows();
			
		},
		
		sortTable: function(col, desc) {
			var data = this.options.data;
			var rows = [];
	        for (var j=0; j<data.length; j++) {
	          rows.push([data[j][col], this.rows[j]]);
	        }
	        rows.sort(this.sort_alpha);
	        if(desc) rows.reverse();
	        
	        for (var j=0; j<rows.length; j++) {
	          this.$body.append(rows[j][1]);
	        }
	        
	        delete rows;
		}, 	 
		
		sort_alpha: function(a,b) {
	    	if (a[0]==b[0]) return 0;
	    	if (a[0]<b[0]) return -1;
	    	return 1;
	   },
	   sort_numeric: function(a,b) {
		    aa = parseFloat(a[0].replace(/[^0-9.-]/g,''));
		    if (isNaN(aa)) aa = 0;
		    bb = parseFloat(b[0].replace(/[^0-9.-]/g,'')); 
		    if (isNaN(bb)) bb = 0;
		    return aa-bb;
	  }
 	 }
 	 
	  $.fn.datatable = function ( option ) {
	    return this.each(function () {
	      var $this = $(this)
	        , data = $this.data('datatable')
	        , options = typeof option == 'object' && option
	      if (!data) $this.data('datatable', (data = new DataTable(this, options)))
	      if (typeof option == 'string') data[option]()
	    })
	  }
     
 	 $.fn.datatable.defaults = {
 	 	width: '100%',
   		cols : [
    			{title: 'name'},
    			{title: 'address'},
    		],
    	colDefaults : {
    		width: 'auto'
    		
    	}
  	 }
  		
  	 $.fn.datatable.Constructor = DataTable

})(jQuery);

/* Copyright (c) 2016 GearGrams LLC */

var gg = new function() {

/* These properties are used for caching list data*/
this.lists = {};
this.defaultListUnitIDs = {};
this.gearItems = {};
this.units = {};



/* categoryData object structure
{
	cats:Object; // {total:Float, gearItems:Array, listItems:Array, name:String, canNames:Array}
    catNames:Array;
    totalWeight:Float;
    wornTotal:Float;
    consumableTotal:Float;
}
*/
this.categoryData = {};


//-------------------------------- Shortcode Functions ------------------------------

this.displayMinimal = function(elementID, listId, title, categoriesStr)
{
	var obj = this;

	success = function()
	{
		var gearListItems = obj.lists[listId].gearListItems;
		var cData = obj.getCategoryData(gearListItems, listId);
		var categoriesToShow = obj.getCategoriesToShow(categoriesStr, cData.catNames);
		
		var html = "";
		
		html += "<ul>";	
		for(var a=0; a < categoriesToShow.length; ++a)
		{
			html += '<li class="gg_gategory">' + categoriesToShow[a] + ' <span class="gg_weight">' + obj.getWeightLabel(cData.cats[categoriesToShow[a]].total, obj.defaultListUnitIDs[listId])  +'</span>';
				
			var gearItems = cData.cats[categoriesToShow[a]].gearItems;
			var listItems = cData.cats[categoriesToShow[a]].listItems;
			html += "<ul>";	
			for(var b=0; b < gearItems.length; ++b)
			{
				html += '<li class="gg_item">';
				if(gearItems[b].url != null && gearItems[b] != "")
					html += '<a href="' + gearItems[b].url + '">' + gearItems[b].name + '</a>';
				else
					html += gearItems[b].name;
					
				html += ' ';
				
				if(listItems[b].quantity > 1)
					html +='<span class="gg_qty">' + listItems[b].quantity + "</span>, ";
						
				html += '<span class="gg_weight">' + obj.getWeightLabel(gearItems[b].gramWeight * listItems[b].quantity, gearItems[b].weightUnitId) +  '</span></li>';
			}
			html += "</ul>";
			html += '</li>';		
		}
		
		html += "</ul>";
		
		if(title != null && title != "")
		{
			var titleHTML = '<div class="gg_header">';
			if(title == "gg_default")
				titleHTML += "<h3>" + obj.lists[listId].name + "</h3>";
			else
				titleHTML += "<h3>" + title + "</h3>";
				
			 titleHTML += '<span class="gg_weight">' + obj.getWeightLabel(cData.totalWeight, obj.defaultListUnitIDs[listId]) + "</span></div>";
			 html = titleHTML + html;
		}
		document.getElementById(elementID).innerHTML = html;
	}

	this.retrieveList(listId, success, function(){});
};


this.displayPieChart = function(elementID, listId, diameter, title, categoriesStr)
{
	var obj = this;

	success = function()
	{
		var gearListItems = obj.lists[listId].gearListItems;
		var cData = obj.getCategoryData(gearListItems, listId);
		var categoriesToShow = obj.getCategoriesToShow(categoriesStr, cData.catNames);
		
		var w = diameter;
		var h = diameter;
		var r = h/2;
		var color = d3.scale.category20();
		
		var data = [];
				          
		for(var a=0; a < categoriesToShow.length; ++a)
			data.push({"label":categoriesToShow[a], "value":cData.cats[categoriesToShow[a]].total});

		var vis = d3.select(document.getElementById(elementID)).append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
		var pie = d3.layout.pie().value(function(d){return d.value;});

		// declare an arc generator function
		var arc = d3.svg.arc().outerRadius(r);

		// select paths, use arc generator to draw
		var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
		arcs.append("svg:path")
		    .attr("fill", function(d, i){
		        return color(i);
		    })
		    .attr("d", function (d) {
		        return arc(d);
		    });
	}

	this.retrieveList(listId, success, function(){});		
};


this.displayLegend = function(elementID, listId, width, height, title, categoriesStr)
{
	var obj = this;

	success = function()
	{
		var legendRectSize = 18;
	    var legendSpacing = 4;
	    var color = d3.scale.category20b();

		var gearListItems = obj.lists[listId].gearListItems;
		var cData = obj.getCategoryData(gearListItems, listId);
		var categoriesToShow = obj.getCategoriesToShow(categoriesStr, cData.catNames);
		
		var labels = [];
		for(index in categoriesToShow)
		{
			var catName = categoriesToShow[index];
			labels.push(catName + ", " + obj.getWeightLabel(cData.cats[catName].total, obj.defaultListUnitIDs[listId]));
		}
		
	    var legend = d3.select(document.getElementById(elementID)).append("svg:svg").attr("width", width).attr("height", height)
	    	.append("g")
	    	.selectAll("g")
	    	.data(labels)
	    	.enter()
	    	.append('g')
			.attr('class', 'legend')
			.attr('transform', function(d, i)
			{
	    	   	var height = legendRectSize;
	    	   	var x = 0;
	    	   	var y = i * height;
	    	   	return 'translate(' + x + ',' + y + ')';
	    	});
	    
	    legend.append('rect')
	    	.attr('width', legendRectSize)
	    	.attr('height', legendRectSize)
	    	.style('fill', d3.scale.category20())
	    	.style('stroke', d3.scale.category20());

		legend.append('text')
	   		.attr('x', legendRectSize + legendSpacing)
	    	.attr('y', legendRectSize - legendSpacing)
	    	.text(function(d) { return d; });
	}

	this.retrieveList(listId, success, function(){});	
};

this.displayHeading = function(elementID, listId, title, unit, totals)
{
	var obj = this;

	success = function()
	{
		if(totals == "all" )
			totals = "total,pack,worn,consumable";

		var html = '<div class="gg_header">';

		if(title != null && title != "")
		{
			if(title == "gg_default")
				html += "<h3>" + obj.lists[listId].name + "</h3>";
			else
				html += "<h3>" + title + "</h3>";
		}


		var gearListItems = obj.lists[listId].gearListItems;
		var cData = obj.getCategoryData(gearListItems, listId);

		if(totals.indexOf("total") >= 0)
		{
			html += '<div class="gg_weight_label">';
			html += '<span class="gg_label">Total:</span>';
			html += '<span class="gg_total gg_weight">' + obj.getWeightLabel(cData.totalWeight, obj.defaultListUnitIDs[listId]) + "</span>";
			html += '</div>';
		}

		if(totals.indexOf("pack") >= 0)
		{
			html += '<div class="gg_weight_label">';
			html += '<span class="gg_label">Pack:</span>';
			html += '<span class="gg_pack gg_weight">' + obj.getWeightLabel(cData.totalWeight - (cData.wornTotal + cData.consumableTotal), obj.defaultListUnitIDs[listId]) + "</span>";
			html += '</div>';
		}

		if(totals.indexOf("worn") >= 0)
		{
			html += '<div class="gg_weight_label">';
			html += '<span class="gg_label">Worn:</span>';
			html += '<span class="gg_worn gg_weight">' + obj.getWeightLabel(cData.wornTotal, obj.defaultListUnitIDs[listId]) + "</span>";
			html += '</div>';
		}
		
		if(totals.indexOf("consumable") >= 0)
		{
			html += '<div class="gg_weight_label">';
			html += '<span class="gg_label">Consumable:</span>';
			html += '<span class="gg_consumable gg_weight">' + obj.getWeightLabel(cData.consumableTotal, obj.defaultListUnitIDs[listId]) + "</span>";
			html += '</div>';
		}
			
		html += '</div>';

		document.getElementById(elementID).innerHTML = html;
	}

	this.retrieveList(listId, success, function(){});
};


//-------------------------------- Helper Functions ------------------------------


this.retrieveList = function(listId, handler, errorHandler)
{
	var obj = this;

	if(this.lists[listId] != null)
		handler();
	else
	{
		jQuery.ajax(
		{
        	url: "https://www.geargrams.com/api/gearlist/" + listId,
        	data: {},
        	success:function(data)
        	{
        		var json = JSON.parse(data);
        		obj.lists[json.gearList.uid] = json.gearList;
        		obj.defaultListUnitIDs[json.gearList.uid] = json.defaultUintId;
        		
        		for(var a=0; a < json.gearItems.length; ++a)
        			obj.gearItems[json.gearItems[a].uid] = json.gearItems[a];
        			
        		for(var a=0; a < json.weightUnits.length; ++a)
        			obj.units[json.weightUnits[a].uid] = json.weightUnits[a];
        		
				handler();
        	},
			error: function(e)
			{
        	    console.log(e);
        	    errorHandler();
        	}
    	});
    }
};

this.getCategoryData = function(gearListItems, listId)
{
	if(listId != null && this.categoryData[listId] != null)
		return this.categoryData[listId];

	var returnData = {};
	returnData.cats = {};
    returnData.catNames = [];
    returnData.totalWeight = 0;
    returnData.wornTotal = 0;
    returnData.consumableTotal = 0;
	for(a=0; a < gearListItems.length; ++a)
	{
		var gItem = this.gearItems[gearListItems[a].gearItemId];
		var objName = gItem.category.toLowerCase();
		if(returnData.cats[objName] == null)
		{
			returnData.cats[objName] = {};
			returnData.cats[objName].total = 0;
			returnData.cats[objName].gearItems = [];
			returnData.cats[objName].listItems = [];
			returnData.cats[objName].name = gItem.category;
			returnData.catNames.push(gItem.category);
		}
		returnData.cats[objName].total += gItem.gramWeight;
		returnData.cats[objName].gearItems.push(gItem);
		returnData.cats[objName].listItems.push(gearListItems[a]);
		var itemWeight = gItem.gramWeight * gearListItems[a].quantity;
		returnData.totalWeight += itemWeight;
		if(gearListItems[a].worn)
			returnData.wornTotal += itemWeight;
		if(gearListItems[a].consumable)
			returnData.consumableTotal += itemWeight;
	}
	returnData.catNames = returnData.catNames.sort();

	if(listId != null)
		this.categoryData[listId] = returnData;
	
	return returnData;
};

this.parseCategoryStr = function(categoriesStr)
{
	var categoriesToShow = null;
	if(categoriesStr != "")
	{
		categoriesToShow = categoriesStr.split(",");
		categoriesToShow.map(Function.prototype.call, String.prototype.toLowerCase);
	}
	return categoriesToShow;
};

this.getCategoriesToShow = function(categoriesStr, allCategories)
{
	var catsToShow = categoriesStr;
	if(catsToShow == null || catsToShow.length == 0)
	{
		catsToShow = allCategories.slice(0, allCategories.length);
		return catsToShow.map(Function.prototype.call, String.prototype.toLowerCase);
	}
	return catsToShow;
};

this.getWeightLabel = function(gramWeight, unitId)
{
	var unit = this.units[unitId];
	var weightString = "";

	if(unit.abbreviation == "lb" || unit.abbreviation == "oz")
	{
		var lbs = this.getUnitWithName("pound");
		var oz = this.getUnitWithName("ounce");
		var pounds = Math.floor(gramWeight / lbs.gramWeight);
		var ounceGrams = gramWeight % lbs.gramWeight;
		var ounces = Math.round((ounceGrams / oz.gramWeight) * 100) / 100;

		if(pounds > 0)
			weightString = pounds + "  " + lbs.abbreviation + " ";

		weightString += ounces + " " + oz.abbreviation;
	}
	else
	{
		if(gramWeight >= 1000)
			weightString = Math.round((gramWeight/1000) * 100) / 100 + " kg";
		else
			weightString = Math.round(gramWeight) + " g";
	}
	return weightString;
};

this.getUnitWithName = function(name)
{
	for(i in this.units)
	{
		if(this.units[i].name == name)
			return this.units[i];
	}
	return null;
};


};


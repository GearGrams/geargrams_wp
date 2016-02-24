/*
Copyright (c) 2016 GearGrams LLC 
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
*/

var gg = new function() {

/* These properties are used for caching list data*/
this.lists = {};
this.defaultListUnitIDs = {};
this.gearItems = {};
this.units = {};

/* 
categoryData is an associative array of processed data about categories for lists

categoryData objects structure

categoryData[listId] = 
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

this.displayMinimal = function(elementID, listId, categoriesStr)
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
				
			var listItems = cData.cats[categoriesToShow[a]].listItems;
			html += "<ul>";	
			for(var b=0; b < gearItems.length; ++b)
			{
				var gearItem = obj.gearItems[listItems[b].gearItemId];
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
		
		document.getElementById(elementID).innerHTML = html;
	}

	this.retrieveList(listId, success, function(){});
};


this.displayPieChart = function(elementID, listId, diameter, pie, categoriesStr)
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


this.displayLegend = function(elementID, listId, width, height, categoriesStr)
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

this.displayTable = function(elementID, listId, categoriesStr)
{
	var obj = this;

	success = function()
	{
		var gearListItems = obj.lists[listId].gearListItems;
		var cData = obj.getCategoryData(gearListItems, listId);
		var categoriesToShow = obj.getCategoriesToShow(categoriesStr, cData.catNames);

		var element = document.getElementById(elementID);

		element.className += " gg_gear_table";
		var html = "";

		html += '<table cellspacing="0" cellpadding="0">';
		for(var a=0; a < categoriesToShow.length; ++a)
		{
			html += '<tr class="gg_category"><td><h4>' + cData.cats[categoriesToShow[a]].name + '</h4>';
			html += '<td style="width:50%"></td><td style="width:10%"></td><td style="width:20%"></td></tr>';

			var count = 0;
			var listItems = cData.cats[categoriesToShow[a]].listItems;

			for(var b=0; b < listItems.length; ++b)
			{
				html += '<tr class="gg_item">';
				var listItem = listItems[b];
				var gearItem = obj.gearItems[listItems[b].gearItemId];

				html += '<td>';
				if(gearItem.url != null && gearItem.url != "")
					html += '<a href="' + gearItem.url + '">' + gearItem.name + '</a>';
				else
					html += gearItem.name;

				if(listItem.worn || listItem.consumable)
				{
					html += '<div style="float:right">';
					if(listItem.worn)
						html += '<img style="width:13px" src="" />';

					if(listItem.consumable)
						html += '<img style="width:13px" src="" />';

					html += '</div>';
				}
					
				html += '</td>';
				html +='<td>' + gearItem.description + "</td>";
				html +='<td>' + listItem.quantity + "</td>";
				html += '<td>' + obj.getWeightLabel(gearItem.gramWeight * listItem.quantity, gearItem.weightUnitId) +  '</td>';
				html += "</tr>";

				++count;
			}

			html += '<tr> <td style="padding-top:5px;"></td> <td></td> <td style="text-align:right">Total</td><td style="text-align:right; color:#111111;">';
			html += obj.getWeightLabel(cData.cats[categoriesToShow[a]].total, 1);
			html += "</td></tr>";
		}
		
		html += "</table>";

		document.getElementById(elementID).innerHTML = html;return html;
	}

	this.retrieveList(listId, success, function(){});

}


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
	var obj = this;

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
		returnData.cats[objName].listItems.push(gearListItems[a]);
		var itemWeight = gItem.gramWeight * gearListItems[a].quantity;
		returnData.totalWeight += itemWeight;
		if(gearListItems[a].worn)
			returnData.wornTotal += itemWeight;
		if(gearListItems[a].consumable)
			returnData.consumableTotal += itemWeight;
	}
	returnData.catNames = returnData.catNames.sort();

	for(cat in returnData.cats)
	{
		var catObj = returnData.cats[cat];
		catObj.listItems.sort(function(a,b)
		{
			var gearItemA = obj.gearItems[a.gearItemId];
			var gearItemB = obj.gearItems[b.gearItemId];

			if(gearItemA.name.toLowerCase() < gearItemB.name.toLowerCase())
				return -1;
			else if(gearItemA.name.toLowerCase() > gearItemB.name.toLowerCase())
				return 1;
			else
				return 0;
		});
		
		for(listItem in catObj.listItems)
			catObj.gearItems.push(obj.gearItems[listItem.gearItemId]);
	}

	if(listId != null)
		this.categoryData[listId] = returnData;
	
	return returnData;
};

this.parseCategoryStr = function(categoriesStr)
{
	if(categoriesStr == null)
		return [];
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
	var catsToShow = this.parseCategoryStr(categoriesStr);
	if(catsToShow == null || catsToShow.length == 0)
	{
		catsToShow = allCategories.slice(0, allCategories.length);
		return catsToShow.map(Function.prototype.call, String.prototype.toLowerCase).sort();
	}
	return catsToShow.sort();
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


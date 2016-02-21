/* Copyright (c) 2016 GearGrams LLC */

var GG_lists = {};
var GG_defaultListUnitIDs = {};
var GG_gearItems = {};
var GG_units = {};


function gg_retrieveList(listId, handler, errorHandler)
{
	if(GG_lists[listId] != null)
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
        		GG_lists[json.gearList.uid] = json.gearList;
        		
        		GG_defaultListUnitIDs[json.gearList.uid] = json.defaultUintId;
        		
        		for(var a=0; a < json.gearItems.length; ++a)
        			GG_gearItems[json.gearItems[a].uid] = json.gearItems[a];
        			
        		for(var a=0; a < json.weightUnits.length; ++a)
        			GG_units[json.weightUnits[a].uid] = json.weightUnits[a];
        		
				handler();
            
        	},
			error: function(e)
			{
        	    console.log(e);
        	    errorHandler();
        	}
    	});
    }
}

function parseCategoryStr(categoriesStr)
{
	var categoriesToShow = null;
	if(categoriesStr != "")
	{
		categoriesToShow = categoriesStr.split(",");
		categoriesToShow.map(Function.prototype.call, String.prototype.toLowerCase);
	}
	
	return categoriesToShow;
}

function getCategoriesToShow(categoriesStr, allCategories)
{
	var catsToShow = categoriesStr;
	if(catsToShow == null || catsToShow.length == 0)
	{
		catsToShow = allCategories.slice(0, allCategories.length);
		return catsToShow.map(Function.prototype.call, String.prototype.toLowerCase);
	}
	return catsToShow;
}

function gg_displayMinimal(elementID, listId, title, categoriesStr)
{
	if(GG_lists[listId] != null)
		displayList(listId, elementID, title, categoriesStr);
	else
	{
		document.getElementById(elementID).innerHTML = "Loading gear list...";
		gg_retrieveList(listId, 
			function()
			{
				displayList(listId, elementID, title, categoriesStr);
			},
			function()
			{
				document.getElementById(elementID).innerHTML = "Could not load gear list";
			}
		);
    }
}

function getCategoryData(gearListItems)
{
	var returnData = {};
	returnData.cats = {};
    returnData.catNames = [];
    returnData.totalWeight = 0;
	for(a=0; a < gearListItems.length; ++a)
	{
		var gItem = GG_gearItems[gearListItems[a].gearItemId];
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
		returnData.totalWeight += gItem.gramWeight;
	}
	returnData.catNames = returnData.catNames.sort();
	
	return returnData;
}

function displayList(listId, elementID, title, categoriesStr)
{
    var gearListItems = GG_lists[listId].gearListItems;
	var cData = getCategoryData(gearListItems);
	var categoriesToShow = getCategoriesToShow(categoriesStr, cData.catNames);
	
	var html = "";
	
	html += "<ul>";	
	for(var a=0; a < categoriesToShow.length; ++a)
	{
		html += '<li class="gg_gategory">' + categoriesToShow[a] + ' <span class="gg_weight">' + getWeightLabel(cData.cats[categoriesToShow[a]].total, GG_defaultListUnitIDs[listId])  +'</span>';
			
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
					
			html += '<span class="gg_weight">' + getWeightLabel(gearItems[b].gramWeight * listItems[b].quantity, gearItems[b].weightUnitId) +  '</span></li>';
		}
		html += "</ul>";
		html += '</li>';		
	}
	
	html += "</ul>";
	
	if(title != null && title != "")
	{
		var titleHTML = '<div class="gg_header">';
		if(title == "gg_default")
			titleHTML += "<h3>" + GG_lists[listId].name + "</h3>";
		else
			titleHTML += "<h3>" + title + "</h3>";
			
		 titleHTML += '<span class="gg_weight">' + getWeightLabel(cData.totalWeight, GG_defaultListUnitIDs[listId]) + "</span></div>";
		 
		 html = titleHTML + html;
	}
	document.getElementById(elementID).innerHTML = html;
}

function getWeightLabel(gramWeight, unitId)
{
	var unit = GG_units[unitId];
	var weightString = "";

	if(unit.abbreviation == "lb" || unit.abbreviation == "oz")
	{
		var lbs = getUnitWithName("pound");
		var oz = getUnitWithName("ounce");
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
}

function getUnitWithName(name)
{
	for(i in GG_units)
	{
		if(GG_units[i].name == name)
			return GG_units[i];
	}
	
	return null;
}


function gg_displayPieChart(elementID, listId, diameter, title, categoriesStr)
{
	if(GG_lists[listId] != null)
		displayPieChart(elementID, listId, title, parseCategoryStr(categoriesStr));
	else
	{
		gg_retrieveList(listId, 
			function()
			{
				displayPieChart(elementID, listId, diameter, title, categoriesStr);
			},
			function(){}
		);
    }		
}


function displayPieChart(elementID, listId, diameter, title, categoriesStr)
{
	var gearListItems = GG_lists[listId].gearListItems;
	var cData = getCategoryData(gearListItems);
	var categoriesToShow = getCategoriesToShow(categoriesStr, cData.catNames);
	
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


function gg_displayLegend(elementID, listId, width, height, title, categoriesStr)
{
	if(GG_lists[listId] != null)
		displayLegend(elementID, listId, width, height, title, categoriesStr);
	else
	{
		gg_retrieveList(listId, 
			function()
			{
				displayLegend(elementID, listId, width, height, title, categoriesStr);
			},
			function(){}
		);
    }		
}

function displayLegend(elementID, listId, width, height, title, categoriesStr)
{
	var legendRectSize = 18;
    var legendSpacing = 4;
    var color = d3.scale.category20b();

	var gearListItems = GG_lists[listId].gearListItems;
	var cData = getCategoryData(gearListItems);
	var categoriesToShow = getCategoriesToShow(categoriesStr, cData.catNames);
	
	var color = d3.scale.ordinal().domain(categoriesToShow);
          
    var legend = d3.select(document.getElementById(elementID)).append("svg:svg").attr("width", width).attr("height", height)
    	.append("g")
    	.selectAll("g")
    	.data(categoriesToShow)
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



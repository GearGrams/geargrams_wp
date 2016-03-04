=== GearGrams ===
Donate link: https://www.geargrams.com/
Depends: Wp-D3
Tags: geargrams, lists, backpacking
Requires at least: 3.0.1
Tested up to: 4.4.1
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl.html
Stable tag: none

With the GearGrams Wordpress plugin you can show GearGrams lists in wordpress.

 == Description ==


With this plugin you can show GearGrams.com lists along with graphs in wordpress. 
 
Specifically this plugins adds short codes that can be added to most anywhere in wordpress.

If you haven’t used wordpress short codes you can read more about them here:
https://codex.wordpress.org/shortcode

== Installation ==

* First you must install the Wp-D3 plugin which is used for graphs.
You can do this by searching for Wp-D3 in the add new plugins of your wordpress admin.
Or follow the instructions at https://wordpress.org/plugins/wp-d3/installation/


1. Upload the plugin files to the `/wp-content/plugins/plugin-name` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress

= Usage =

Add the following shortcodes to any text in wordpress


* gg-table
	* Displays a list in table form
	* Attributes
		* list_id
			* Required
			* The id of the list to be displayed
		* categories
			* Optional
			* Comma seprated list of categories. example: "food,clothing"
			* Default: "" (empty string means all categories are displayed)
	* Examples
		* [gg-table list_id="123"]
		* [gg-table list_id="4432" categories="food,clothing"]

* gg-minimal
	* Adds a simple text list.
	* Attributes
		* list_id
			* Required
			* The id of the list to be displayed
		* categories
			* Optional
			* Comma seprated list of categories. example: "food,clothing"
			* Default: "" (empty string means all categories are displayed)
	* Examples
		* [gg-minimal list_id="123"]
		* [gg-minimal list_id="4432" categories="food,clothing"]


* gg-pie-graph
	* Displays a pie graph
	* Attributes
		* list_id
			* Required
			* The id of the list to be displayed
		* diameter
			* Optional
			* The diameter of the pie
			* default 300
		* categories
			* Optional
			* Comma seprated list of categories. example: "food,clothing"
			* empty string means all categories are displayed
			* Default: ""
	* Example
		* [gg-pie-graph list_id="123"]
		* [gg-pie-graph list_id="4432" categories="food,clothing"]


* gg_heading
	* Displays a list title and weight totals
	* Attributes
		* list_id
			* Required
			* The id of the list to be displayed
		* title
			* Optional
			* The title of the list.
			* Default: gg_default (this gives the actual name of the list)
		* unit
			* Optional
			* The unit to be used for the weights.
			* Accepted values: default,gram, lbs, oz, kg
			* Default: default
		* totals
			* Optional
			* Comma seprated list of total types.
			* Accepted Values: all, total, pack, worn, consumable
			* Default: "all"
	* Example
		* [gg-heading list_id="123"]
		* [gg-headingh list_id="4432" title="List Total and Pack Weights" totals="total,pack"]

* gg-full
	* Adds a full report view style list
	* Attributes
		* list_id
			* Required
			* The id of the list to be displayed
		* width
			* Optional
			* The width of the list
			* default: 100%
		* height
			* Optional
			* The height of the list
			* default: 600
	* Example
		* [gg-full list_id="123" width="800" height="500"]



 == Frequently Asked Questions == 

.


== Screenshots ==

1. Display of heading, list, graph and legend
Live example here:
http://blog.geargrams.com/devils-punchbowl/
=== GearGrams ===
Donate link: https://www.geargrams.com/
Depends: Wp-D3
Tags: geargrams, lists, backpacking
Requires at least: 3.0.1
Tested up to: 4.4.1
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Stable tag: none
Contributors: 000

With the GearGrams Wordpress plugin you can show GearGrams lists in wordpress. This plugin is in development and is likely to change.

 == Description ==




== Installation ==

First you must install the Wp-D3 plugin which is used for graphs.
You can do this by searching for Wp-D3 in the add new plugins of your wordpress admin.
Or follow the instructions at https://wordpress.org/plugins/wp-d3/installation/


1. Upload the plugin files to the `/wp-content/plugins/plugin-name` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress

Alternatly you can use GitHub Updater to install directly from the git repo.

1. Install https://github.com/afragen/github-updater
2. From the GitHub updater settings install the GearGrams using: https://github.com/Randonee/geargrams_wp

== Usage ==

Add the following shortcodes to any text in wordpress

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

* gg-minimal
	* Adds a simple text list.
	* Attributes
		* list_id
			* Required
			* The id of the list to be displayed
		* title
			* Optional
			* The title of the list.
			* Default: gg_default (this gives the actual name of the list)
		* categories
			* Optional
			* Comma seprated list of categories. example: "food,clothing"
			* Default: "" (empty string means all categories are displayed)
	* Examples
		* [gg-minimal list_id="123"]
		* [gg-minimal list_id="4432" categories="food,clothing" title="Pack List"]


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
		* title
			* Optional
			* The title of the list.
			* If set to an empty string then no title will display.
			* Default: ""
		* categories
			* Optional
			* Comma seprated list of categories. example: "food,clothing"
			* empty string means all categories are displayed
			* Default: ""
	* Example
		* [gg-pie-graph list_id="123"]
		* [gg-pie-graph list_id="4432" categories="food,clothing" title="Food and Clothing"]






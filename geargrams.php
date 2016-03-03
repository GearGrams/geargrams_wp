<?php
/*
Plugin Name: GearGrams
Plugin URI: http://www.geargrams.com/wordpress
Depends: Wp-D3
GitHub Plugin URI: https://github.com/Randonee/geargrams_wp
Description: Display GearGrams Lists
Version: 0.2.3
Author: GearGrams LLC
Author URI: http://www.gargrams.com
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl.html
*/

/*
GearGrams Wordpress Plugin
Copyright (C) 2016 GearGrams LLC
Contact at http://www.geargrams.com
*/

//define plugin defaults
DEFINE("GG_LIST_ID", "0");
DEFINE("GEARGRAMS_WIDTH", "100%");
DEFINE("GEARGRAMS_HEIGHT", "600");
DEFINE("GEARGRAMS_TITLE", "gg_default");
DEFINE("GEARGRAMS_CATEGORIES", "");
DEFINE("GEARGRAMS_DIAMETER", "300");
DEFINE("GEARGRAMS_LEGEND_WIDTH", "230");
DEFINE("GEARGRAMS_LEGEND_HEIGHT", "500");
DEFINE("GEARGRAMS_UNIT", "gram");
DEFINE("GEARGRAMS_TOTALS", "all");

DEFINE( 'GEARGRAMS__PLUGIN_URL', plugin_dir_url( __FILE__ ) );


register_activation_hook( __FILE__, 'geargrams_plugin_activate' );
function geargrams_plugin_activate(){

    // Require parent plugin
    if ( ! is_plugin_active( 'wp-d3/wp-d3.php' ) and current_user_can( 'activate_plugins' ) ) {
        // Stop activation redirect and show error
        wp_die('Sorry, but this plugin requires the Wp-D3 plugin to be installed and active. <br><a href="' . admin_url( 'plugins.php' ) . '">&laquo; Return to Plugins</a>');
    }
}

function load()
{
	global $gg_listCount;
	$gg_listCount = 0;

	wp_register_script( 'geargrams', GEARGRAMS__PLUGIN_URL . 'geargrams.js', array('jquery'), "1.0.0");
	wp_enqueue_script( 'geargrams' );
	
	wp_register_style( 'geargrams', GEARGRAMS__PLUGIN_URL. 'geargrams.css');
    wp_enqueue_style( 'geargrams' );
}

add_action('wp_enqueue_scripts', 'load');
add_shortcode("gg-full", "gg_full");
add_shortcode("gg-minimal", "gg_minimal");
add_shortcode("gg-pie-chart", "gg_piechart");
add_shortcode("gg-legend", "gg_legend");
add_shortcode("gg-heading", "gg_heading");
add_shortcode("gg-table", "gg_table");

header("Access-Control-Allow-Origin: https://www.geargrams.com");

function gg_full($atts)
{
	$atts=shortcode_atts(array(
		"list_id" => GG_LIST_ID,
		"width" => GEARGRAMS_WIDTH,
		"height" => GEARGRAMS_HEIGHT 
	), $atts);
	
	$elementId = 'geargrams_content' . nextListId();
	
	$output = '<iframe id="' . elementId . '" src="https://www.geargrams.com/list?id=' . $atts["list_id"] . '" width="' . $atts["width"] . '" height="' . $atts["height"] . '" frameborder="0" scrolling="yes" class="gg-iframe-class"></iframe>';

  return $output;
}

function gg_table($atts)
{
	$elementId = 'geargrams_content' . nextListId();

	$atts=shortcode_atts(array(
		"list_id" => GG_LIST_ID,
		"categories" => GEARGRAMS_CATEGORIES    
	), $atts);
	
	$output .= '<div id="' . $elementId . '" class="geargrams">';
	$output .= '<script>gg.displayTable("';
		$output .= $elementId . '", "';
		$output .= $atts["list_id"] . '", "';
		$output .= $atts["categories"];
	$output .= '");</script>';
	$output .= '</div>';

  return $output;
}

function gg_minimal($atts)
{
	$elementId = 'geargrams_content' . nextListId();

	$atts=shortcode_atts(array(
		"list_id" => GG_LIST_ID,
		"categories" => GEARGRAMS_CATEGORIES    
	), $atts);
	
	$output .= '<div id="' . $elementId . '" class="geargrams">';
	$output .= '<script>gg.displayMinimal("';
		$output .= $elementId . '", "';
		$output .= $atts["list_id"] . '", "';
		$output .= $atts["categories"];
	$output .= '");</script>';
	$output .= '</div>';

  return $output;
}

function gg_piechart($atts)
{
	$elementId = 'geargrams_content' . nextListId();

	$atts=shortcode_atts(array(
		"list_id" => GG_LIST_ID,
		"diameter" => GEARGRAMS_DIAMETER,
		"categories" => GEARGRAMS_CATEGORIES    
	), $atts);
	
	$output .= '<div id="' . $elementId . '" class="geargrams">';
	$output .= '<script>gg.displayPieChart("';
		$output .= $elementId . '", "';
		$output .= $atts["list_id"] . '", "';
		$output .= $atts["diameter"] . '", "';
		$output .= $atts["categories"];
	$output .= '");</script>';
	$output .= '</div>';

  return $output;
}

function gg_legend($atts)
{
	$elementId = 'geargrams_content' . nextListId();

	$atts=shortcode_atts(array(
		"list_id" => GG_LIST_ID,
		"width" => GEARGRAMS_LEGEND_WIDTH,
		"height" => GEARGRAMS_LEGEND_HEIGHT,
		"categories" => GEARGRAMS_CATEGORIES    
	), $atts);
	
	$output .= '<div id="' . $elementId . '" class="geargrams">';
	$output .= '<script>gg.displayLegend("';
		$output .= $elementId . '", "';
		$output .= $atts["list_id"] . '", "';
		$output .= $atts["width"] . '", "';
		$output .= $atts["height"] . '", "';
		$output .= $atts["categories"];
	$output .= '");</script>';
	$output .= '</div>';

  return $output;
}

function gg_heading($atts)
{
	$elementId = 'geargrams_content' . nextListId();

	$atts=shortcode_atts(array(
		"list_id" => GG_LIST_ID,
		"title" => GEARGRAMS_TITLE, 
		"unit" => GEARGRAMS_UNIT,
		"totals" => GEARGRAMS_TOTALS
	), $atts);
	
	$output .= '<div id="' . $elementId . '" class="geargrams">';
	$output .= '<script>gg.displayHeading("';
		$output .= $elementId . '", "';
		$output .= $atts["list_id"] . '", "';
		$output .= $atts["title"] . '", "';
		$output .= $atts["unit"] . '", "';
		$output .= $atts["totals"];
	$output .= '");</script>';
	$output .= '</div>';

  return $output;
}

function nextListId()
{
	$GLOBALS['gg_listCount'] = $GLOBALS['gg_listCount'] + 1;
	return $GLOBALS['gg_listCount'];
}


?>
<?php
/**
 * Template Name: special-offers
 * The template for displaying special deals
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package GTL_Multipurpose
 */
$templateParams = [
	'title' => 'Special Deals',
	'buttonName' => 'Special Deals',
	'noSearchBar' => true,
	'code' => '???SP????????????',
];
require_once(get_template_directory() . '/tourplan-template-product-search.php');
?>

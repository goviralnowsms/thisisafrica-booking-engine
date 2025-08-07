<?php
/**
 * Template Name: supplier-product-list
 * The template for displaying Accommodation supplier products list
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
	'title' => 'Accommodation',
	'buttonName' => 'Accommodation',
	'noSearchBar' => true,
];
require_once(get_template_directory() . '/tourplan-template-product-search.php');
?>

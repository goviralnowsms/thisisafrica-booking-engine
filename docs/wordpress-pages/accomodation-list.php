<?php
/**
 * Template Name: accomodation-list
 * The template for displaying Accommodation list
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
];
if(false):
require_once(get_template_directory() . '/tourplan-template-supplier-search.php');
else:
require_once(get_template_directory() . '/single.php');
endif;
?>

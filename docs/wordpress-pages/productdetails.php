<?php
/**
 * Template Name: productdetails
 * The template for displaying product details
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

require_once(get_stylesheet_directory() . '/tourplan-api-classes.php');

$dp = NULL;
$product = NULL;
$code = isset($_GET['code']) ? sanitize_text_field($_GET['code']) : NULL;
if(!empty($code)) {
    $product = new TourplanOptionProduct($code, 'ADG');
    
    if(!empty($product)) {
    $dp = $product->setDays(1095)->getDatesPrices();
    if(!empty($dp)) {
    function tia_product_details_add_scripts() {
    $baseURL = get_stylesheet_directory_uri();
    wp_enqueue_style('productdetails-dates-prices-css', $baseURL . '/productdetails-dates-prices.css', [], '1.0', 'all');
    wp_enqueue_script('productdetails-dates-prices-js', $baseURL . '/productdetails-dates-prices.js', ['jquery'], '1.0', true);
    }
    add_action('wp_enqueue_scripts', 'tia_product_details_add_scripts', 10, 0);
    }
    }
}

get_header();
?>
<section class="jr-site-para-highlight inner-page"><section class="inner-banner">
	<div class="testimonial" id="custestimonial"><?php get_template_part('template-parts/banner');?></div>
	<div class="new-testimonial0" id="new-testimonial0cus">
		<div class="container">
			<div class="about-us">
<?php
$title = $product->getTitle(); if(empty($title)) the_title('<h1>', '</h1>'); else echo "<h1>{$title}</h1>";
?>
				<div id="rectangle"></div>
				<span class="reserv">This is Africa is a rapidly growing wholesale and retail travel company which specialises in selling tailor-made and package tours to Africa.</span>
				<div class="package-area">
<?php
if(!empty($code)) :
	$upload_dir = wp_upload_dir(null, false)['baseurl'];
?>
				<div class="col-md-4"><div class="find-your-trip"><?php echo $product->getMap(); ?></div></div>
				<div id="myCarousel" class="carousel slide group-gallery col-md-8" data-ride="carousel">
<?php
	$productImages = $wpdb->get_results("SELECT image_name FROM af_product_images WHERE optioncode = '{$code}' AND status = '1'");
	if($productImages):
?>
				<div class="carousel-inner">
<?php		foreach($productImages as $key=>&$productImage): ?>
				<div class="item <?php if($key===0) echo 'active';?>"><img src="<?php echo $upload_dir, '/product_images/', $productImage->image_name;?>"/></div>
<?php		endforeach; unset($productImage); ?>
				</div>
				<ul class="list-group col-md-3 carousel-indicators">
<?php		for($i=0, $l=count($productImages); $i<$l; ++$i): ?>
				<li data-target="#myCarousel" data-slide-to="<?php echo $i;?>" class="<?php if($i===0) echo 'active';?>"></li>
<?php		endfor; ?>
				</ul>
<?php
	else:
		$html = $product->getImage();
		if(empty($html)) $html = '<img src="' . THEME_IMG_PATH . '/NO-IMG.jpg"/>';
?>
				<div class="carousel-inner"><div class="item active"><?php echo $html;?></div></div>
<?php	endif; ?>
				</div>
				<div class="col-md-12 tabs-group"><div class="panel panel-primary">
				<div class="panel-heading"><span class="pull-left">
				<ul class="nav panel-tabs">
				<li class="nav-item active"><a data-toggle="tab" href="#tab1" class="nav-link active">Introduction</a></li>
				<li class="nav-item"><a data-toggle="tab" href="#tab2" class="nav-link">Details</a></li>
				<li class="nav-item"><a data-toggle="tab" href="#tab3" class="nav-link">Inclusions</a></li>
<?php	if(!empty($dp)): ?>
				<li class="nav-item"><a data-toggle="tab" href="#tab4" class="nav-link">Dates &amp; Prices</a></li>
<?php
	endif;
	$productVideos = $wpdb->get_results("SELECT youtubelink FROM af_video_link WHERE optioncode = '{$code}' AND status = '1' ORDER BY id DESC LIMIT 1");
	if($productVideos):
?>
				<li class="nav-item"><a data-toggle="tab" href="#tab5" class="nav-link">Video</a></li>
<?php
	endif;
	if(($pdfname = $wpdb->get_var("SELECT pdfname FROM af_product_pdf WHERE optioncode = '{$code}' AND status = '1'")) !== null):
?>
				<li><a href="<?php echo $upload_dir, '/product_pdf/', $pdfname;?>" target="_blank">Printable itinerary</a></li>
<?php	endif; ?>
				</ul>
				</span></div>
				<div class="panel-body"><div class="tab-content">
				<div id="tab1" class="tab-pane active"><div class="group-sec"><?php echo $product->getIntroduction();?></div></div>
				<div id="tab2" class="tab-pane"><div class="group-sec"><?php echo $product->getDetails();?></div></div>
				<div id="tab3" class="tab-pane"><div class="group-sec"><?php echo $product->getInclusions();?></div></div>
<?php	if(!empty($dp)): ?>
<div id="tab4" class="tab-pane">
  <div class="group-sec">
    <table>
    <tr>
    <th></th>
    <th>Dates</th>
    <th>Twin</th>
    <th>Single</th>
    </tr>

    <?php 
    $hasAvailableDate = false; // Flag to track any valid entry
    ?>

    <?php foreach($dp as &$i): ?>

    <?php
    // Check if there are any available days in this date range
    $availableDays = [];
    if (isset($i['Days']) && !empty($i['Days'])) {
        foreach($i['Days'] as $day) {
            if (strpos($day['Status'], 'Available') !== false) {
                $availableDays[] = $day;
                $hasAvailableDate = true;
            }
        }
    }

    // Skip this iteration if no available dates found
    if (empty($availableDays)) {
        continue;
    }
    ?>

    <tr class="dates_prices_major">
    <th><button type="button">+</button></th>
    <th><?php echo "{$i['DateFrom']} - {$i['DateTo']}"; ?></th>
    <th><?php echo $i['TwinRate']; ?></th>
    <th><?php echo $i['SingleRate']; ?></th>
    </tr>

    <tr class="dates_prices_minor">
    <td></td>
    <td colspan="3">
    <div class="dates_prices_hidden">
        <?php foreach($availableDays as $day): ?>
        <p><?php echo "{$day['Date']}: {$day['Status']}"; ?></p>
        <?php endforeach; ?>
    </div>
    </td>
    </tr>

    <?php endforeach; unset($i); ?>

    <?php if (!$hasAvailableDate): ?>
    <tr>
    <td colspan="4"><p>No available dates found.</p></td>
    </tr>
    <?php endif; ?>

    </table>
  </div>
</div>
<?php
	endif;
	if($productVideos):
?>
				<div id="tab5" class="tab-pane"><div class="group-sec">
<?php		foreach($productVideos as &$productVideo): ?>
				<iframe width="510" height="287" src="https://www.youtube.com/embed/<?php echo $productVideo->youtubelink; ?>" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<?php		endforeach; unset($productVideo); ?>
				</div></div>
<?php	endif; ?>
				</div></div>
				</div></div>
<?php endif; ?>
				</div>
			</div>
		</div>
	</div>
</section></section>
<?php get_footer();?>
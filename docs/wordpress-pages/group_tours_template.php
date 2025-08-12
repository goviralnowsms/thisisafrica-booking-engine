<?php
/**
 * Template Name: Group-tours-template
 * The template for displaying group tours list
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

get_header();

?>
<script>
	$(document).ready(function(){
	$('#country').change(function(){
	var country_name= jQuery(this).val();
	//alert(country_name);
	$.ajax({
			type:'POST',
			url: get_theme_file_uri('get_destination.php'),
			data:{ c_name: country_name},
			success:function(result){
					alert(result);
			}
		});
	});
});
</script>
<section class="jr-site-para-highlight inner-page">
	<section class="inner-banner">
		<div class="testimonial">
			<?php get_template_part('template-parts/banner');?>
		</div>
		<div class="new-testimonial0">
			<div class="container">
				<div class="about-us">
					<?php $page_title = $wp_query->post->post_title;
					if($page_title =="group tour"){ ?>
					<h1>Group tours</h1>
					<?php }?>
					<div id="rectangle"></div>
					<span class="reserv">This is Africa is a rapidly growing wholesale and retail travel company which<br> specialists in selling tailor-made and package tours to Africa. </span>
					<div class="package-area">
						<section class="search_deals define_float">
							 <div class="form_outer">
								 <form class="form-inline" method="post" name="groupsearch" id="groupsearch" action="">
									<div class="form-group">
										<label for="text">Find your tour</label>
										<div class="select_main">
											 <div class="autocomplete1">
												<select name="country" id="country" >
													<option value="none">Select Country</option>
													<?php

														global $wpdb;
														$countries = $wpdb->get_results("select af_term_taxonomy.term_id , af_terms.name from af_term_taxonomy  INNER JOIN  af_terms ON af_term_taxonomy.term_id = af_terms.term_id where taxonomy = 'country'");
														foreach($countries as $country){
															//echo "<pre>";print_r($country);
														?>
														<option value="<?php echo $country->name; ?>" ><?php echo $country->name; ?></option>
													   <?php } ?>
												</select>
											 </div>
										</div>
									</div>
									<div class="form-group">
										<label for="text">Destination</label>
										<div class="select_main">
											 <div class="autocomplete1">
												<select name="country" id="country" onchange="getDropdownsData();">
													<option value="none">Select Country</option>
													<option value="" ></option>
												</select>
											 </div>
										</div>
									</div>
									<div class="form-group">
										<label for="text">Standard</label>
										<div class="select_main">
											 <div class="autocomplete1">
												<select name="country" id="country" onchange="getDropdownsData();">
													<option value="none">Select Country</option>
													<option value="" ></option>
												</select>
											 </div>
										</div>
									</div>
									<div class="button">
										<div class="select_main">
											 <input type="submit" name="search" value="Search" class="fil-btn" id="search">
										</div>
									</div>
								 </form>
							 </div>
						</section>
					</div>
				</div>
			</div>
		</div>
	</section>
</section>

<?php get_footer();?>

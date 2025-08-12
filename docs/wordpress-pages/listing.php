<?php
/**
 * Template Name: listing
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

 
 
<section class="jr-site-para-highlight inner-page">
 
<section class="inner-banner">
  <div class="testimonial">
  
  <?php get_template_part('template-parts/banner');?>
  
  <!--<img src="images/accomodation.jpg">-->
  </div>
   <div class="new-testimonial0">
  <div class="container">
    <div class="about-us"> 
	<?php if($_GET['catid']){ $cat_id = $_GET['catid'];}else { $cat_id = '';} ?>
      <?php //the_title( '<h1>', '</h1>' );  //ucfirst?>
	  <h1><?php echo get_cat_name( $cat_id );?> <?php the_title(); ?></h1>
      <div id="rectangle"></div>
	   <span class="reserv">This is Africa is a rapidly growing wholesale and retail travel company which<br> specialises in selling tailor-made and package tours to Africa. </span>
	   
	   
	  <div class="package-area">
	  
	  <!--left sidebar start here-->
        <div class="col-md-4">
		
		<!--Trip Search start here-->
          <div class="find-your-trip">
            <h3 class="book-now-title">FIND YOUR TRIP</h3>
            <form>
              <div class="origin-section"> <span>Origin</span>
                <select>
                  <option>Africa (AFR)</option>
                  <option>Botswana, Africa (BW)</option>
                  <option>Cape Town, South Africa, Africa</option>
                  <option>Greater Kruger National Park, South Africa, Africa (GKNP)</option>
                  <option>Hoedspruit, Greater Kruger National Park, South Africa, Africa</option>
                  <option>Maun Airport, Maun, Botswana, Africa (MUB)</option>
                </select>
              </div>
              <div class="origin-section"> <span>Destination</span>
                <select>
                  <option>Africa (AFR)</option>
                  <option>Botswana, Africa (BW)</option>
                  <option>Cape Town, South Africa, Africa</option>
                  <option>Greater Kruger National Park, South Africa, Africa (GKNP)</option>
                  <option>Hoedspruit, Greater Kruger National Park, South Africa, Africa</option>
                  <option>Maun Airport, Maun, Botswana, Africa (MUB)</option>
                </select>
              </div>
              <div class="origin-section"> <span>Product Name</span>
                <input placeholder="" type="text">
              </div>
              <div class="origin-section"> <span>Class</span>
                <select>
                  <option>Any</option>
                  <option>Budget - 2 to 3 star</option>
                  <option>Deluxe -  4 star</option>
                  <option>Luxury - 5 star</option>
                  <option>Something special</option>
                  <option>Standard - 3</option>
                </select>
              </div>
              <div class="search"><a href="#">Search Now</a></div>
            </form>
          </div>
		  <!--Trip Search end here-->
		  
		  <!-- News section start here-->
          <div class="side-add"><a href="#"><img src="images/add.jpg"></a></div>
          <div class="widget-title">
            <h5>LATEST NEWS</h5>
          </div>
		  
		  <?php echo do_shortcode('[sp_news grid="list"]');?>
		  <!-- News section end here-->
		  
        </div>
		<!--left sidebar end here-->
		
        
		<!-- Main inner content started here --->
		
		<div class="col-md-8 md-space">
          
 <?php
	if($_GET['catid'])
	{
		$catid = $_GET['catid'];
		$args = array( 'posts_per_page' => 20, 'category' => $catid);

		$myposts = get_posts( $args ); ?>
		
			  
		<?php if($myposts){?>
			<?php  foreach ( $myposts as $post ) : setup_postdata( $post ); ?>
			<?php #echo "<pre>";print_r($post);?>
			<?php //$trip_code = get_post_meta( get_the_ID(),'trip_code:');echo $trip_code[0];?>
			
			  <div class="single-package p-list mb-50">
			  
				<div class="package-img p-list"> 
				<!-- display Image here..-->
				<a href="<?php the_permalink(); ?>"><?php echo get_the_post_thumbnail( get_the_ID(), 'medium' ); ?></a>
				</div>
				
				<div class="pack-content">
				  <div class="p-cost">AUD$ <?php $price = get_post_meta( get_the_ID(),'price');echo $price[0];?></div>
				  <h5> <span><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></span></h5>
				  <p><?php $private_package_tour = get_post_meta( get_the_ID(),'private_package_which_includes_a_four_day_guided_small_group_tour'); echo wp_trim_words( $private_package_tour[0], 40, '...' );?>
				  </p>
				  <a class="read-more p-list" href="<?php the_permalink(); ?>"> READ MORE <i class="icofont icofont-arrow-right"></i> </a> </div>
			  </div>	
			  
				<?php endforeach;  ?>		  
				<?php }else{?>
				<div class="no-found"> <h3>No Result Found.</h3></div>
					<?php } ?> 
		<?php }else{ ?>
		<div class="no-found"> <h3>No Result Found.</h3></div>
		<?php  } ?>
        </div>		
		
		<!-- Main inner content end here --->
		
		
		
      </div>
    </div>
  </div>
  </div>
</section>
	



 

</section>	
	
<?php

get_footer();

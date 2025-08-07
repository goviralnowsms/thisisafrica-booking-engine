<?php
/**
 * Template Name: specialoffers
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
//API Credentials/Details file


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
      <?php the_title( '<h1>', '</h1>' ); //ucfirst?>
      <div id="rectangle"></div>
	   <span class="reserv">This is Africa is a rapidly growing wholesale and retail travel company which<br> specialises in selling tailor-made and package tours to Africa. </span>
	   
	   
	  <div class="package-area">
	  
	  <!--left sidebar start here-->
	  <!--Trip Search start here-->
        <div class="col-md-4">
		
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
		  
		  
        </div>
		<!--Trip Search end here-->
		
		<!--left sidebar end here-->
		
        
		<!-- Main inner content started here --->
		
		<div class="col-md-8 md-space">

		<?php
		//retrieve custom posts
		$args = array( 'post_type' => '	feature_specials', 'posts_per_page' => 10 );
		$loop = new WP_Query( $args );
		while ( $loop->have_posts() ) : $loop->the_post();

			echo '<div class="entry-content">';
			the_content();
			echo '</div>';
		
		endwhile;
		
		?>


		 <!-- <div class="single-package p-list mb-50">
            <div class="package-img p-list"> <img src="<?php echo THEME_IMG_PATH; ?>/package-thum-1.jpg"> </div>
            <div class="pack-content">
              <div class="p-cost"><?php //echo $Currency;?>$<?php //echo $SingleRate;?></div>
              <h5> <span><?php //echo ucfirst($SupplierName);?></span></h5>
              <p><?php //echo $Description;?></p>
              <a class="read-more p-list" href="#">READ MORE <i class="icofont icofont-arrow-right"></i> </a> 
			  </div>
          </div>		
		
		<div> <h3>No Result Found.</h3></div>-->
		 
	
<!--
		  <div class="single-package p-list mb-50">
            <div class="package-img p-list"> <img src="<?php //echo THEME_IMG_PATH; ?>/package-thum-1.jpg"> </div>
            <div class="pack-content">
              <div class="p-cost">$3000</div>
              <h5> <span>Affordable Africa</span></h5>
              <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. </p>
              <a class="read-more p-list" href="#">READ MORE <i class="icofont icofont-arrow-right"></i> </a> </div>
          </div>
		  
		  <div class="single-package p-list mb-50">
            <div class="package-img p-list"> <img src="<?php //echo THEME_IMG_PATH; ?>/package-thum-2.jpg"> </div>
            <div class="pack-content">
              <div class="p-cost">$3000</div>
              <h5> <span>Makutsi Safari</span></h5>
              <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. </p>
              <a class="read-more p-list" href="#">READ MORE <i class="icofont icofont-arrow-right"></i> </a> </div>
          </div>
		  
		  
		  <div class="single-package p-list mb-50">
            <div class="package-img p-list"> <img src="<?php //echo THEME_IMG_PATH; ?>/package-thum-3.jpg"> </div>
            <div class="pack-content">
              <div class="p-cost">$3000</div>
              <h5> <span>Panorama Route tour</span> </h5>
              <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. </p>
              <a class="read-more p-list" href="#">READ MORE <i class="icofont icofont-arrow-right"></i> </a> </div>
          </div>
		  
		  <div class="single-package p-list mb-50">
            <div class="package-img p-list"> <img src="<?php //echo THEME_IMG_PATH; ?>/package-thum-4.jpg"> </div>
            <div class="pack-content">
              <div class="p-cost">$3000</div>
              <h5> <span> Makutsi Private Game Reserve</span></h5>
              <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. </p>
              <a class="read-more p-list" href="#">READ MORE <i class="icofont icofont-arrow-right"></i> </a> </div>
          </div>
		  
		  
        </div>		
-->
		
		<!-- Main inner content end here --->
		
		
		
      </div>
    </div>
  </div>
  </div>
</section>
	



 

</section>	
	
<?php

get_footer();

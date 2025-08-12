<?php
/**
 * Template Name: Group-tour
 * The template for displaying accommodation list
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
<!--link type="style/css" rel="stylesheet" href="http://108.179.213.63/~quirksto/gamma/thisisafrica/wp-content/themes/gtl-multipurpose/bootstrap.min.css"/-->
 
 
 
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
          <!--<div class="widget-body">
            <div class="widget-single-content">
              <div class="widget-thumb"> <img src="images/latest-post1.jpg"> </div>
              <div class="widget-content"> <a href="#">
                <h6>Louvre Museum in Paries,</h6>
                </a> <span>France</span>
                <p>May 20, 2017</p>
              </div>
            </div>
            <div class="widget-single-content">
              <div class="widget-thumb"> <img src="images/latest-post2.jpg"> </div>
              <div class="widget-content"> <a href="#">
                <h6>Louvre Museum in Paries,</h6>
                </a> <span>France</span>
                <p>May 20, 2017</p>
              </div>
            </div>
            <div class="widget-single-content">
              <div class="widget-thumb"> <img src="images/latest-post3.jpg"> </div>
              <div class="widget-content"> <a href="#">
                <h6>Louvre Museum in Paries,</h6>
                </a> <span>France</span>
                <p>May 20, 2017</p>
              </div>
            </div>
          </div>-->
		  <!-- News section end here-->
		  
        </div>
		<!--left sidebar end here-->
		
        <div class="col-md-8 md-space">
          <div class="panel panel-primary">
                <div class="panel-heading">
                    <?php the_title( '<h3 class="panel-title">', '</h3>' ); //ucfirst?>
                </div>
                <div class="panel-body">
                    <div class="tab-content">
                        <div class="tab-pane active first-tab-content" id="tab1">
							<?php
							while ( have_posts() ) : the_post();
								the_content();

								/*wp_link_pages( array(
								'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'gtl-multipurpose' ),
								'after'  => '</div>',
								) );*/
							endwhile; // End of the loop.
							?>
						<div class="col-lg-4 accmdtion">
						<img src="<?php echo THEME_IMG_PATH; ?>/criptown.jpg">
						<h2> <a href="<?php echo home_url('/group-tours-list/?location=Cape Town'); ?>">Cape Town </a> </h2>
						</div>
						<div class="col-lg-4 accmdtion">
						<img src="<?php echo THEME_IMG_PATH; ?>/a1.jpg">
						<h2>  <a href="<?php echo home_url('/group-tours-list/?location=Nairobi'); ?>"> Nairobi  </a>  </h2>
						</div>
						<div class="col-lg-4 accmdtion">
						<img src="<?php echo THEME_IMG_PATH; ?>/a2.jpg">
						<h2><a href="<?php echo home_url('/group-tours-list/?location=Johannesburg'); ?>">Johannesburg </a> </h2>
						</div>
						<div class="col-lg-4 accmdtion">
						<img src="<?php echo THEME_IMG_PATH; ?>/a3.jpg">
						<h2> <a href="<?php echo home_url('/group-tours-list/?location=Masai Mara'); ?>">Masai Mara </a> </h2>
						</div>
						<div class="col-lg-4 accmdtion">
						<img src="<?php echo THEME_IMG_PATH; ?>/a4.jpg">
						<h2> <a href="<?php echo home_url('/group-tours-list/?location=Kruger National Park'); ?>">Kruger National Park   </a>  </h2>
						</div>
						<div class="col-lg-4 accmdtion">
						<img src="<?php echo THEME_IMG_PATH; ?>/a6.jpg">
						<h2> <a href="<?php echo home_url('/group-tours-list/?location=Victoria Falls'); ?>"> Victoria Falls</a></h2>
						</div>
						<div class="col-lg-4 accmdtion">
						<img src="<?php echo THEME_IMG_PATH; ?>/a5.jpg">
						<h2> <a href="<?php echo home_url('/group-tours-list/?location=Serengeti'); ?>">  Serengeti </a>   </h2>
						</div>
						<div class="col-lg-4 accmdtion">
						<img src="<?php echo THEME_IMG_PATH; ?>/a7.jpg">
						<h2>  <a href="<?php echo home_url('/group-tours-list/?location=Mozambique'); ?>">  Mozambique   </a>  </h2>
						</div>
						<div class="col-lg-4 accmdtion">
						<img src="<?php echo THEME_IMG_PATH; ?>/a8.jpg">
						<h2><a href="<?php echo home_url('/group-tours-list/?location=Mauritius'); ?>"> Mauritius   </a> </h2>
						</div>
						<div class="col-lg-4 accmdtion">
						<img src="<?php echo THEME_IMG_PATH; ?>/a13.jpg">
						<h2><a href="<?php echo home_url('/group-tours-list/?location=Chobe National Park'); ?>"> Chobe National Park     </a> </h2>
						</div>
						<div class="col-lg-4 accmdtion">
						<img src="<?php echo THEME_IMG_PATH; ?>//a14.jpg">
						<h2><a href="<?php echo home_url('/group-tours-list/?location=Okavango Delta'); ?>"> Okavango Delta   </a>    </h2>
						</div>
						</div>
                        <div class="tab-pane" id="tab2"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13500832.270260487!2d18.247902564791413!3d-34.296954151534734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1c34a689d9ee1251%3A0xe85d630c1fa4e8a0!2sSouth+Africa!5e0!3m2!1sen!2sin!4v1524745077416" style="border:0" allowfullscreen="" width="100%" height="450" frameborder="0"></iframe></div>
                                               
                    </div>
                </div>
            </div>
          
		   
		  
        </div>
      </div>
    </div>
  </div>
  </div>
</section>
	



 

</section>	
	
<?php

get_footer();

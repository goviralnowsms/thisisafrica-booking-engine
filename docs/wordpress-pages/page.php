<?php
/**
 * The template for displaying all pages
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

$sidebar = gtl_multipurpose_page_sidebar_pos();
if ( class_exists( 'WooCommerce' ) ) {
  if( is_woocommerce() ){
    $sidebar = gtl_multipurpose_shop_sidebar_pos();
  }
}
if(!$sidebar) $row = 'aGrid';
elseif($sidebar=='left') $row = 'col_2-30-70';
else $row = 'col_2-70-30';
?>
<section class="jr-site-para-highlight inner-page">
  <section class="inner-banner">
<?php
    if(is_page("Request Brochure")):
?>
      <style>
        .testimonial {display:none !important}
        .page-id-295 .new-testimonial0 {margin-top:0px !important}
      </style>
<?php
    endif;
    if(is_page("View Brochure")):
?>
      <style>
        .testimonial {display:none !important}
        .page-id-292 .new-testimonial0 {margin-top:0px !important}
      </style>
<?php
    endif;
?>
    <div class="testimonial">
<?php
      if($wp_query->post->post_title == 'Testimonials') echo do_shortcode('[text-slider]');
      get_template_part('template-parts/banner');
?>
    </div>
    <!--div class="<?php //echo gtl_multipurpose_site_container();?> content-all"-->
    <div class="new-testimonial0">
      <div class="container">
        <!--div class="<?php echo esc_attr($row);?>"-->
<?php
          if($sidebar == 'left') get_sidebar();
?>
          <!--div class="cols"-->
<?php
            while(have_posts()):
              the_post();
              get_template_part('template-parts/content', 'page');
              // If comments are open or we have at least one comment, load up the comment template.
              if(comments_open() || get_comments_number()) comments_template();
            endwhile;
?>
          <!--/div-->
        <!--/div-->
<?php
        if($sidebar == 'right') get_sidebar();
?>
      </div>
    </div>
  </section>
</section>
<?php get_footer(); ?>

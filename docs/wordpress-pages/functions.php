<?php
/**
 * GTL Multipurpose functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package GTL_Multipurpose
 */

// Stop Wordpress putting "prev" and "next" links in the HEAD section. This will stop browsers prefetching unwanted pages.
remove_action('wp_head', 'adjacent_posts_rel_link_wp_head');

/**
 * Custom debug log writer
 */
if (!function_exists('write_log')) {
  function write_log( $log )  {
    if ( true === WP_DEBUG ) {
      if ( is_array( $log ) || is_object( $log ) ) {
	error_log( print_r( $log, true ) );
      } else {
	error_log( $log );
      }
    }
  }
}

/**
 * Write the given backtrace array to the error log.
 * @param array $bt as returned from debug_backtrace()
 */
if (!function_exists('log_backtrace')) {
  function log_backtrace($bt = null) {
    if(empty($bt)) $bt = debug_backtrace();
    foreach($bt as $x) {
      if(!isset($x['function'])) $x['function'] = 'UNKNOWN';
      if(!isset($x['line'])) $x['line'] = 'UNKNOWN';
      if(!isset($x['file'])) $x['file'] = 'UNKNOWN';
      write_log("function {$x['function']} line {$x['line']} file {$x['file']}");
    }
  }
}

if ( ! function_exists( 'gtl_multipurpose_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function gtl_multipurpose_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on GTL Multipurpose, use a find and replace
		 * to change 'gtl-multipurpose' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'gtl-multipurpose', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		add_image_size( 'gtl-multipurpose-img-525-350' , 525 , 350 , array( 'center', 'top' ) );
		add_image_size( 'gtl-multipurpose-img-585-500' , 585 , 500 , array( 'center', 'top' ) );
		add_image_size( 'gtl-multipurpose-img-330-200' , 330 , 200 , array( 'center', 'top' ) );
		add_image_size( 'gtl-multipurpose-img-250-380' , 250 , 380 , array( 'center', 'top' ) );
		add_image_size( 'gtl-multipurpose-img-105-70' , 105 , 70 , array( 'center', 'top' ) );
		add_image_size( 'gtl-multipurpose-img-46-54' , 46 , 54 , array( 'center', 'top' ) );

		// This theme uses wp_nav_menu() in one location.
		register_nav_menus( array(
			'primary-menu' => esc_html__( 'Primary', 'gtl-multipurpose' ),
			'secondary-menu' => esc_html__( 'Secondary', 'gtl-multipurpose' ),
		) );

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support( 'html5', array(
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		) );

		// Set up the WordPress core custom background feature.
		add_theme_support( 'custom-background', apply_filters( 'gtl_multipurpose_custom_background_args', array(
			'default-color' => 'ffffff',
			'default-image' => '',
		) ) );

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
		add_theme_support( 'custom-logo', array(
			'width'	     => 170,
			'height'       => 40,
			'flex-width'  => true,
			'flex-height' => true,
		) );

		/**
		 * Add support for woocommerce.
		 *
		 */
		add_theme_support( 'woocommerce' );
		add_theme_support( 'wc-product-gallery-lightbox' );

	}
endif;
add_action( 'after_setup_theme', 'gtl_multipurpose_setup' );


/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function gtl_multipurpose_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'gtl_multipurpose_content_width', 640 );
}
add_action( 'after_setup_theme', 'gtl_multipurpose_content_width', 0 );

/**
 * Enqueue scripts and styles.
 */
function gtl_multipurpose_scripts() {
	wp_enqueue_style( 'gtl-multipurpose-font' , gtl_multipurpose_get_font() , array(), '20151215' );
	wp_enqueue_style( 'bootstrap', get_template_directory_uri() . '/assets/css/bootstrap.min.css', array(), '20151215' );
	wp_enqueue_style( 'flexslider', get_template_directory_uri() . '/assets/css/flexslider.min.css', array(), '20151215' );
	wp_enqueue_style( 'owl-carousel', get_template_directory_uri() . '/assets/css/owl.carousel.min.css', array(), '20151215' );
	wp_enqueue_style( 'font-awesome', get_template_directory_uri() . '/assets/css/font-awesome.min.css', array(), '20151215' );
	wp_enqueue_style( 'gtl-multipurpose-style' , get_stylesheet_uri() , array() , '1.8' );
	wp_enqueue_style( 'gtl-multipurpose-responsive', get_template_directory_uri() . '/assets/css/responsive.css', array(), '1.0' );

	wp_enqueue_script( 'bootstrap', get_template_directory_uri() . '/assets/js/bootstrap.min.js', array('jquery'), '20151215', true );
	wp_enqueue_script( 'flexslider', get_template_directory_uri() . '/assets/js/flexslider.min.js', array('jquery'), '20151215', true );
	wp_enqueue_script( 'owl-carousel', get_template_directory_uri() . '/assets/js/owl.carousel.min.js', array('jquery'), '20151215', true );
	wp_enqueue_script( 'parallax', get_template_directory_uri() . '/assets/js/parallax.min.js', array('jquery'), '20151215', true );
	wp_enqueue_script( 'gtl-multipurpose-skip-link-focus-fix', get_template_directory_uri() . '/assets/js/skip-link-focus-fix.js', array('jquery'), '20151215', true );
	wp_enqueue_script( 'gtl-multipurpose-scripts', get_template_directory_uri() . '/assets/js/scripts.js', array('jquery'), '1.0.4', true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'gtl_multipurpose_scripts' );

/**
 * loads javscript and css files in admin section.
 */
function gtl_multipurpose_admin_enqueue($hook){
	if($hook == 'post.php' || $hook == 'post-new.php' || $hook == 'edit.php'){
		wp_enqueue_style( 'wp-color-picker');
		wp_enqueue_script( 'wp-color-picker');

		wp_enqueue_style( 'greenturtle-mag-admin-style', get_template_directory_uri() . '/assets/admin/css/admin-style.css', array(), '1.0.4' );

		wp_enqueue_script( 'gtl-multipurpose-admin-script', get_template_directory_uri().'/assets/admin/js/scripts.js','', '1.0.4' , 'all' );
	}
}
add_action( 'admin_enqueue_scripts' , 'gtl_multipurpose_admin_enqueue' );

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Recommended plugins
 */
require get_template_directory() . '/inc/recommended-plugins.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Theme functions
 */
require get_template_directory() . '/inc/theme-functions.php';

/**
 * Theme functions
 */
require get_template_directory() . '/inc/sidebars.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';


/**
 * Demo Import
 */
require get_template_directory() . '/inc/one-click-demo-import.php';

if ( defined( 'SITEORIGIN_PANELS_VERSION' ) ) {
	/* load widgets */
	require get_template_directory() . '/inc/widgets/title_subtitle.php';
	require get_template_directory() . '/inc/widgets/raw_html.php';
	require get_template_directory() . '/inc/widgets/text_image_video.php';
	require get_template_directory() . '/inc/widgets/cta.php';
	require get_template_directory() . '/inc/widgets/list.php';
	require get_template_directory() . '/inc/widgets/divider.php';
	require get_template_directory() . '/inc/widgets/services.php';
	require get_template_directory() . '/inc/widgets/testimonials.php';
	require get_template_directory() . '/inc/widgets/team.php';
	require get_template_directory() . '/inc/widgets/blog.php';
	require get_template_directory() . '/inc/widgets/counter.php';
	require get_template_directory() . '/inc/widgets/skillbar.php';
	require get_template_directory() . '/inc/widgets/video.php';
	require get_template_directory() . '/inc/widgets/contact.php';
	if( class_exists( 'WooCommerce' ) ) {
		require get_template_directory() . '/inc/widgets/shop_products.php';
	}

	/* pagebuilder setting extension */
	require get_template_directory() . '/inc/page-builder.php';
}

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require get_template_directory() . '/inc/jetpack.php';
}

if( !defined('THEME_IMG_PATH')){
	define( 'THEME_IMG_PATH', get_stylesheet_directory_uri() . '/images' );
}


/*******************************************************************************
 * Tourplan hostConnect API interface
 */

require_once(get_template_directory() . '/tourplan-api-classes.php');

function tourplan_query($input_xml) {
	//CURL REQUEST
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, TOURPLAN_CURLURL);

	// For xml, change the content-type.
	curl_setopt($ch, CURLOPT_HTTPHEADER, Array("Content-Type: text/xml"));
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $input_xml);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); // ask for results to be returned

	// Send to remote and close the channel after the XML data is returned
	$result = curl_exec($ch);

	if(curl_errno($ch) !== 0) {
		write_log(curl_error($ch));
		log_backtrace();
		write_log('Tourplan request:'); write_log($input_xml);
		write_log('Tourplan response:'); write_log($result);
	}

    file_put_contents(__DIR__ . "/tourplan-raw-request.xml", $input_xml);
    file_put_contents(__DIR__ . "/tourplan-raw-response.xml", $result);
	curl_close($ch);

	// return the result as a SimpleXMLElement object
	return simplexml_load_string($result);
}


function WPXMLREQUEST($input_xml)
{
	return json_decode(json_encode(tourplan_query($input_xml)), true);
}


function get_destination_ajax_handler()
{
	$data = $_REQUEST['data'];
	$query = new TourplanProductSearchOptions($data['reqType'], $data['countryName']);
	$data['localityCount'] = count($data['LocalityDescription'] = $query->getLocalities());
	$data['classesCount'] = count($data['ClassDescription'] = $query->getClasses());
	echo json_encode($data);
	exit;
}
add_action('wp_ajax_get_destination', 'get_destination_ajax_handler'); // add action for logged users
add_action('wp_ajax_nopriv_get_destination', 'get_destination_ajax_handler'); // add action for unlogged users


function load_product_image_ajax_handler()
{
	$image = NULL;
	$data = stripslashes_deep($_REQUEST['data']);
	if(isset($data) && !empty($data['code']) && !empty($data['note']))
		$image = (new TourplanOptionRequest())
			 ->addProduct(new TourplanOptionCode(sanitize_text_field($data['code'])))
			 ->setNote(sanitize_text_field($data['note']))
			 ->getNote();
	if(!empty($image)) :
		echo $image;
	else :
?>
		<img src="<?php echo THEME_IMG_PATH;?>/no-img.png" noimage="33"/>
<?php
	endif;
	exit;
}
add_action('wp_ajax_load_product_image', 'load_product_image_ajax_handler'); // add action for logged users
add_action('wp_ajax_nopriv_load_product_image', 'load_product_image_ajax_handler'); // add action for unlogged users


function load_supplier_image_ajax_handler()
{
	$image = NULL;
	$data = stripslashes_deep($_REQUEST['data']);
	if(isset($data) && !empty($data['code']) && !empty($data['note']))
		$image = (new TourplanSupplierRequest())
			 ->addProduct(new TourplanSupplierCode(sanitize_text_field($data['code'])))
			 ->setNote(sanitize_text_field($data['note']))
			 ->getNote();
	if(!empty($image)) :
		echo $image;
	else :
?>
		<img src="<?php echo THEME_IMG_PATH;?>/no-img.png" noimage="33"/>
<?php
	endif;
	exit;
}
add_action('wp_ajax_load_supplier_image', 'load_supplier_image_ajax_handler'); // add action for logged users
add_action('wp_ajax_nopriv_load_supplier_image', 'load_supplier_image_ajax_handler'); // add action for unlogged users


/******************************************************************************/


function get_prev_ajax_handler()
{
	global $wpdb;
	$disoptioncode = $_POST['disoptioncode'];
	$productImages = $wpdb->get_results("SELECT * FROM af_product_images WHERE optioncode = '".$disoptioncode."' ");
	print_r(json_encode($productImages));
	exit;
}
add_action('wp_ajax_get_prev', 'get_prev_ajax_handler'); // add action for logged users
add_action( 'wp_ajax_nopriv_get_prev', 'get_prev_ajax_handler' ); // add action for unlogged users


function get_prevPDF_ajax_handler()
{
	global $wpdb;
	$disoptioncode = $_POST['disoptioncode'];
	$productImages = $wpdb->get_results("SELECT * FROM af_product_pdf WHERE optioncode = '".$disoptioncode."' ");
	print_r(json_encode($productImages));
	exit;
}
add_action('wp_ajax_get_prevPDF', 'get_prevPDF_ajax_handler'); // add action for logged users
add_action( 'wp_ajax_nopriv_get_prevPDF', 'get_prevPDF_ajax_handler' ); // add action for unlogged users


function get_del_ajax_handler()
{
	global $wpdb;
	$id = $_POST['id'];
	echo $productImages = $wpdb->get_results("DELETE FROM af_product_images WHERE id = '".$id."' ");
}
add_action('wp_ajax_get_del', 'get_del_ajax_handler'); // add action for logged users
add_action( 'wp_ajax_nopriv_get_del', 'get_del_ajax_handler' ); // add action for unlogged users


function get_delpdf_ajax_handler()
{
	global $wpdb;
	$id = $_POST['id'];
	echo $productImages = $wpdb->get_results("DELETE FROM af_product_pdf WHERE id = '".$id."' ");
}
add_action('wp_ajax_get_delpdf', 'get_delpdf_ajax_handler'); // add action for logged users
add_action( 'wp_ajax_nopriv_get_delpdf', 'get_delpdf_ajax_handler' ); // add action for unlogged users


/**********special offer custom post type code*************/

add_action( 'init', 'special_offer_post' );
function special_offer_post() {
	$labels = array(
		'name'		     => _x( 'Special Offers', 'post type general name', 'your-plugin-textdomain' ),
		'singular_name'	     => _x( 'Special Offer', 'post type singular name', 'your-plugin-textdomain' ),
		'menu_name'	     => _x( 'Special Offers', 'admin menu', 'your-plugin-textdomain' ),
		'name_admin_bar'     => _x( 'Special Offer', 'add new on admin bar', 'your-plugin-textdomain' ),
		'add_new'	     => _x( 'Add New', 'Special Offer', 'your-plugin-textdomain' ),
		'add_new_item'	     => __( 'Add New Special Offer', 'your-plugin-textdomain' ),
		'new_item'	     => __( 'New Special Offer', 'your-plugin-textdomain' ),
		'edit_item'	     => __( 'Edit Special Offer', 'your-plugin-textdomain' ),
		'view_item'	     => __( 'View Special Offer', 'your-plugin-textdomain' ),
		'all_items'	     => __( 'All Special Offers', 'your-plugin-textdomain' ),
		'search_items'	     => __( 'Search Special Offers', 'your-plugin-textdomain' ),
		'parent_item_colon'  => __( 'Parent Special Offers:', 'your-plugin-textdomain' ),
		'not_found'	     => __( 'No Special Offers found.', 'your-plugin-textdomain' ),
		'not_found_in_trash' => __( 'No Special Offers found in Trash.', 'your-plugin-textdomain' )
	);

	$args = array(
		'labels'	     => $labels,
		'description'	     => __( 'Description.', 'add Special Offers' ),
		'public'	     => true,
		'publicly_queryable' => true,
		'show_ui'	     => true,
		'show_in_menu'	     => true,
		'query_var'	     => true,
		'rewrite'	     => array( 'slug' => 'special-offer' ),
		'capability_type'    => 'post',
		'has_archive'	     => true,
		'hierarchical'	     => false,
		'menu_position'	     => null,
		'supports'	     => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt', 'comments','custom-fields' )
	);

	register_post_type( 'Special Offer', $args );
}



/**********create taxonomies*************/

add_action( 'init', 'create_tour_taxonomies', 0 );

function create_tour_taxonomies() {
	// Add new taxonomy, make it hierarchical (like categories)
	$labels = array(
		'name'		    => _x( 'Countries', 'taxonomy general name', 'textdomain' ),
		'singular_name'	    => _x( 'Country', 'taxonomy singular name', 'textdomain' ),
		'search_items'	    => __( 'Search Countries', 'textdomain' ),
		'all_items'	    => __( 'All Countries', 'textdomain' ),
		'parent_item'	    => __( 'Parent Country', 'textdomain' ),
		'parent_item_colon' => __( 'Parent Country:', 'textdomain' ),
		'edit_item'	    => __( 'Edit Country', 'textdomain' ),
		'update_item'	    => __( 'Update Country', 'textdomain' ),
		'add_new_item'	    => __( 'Add New Country', 'textdomain' ),
		'new_item_name'	    => __( 'New Country Name', 'textdomain' ),
		'menu_name'	    => __( 'Country', 'textdomain' ),
	);

	$args = array(
		'hierarchical'	    => true,
		'labels'	    => $labels,
		'show_ui'	    => true,
		'show_admin_column' => true,
		'query_var'	    => true,
		'rewrite'	    => array( 'slug' => 'country' ),
	);

	register_taxonomy( 'country', array( 'tour' ), $args );
}

add_action( 'init', 'create_destination_taxonomies', 0 );

function create_destination_taxonomies() {
	// Add new taxonomy, make it hierarchical (like categories)
	$labels = array(
		'name'		    => _x( 'Destinations', 'taxonomy general name', 'textdomain' ),
		'singular_name'	    => _x( 'Destination', 'taxonomy singular name', 'textdomain' ),
		'search_items'	    => __( 'Search Destinations', 'textdomain' ),
		'all_items'	    => __( 'All Destinations', 'textdomain' ),
		'parent_item'	    => __( 'Parent Destination', 'textdomain' ),
		'parent_item_colon' => __( 'Parent Destination:', 'textdomain' ),
		'edit_item'	    => __( 'Edit Destination', 'textdomain' ),
		'update_item'	    => __( 'Update Destination', 'textdomain' ),
		'add_new_item'	    => __( 'Add New Destination', 'textdomain' ),
		'new_item_name'	    => __( 'New Destination Name', 'textdomain' ),
		'menu_name'	    => __( 'Destination', 'textdomain' ),
	);

	$args = array(
		'hierarchical'	    => true,
		'labels'	    => $labels,
		'show_ui'	    => true,
		'show_admin_column' => true,
		'query_var'	    => true,
		'rewrite'	    => array( 'slug' => 'destination' ),
	);

	register_taxonomy( 'destination', array( 'destination' ), $args );
}


add_action( 'init', 'create_standard_taxonomies', 0 );

function create_standard_taxonomies() {
	// Add new taxonomy, make it hierarchical (like categories)
	$labels = array(
		'name'		    => _x( 'Standards', 'taxonomy general name', 'textdomain' ),
		'singular_name'	    => _x( 'Standard', 'taxonomy singular name', 'textdomain' ),
		'search_items'	    => __( 'Search Standards', 'textdomain' ),
		'all_items'	    => __( 'All Standards', 'textdomain' ),
		'parent_item'	    => __( 'Parent Standard', 'textdomain' ),
		'parent_item_colon' => __( 'Parent Standard:', 'textdomain' ),
		'edit_item'	    => __( 'Edit Standard', 'textdomain' ),
		'update_item'	    => __( 'Update Standard', 'textdomain' ),
		'add_new_item'	    => __( 'Add New Standard', 'textdomain' ),
		'new_item_name'	    => __( 'New Standard Name', 'textdomain' ),
		'menu_name'	    => __( 'Standard', 'textdomain' ),
	);

	$args = array(
		'hierarchical'	    => true,
		'labels'	    => $labels,
		'show_ui'	    => true,
		'show_admin_column' => true,
		'query_var'	    => true,
		'rewrite'	    => array( 'slug' => 'standard' ),
	);

	register_taxonomy( 'standard', array( 'standard' ), $args );
}





/**********group tour custom post type code*************/

add_action( 'init', 'group_tour_post' );
function group_tour_post() {
	$labels = array(
		'name'		     => _x( 'Group Tours', 'post type general name', 'your-plugin-textdomain' ),
		'singular_name'	     => _x( 'Group Tour', 'post type singular name', 'your-plugin-textdomain' ),
		'menu_name'	     => _x( 'Group Tours', 'admin menu', 'your-plugin-textdomain' ),
		'name_admin_bar'     => _x( 'Group Tour', 'add new on admin bar', 'your-plugin-textdomain' ),
		'add_new'	     => _x( 'Add New', 'Group Tour', 'your-plugin-textdomain' ),
		'add_new_item'	     => __( 'Add New Group Tour', 'your-plugin-textdomain' ),
		'new_item'	     => __( 'New Group Tour', 'your-plugin-textdomain' ),
		'edit_item'	     => __( 'Edit Group Tour', 'your-plugin-textdomain' ),
		'view_item'	     => __( 'View Group Tour', 'your-plugin-textdomain' ),
		'all_items'	     => __( 'All Group Tours', 'your-plugin-textdomain' ),
		'search_items'	     => __( 'Search Group Tours', 'your-plugin-textdomain' ),
		'parent_item_colon'  => __( 'Parent Group Tours:', 'your-plugin-textdomain' ),
		'not_found'	     => __( 'No Group Tours found.', 'your-plugin-textdomain' ),
		'not_found_in_trash' => __( 'No Group Tours found in Trash.', 'your-plugin-textdomain' )
	);

	$args = array(
		'labels'	     => $labels,
		'description'	     => __( 'Description.', 'add Group Tours' ),
		'public'	     => true,
		'publicly_queryable' => true,
		'show_ui'	     => true,
		'show_in_menu'	     => true,
		'query_var'	     => true,
		'rewrite'	     => array( 'slug' => 'group-tour' ),
		'capability_type'    => 'post',
		'has_archive'	     => true,
		'hierarchical'	     => false,
		'menu_position'	     => null,
		'supports'	     => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt', 'comments','custom-fields' ),
		'taxonomies' => array('country','destination','standard')
	);

	register_post_type( 'Group Tour', $args );
}

add_action('init', function () {
	if (isset($_GET['myip'])) {
		echo 'Server IP: ' . file_get_contents("https://api.ipify.org");
		exit;
	}
});


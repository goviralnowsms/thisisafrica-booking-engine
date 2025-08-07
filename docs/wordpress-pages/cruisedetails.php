<?php
/**
 * Template Name: cruisedetails
 * The template for displaying Cruise details
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
#error_reporting(E_ALL); ini_set('display_errors', TRUE);
get_header();
//API Credentials/Details file
include('api-configuration.php');

?>
<?php
$GENERAL_PRODUCT_Response = '';
if(isset($_GET['code']))
{
	$code = $_GET['code'];

	//fetch record with Opt code
	$XML = '<?xml version="1.0"?>
					<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
					<Request>
						<OptionInfoRequest>
							<AgentID>'.AGENTID.'</AgentID>
							<Password>'.AGENTPASSWORD.'</Password>
							<Opt>'.$code.'</Opt>
							<Info>GMFTD</Info>
							<NotesInRtf>H</NotesInRtf>
						</OptionInfoRequest>
					</Request>';

	$Response = WPXMLREQUEST($XML);

 }
?>


<section class="jr-site-para-highlight inner-page">

<section class="inner-banner">
  <div class="testimonial" id="custestimonial">

  <?php get_template_part('template-parts/banner');?>

  <!--<img src="images/accomodation.jpg">-->
  </div>
   <div class="new-testimonial0" id="new-testimonial0cus">
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
            <!--<h4 class="book-now-title">Map</h4>-->
			<?php
			if($Response)
			{


				if(!empty($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][0]['NoteCategory']))
				{
					if(!empty($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][0]['NoteText']) && ($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][0]['NoteCategory']=='MPI'))
					{
						$NoteTextimage = $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][0]['NoteText'];
					}
					else if(($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][1]['NoteCategory']=='MPI'))
					{
						$NoteTextimage = $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][1]['NoteText'];
					}
					else if(($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][2]['NoteCategory']=='MPI'))
					{
						$NoteTextimage = $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][2]['NoteText'];
					}
					else if(($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][3]['NoteCategory']=='MPI'))
					{
						$NoteTextimage = $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][3]['NoteText'];
					}

					$string =  implode(' ', array_slice(str_word_count($NoteTextimage, 2), 0, 20));
						if (strpos($string, 'src data image') !== false)
						{

							echo preg_replace("/<div>(.*?)<\/div>/", "$1", $NoteTextimage);

						}


				}


			}
			?>
          </div>
		  <!--Trip Search end here-->

        </div>
		<!--left sidebar end here-->


			<!-- slider started here-->
				<?php

				$productImages = $wpdb->get_results("SELECT * FROM af_product_images WHERE optioncode = '".$code."' AND status = '1' ");
				//echo "<pre>";print_r($productImages);
				?>
				<?php if($productImages){ ?>
				<div id="myCarousel" class="carousel slide group-gallery col-md-8" data-ride="carousel">
					<!-- Wrapper for slides -->
					<div class="carousel-inner">


						<?php
						foreach($productImages as $key=>$productImage)
						{
							$imageName = $productImage->image_name;
							$upload_dir   = wp_upload_dir(null, false);
							//echo '<div class="item active left"> <img src="'.$upload_dir['baseurl'].'/product_images/'.$imageName.'"> </div>';
						?>
						<div class="item <?php if($key=='0'){ echo 'active'; }?>"> <img src="<?php echo $upload_dir['baseurl'];?>/product_images/<?php echo $imageName;?>"> </div>
						<?php
						} ?>

					</div>
					<!-- End Carousel Inner -->
					<ul class="list-group col-md-3 carousel-indicators">
					<?php for($i=0;$i<count($productImages);$i++)
					{ ?>
						<li data-target="#myCarousel" data-slide-to="<?php echo $i;?>" class="<?php if($i=='0'){ echo 'active'; }?>"></li>
						<?php
					} 	?>
					  <!--<li data-target="#myCarousel" data-slide-to="0" class=""></li>
					  <li data-target="#myCarousel" data-slide-to="1" class="active"></li>
					  <li data-target="#myCarousel" data-slide-to="2" class=""></li>-->

					</ul>
				<!-- End Carousel -->
			  </div>
			<?php }
			 else if($Response)
			{ ?>
				<div id="myCarousel" class="carousel slide group-gallery col-md-8" data-ride="carousel">

					<div class="carousel-inner">

				<?php
				if($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][0]['NoteText'])
				{
					$NoteTextimage = $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][0]['NoteText'];

					$string =  implode(' ', array_slice(str_word_count($NoteTextimage, 2), 0, 20));
						if (strpos($string, 'src data image') !== false)
						{ ?>

							<?php echo preg_replace("/<div>(.*?)<\/div>/", "$1", $NoteTextimage);?>
						<?php
						}
						else
						{
							if($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][1]['NoteCategory']=="PI1"){
							$NoteTextimage1 = $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][1]['NoteText'];}

							if($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][2]['NoteCategory']=="PI1"){
							$NoteTextimage1 = $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][2]['NoteText'];}

							if($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][3]['NoteCategory']=="PI1"){
							$NoteTextimage1 = $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][3]['NoteText'];}

							if($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][4]['NoteCategory']=="PI1"){
							$NoteTextimage1 = $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][4]['NoteText'];}

							$string1 =  implode(' ', array_slice(str_word_count($NoteTextimage1, 2), 0, 20));
							if (strpos($string1, 'src data image') !== false)
							{ ?>

								<?php echo preg_replace("/<div>(.*?)<\/div>/", "$1", $NoteTextimage1); ?>
							<?php
							}
							else
							{ ?>
								<div class="item active"><img src="<?php echo THEME_IMG_PATH; ?>/NO-IMG.jpg"></div>
							<?php
							}

						}
				}
				else
				{ ?>
					<div class="item active"> <img src="<?php echo THEME_IMG_PATH; ?>/NO-IMG.jpg">  </div>
				  <?php
				} ?>
				</div>
				</div>
	  <?php } ?>



		<!-- slider end here-->

		<!-- Main inner content started here --->
			<div class="col-md-12 tabs-group">
			<?php //echo"<pre>"; print_r($Response);?>

			<?php if($Response){?>
			<?php
				if($Response['OptionInfoReply']['Option']['OptGeneral']['SupplierName'])
				{
					$SupplierName = $Response['OptionInfoReply']['Option']['OptGeneral']['SupplierName'];
				}
				if($Response['OptionInfoReply']['Option']['OptGeneral']['Description'])
				{
					$Description = $Response['OptionInfoReply']['Option']['OptGeneral']['Description'];
				}

				if($Response['OptionInfoReply']['Option']['OptGeneral']['LocalityDescription'])
				{
					$LocalityDescription = $Response['OptionInfoReply']['Option']['OptGeneral']['LocalityDescription'];
				}

				if($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][0]['NoteText'] && $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][0]['NoteCategory']=='PDW')
				{
					$NoteTextContentTab1 = $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][0]['NoteText'];

				}
				else if($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][1]['NoteText'] && $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][1]['NoteCategory']=='PDW')
				{
					$NoteTextContentTab1 = $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][1]['NoteText'];

				}
				else if($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][2]['NoteText'] && $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][2]['NoteCategory']=='PDW')
				{
					$NoteTextContentTab1 = $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][2]['NoteText'];

				}
				else if($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][3]['NoteText'] && $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][3]['NoteCategory']=='PDW')
				{
					$NoteTextContentTab1 = $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][3]['NoteText'];

				}
				else if($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][4]['NoteText'] && $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][4]['NoteCategory']=='PDW')
				{
					$NoteTextContentTab1 = $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][4]['NoteText'];

				}
				else
				{
					$NoteTextContentTab1 = '';//$Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote']['NoteText'];
				}


				if($Response['OptionInfoReply']['Option']['OptGeneral']['Periods'])
				{
					$Periods = $Response['OptionInfoReply']['Option']['OptGeneral']['Periods'];
				}
				if($Response['OptionInfoReply']['Option']['OptDateRanges']['OptDateRange']['RateSets']['RateSet']['OptRate']['RoomRates']['SingleRate'])
				{
					$SingleRate = $Response['OptionInfoReply']['Option']['OptDateRanges']['OptDateRange']['RateSets']['RateSet']['OptRate']['RoomRates']['SingleRate'];
				}
				if($Response['OptionInfoReply']['Option']['OptDateRanges']['OptDateRange']['RateSets']['RateSet']['OptRate']['RoomRates']['TwinRate'])
				{
					$TwinRate = $Response['OptionInfoReply']['Option']['OptDateRanges']['OptDateRange']['RateSets']['RateSet']['OptRate']['RoomRates']['TwinRate'];
				}
				if($Response['OptionInfoReply']['Option']['OptDateRanges']['OptDateRange']['Currency'])
				{
					$Currency = $Response['OptionInfoReply']['Option']['OptDateRanges']['OptDateRange']['Currency'];
				}

			?>

            <div class="panel panel-primary">
                <div class="panel-heading">
                    <span class="pull-left">
                        <!-- Tabs -->
                        <ul class="nav panel-tabs">
                            <li class="active"><a href="#tab1" data-toggle="tab" aria-expanded="true">Introduction</a></li>
                            <li class=""><a href="#tab2" data-toggle="tab" aria-expanded="false">Details</a></li>
                            <li class=""><a href="#tab3" data-toggle="tab" aria-expanded="false">Inclusions</a></li>
                            <li class=""><a href="#tab4" data-toggle="tab" aria-expanded="false">Departures</a></li>
							<li class=""><a href="#tab5" data-toggle="tab" aria-expanded="false">Video</a></li>
							<li class=""><a href="#tab6" data-toggle="tab" aria-expanded="false">Printabe itinerary</a></li>
                        </ul>
                    </span>
                </div>
                <div class="panel-body">
                    <div class="tab-content">
                        <div class="tab-pane active" id="tab1">
							<div class="group-sec">
								<?php echo $NoteTextContentTab1;?>
						   </div>
						</div>
                        <div class="tab-pane" id="tab2">
						<div class="group-sec">
						<!--<h2><?php //echo $SupplierName;?></h2>
							<ul>
							<li><span>Duration</span>: <?php //echo $Periods;?> days</li>
							<li><span>Tour starts</span>: <?php //echo $LocalityDescription;?></li>
							</ul>	-->
							<?php
								if($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote']['NoteCategory']=="PII")
								{
										echo $NoteTextPII = $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote']['NoteText'];
								}
								else if($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][1]['NoteCategory']=="PII")
								{
									echo $NoteTextPII =  $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][1]['NoteText'];
								}
								else if($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][2]['NoteCategory']=="PII")
								{
									echo $NoteTextPII =  $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][2]['NoteText'];
								}
								else if($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][3]['NoteCategory']=="PII")
								{
									echo $NoteTextPII =  $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][3]['NoteText'];
								}
								else if($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][4]['NoteCategory']=="PII")
								{
									echo $NoteTextPII =  $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][4]['NoteText'];
								}
							?>


						   </div></div>
                        <div class="tab-pane" id="tab3">
						<div class="group-sec">
							<?php
								if($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][0]['NoteCategory']=="INC")
								{
										echo $NoteTextINC_tab3 = $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][0]['NoteText'];
								}
								else if($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][1]['NoteCategory']=="INC")
								{
									echo $NoteTextINC_tab3 =  $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][1]['NoteText'];
								}
								else if($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][2]['NoteCategory']=="INC")
								{
									echo $NoteTextINC_tab3 =  $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][2]['NoteText'];
								}
								else if($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][3]['NoteCategory']=="INC")
								{
									echo $NoteTextINC_tab3 =  $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][3]['NoteText'];
								}
								else if($Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][4]['NoteCategory']=="INC")
								{
									echo $NoteTextINC_tab3 =  $Response['OptionInfoReply']['Option']['OptionNotes']['OptionNote'][4]['NoteText'];
								}
							?>
						   </div>
						</div>
                        <div class="tab-pane" id="tab4"><b>Not Found</b></div>
						<div class="tab-pane" id="tab5"><b>Not Found</b></div>
						<div class="tab-pane" id="tab6"><b>Printabe itinerary</b>
						<div class="group-sec">
							<ul>
							<?php
							$upload_dir   = wp_upload_dir(null, false);
							$productPDF = $wpdb->get_results("SELECT * FROM af_product_pdf WHERE optioncode = '".$code."' AND status = '1' ");
							//echo "<pre>";print_r($productPDF);

							if($productPDF)
							{
								$pdfFilePath = $productPDF[0];
								$pdfname = $pdfFilePath->pdfname;
								?>
								<li><span>PDF Link</span>: <a href="<?php echo $upload_dir['baseurl'];?>/product_pdf/<?php echo $pdfname;?>"target="_blank">View file</a> </li>
							<?php
							}
							else
							{ ?>
								<li>No PDF File</li>
							<?php
							}
							?>




							</ul>
						   </div>

						</div>
                    </div>
                </div>
            </div>
			<?php } ?>

        </div>

		<!-- Main inner content end here --->



      </div>
    </div>
  </div>
  </div>
</section>






</section>

<?php

get_footer(); ?>

<script>
$(document).ready(function(){

    var clickEvent = false;
	$('#myCarousel').carousel({
		interval:   4000
	}).on('click', '.list-group li', function() {
			clickEvent = true;
			$('.list-group li').removeClass('active');
			$(this).addClass('active');
	}).on('slid.bs.carousel', function(e) {
		if(!clickEvent) {
			var count = $('.list-group').children().length -1;
			var current = $('.list-group li.active');
			current.removeClass('active').next().addClass('active');
			var id = parseInt(current.data('slide-to'));
			if(count == id) {
				$('.list-group li').first().addClass('active');
			}
		}
		clickEvent = false;
	});
})

$(window).load(function() {
    var boxheight = $('#myCarousel .carousel-inner').innerHeight();
    var itemlength = $('#myCarousel .item').length;
    var triggerheight = Math.round(boxheight/itemlength+1);
	$('#myCarousel .list-group-item').outerHeight(triggerheight);
});</script>
<script>function DropDown(el) {
				this.dd = el;
				this.placeholder = this.dd.children('span');
				this.opts = this.dd.find('.dropdown a');
				this.val = '';
				this.index = -1;
				this.initEvents();
			}
			DropDown.prototype = {
				initEvents : function() {
					var obj = this;

					obj.dd.on('click', function(event){
						$(this).toggleClass('active');
						return false;
					});

					obj.opts.on('click',function(){
						var opt = $(this);
						obj.val = opt.text();
						obj.index = opt.index();
						obj.placeholder.text(obj.val);
					});
				},
				getValue : function() {
					return this.val;
				},
				getIndex : function() {
					return this.index;
				}
			}

			$(function() {

				var dd = new DropDown( $('#dd') );



			});</script>
<script>$('ul.nav li.dropdown').hover(function() {
  $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
}, function() {
  $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
});</script>

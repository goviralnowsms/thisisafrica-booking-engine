<?php
/**
 * This template lets the customer search for and review products based on country, destination and class.
 * Before including it, define an array named $templateParams containing these keys:
 *	'title' => the text to be displayed in the title section near the top of the page;
 *	'buttonName' => the type of product to be searched for, acting as the initial search filter;
 *	'highlights' => the three-letter name of the Notes field that holds the highlights content, defaults to 'PHL';
 *	'imageNote' => the three-letter name of the Notes field that holds the promotional image content, defaults to 'PI1';
 *	'imageLoader' => the name of the AJAX action used to load deferred images, defaults to 'load_product_image';
 *	'noSearchBar' => if not empty, then the search bar will not be shown and an automatic search will be conducted based on GET or POST parameters;
 *	'code' => if not empty, then this will override any value that may have been sent as a GET parameter.
 */
get_header();

$highlights = isset($templateParams['highlights']) ? $templateParams['highlights'] : 'PHL';
$imageNote = isset($templateParams['imageNote']) ? $templateParams['imageNote'] : 'PI1';
$imageLoader = isset($templateParams['imageLoader']) ? $templateParams['imageLoader'] : 'load_product_image';
$noSearchBar = !empty($templateParams['noSearchBar']);
$code = !empty($templateParams['code']) ? $templateParams['code'] : NULL;

if (!isset($code) && isset($_GET['code'])) $code = sanitize_text_field($_GET['code']);

$country = isset($_POST['country']) ? sanitize_text_field($_POST['country']) : NULL;
if (!$noSearchBar) $searchParameters = new TourplanProductSearchOptions($templateParams['buttonName'], $country);
if (!empty($country)) {
	if (!isset($_POST['destination']) || (($destination = sanitize_text_field($_POST['destination'])) == 'none')) $destination = '';
	if (!isset($_POST['classtype']) || (($classtype = sanitize_text_field($_POST['classtype'])) == 'none')) $classtype = '';
}

$matchingProducts = NULL;
if (!empty($code) || !empty($country)) {
	$matchingProducts = (new TourplanOptionRequest('GDM'))->setNote($highlights)->setDays(1095);
	if (!empty($code)) $matchingProducts->addProduct(new TourplanOptionCode($code));
	if (!empty($country)) $matchingProducts->addProduct(new TourplanProductsInCountry($templateParams['buttonName'], $country))->setLocality($destination)->setClass($classtype);
	$matchingProducts = $matchingProducts->getResponse();
	if(false) write_log($matchingProducts);
}

// echo "<pre>";
// print_r($searchParameters->getCountries());
// echo "</pre>";
?>
<section class="jr-site-para-highlight inner-page"><section class="inner-banner">
	<div class="testimonial"><?php get_template_part('template-parts/banner');?></div>
	<div class="new-testimonial0"><div class="container"><div class="about-us">
		<h1><?php echo $templateParams['title'];?></h1>
		<div id="rectangle"></div>
		<span class="reserv">This is Africa is a rapidly growing wholesale and retail travel company which specialises in selling tailor-made and package tours to Africa.</span>
		<div class="package-area">
<?php
			if (!$noSearchBar) :
?>
				<section class="search_deals define_float">
					<div class="form_outer">
						<form class="form-inline" method="post" name="groupsearch" id="groupsearch" action="">
							<div class="form-group">
								<label for="country">Starting country</label>
								<div class="select_main"><div class="autocomplete">
									<select id="country" name="country" onchange="getDropdownsData();">
										<option value="none">(Select Country)</option>
<?php
										foreach ($searchParameters->getCountries() as &$elem) :
											$selected = ($country == $elem) ? ' selected' : '';
?>
											<option value="<?php echo $elem;?>"<?php echo $selected;?>><?php echo $elem;?></option>
<?php
										endforeach;
?>
									</select>
								</div></div>
							</div>
							<div class="form-group">
								<label for="destination">Starting destination</label>
								<div class="select_main"><div class="autocomplete">
									<select id="destination" name="destination">
<?php
										$list = $searchParameters->getLocalities();
										if(!empty($list)) :
											echo '<option value="none">(Select option)</option>';
											foreach ($list as &$elem) :
												$selected = ($destination == $elem) ? ' selected' : '';
?>
												<option value="<?php echo $elem;?>"<?php echo $selected;?>><?php echo $elem;?></option>
<?php
											endforeach;
										endif;
?>
									</select>
								</div></div>
							</div>
							<div class="form-group">
								<label for="classtype">Class</label>
								<div class="select_main"><div class="autocomplete">
									<select id="classtype" name="classtype">
<?php
										$list = $searchParameters->getClasses();
										if(!empty($list)) :
											echo '<option value="none">(Select option)</option>';
											foreach ($list as &$elem) :
												$selected = ($classtype == $elem) ? ' selected' : '';
?>
												<option value="<?php echo $elem;?>"<?php echo $selected;?>><?php echo $elem;?></option>
<?php
											endforeach;
										endif;
?>
									</select>
								</div></div>
							</div>
							<div class="button"><div class="select_main"><input type="submit" name="search" value="<?php if(!empty($country)) echo 'Search';?>" class="fil-btn" id="search" <?php if(empty($country)) echo 'disabled';?>/></div></div>
						</form>
					</div>
				</section>
<?php
			endif;
?>
			<section class="travel define_float">
<?php
				if (!$noSearchBar && !isset($matchingProducts)) :
					// User-controlled searching is possible but no search has been performed yet
?>
					<div><h3>(Search results will appear here.)</h3></div>
<?php
				elseif (!isset($matchingProducts) || !isset($matchingProducts->OptionInfoReply->Option)) :
					// User-controlled searching is NOT possible, so either a search was not automatically performed or it found nothing
?>
					<div><h3>NO PRODUCTS FOUND</h3></div>
<?php
				else :
					// Scan all found options to determine the set of CTY amenities
					$amenities = array();
					foreach ($matchingProducts->OptionInfoReply->Option as $Opt) {
						if(isset($Opt->Amenities)) {
							foreach($Opt->Amenities->Amenity as $amenity) {
								$code = (string)$amenity->AmenityCode;
								if(((string)$amenity->AmenityCategory === 'CTY') && !isset($amenities[$code])) {
									$amenities[$code] = (string)$amenity->AmenityDescription;
								}
							}
						}
					}
					// Display amenities and ensure the supporting JavaScript will be loaded
					if (!empty($amenities)) :
						asort($amenities, SORT_STRING);
?>
						<div class="amenities_filter"><span>Show <strong>only</strong> these destinations:</span><ul>
<?php
						foreach($amenities as $code => $desc) :
?>
							<li><label><input class="amenity_cty" type="checkbox" value="<?php echo $code;?>" onchange="updateFilterAmenityCTY(this);"/> <?php echo $desc;?></label></li>
<?php
						endforeach;
?>
						</ul></div>
<?php
					endif;
?>
					<div class="container"><div class="outer_travel row">
<?php
						$siteURL = get_site_url();
						$loaderURL = get_stylesheet_directory_uri() . '/pageLoader.gif';
						foreach ($matchingProducts->OptionInfoReply->Option as $Opt) :
							$code = (string)$Opt->Opt;
							$detailsURL = $siteURL . '/productdetails?code=' . $code;
							$Periods = isset($Opt->OptGeneral->Periods) ? $Opt->OptGeneral->Periods : 0;
							$ClassDescription = isset($Opt->OptGeneral->ClassDescription) ? $Opt->OptGeneral->ClassDescription : '';
							$Comment = isset($Opt->OptGeneral->Comment) ? wp_trim_words($Opt->OptGeneral->Comment, 5, '...') : '';
							$TwinRate = 0; if(isset($Opt->OptDateRanges)) {
								foreach($Opt->OptDateRanges->OptDateRange as $dateRange) {
									if(isset($dateRange->RateSets)) {
										foreach($dateRange->RateSets->RateSet as $rateSet) {
											if(isset($rateSet->OptRate) && isset($rateSet->OptRate->RoomRates)) {
												$thisRate = (int)$rateSet->OptRate->RoomRates->TwinRate;
												if((($thisRate < $TwinRate) || ($TwinRate == 0)) && ($thisRate > 0)) $TwinRate = $thisRate;
											}
										}
									}
								}
							}
							$ctydata = ''; if(isset($Opt->Amenities)) {
								$ctydata = ' data-amenity_cty=" ';
								foreach($Opt->Amenities->Amenity as $amenity) {
									if((string)$amenity->AmenityCategory === 'CTY') {
										$ctydata .= (string)$amenity->AmenityCode . ' ';
									}
								}
								$ctydata .= '"';
							}
?>
							<div class="col-sm-4 col-xs-12 space"><div class="travel_offer"<?php echo $ctydata;?>>
								<div class="image">
									<a href="<?php echo $detailsURL;?>" target="_blank" class="deferred-image-load" data-loader="<?php echo $imageLoader;?>" data-code="<?php echo $code;?>" data-note="<?php echo $imageNote;?>">
										<img style="width:50%;height:50%;" src="<?php echo $loaderURL;?>" noimage="33"/>
									</a>
								</div>
								<div class="tourdetails">
									<div class="leftside">
										<div class="packagetitle"><?php echo $Opt->OptGeneral->Description;?></div>
										<div class="highlights hiddenblock"><?php if (isset($Opt->OptionNotes->OptionNote)) echo $Opt->OptionNotes->OptionNote->NoteText; ?></div>
										<div class="daywithcountry">
											<div class="days"><span><?php echo 1+$Periods;?></span> Days</div>
											<div class="country"><span class="departure-day"><?php echo $Comment;?></span><br/><span class="price-inf">per person twin share</span></div>
										</div>
									</div>
									<div class="rightside">
										<div class="price">
											<?php if($TwinRate == 0) : ?>
												<span style="font-size:70%;">On request</span>
											<?php else : ?>
												<sup><span style="font-size:50%;">From </span></sup>$<?php echo number_format(ceil($TwinRate/200),0);?>
											<?php endif; ?>
										</div>
										<div class="typ-proce"><?php echo $ClassDescription;?></div>
										<a class="viewdetail" href="<?php echo $detailsURL;?>" target="_blank">View Details<i class="fa fa-angle-double-right"></i></a>
									</div>
								</div>
							</div></div>
<?php
						endforeach;
?>
					</div></div>
<?php
				endif;
?>
			</section>
		</div>
	</div></div></div>
</section></section>
<?php
get_footer();
require_once(get_template_directory() . '/tourplan-template-search-script.php');
?>

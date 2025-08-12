<?php
/**
 * Version 0.3 (11 Dec 2018)
 * Copyright 2018 Christopher Martin <iam.chris.martin@internode.on.net>.
 * All rights reserved. This file remains the property of its author, Christopher Martin.
 * Redistribution in part or whole is strictly forbidden without the express written permission of the author.
 * The production of derivative works is strictly forbidden without the express written permission of the author.
 * Reproduction in any form must contain this notice complete and unaltered.
 *
 * This file defines classes which simplify use of a Tourplan NX service.
 * The owner of website <thisisafrica.com.au> has a perpetual, non-exclusive, non-transferable licence to
 * include this file as part of the source code of that website alone for as long as that website is operating.
 *
 * To use the classes from this file in another PHP 5 file, add the following line:
 * require_once(get_template_directory() . '/tourplan-api-classes.php');
 */

/**
 * Tourplan NX account credentials and other configuration settings are stored in a separate file.
 */
require_once(get_template_directory() . '/tourplan-api-configuration.php');

interface TourplanIdentifier {
    /** @return string */
    public function encode();
}

final class TourplanProductsInCountry implements TourplanIdentifier {
    private $service;
    private $country;
    public function encode() {return '<ButtonName>' . $this->service . '</ButtonName><DestinationName>' . $this->country . '</DestinationName>';}
    public function __construct($service, $country) {$this->service = $service; $this->country = $country;}
}

final class TourplanOptionCode implements TourplanIdentifier {
    private $code;
    public function encode() {return '<Opt>' . $this->code . '</Opt>';}
    public function __construct($code) {$this->code = $code;}
}

final class TourplanSupplierCode implements TourplanIdentifier {
    private $code;
    public function encode() {return '<SupplierCode>' . $this->code . '</SupplierCode>';}
    public function __construct($code) {$this->code = $code;}
}

final class TourplanSupplierID implements TourplanIdentifier {
    private $code;
    public function encode() {return '<SupplierId>' . $this->code . '</SupplierId>';}
    public function __construct($code) {$this->code = $code;}
}

abstract class TourplanRequest {
    /**
    * PHP does not allow abstract protected static members (aka properties).
    * Therefore, every TourplanRequest subclass *MUST* include uncommented the lines immediately below.
    * This workaround was suggested on StackOverflow by Marco Pallante.
    * See <https://stackoverflow.com/a/38397766>.
    */
    // protected static string $requestType = ''; // Identifies the type of Tourplan request
    // protected static string[] $tagOrder = []; // Lists the order in which tags are accepted

    /** @var string[string] */
    protected $tags;

    /** @var cached SimpleXMLElement object */
    protected $response = NULL;

    /**
    * A subclass may override this method to construct a part of the request that is unique to its type.
    * @return string
    */
    protected function buildRequest() {return '';}

    /**
    * Calls down to the subclass' buildRequest() method, then issues the composed request
    * to Tourplan and returns the response, also saving it in case needed for later processing.
    * @return SimpleXMLElement object
    */
    final public function getResponse() {
        try {
            $log = true; // Turn on logging for debugging
            if (!isset($this->response)) {
                $q = '<?xml version="1.0"?><!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd"><Request><'
                . static::$requestType
                . 'Request><AgentID>'
                . TOURPLAN_AGENTID
                . '</AgentID><Password>'
                . TOURPLAN_AGENTPASSWORD
                . '</Password>'
                . $this->buildRequest();

                foreach (static::$tagOrder as &$tag) {
                    if (!empty($this->tags[$tag])) {
                        $q .= "<{$tag}>{$this->tags[$tag]}</{$tag}>";
                    }
                }

                $q .= '</' . static::$requestType . 'Request></Request>';

                if ($log) {
                    error_log("[Tourplan Request XML] " . $q);
                }

                $this->response = tourplan_query($q); // assuming this returns SimpleXMLElement
                file_put_contents(__DIR__ . '/tourplan-raw-response.xml', $this->response instanceof SimpleXMLElement ? $this->response->asXML() : print_r($this->response, true));

                // *** ADDED: Log the raw API response ***
                error_log("[Tourplan Raw Response] " . print_r($this->response, true));

                if ($log) {
                    error_log("[Tourplan Response XML] " . print_r($this->response, true));
                }

                if (!$this->response instanceof SimpleXMLElement) {
                    throw new Exception("Invalid response received from Tourplan API.");
                }
            }
        } catch (Exception $e) {
            error_log("[Tourplan Error] " . $e->getMessage());
            error_log("[Tourplan Trace] " . $e->getTraceAsString());
        }

        return $this->response;
    }

    public function __construct() {$this->tags = array();}
}

class TourplanProductSearchOptions extends TourplanRequest {
    protected static $requestType = 'GetServiceButtonDetails';
    protected static $tagOrder = ['ButtonName', 'DestinationName'];

    protected $countries = NULL;
    protected $localities = NULL;
    protected $classes = NULL;

    public function getCountries() {
        if(!isset($this->countries)) {
            $this->countries = [];
            $list = $this->getResponse()->GetServiceButtonDetailsReply->Countries;
            if(isset($list) && isset($list->Country)) foreach($list->Country as $elem) $this->countries[] = (string)$elem->CountryName;
        }
        return $this->countries;
    }

    public function getLocalities() {
        if(!isset($this->localities)) {
            $list = $this->getResponse()->GetServiceButtonDetailsReply->LocalityDescriptions;
            $this->localities = (isset($list) && !empty($list->LocalityDescription)) ? (array)$list->LocalityDescription : [];
        }
        return $this->localities;
    }

    public function getClasses() {
        if(!isset($this->classes)) {
            $list = $this->getResponse()->GetServiceButtonDetailsReply->ClassDescriptions;
            $this->classes = (isset($list) && !empty($list->ClassDescription)) ? (array)$list->ClassDescription : [];
        }
        return $this->classes;
    }

    public function __construct($service, $country = '') {
        parent::__construct();
        $this->tags['ButtonName'] = $service;
        if(!empty($country)) $this->tags['DestinationName'] = $country;
    }
}

abstract class TourplanProductRequest extends TourplanRequest {
    protected /* TourplanIdentifier[] */ $ids;

    protected function buildRequest() {
        $body = '';
        foreach($this->ids as &$id) $body .= $id->encode();
        return $body;
    }

    public function addProduct(TourplanIdentifier $id) {
        $this->ids[] = $id;
        return $this;
    }

    public function setNote($category) {
        $this->tags['NoteCategory'] = $category;
        $this->tags['NoteFormat'] = 'H';
        return $this;
    }

    /**
    * @return string some note content (if any) in HTML format, '' otherwise
    */
    abstract public function getNote();

    public function __construct($info = false) {
        parent::__construct();
        $this->ids = array();
        if($info !== false) $this->tags['Info'] = $info;
    }
}

class TourplanOptionRequest extends TourplanProductRequest {
    protected static $requestType = 'OptionInfo';
    protected static $tagOrder = ['Info', 'DateFrom', 'SCUqty', 'RateConvert', 'NoteCategory', 'LocalityDescription', 'ClassDescription', 'NoteFormat'];

    public function setLocality($val) {
        $this->tags['LocalityDescription'] = $val;
        return $this;
    }

    public function setClass($val) {
        $this->tags['ClassDescription'] = $val;
        return $this;
    }

    /**
    * @param int $days Number of days from the starting date inclusive
    * @param string $start a recognisable date if specified, otherwise default to today's date
    */
    public function setDays($days = 1, $start = NULL) {
        if(!isset($start)) $start = date('Y-m-d');
        $this->tags['DateFrom'] = $start;
        $this->tags['SCUqty'] = $days;
        $this->tags['RateConvert'] = 'Y';
        return $this;
    }

    /**
    * @return string some note content (if any) in HTML format, '' otherwise
    */
    public function getNote() {
        $note = $this->getResponse()->OptionInfoReply->Option->OptionNotes;
        return (isset($note) && isset($note->OptionNote)) ? (string)$note->OptionNote->NoteText : '';
    }

    /**
    * @return string the description (if Info 'G' was requested), '' otherwise
    */
    public function getDescription() {
        $gen = $this->getResponse()->OptionInfoReply->Option->OptGeneral;
        return isset($gen) ? (string)$gen->Description : '';
    }

    public function __construct($info = false) {
        parent::__construct($info);
    }
}

class TourplanSupplierRequest extends TourplanProductRequest {
    protected static $requestType = 'SupplierInfo';
    protected static $tagOrder = ['NoteCategory', 'Info', 'LocationCode', 'NoteFormat'];

    public function setLocation($val) {
        $this->tags['LocationCode'] = $val;
        return $this;
    }

    /**
    * @return string some note content (if any) in HTML format, '' otherwise
    */
    public function getNote() {
        $note = $this->getResponse()->SupplierInfoReply->Suppliers->Supplier->SupplierNotes;
        return (isset($note) && isset($note->SupplierNote)) ? (string)$note->SupplierNote->NoteText : '';
    }

    public function __construct($info = false) {
        parent::__construct($info);
    }
}

/**
 * Implementation note:
 * If multiple notes are required about a product, each note will be retrieved by a distinct request.
 * If a single note is required about a product, it is more efficient to retrieve that note when requesting other information.
 */
abstract class TourplanProduct {
    // protected static string[6] $noteKeys;

    private /* TourplanIdentifier */ $id;
    private /* TourplanOptionRequest[] */ $notes;

    protected /* TourplanProductRequest */ $info;

    /** @return a subclass of TourplanProductRequest */
    abstract protected function newProductRequest();

    /*
    * @param int $idx an index into array $noteKeys
    * @return string
    */
    private function getDistinctNote($idx) {
        if(!isset($this->notes[$key = static::$noteKeys[$idx]])) $this->notes[$key] = $this->newProductRequest()->addProduct($this->id)->setNote($key);
        return $this->notes[$key]->getNote();
    }

    final public function getIntroduction() {return $this->getDistinctNote(0);}
    final public function getDetails() {return $this->getDistinctNote(1);}
    final public function getInclusions() {return $this->getDistinctNote(2);}
    final public function getHighlights() {return $this->getDistinctNote(3);}
    final public function getMap() {return $this->getDistinctNote(4);}
    final public function getImage() {return $this->getDistinctNote(5);}

    /*
    * @param int $idx an index into array $noteKeys
    * @return $this
    */
    final public function setNote($idx) {
        $this->info->setNote(static::$noteKeys[$idx]);
        return $this;
    }

    /**
    * @return string some note content (if any) in HTML format, '' otherwise
    */
    final public function getNote() {
        return $this->info->getNote();
    }

    /**
    * @return string the product title which (for some strange reason) is kept in the Description element returned when Info requested includes 'G'
    */
    final public function getTitle() {
        return $this->info->getDescription();
    }

    public function __construct(TourplanIdentifier $id, TourplanProductRequest $info) {
        ($this->info = $info)->addProduct($this->id = $id);
        $this->notes = array();
    }
}

class TourplanOptionProduct extends TourplanProduct {
    protected static $noteKeys = ['PDW', 'PII', 'INC', 'PHL', 'MPI', 'PI1'];

    private /* int */ $timeStart = NULL; // a Unix timestamp representing zero hours today or some other nominated date
    private /* DateTime */ $dateStart = NULL; // a DateTime object representing zero hours today or some other nominated date
    private /* array */ $dates = NULL; // a numerically indexed array of associative arrays: { 'DateFrom' , 'DateTo' , 'SingleRate' , 'TwinRate' , 'Days' : { 'Date' , 'Status' }* }*
    private /* bool */ $includeDays; // true if 'A' was included in the argument to the constructor's $info, in which case 'Days' subelements will be present in $dates

    /** @return a subclass of TourplanProductRequest */
    protected function newProductRequest() {return new TourplanOptionRequest();}

    /**
    * @param int $days Number of days from the starting date inclusive
    * @param string $start a recognisable date if specified, otherwise default to today's date
    */
    public function setDays($days = 1, $start = NULL) {
        if(!isset($start)) $start = date('Y-m-d');
        $this->timeStart = strtotime($start);
        $this->dateStart = new DateTime($start);
        $this->info->setDays($days, $start);
        return $this;
    }

    /**
    * @return array
    */
    public function getDatesPrices() {
        if(!isset($this->dates)) {
            $this->dates = array();
            $opt = $this->info->getResponse()->OptionInfoReply->Option;
            if(isset($opt->OptDateRanges)) {
                if($this->includeDays && ($this->includeDays = isset($opt->OptAvail))) $avail = explode(' ', (string)$opt->OptAvail);
                foreach($opt->OptDateRanges->OptDateRange as $dateRange) {
                    if(isset($dateRange->RateSets)) {
                        foreach($dateRange->RateSets->RateSet as $rateSet) {
                            if(isset($rateSet->OptRate) && isset($rateSet->OptRate->RoomRates) && (isset($rateSet->OptRate->RoomRates->SingleRate) || isset($rateSet->OptRate->RoomRates->TwinRate))) {
                                $dFrom = (string)$dateRange->DateFrom;
                                $dTo = (string)$dateRange->DateTo;
                                $roomRates = $rateSet->OptRate->RoomRates;
                                $optRate = array(
                                    'DateFrom' => date('d-M-Y', strtotime($dFrom)),
                                    'DateTo' => date('d-M-Y', strtotime($dTo)),
                                    'SingleRate' => (isset($roomRates->SingleRate) ? ('$' . number_format(ceil($roomRates->SingleRate/100),0)) : ''),
                                    'TwinRate' => (isset($roomRates->TwinRate) ? ('$' . number_format(ceil($roomRates->TwinRate/200),0)) : '')
                                );
                                if($this->includeDays) {
                                    $days = array();
                                    $dFrom = (new DateTime($dFrom))->diff($this->dateStart)->days;
                                    $dTo = (new DateTime($dTo))->diff($this->dateStart)->days;
                                    for($day = $dFrom; $day <= $dTo; ++$day) {
                                        if($avail[$day] != '-1') {
                                            switch($avail[$day]) {
                                                case '-3' : $stat = 'On request'; break;
                                                case '-2' : $stat = 'On free sell'; break;
                                                default   : $stat = 'Available';
                                            }
                                            $days[] = array(
                                                'Date' => date('D j F', strtotime("{$day} days", $this->timeStart)),
                                                'Status' => $stat
                                            );
                                        }
                                    }
                                    $optRate['Days'] = &$days;
                                    unset($days);
                                }
                                $this->dates[] = &$optRate;
                                unset($optRate);
                            }
                        }
                    }
                }
            }
        }
        return $this->dates;
    }

    public function __construct($code, $info = false) {
        parent::__construct(new TourplanOptionCode($code), new TourplanOptionRequest($info));
        $this->includeDays = (strpos($info, 'A') !== false);
    }
}

class TourplanSupplierProduct extends TourplanProduct {
    protected static $noteKeys = ['DDW', 'SDD', 'SII', 'SHL', 'MSI', 'DI1', 'DI2', 'SP1'];

    /** @return a subclass of TourplanProductRequest */
    protected function newProductRequest() {return new TourplanSupplierRequest();}

    public function __construct($code, $info = false) {
        parent::__construct(new TourplanSupplierCode($code), new TourplanSupplierRequest($info));
    }
}
?>
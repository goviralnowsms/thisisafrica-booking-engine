/**
 * Country + Class catalog for Group Tours
 * When searching by country + class only (no specific destination selected),
 * these are the exact products that should be returned to match WordPress
 */

export const COUNTRY_CLASS_CATALOG: Record<string, string[]> = {
  // Kenya combinations (aggregate all destinations for each class)
  'kenya-deluxe': [
    // From kenya-nairobi-jki-airport-deluxe (5 tours)
    'NBOGTARP001CKEKEE', 'NBOGTARP001CKSE', 'NBOGTARP001EAEKE',
    'NBOGTARP001THRKE3', 'NBOGTARP001THRSE3'
  ],
  'kenya-deluxe-plus': [
    // From kenya-nairobi-jki-airport-deluxe-plus (1 tour)
    'NBOGTARP001EAESE'
  ],
  'kenya-basic': [
    // From kenya-nairobi-jki-airport-basic (2 tours)
    'NBOGTARP001CKSM', 'NBOGTARP001THRSM3'
  ],
  'kenya-standard': [
    // From kenya-nairobi-jki-airport-standard (12 tours)
    'NBOGTARP001CKSO', 'NBOGTARP001THRSO3', 'NBOGTSOAEASKTNM21',
    'NBOGTSOAEASSNM022', 'NBOGTSOAEASSNM031', 'NBOGTSOAEASSNM041',
    'NBOGTSOAEASSNM061', 'NBOGTSOAEASSNM062', 'NBOGTSOAEASSNM071',
    'NBOGTSOAEASSNM091', 'NBOGTSOAEASSNM111', 'NBOGTSOAEASSNM131'
  ],
  
  // Botswana combinations (aggregate all Maun destinations)
  'botswana-basic': [
    'MUBGTSUNWAYSUNA13' // From maun city
  ],
  'botswana-deluxe': [
    'MUBGTJENMANJENBSE' // From maun airport
  ],
  'botswana-overland-camping': [
    'MUBGTSUNWAYSUBT13' // From maun airport
  ],
  
  // Namibia combinations (all from Windhoek)
  'namibia-deluxe': [
    'WDHGTSOANAMCAPNAM'
  ],
  'namibia-deluxe-plus': [
    'WDHGTULTSAFULTNAM', 'WDHGTSOANAMEXNASP'
  ],
  'namibia-standard': [
    'WDHGTSOANAMHINAMC'
  ],
  
  // South Africa combinations (aggregate all cities)
  'south-africa-basic': [
    // Cape Town city
    'CPTGTNOMAD NOMNAM', 'CPTGTSUNWAYCWA13', 'CPTGTSUNWAYSUNA21',
    // Durban airport
    'DURGTNOMAD NADC',
    // Johannesburg city
    'JNBGTSUNWAYSAA17',
    // Johannesburg airport
    'JNBGTNOMAD NAJC', 'JNBGTNOMAD NAJD', 'JNBGTNOMAD NAJP',
    'JNBGTSUNWAYSUNA14', 'JNBGTSUNWAYSUNZBA',
    // Port Elizabeth
    'CPTGTSATOURSAGRD4' // Note: appears in both Cape Town and Port Elizabeth
  ],
  'south-africa-overland-camping': [
    // Cape Town city
    'CPTGTSUNWAYSUCV21', 'CPTGTSUNWAYSUCW14',
    // Durban airport
    'DURGTNOMAD NDC',
    // Johannesburg airport
    'JNBGTSUNWAYSUBT14', 'JNBGTNOMAD NJP', 'JNBGTNOMAD NJD', 'JNBGTNOMAD NJC',
    // Port Elizabeth
    'PLZGTNOMAD NPC'
  ],
  'south-africa-standard': [
    // Cape Town city
    'CPTGTSATOURSAGRD4',
    // Johannesburg airport
    'JNBGTNOMAD NAJCSG', 'JNBGTNOMAD NAJPSG', 'JNBGTSATOURSAJOUR',
    // Port Elizabeth
    'PLZGTNOMAD NAPCSG', 'PLZGTTVT001TISD20', 'PLZGTTVT001TISG20'
  ],
  
  // Tanzania combinations (all from Kilimanjaro airport)
  'tanzania-deluxe': [
    'JROGTARP001SIMSE7'
  ],
  'tanzania-luxury': [
    'JROGTARP001SIMWEP'
  ],
  'tanzania-standard': [
    'JROGTARP001SIMTW7', 'JROGTSOAEASSNM024', 'JROGTSOAEASSNM042'
  ],
  
  // Zambia combinations (all from Livingstone)
  'zambia-basic': [
    'LVIGTSUNWAYNBA15', 'LVIGTSUNWAYSUNNBA'
  ],
  'zambia-overland-camping': [
    'LVIGTSUNWAYSUNB15', 'LVIGTSUNWAYSUNB21'
  ],
  
  // Zimbabwe combinations (all from Victoria Falls airport)
  'zimbabwe-basic': [
    'VFAGTNOMAD NAZZ'
  ],
  'zimbabwe-standard': [
    'VFAGTJENMANJENW15', 'VFAGTJENMANJENW12'
  ]
};

/**
 * Packages catalog for country + class combinations
 * Based on group-tours-search.csv PACKAGES section
 */
export const PACKAGES_CLASS_CATALOG: Record<string, string[]> = {
  // Botswana packages by class
  'botswana-deluxe': [
    'BBKPKCHO0153NIGPA', 'BBKPKCHO015BUSDEL', 'BBKPKTVT001BOD6KM', 'BBKPKTVT001CGLCOK'
  ],
  'botswana-luxury': [
    'BBKPKCHO015STDBUS', 'BBKPKCPKUZ CPKU2N'
  ],
  'botswana-standard': [
    'BBKPKCHO004CHOLUX', 'BBKPKCHO004CHOLWA', 'BBKPKCHOBAKBAK3DP', 'BBKPKCHOBAKBAK4DP'
  ],
  
  // Kenya packages by class
  'kenya-basic': [
    'NBOPKARP001CKSNPK'
  ],
  'kenya-deluxe': [
    'NBOPKARP001ENCHAN', 'NBOPKARP001FIMSER', 'NBOPKARP001WDD', 'NBOPKTHISSAWLWFPC'
  ],
  'kenya-luxury': [
    'NBOPKARP001FIMMGV', 'NBOPKARP001FIMMKT', 'NBOPKARP001FIMMLG'
  ],
  
  // Rwanda packages by class
  'rwanda-basic': [
    'KGLPKAASAFAGERB', 'KGLPKAASAFAGEUB'
  ],
  'rwanda-deluxe': [
    'KGLPKAASAFAGEUD', 'KGLPKARP001GERWDX'
  ],
  'rwanda-standard': [
    'KGLPKAASAFAAAGMST', 'KGLPKAASAFAAAPPST', 'KGLPKAASAFAGERS', 
    'KGLPKAASAFAGEUS', 'KGLPKTHISSAGGAME'
  ],
  
  // South Africa packages by class (large set - only showing products that match)
  'south-africa-deluxe': [
    'CPTPKTHISSACPGRKA', 'CPTPKTHISSASCENDX', 'CPTPKTHISSASDCRDX',
    'CPTPKTVT001CTCLCM', 'CPTPKTVT001CTCLPW', 'CPTPKTVT001CTCLRB',
    'CPTPKTVT001CTCLSS', 'CPTPKTVT001CTCLVL', 'CPTPKTVT001CTERRB',
    'CPTPKTVT001CTERSS', 'CPTPKTVT001CTERVL', 'CPTPKTVT001CTEXCM',
    'CPTPKTVT001CTEXPW', 'CPTPKTVT001CTEXRB', 'CPTPKTVT001CTEXSS',
    'CPTPKTVT001CTEXVL', 'CPTPKTVT001CTRCO', 'GKPPKTVT001KREDEL',
    'JNBPKTHISSAHOSADE'
  ],
  'south-africa-standard': [
    'CPTPKTHISSAGRANDS', 'CPTPKTHISSASCENST', 'CPTPKTHISSASDCGST',
    'CPTPKTVT001CTCLHO', 'CPTPKTVT001CTERHO', 'CPTPKTVT001CTERPW',
    'CPTPKTVT001CTEXHO', 'HDSPKMAKUTSMSSCLA', 'HDSPKMAKUTSMSSWLK',
    'JNBPKTHISSASPLEN1', 'JNBPKTHISSASPLEN2'
  ],
  'south-africa-luxury': [
    'CPTPKTHISSASCENLX', 'CPTPKTHISSASDCGLX', 'CPTPKTVT001CTCLTB',
    'CPTPKTVT001CTCLVA', 'CPTPKTVT001CTERTB', 'CPTPKTVT001CTERVC',
    'CPTPKTVT001CTEXTB', 'CPTPKTVT001CTEXVA', 'GKPPKSABBLDSBL4P3'
  ],
  
  // Uganda packages by class
  'uganda-basic': [
    'EBBPKAASAFAGITMB'
  ],
  'uganda-standard': [
    'EBBPKAASAFAAGITMS', 'EBBPKARP001BAIRST'
  ],
  'uganda-deluxe': [
    'EBBPKARP001BAIRDX'
  ],
  
  // Zambia packages by class
  'zambia-standard': [
    'LVIPKTVT001FE2NAV'
  ],
  'zambia-luxury': [
    'LVIPKTVT001FE2NRL'
  ],
  
  // Zimbabwe packages by class - extensive list
  'zimbabwe-deluxe': [
    'VFAPKTHISSAVFCHD2', 'VFAPKTHISSAVFCHO2', 'VFAPKTHISSAVFCHO6',
    'VFAPKTHISSAVFCRU1', 'VFAPKTHISSAVFCRU2', 'VFAPKTHISSAZAMDR1',
    'VFAPKTHISSAZAMDR2', 'VFAPKTVT001FC3NT1', 'VFAPKTVT001FC3NT3',
    'VFAPKTVT001FC3NT5', 'VFAPKTVT001FE2NSL', 'VFAPKTVT001FE2NT3',
    'VFAPKTVT001FE3NT2', 'VFAPKTVT001FE3NT3', 'VFAPKTVT001FE3NT6',
    'VFAPKTVT001FSD2NW', 'VFAPKTVT001FSD3NS', 'VFAPKTVT001FSD3NW',
    'VFAPKTVT001FSD3WS'
  ],
  'zimbabwe-standard': [
    'VFAPKTHISSAVFCH01', 'VFAPKTHISSAVFCHD1', 'VFAPKTHISSAVFCHO5',
    'VFAPKTVT001FC3NT2', 'VFAPKTVT001FE2NT1'
  ],
  'zimbabwe-luxury': [
    'VFAPKTHISSAVFCHD4', 'VFAPKTHISSAVFCHO7', 'VFAPKTHISSAVFCRU3',
    'VFAPKTHISSAZAMDR3', 'VFAPKTHISSAZAMDR4', 'VFAPKTVT001FC3NT4',
    'VFAPKTVT001FC3NT6', 'VFAPKTVT001FC3NT7', 'VFAPKTVT001FE2NT4',
    'VFAPKTVT001FE2NT8', 'VFAPKTVT001FE3NT5', 'VFAPKTVT001FE3NT7',
    'VFAPKTVT001FE3NT8', 'VFAPKTVT001FSD3CL', 'VFAPKTVT001FSD3CS'
  ]
};

/**
 * Get products for country + class combination
 * Now supports both Group Tours and Packages
 */
export function getCountryClassProducts(country: string, classFilter: string, productType?: string): string[] | null {
  const normalizedCountry = country.toLowerCase().trim();
  const normalizedClass = classFilter.toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace('deluxe+', 'deluxe-plus');
  
  const key = `${normalizedCountry}-${normalizedClass}`;
  
  // Check if this is for packages
  if (productType && (productType === 'Packages' || productType === 'Pre-designed packages')) {
    return PACKAGES_CLASS_CATALOG[key] || null;
  }
  
  // Default to group tours catalog
  return COUNTRY_CLASS_CATALOG[key] || null;
}
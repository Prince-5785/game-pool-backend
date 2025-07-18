"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("countries", [
      {
        name: "Aruba",
        key: "AW",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Afghanistan",
        key: "AF",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Angola",
        key: "AO",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Anguilla",
        key: "AI",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Åland Islands",
        key: "AX",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Albania",
        key: "AL",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Andorra",
        key: "AD",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "United Arab Emirates",
        key: "AE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Argentina",
        key: "AR",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Armenia",
        key: "AM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "American Samoa",
        key: "AS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Antarctica",
        key: "AQ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "French Southern Territories",
        key: "TF",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Antigua and Barbuda",
        key: "AG",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Australia",
        key: "AU",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Austria",
        key: "AT",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Azerbaijan",
        key: "AZ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Burundi",
        key: "BI",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Belgium",
        key: "BE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Benin",
        key: "BJ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Bonaire, Sint Eustatius and Saba",
        key: "BQ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Burkina Faso",
        key: "BF",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Bangladesh",
        key: "BD",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Bulgaria",
        key: "BG",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Bahrain",
        key: "BH",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Bahamas",
        key: "BS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Bosnia and Herzegovina",
        key: "BA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Saint Barthélemy",
        key: "BL",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Belarus",
        key: "BY",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Belize",
        key: "BZ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Bermuda",
        key: "BM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Bolivia, Plurinational State of",
        key: "BO",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Brazil",
        key: "BR",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Barbados",
        key: "BB",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Brunei Darussalam",
        key: "BN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Bhutan",
        key: "BT",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Bouvet Island",
        key: "BV",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Botswana",
        key: "BW",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Central African Republic",
        key: "CF",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Canada",
        key: "CA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Cocos (Keeling) Islands",
        key: "CC",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Switzerland",
        key: "CH",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Chile",
        key: "CL",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "China",
        key: "CN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Côte d'Ivoire",
        key: "CI",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Cameroon",
        key: "CM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Congo, The Democratic Republic of the",
        key: "CD",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Congo",
        key: "CG",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Cook Islands",
        key: "CK",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Colombia",
        key: "CO",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Comoros",
        key: "KM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Cabo Verde",
        key: "CV",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Costa Rica",
        key: "CR",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Cuba",
        key: "CU",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Curaçao",
        key: "CW",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Christmas Island",
        key: "CX",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Cayman Islands",
        key: "KY",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Cyprus",
        key: "CY",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Czechia",
        key: "CZ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Germany",
        key: "DE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Djibouti",
        key: "DJ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dominica",
        key: "DM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Denmark",
        key: "DK",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dominican Republic",
        key: "DO",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Algeria",
        key: "DZ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ecuador",
        key: "EC",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Egypt",
        key: "EG",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Eritrea",
        key: "ER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Western Sahara",
        key: "EH",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Spain",
        key: "ES",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Estonia",
        key: "EE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ethiopia",
        key: "ET",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Finland",
        key: "FI",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Fiji",
        key: "FJ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Falkland Islands (Malvinas)",
        key: "FK",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "France",
        key: "FR",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Faroe Islands",
        key: "FO",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Micronesia, Federated States of",
        key: "FM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Gabon",
        key: "GA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "United Kingdom",
        key: "GB",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Georgia",
        key: "GE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Guernsey",
        key: "GG",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ghana",
        key: "GH",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Gibraltar",
        key: "GI",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Guinea",
        key: "GN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Guadeloupe",
        key: "GP",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Gambia",
        key: "GM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Guinea-Bissau",
        key: "GW",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Equatorial Guinea",
        key: "GQ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Greece",
        key: "GR",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Grenada",
        key: "GD",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Greenland",
        key: "GL",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Guatemala",
        key: "GT",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "French Guiana",
        key: "GF",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Guam",
        key: "GU",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Guyana",
        key: "GY",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Hong Kong",
        key: "HK",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Heard Island and McDonald Islands",
        key: "HM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Honduras",
        key: "HN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Croatia",
        key: "HR",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Haiti",
        key: "HT",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Hungary",
        key: "HU",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Indonesia",
        key: "ID",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Isle of Man",
        key: "IM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "India",
        key: "IN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "British Indian Ocean Territory",
        key: "IO",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ireland",
        key: "IE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Iran, Islamic Republic of",
        key: "IR",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Iraq",
        key: "IQ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Iceland",
        key: "IS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Israel",
        key: "IL",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Italy",
        key: "IT",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jamaica",
        key: "JM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jersey",
        key: "JE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jordan",
        key: "JO",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Japan",
        key: "JP",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Kazakhstan",
        key: "KZ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Kenya",
        key: "KE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Kyrgyzstan",
        key: "KG",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Cambodia",
        key: "KH",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Kiribati",
        key: "KI",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Saint Kitts and Nevis",
        key: "KN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Korea, Republic of",
        key: "KR",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Kuwait",
        key: "KW",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lao People's Democratic Republic",
        key: "LA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lebanon",
        key: "LB",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Liberia",
        key: "LR",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Libya",
        key: "LY",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Saint Lucia",
        key: "LC",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Liechtenstein",
        key: "LI",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sri Lanka",
        key: "LK",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lesotho",
        key: "LS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lithuania",
        key: "LT",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Luxembourg",
        key: "LU",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Latvia",
        key: "LV",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Macao",
        key: "MO",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Saint Martin (French part)",
        key: "MF",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Morocco",
        key: "MA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Monaco",
        key: "MC",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Moldova, Republic of",
        key: "MD",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Madagascar",
        key: "MG",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Maldives",
        key: "MV",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mexico",
        key: "MX",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Marshall Islands",
        key: "MH",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "North Macedonia",
        key: "MK",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mali",
        key: "ML",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Malta",
        key: "MT",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Myanmar",
        key: "MM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Montenegro",
        key: "ME",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mongolia",
        key: "MN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Northern Mariana Islands",
        key: "MP",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mozambique",
        key: "MZ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mauritania",
        key: "MR",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Montserrat",
        key: "MS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Martinique",
        key: "MQ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mauritius",
        key: "MU",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Malawi",
        key: "MW",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Malaysia",
        key: "MY",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mayotte",
        key: "YT",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Namibia",
        key: "NA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "New Caledonia",
        key: "NC",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Niger",
        key: "NE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Norfolk Island",
        key: "NF",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Nigeria",
        key: "NG",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Nicaragua",
        key: "NI",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Niue",
        key: "NU",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Netherlands",
        key: "NL",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Norway",
        key: "NO",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Nepal",
        key: "NP",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Nauru",
        key: "NR",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "New Zealand",
        key: "NZ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Oman",
        key: "OM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pakistan",
        key: "PK",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Panama",
        key: "PA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pitcairn",
        key: "PN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Peru",
        key: "PE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Philippines",
        key: "PH",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Palau",
        key: "PW",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Papua New Guinea",
        key: "PG",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Poland",
        key: "PL",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Puerto Rico",
        key: "PR",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Korea, Democratic People's Republic of",
        key: "KP",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Portugal",
        key: "PT",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Paraguay",
        key: "PY",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Palestine, State of",
        key: "PS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "French Polynesia",
        key: "PF",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Qatar",
        key: "QA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Réunion",
        key: "RE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Romania",
        key: "RO",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Russian Federation",
        key: "RU",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Rwanda",
        key: "RW",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Saudi Arabia",
        key: "SA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sudan",
        key: "SD",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Senegal",
        key: "SN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Singapore",
        key: "SG",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "South Georgia and the South Sandwich Islands",
        key: "GS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Saint Helena, Ascension and Tristan da Cunha",
        key: "SH",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Svalbard and Jan Mayen",
        key: "SJ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Solomon Islands",
        key: "SB",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sierra Leone",
        key: "SL",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "El Salvador",
        key: "SV",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "San Marino",
        key: "SM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Somalia",
        key: "SO",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Saint Pierre and Miquelon",
        key: "PM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Serbia",
        key: "RS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "South Sudan",
        key: "SS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sao Tome and Principe",
        key: "ST",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Suriname",
        key: "SR",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Slovakia",
        key: "SK",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Slovenia",
        key: "SI",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sweden",
        key: "SE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Eswatini",
        key: "SZ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sint Maarten (Dutch part)",
        key: "SX",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Seychelles",
        key: "SC",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Syrian Arab Republic",
        key: "SY",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Turks and Caicos Islands",
        key: "TC",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Chad",
        key: "TD",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Togo",
        key: "TG",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Thailand",
        key: "TH",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tajikistan",
        key: "TJ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tokelau",
        key: "TK",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Turkmenistan",
        key: "TM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Timor-Leste",
        key: "TL",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tonga",
        key: "TO",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Trinidad and Tobago",
        key: "TT",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tunisia",
        key: "TN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Turkey",
        key: "TR",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tuvalu",
        key: "TV",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Taiwan, Province of China",
        key: "TW",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tanzania, United Republic of",
        key: "TZ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Uganda",
        key: "UG",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ukraine",
        key: "UA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "United States Minor Outlying Islands",
        key: "UM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Uruguay",
        key: "UY",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "United States",
        key: "US",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Uzbekistan",
        key: "UZ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Holy See (Vatican City State)",
        key: "VA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Saint Vincent and the Grenadines",
        key: "VC",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Venezuela, Bolivarian Republic of",
        key: "VE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Virgin Islands, British",
        key: "VG",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Virgin Islands, U.S.",
        key: "VI",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Viet Nam",
        key: "VN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Vanuatu",
        key: "VU",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Wallis and Futuna",
        key: "WF",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Samoa",
        key: "WS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Yemen",
        key: "YE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "South Africa",
        key: "ZA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Zambia",
        key: "ZM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Zimbabwe",
        key: "ZW",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("countries", null, {});
  },
};

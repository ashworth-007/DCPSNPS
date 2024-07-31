const firebaseConfig = {
  apiKey: "AIzaSyDLm_yXfa58C9yCtoj4PE0YNxXgCY3RY7Q",
  authDomain: "dcpsnps-fe479.firebaseapp.com",
  projectId: "dcpsnps-fe479",
  storageBucket: "dcpsnps-fe479.appspot.com",
  messagingSenderId: "144799129608",
  appId: "1:144799129608:web:9a030aef68f2f20293b1bd",
  measurementId: "G-JWK7ZTTS78",
  databaseURL: "https://dcpsnps-fe479-default-rtdb.firebaseio.com",
 
};
// initialize firebase
firebase.initializeApp(firebaseConfig);

// reference your database
var contactFormDB = firebase.database().ref("contact");

document.getElementById("contact").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  var name = getElementVal("name");
  var emailid = getElementVal("emailid");
  var msgContent = getElementVal("msgContent");
  var country = getElementVal("state");
  let isValid = true;

  if (!name) {
    setError("name");
   
    isValid = false;
  } else {
    clearError("name");
  }

  if (!emailid || !validateEmail(emailid)) {
    setError("emailid");
    isValid = false;
  } else {
    clearError("emailid");
  }

  if (!state) {
    setError("state");
    isValid = false;
  } else {
    clearError("state");
  }

  if (!msgContent) {
    setError("msgContent");
    isValid = false;
  } else {
    clearError("msgContent");
  }
  if (!isValid) {
    alert("Please fill in all fields.");
    return;
  }
  saveMessages(name, emailid, msgContent, country);
 
  //   enable alert
  document.querySelector(".alert").style.display = "block";

  //   remove the alert
  setTimeout(() => {
    document.querySelector(".alert").style.display = "none";
  }, 3000);

  //   reset the form
  document.getElementById("contact").reset();
}

const saveMessages = (name, emailid, msgContent, country) => {
  var newContactForm = contactFormDB.push();

  newContactForm.set({
    name: name,
    emailid: emailid,
    msgContent: msgContent,
    country: country
  });
};

const getElementVal = (id) => {
  return document.getElementById(id).value;
};
const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
  return re.test(String(email).toLowerCase());
};

const setError = (id) => {
  document.getElementById(id).parentElement.classList.add("error");
};
const clearError = (id) => {
  document.getElementById(id).parentElement.classList.remove("error");
};

// State and District JSON Data
const stateDistrictData = {  
  "states":[  
     {  
        "state":"Andhra Pradesh",
        "districts":[  
           "Anantapur",
           "Chittoor",
           "East Godavari",
           "Guntur",
           "Krishna",
           "Kurnool",
           "Nellore",
           "Prakasam",
           "Srikakulam",
           "Visakhapatnam",
           "Vizianagaram",
           "West Godavari",
           "YSR Kadapa"
        ]
     },
     {  
        "state":"Arunachal Pradesh",
        "districts":[  
           "Tawang",
           "West Kameng",
           "East Kameng",
           "Papum Pare",
           "Kurung Kumey",
           "Kra Daadi",
           "Lower Subansiri",
           "Upper Subansiri",
           "West Siang",
           "East Siang",
           "Siang",
           "Upper Siang",
           "Lower Siang",
           "Lower Dibang Valley",
           "Dibang Valley",
           "Anjaw",
           "Lohit",
           "Namsai",
           "Changlang",
           "Tirap",
           "Longding"
        ]
     },
     {  
        "state":"Assam",
        "districts":[  
           "Baksa",
           "Barpeta",
           "Biswanath",
           "Bongaigaon",
           "Cachar",
           "Charaideo",
           "Chirang",
           "Darrang",
           "Dhemaji",
           "Dhubri",
           "Dibrugarh",
           "Goalpara",
           "Golaghat",
           "Hailakandi",
           "Hojai",
           "Jorhat",
           "Kamrup Metropolitan",
           "Kamrup",
           "Karbi Anglong",
           "Karimganj",
           "Kokrajhar",
           "Lakhimpur",
           "Majuli",
           "Morigaon",
           "Nagaon",
           "Nalbari",
           "Dima Hasao",
           "Sivasagar",
           "Sonitpur",
           "South Salmara-Mankachar",
           "Tinsukia",
           "Udalguri",
           "West Karbi Anglong"
        ]
     },
     {  
        "state":"Bihar",
        "districts":[  
           "Araria",
           "Arwal",
           "Aurangabad",
           "Banka",
           "Begusarai",
           "Bhagalpur",
           "Bhojpur",
           "Buxar",
           "Darbhanga",
           "East Champaran (Motihari)",
           "Gaya",
           "Gopalganj",
           "Jamui",
           "Jehanabad",
           "Kaimur (Bhabua)",
           "Katihar",
           "Khagaria",
           "Kishanganj",
           "Lakhisarai",
           "Madhepura",
           "Madhubani",
           "Munger (Monghyr)",
           "Muzaffarpur",
           "Nalanda",
           "Nawada",
           "Patna",
           "Purnia (Purnea)",
           "Rohtas",
           "Saharsa",
           "Samastipur",
           "Saran",
           "Sheikhpura",
           "Sheohar",
           "Sitamarhi",
           "Siwan",
           "Supaul",
           "Vaishali",
           "West Champaran"
        ]
     },
     {  
        "state":"Chandigarh (UT)",
        "districts":[  
           "Chandigarh"
        ]
     },
     {  
        "state":"Chhattisgarh",
        "districts":[  
           "Balod",
           "Baloda Bazar",
           "Balrampur",
           "Bastar",
           "Bemetara",
           "Bijapur",
           "Bilaspur",
           "Dantewada (South Bastar)",
           "Dhamtari",
           "Durg",
           "Gariyaband",
           "Janjgir-Champa",
           "Jashpur",
           "Kabirdham (Kawardha)",
           "Kanker (North Bastar)",
           "Kondagaon",
           "Korba",
           "Korea (Koriya)",
           "Mahasamund",
           "Mungeli",
           "Narayanpur",
           "Raigarh",
           "Raipur",
           "Rajnandgaon",
           "Sukma",
           "Surajpur  ",
           "Surguja"
        ]
     },
     {  
        "state":"Dadra and Nagar Haveli (UT)",
        "districts":[  
           "Dadra & Nagar Haveli"
        ]
     },
     {  
        "state":"Daman and Diu (UT)",
        "districts":[  
           "Daman",
           "Diu"
        ]
     },
     {  
        "state":"Delhi (NCT)",
        "districts":[  
           "Central Delhi",
           "East Delhi",
           "New Delhi",
           "North Delhi",
           "North East  Delhi",
           "North West  Delhi",
           "Shahdara",
           "South Delhi",
           "South East Delhi",
           "South West  Delhi",
           "West Delhi"
        ]
     },
     {  
        "state":"Goa",
        "districts":[  
           "North Goa",
           "South Goa"
        ]
     },
     {  
        "state":"Gujarat",
        "districts":[  
           "Ahmedabad",
           "Amreli",
           "Anand",
           "Aravalli",
           "Banaskantha (Palanpur)",
           "Bharuch",
           "Bhavnagar",
           "Botad",
           "Chhota Udepur",
           "Dahod",
           "Dangs (Ahwa)",
           "Devbhoomi Dwarka",
           "Gandhinagar",
           "Gir Somnath",
           "Jamnagar",
           "Junagadh",
           "Kachchh",
           "Kheda (Nadiad)",
           "Mahisagar",
           "Mehsana",
           "Morbi",
           "Narmada (Rajpipla)",
           "Navsari",
           "Panchmahal (Godhra)",
           "Patan",
           "Porbandar",
           "Rajkot",
           "Sabarkantha (Himmatnagar)",
           "Surat",
           "Surendranagar",
           "Tapi (Vyara)",
           "Vadodara",
           "Valsad"
        ]
     },
     {  
        "state":"Haryana",
        "districts":[  
           "Ambala",
           "Bhiwani",
           "Charkhi Dadri",
           "Faridabad",
           "Fatehabad",
           "Gurgaon",
           "Hisar",
           "Jhajjar",
           "Jind",
           "Kaithal",
           "Karnal",
           "Kurukshetra",
           "Mahendragarh",
           "Mewat",
           "Palwal",
           "Panchkula",
           "Panipat",
           "Rewari",
           "Rohtak",
           "Sirsa",
           "Sonipat",
           "Yamunanagar"
        ]
     },
     {  
        "state":"Himachal Pradesh",
        "districts":[  
           "Bilaspur",
           "Chamba",
           "Hamirpur",
           "Kangra",
           "Kinnaur",
           "Kullu",
           "Lahaul &amp; Spiti",
           "Mandi",
           "Shimla",
           "Sirmaur (Sirmour)",
           "Solan",
           "Una"
        ]
     },
     {  
        "state":"Jammu and Kashmir",
        "districts":[  
           "Anantnag",
           "Bandipore",
           "Baramulla",
           "Budgam",
           "Doda",
           "Ganderbal",
           "Jammu",
           "Kargil",
           "Kathua",
           "Kishtwar",
           "Kulgam",
           "Kupwara",
           "Leh",
           "Poonch",
           "Pulwama",
           "Rajouri",
           "Ramban",
           "Reasi",
           "Samba",
           "Shopian",
           "Srinagar",
           "Udhampur"
        ]
     },
     {  
        "state":"Jharkhand",
        "districts":[  
           "Bokaro",
           "Chatra",
           "Deoghar",
           "Dhanbad",
           "Dumka",
           "East Singhbhum",
           "Garhwa",
           "Giridih",
           "Godda",
           "Gumla",
           "Hazaribag",
           "Jamtara",
           "Khunti",
           "Koderma",
           "Latehar",
           "Lohardaga",
           "Pakur",
           "Palamu",
           "Ramgarh",
           "Ranchi",
           "Sahibganj",
           "Seraikela-Kharsawan",
           "Simdega",
           "West Singhbhum"
        ]
     },
     {  
        "state":"Karnataka",
        "districts":[  
           "Bagalkot",
           "Ballari (Bellary)",
           "Belagavi (Belgaum)",
           "Bengaluru (Bangalore) Rural",
           "Bengaluru (Bangalore) Urban",
           "Bidar",
           "Chamarajanagar",
           "Chikballapur",
           "Chikkamagaluru (Chikmagalur)",
           "Chitradurga",
           "Dakshina Kannada",
           "Davangere",
           "Dharwad",
           "Gadag",
           "Hassan",
           "Haveri",
           "Kalaburagi (Gulbarga)",
           "Kodagu",
           "Kolar",
           "Koppal",
           "Mandya",
           "Mysuru (Mysore)",
           "Raichur",
           "Ramanagara",
           "Shivamogga (Shimoga)",
           "Tumakuru (Tumkur)",
           "Udupi",
           "Uttara Kannada (Karwar)",
           "Vijayapura (Bijapur)",
           "Yadgir"
        ]
     },
     {  
        "state":"Kerala",
        "districts":[  
           "Alappuzha",
           "Ernakulam",
           "Idukki",
           "Kannur",
           "Kasaragod",
           "Kollam",
           "Kottayam",
           "Kozhikode",
           "Malappuram",
           "Palakkad",
           "Pathanamthitta",
           "Thiruvananthapuram",
           "Thrissur",
           "Wayanad"
        ]
     },
     {  
        "state":"Lakshadweep (UT)",
        "districts":[  
           "Agatti",
           "Amini",
           "Androth",
           "Bithra",
           "Chethlath",
           "Kavaratti",
           "Kadmath",
           "Kalpeni",
           "Kilthan",
           "Minicoy"
        ]
     },
     {  
        "state":"Madhya Pradesh",
        "districts":[  
           "Agar Malwa",
           "Alirajpur",
           "Anuppur",
           "Ashoknagar",
           "Balaghat",
           "Barwani",
           "Betul",
           "Bhind",
           "Bhopal",
           "Burhanpur",
           "Chhatarpur",
           "Chhindwara",
           "Damoh",
           "Datia",
           "Dewas",
           "Dhar",
           "Dindori",
           "Guna",
           "Gwalior",
           "Harda",
           "Hoshangabad",
           "Indore",
           "Jabalpur",
           "Jhabua",
           "Katni",
           "Khandwa",
           "Khargone",
           "Mandla",
           "Mandsaur",
           "Morena",
           "Narsinghpur",
           "Neemuch",
           "Panna",
           "Raisen",
           "Rajgarh",
           "Ratlam",
           "Rewa",
           "Sagar",
           "Satna",
           "Sehore",
           "Seoni",
           "Shahdol",
           "Shajapur",
           "Sheopur",
           "Shivpuri",
           "Sidhi",
           "Singrauli",
           "Tikamgarh",
           "Ujjain",
           "Umaria",
           "Vidisha"
        ]
     },
     {  
        "state":"Maharashtra",
        "districts":[  
           "Ahmednagar",
           "Akola",
           "Amravati",
           "Aurangabad",
           "Beed",
           "Bhandara",
           "Buldhana",
           "Chandrapur",
           "Dhule",
           "Gadchiroli",
           "Gondia",
           "Hingoli",
           "Jalgaon",
           "Jalna",
           "Kolhapur",
           "Latur",
           "Mumbai City",
           "Mumbai Suburban",
           "Nagpur",
           "Nanded",
           "Nandurbar",
           "Nashik",
           "Osmanabad",
           "Palghar",
           "Parbhani",
           "Pune",
           "Raigad",
           "Ratnagiri",
           "Sangli",
           "Satara",
           "Sindhudurg",
           "Solapur",
           "Thane",
           "Wardha",
           "Washim",
           "Yavatmal"
        ]
     },
     {  
        "state":"Manipur",
        "districts":[  
           "Bishnupur",
           "Chandel",
           "Churachandpur",
           "Imphal East",
           "Imphal West",
           "Jiribam",
           "Kakching",
           "Kamjong",
           "Kangpokpi",
           "Noney",
           "Pherzawl",
           "Senapati",
           "Tamenglong",
           "Tengnoupal",
           "Thoubal",
           "Ukhrul"
        ]
     },
     {  
        "state":"Meghalaya",
        "districts":[  
           "East Garo Hills",
           "East Jaintia Hills",
           "East Khasi Hills",
           "North Garo Hills",
           "Ri Bhoi",
           "South Garo Hills",
           "South West Garo Hills ",
           "South West Khasi Hills",
           "West Garo Hills",
           "West Jaintia Hills",
           "West Khasi Hills"
        ]
     },
     {  
        "state":"Mizoram",
        "districts":[  
           "Aizawl",
           "Champhai",
           "Kolasib",
           "Lawngtlai",
           "Lunglei",
           "Mamit",
           "Saiha",
           "Serchhip"
        ]
     },
     {  
        "state":"Nagaland",
        "districts":[  
           "Dimapur",
           "Kiphire",
           "Kohima",
           "Longleng",
           "Mokokchung",
           "Mon",
           "Peren",
           "Phek",
           "Tuensang",
           "Wokha",
           "Zunheboto"
        ]
     },
     {  
        "state":"Odisha",
        "districts":[  
           "Angul",
           "Balangir",
           "Balasore",
           "Bargarh",
           "Bhadrak",
           "Boudh",
           "Cuttack",
           "Deogarh",
           "Dhenkanal",
           "Gajapati",
           "Ganjam",
           "Jagatsinghapur",
           "Jajpur",
           "Jharsuguda",
           "Kalahandi",
           "Kandhamal",
           "Kendrapara",
           "Kendujhar (Keonjhar)",
           "Khordha",
           "Koraput",
           "Malkangiri",
           "Mayurbhanj",
           "Nabarangpur",
           "Nayagarh",
           "Nuapada",
           "Puri",
           "Rayagada",
           "Sambalpur",
           "Sonepur",
           "Sundargarh"
        ]
     },
     {  
        "state":"Puducherry (UT)",
        "districts":[  
           "Karaikal",
           "Mahe",
           "Pondicherry",
           "Yanam"
        ]
     },
     {  
        "state":"Punjab",
        "districts":[  
           "Amritsar",
           "Barnala",
           "Bathinda",
           "Faridkot",
           "Fatehgarh Sahib",
           "Fazilka",
           "Ferozepur",
           "Gurdaspur",
           "Hoshiarpur",
           "Jalandhar",
           "Kapurthala",
           "Ludhiana",
           "Mansa",
           "Moga",
           "Muktsar",
           "Nawanshahr (Shahid Bhagat Singh Nagar)",
           "Pathankot",
           "Patiala",
           "Rupnagar",
           "Sahibzada Ajit Singh Nagar (Mohali)",
           "Sangrur",
           "Tarn Taran"
        ]
     },
     {  
        "state":"Rajasthan",
        "districts":[  
           "Ajmer",
           "Alwar",
           "Banswara",
           "Baran",
           "Barmer",
           "Bharatpur",
           "Bhilwara",
           "Bikaner",
           "Bundi",
           "Chittorgarh",
           "Churu",
           "Dausa",
           "Dholpur",
           "Dungarpur",
           "Hanumangarh",
           "Jaipur",
           "Jaisalmer",
           "Jalore",
           "Jhalawar",
           "Jhunjhunu",
           "Jodhpur",
           "Karauli",
           "Kota",
           "Nagaur",
           "Pali",
           "Pratapgarh",
           "Rajsamand",
           "Sawai Madhopur",
           "Sikar",
           "Sirohi",
           "Sri Ganganagar",
           "Tonk",
           "Udaipur"
        ]
     },
     {  
        "state":"Sikkim",
        "districts":[  
           "East Sikkim",
           "North Sikkim",
           "South Sikkim",
           "West Sikkim"
        ]
     },
     {  
        "state":"Tamil Nadu",
        "districts":[  
           "Ariyalur",
           "Chennai",
           "Coimbatore",
           "Cuddalore",
           "Dharmapuri",
           "Dindigul",
           "Erode",
           "Kanchipuram",
           "Kanyakumari",
           "Karur",
           "Krishnagiri",
           "Madurai",
           "Nagapattinam",
           "Namakkal",
           "Nilgiris",
           "Perambalur",
           "Pudukkottai",
           "Ramanathapuram",
           "Salem",
           "Sivaganga",
           "Thanjavur",
           "Theni",
           "Thoothukudi (Tuticorin)",
           "Tiruchirappalli",
           "Tirunelveli",
           "Tiruppur",
           "Tiruvallur",
           "Tiruvannamalai",
           "Tiruvarur",
           "Vellore",
           "Viluppuram",
           "Virudhunagar"
        ]
     },
     {  
        "state":"Telangana",
        "districts":[  
           "Adilabad",
           "Bhadradri Kothagudem",
           "Hyderabad",
           "Jagtial",
           "Jangaon",
           "Jayashankar Bhoopalpally",
           "Jogulamba Gadwal",
           "Kamareddy",
           "Karimnagar",
           "Khammam",
           "Komaram Bheem Asifabad",
           "Mahabubabad",
           "Mahabubnagar",
           "Mancherial",
           "Medak",
           "Medchal",
           "Nagarkurnool",
           "Nalgonda",
           "Nirmal",
           "Nizamabad",
           "Peddapalli",
           "Rajanna Sircilla",
           "Rangareddy",
           "Sangareddy",
           "Siddipet",
           "Suryapet",
           "Vikarabad",
           "Wanaparthy",
           "Warangal (Rural)",
           "Warangal (Urban)",
           "Yadadri Bhuvanagiri"
        ]
     },
     {  
        "state":"Tripura",
        "districts":[  
           "Dhalai",
           "Gomati",
           "Khowai",
           "North Tripura",
           "Sepahijala",
           "South Tripura",
           "Unakoti",
           "West Tripura"
        ]
     },
     {  
        "state":"Uttarakhand",
        "districts":[  
           "Almora",
           "Bageshwar",
           "Chamoli",
           "Champawat",
           "Dehradun",
           "Haridwar",
           "Nainital",
           "Pauri Garhwal",
           "Pithoragarh",
           "Rudraprayag",
           "Tehri Garhwal",
           "Udham Singh Nagar",
           "Uttarkashi"
        ]
     },
     {  
        "state":"Uttar Pradesh",
        "districts":[  
           "Agra",
           "Aligarh",
           "Allahabad",
           "Ambedkar Nagar",
           "Amethi (Chatrapati Sahuji Mahraj Nagar)",
           "Amroha (J.P. Nagar)",
           "Auraiya",
           "Azamgarh",
           "Baghpat",
           "Bahraich",
           "Ballia",
           "Balrampur",
           "Banda",
           "Barabanki",
           "Bareilly",
           "Basti",
           "Bhadohi",
           "Bijnor",
           "Budaun",
           "Bulandshahr",
           "Chandauli",
           "Chitrakoot",
           "Deoria",
           "Etah",
           "Etawah",
           "Faizabad",
           "Farrukhabad",
           "Fatehpur",
           "Firozabad",
           "Gautam Buddha Nagar",
           "Ghaziabad",
           "Ghazipur",
           "Gonda",
           "Gorakhpur",
           "Hamirpur",
           "Hapur (Panchsheel Nagar)",
           "Hardoi",
           "Hathras",
           "Jalaun",
           "Jaunpur",
           "Jhansi",
           "Kannauj",
           "Kanpur Dehat",
           "Kanpur Nagar",
           "Kanshiram Nagar (Kasganj)",
           "Kaushambi",
           "Kushinagar (Padrauna)",
           "Lakhimpur - Kheri",
           "Lalitpur",
           "Lucknow",
           "Maharajganj",
           "Mahoba",
           "Mainpuri",
           "Mathura",
           "Mau",
           "Meerut",
           "Mirzapur",
           "Moradabad",
           "Muzaffarnagar",
           "Pilibhit",
           "Pratapgarh",
           "RaeBareli",
           "Rampur",
           "Saharanpur",
           "Sambhal (Bhim Nagar)",
           "Sant Kabir Nagar",
           "Shahjahanpur",
           "Shamali (Prabuddh Nagar)",
           "Shravasti",
           "Siddharth Nagar",
           "Sitapur",
           "Sonbhadra",
           "Sultanpur",
           "Unnao",
           "Varanasi"
        ]
     },
     {  
        "state":"West Bengal",
        "districts":[  
           "Alipurduar",
           "Bankura",
           "Birbhum",
           "Burdwan (Bardhaman)",
           "Cooch Behar",
           "Dakshin Dinajpur (South Dinajpur)",
           "Darjeeling",
           "Hooghly",
           "Howrah",
           "Jalpaiguri",
           "Kalimpong",
           "Kolkata",
           "Malda",
           "Murshidabad",
           "Nadia",
           "North 24 Parganas",
           "Paschim Medinipur (West Medinipur)",
           "Purba Medinipur (East Medinipur)",
           "Purulia",
           "South 24 Parganas",
           "Uttar Dinajpur (North Dinajpur)"
        ]
     }
  ]
}



function populateDistricts() {
   const stateSelect = document.getElementById('state');
   const districtSelect = document.getElementById('district');
   districtSelect.innerHTML = '<option value="">Select District</option>';
   
   const selectedState = stateSelect.value;
   const stateObj = stateDistrictData.states.find(state => state.state === selectedState);
   
   if (stateObj) {
     stateObj.districts.forEach(district => {
       const option = document.createElement('option');
       option.value = district;
       option.textContent = district;
       districtSelect.appendChild(option);
     });
   }
 }
 
 // Attach event listener to the state select element
 document.getElementById('state').addEventListener('change', populateDistricts);

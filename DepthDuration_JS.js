// ---------------------------
// initialize global variables
// ---------------------------

// set-up data object --> all key values will be the headers on the output csv
var thisData = {
  "subjID":[],
  "experimentName":[],
  "versionName":[],
  "windowWidth":[],
  "windowHeight":[],
  "screenWidth":[],
  "screenHeight":[],
  "startDate":[],
  "startTime":[],
  "trialNum":[],
  "depthResponse":[],
};

// duration condition is in the json --> later consider logging the actual depth and duration from the json

// set subject ID as a random 6 digit number
var subjID = randomIntFromInterval(100000, 999999);

// start time variables
var start = new Date;
var startDate = start.getMonth() + "-" + start.getDate() + "-" + start.getFullYear();
var startTime = start.getHours() + "-" + start.getMinutes() + "-" + start.getSeconds();

// initialize empty variables
var endExpTime, startExpTime;

// obj variables
var categoryDict = {
  "bathroom":["b1.png", "b2.png", "b3.png", "b4.png", "b5.png", "b6.png"],
  "clothing":["c1.png", "c2.png", "c3.png", "c4.png", "c5.png", "c6.png"],
  "electronics":["e1.png", "e2.png", "e3.png", "e4.png", "e5.png", "e6.png"],
  "kitchen":["k1.png", "k2.png", "k3.png", "k4.png", "k5.png", "k6.png"],
  "office":["o1.png", "o2.png", "o3.png", "o4.png", "o5.png", "o6.png"],
  "sports":["s1.png", "s2.png", "s3.png", "s4.png", "s5.png", "s6.png"]
};
var cats = Object.keys(categoryDict);
var objsPerCat = Object.values(categoryDict);
var totalObjNum = cats.length * objsPerCat[0].length; //total number of categories times total number of objects in each category (use first category to represent all categories, since all categories have the same number of objects)
var prevObjs = [];

// other dictionaries
// var locationDict = {"top": [415, 80], "left": [230, 265], "right": [600, 265], "bottom": [415, 450]};
var locationDict = {"top": [400, 100], "left": [250, 250], "right": [550, 250], "bottom": [400, 400]};
var condsDict = {"NR_2":[2, "NR"], "SR_2":[2, "SR"], "NR_3":[3, "NR"], "SR_3":[3, "SR"]};

// timing variables
var objTime = 4000;
var gaborTime = 2000;

// accuracy variables
var prevAcc = 1;
var trialNum = 0;
var trialInBlockNum = 0;
var numCorr = 0;

// key info
var keyDict = {"c": 90, "m": 0, "none": "none"}

// block variables
var thisBlockNum = 0;
var totalBlocks = 3;

// practice variables
var pracTries = 0;
var pracCondCount = 2; //how many times each condition is shown
var pracTotalTrials = pracCondCount * Object.keys(condsDict).length; //so total trials for practice is 4 conditions x 2 times each = 8 trials
var pracConds = {"NR_2":Array(pracCondCount).fill([2, "NR"]), "SR_2":Array(pracCondCount).fill([2, "SR"]), "NR_3":Array(pracCondCount).fill([3, "NR"]), "SR_3":Array(pracCondCount).fill([3, "SR"])};

// main experiment variables
var experimentCondCount = 16;//how many times each condition is shown
var totalTrials = experimentCondCount * Object.keys(condsDict).length; //so total trials for experiment block is 4 conditions x 16 times each = 64 trials
var experimentConds = {"NR_2":Array(experimentCondCount).fill([2, "NR"]), "SR_2":Array(experimentCondCount).fill([2, "SR"]), "NR_3":Array(experimentCondCount).fill([3, "NR"]), "SR_3":Array(experimentCondCount).fill([3, "SR"])};

// ----------------
// set-up functions
// ----------------

$(document).ready(function(){
  // on open, add this text to the startingInstructions div and pre-load all stimuli

  $("#startingInstructions").append( //have to append here instead of setting in html because variables are included
    "<p>Thank you for your participation in this experiment. Please read the instructions very carefully.</p>"
    + "<p> The experiment will be broken up into " + totalBlocks + " blocks of trials, each taking roughly 8 minutes. Each trial in the experiment will be run as follows:</p>"
    + "<p>1. A fixation cross (+) will appear in the middle of the screen. <strong>Please try to keep your eyes on this fixation cross throughout the experiment.</strong></p>"
    + "<p>2. A ring of 4 objects will then appear around the fixation.</p>"
    + "<p>3. After a moment, one target grating (with either horizontal or vertical oriented lines) and several other distractors with diagonally oriented lines will be overlaid on the objects.</p>"
    + "<p>4. The target grating will either be vertical or horizontal. Your task is to indicate the orientation of the target grating. When the grating is horizontal, press the \"c\" key on your keyboard. When the grating is vertical, press the \"m\" key on your keyboard.</p>"
    + "<br><p>When you are ready to begin the practice section, click the button below.</p>");

  document.getElementById("subjID").value = subjID;
  document.getElementById("startDate").value = startDate;
  document.getElementById("startTime").value = startTime;

  preloadStimuli();

});

function preloadStimuli(){
  // loads all stimuli into document under hidden div so there is no lag when calling them

  for (var catNum=0; catNum<cats.length; catNum++){
    for (var objInCat=0; objInCat<objsPerCat[catNum].length; objInCat++){
      var img = document.createElement("img");
      img.src = "stimuli/" + objsPerCat[catNum][objInCat];
      document.getElementById("preload").appendChild(img);
    }
  }
}
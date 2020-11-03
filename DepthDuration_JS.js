// ---------------------------
// initialize global variables
// ---------------------------

// set-up data object --> all key values will be the headers on the output csv
var thisData = {
  "subjID":[],
  "experimentName":[],
  "versionName": [],
  "sequenceName":[],
  "windowWidth":[],
  "windowHeight":[],
  "screenWidth":[],
  "screenHeight":[],
  "startDate":[],
  "startTime":[],
  "stimulus":[],
  "duration": [],
  "actual_depth": [],
  "depth_estimate": [],
  "unitSelection": []
};

// set subject ID as a random 6 digit number
var subjID = randomIntFromInterval(100000, 999999);

// start time variables
var start = new Date;
var startDate = start.getMonth() + "-" + start.getDate() + "-" + start.getFullYear();
var startTime = start.getHours() + "-" + start.getMinutes() + "-" + start.getSeconds();

// initialize empty variables
var stimulus, duration, actual_depth, depth_estimate, endExpTime, startExpTime; 

// unit preference variables 
var pref = false // unit preference has not been made
var unit = null

// constant timing variables 
var fixation_time = 500
var mask_time = 500 

var practice_trial = 0 // counter that references the index of the practice_seq variable 
var practice_seq = JSON.parse('[{"sequence": "sequence_A", "image": "new_ltq/002131_1", "duration": 250, "num": 1, "depth": 1.73, "image_path": "depth_duration_stimuli/002131_1/002131-original.jpg", "image_path_target": "depth_duration_stimuli/002131_1/002131_1-target.png", "mask_path": "masks/mask_252.jpg", "fixation_path": "fixation.jpg", "sampled": 0}, {"sequence": "sequence_A", "image": "new_ltq/002853_18", "duration": 750, "num": 2, "depth": 1.648, "image_path": "depth_duration_stimuli/002853_18/002853-original.jpg", "image_path_target": "depth_duration_stimuli/002853_18/002853_18-target.png", "mask_path": "masks/mask_129.jpg", "fixation_path": "fixation.jpg", "sampled": 0}, {"sequence": "sequence_A", "image": "new_ltq/002637_8", "duration": 500, "num": 3, "depth": 1.995, "image_path": "depth_duration_stimuli/002637_8/002637-original.jpg", "image_path_target": "depth_duration_stimuli/002637_8/002637_8-target.png", "mask_path": "masks/mask_2.jpg", "fixation_path": "fixation.jpg", "sampled": 0}]')
var practiced = false // practice trials have not been completed 

var trial = 0 //counter that references the index of the stim_seq variable

var counter = 0 // counter for logging 


// PARTIAL SEQUENCE FOR TESTING PURPOSES (needs to be changed for actual experiment)
var sequenceName = "sequence_AF" 
// for full experiment num_trials = 255
var num_trials = 29 // 6 images, but since indexing starts at zero this should be 5

// solves problem of last practice variables being saved in the estimate variable and getting recorded 
// set to true once trial has actually begun NOT in the beginning of the function because the practice trial is still saved in the estimate variable
var start_recording = false 

// Load in stimulus sequence (json file)


var seq_filepath = 'seq_sequence_AF.json'

var stim_seq = $.ajax({
                url: seq_filepath,
                method: 'GET',
                dataType: 'json',
                data: JSON.stringify(),
                success: function (data) {
                    stim_seq = data;
                    // preloadStimuli(stim_seq);
                },
            });


// ----------------
// set-up functions
// ----------------

$(document).ready(function(){



  // on open, add text to the startingInstructions div and pre-load all stimuli
  $(".buttonDivPg2").hide();
  $(".buttonDivPg3").hide();
  $(".buttonDivPg4").hide();
  $(".metersButtonDiv").hide();
  $(".feetButtonDiv").hide();

  $("#start_trials").hide()
  $(".startTrialsButtonDiv").hide();


  $("#Instructions2").hide();
  $("#FinalInstructions").hide()


  $("#startingInstructions").append( 
    "<h1>Thank you for accepting this HIT!</h1>"
    + "<p>In this Human Interaction Task (HIT), you are asked to make judgments about everyday objects and scenes. This psychology task takes about 20 minutes and you will be compensated $2.50 (roughly $7.50/hour).</p>"
    + "<p>This research is conducted by the Brain and Navigation Laboratory at the George Washington University (PI: Dr. John Philbeck). You may contact Dr. Philbeck at bnavlab2@gmail.com, or the George Washington University Institutional Review Board at (202) 994-2715.</p>"
    + "<p>This task can only be completed once. If you have already completed this task before the system will not allow you to run again. If this looks familiar please return the HIT so someone else can participate. </p>"
    + "<p>Otherwise, please click 'NEXT' to reveal further instructions and an informed consent agreement.</p>"
    );

  document.getElementById("subjID").value = subjID;
  document.getElementById("startDate").value = startDate;
  document.getElementById("startTime").value = startTime;

});

// NOTE: no longer preloading in JS file (did not work) --> wrote new function in HTML called under starting instructions 
// NEED TO DELETE --> preload div, css related to preloading... etc. 
// function preloadStimuli(stim_seq){
//   // loads all stimuli into document under hidden div so there is no lag when calling them
//   for (var idx=0; idx <practice_seq.length; idx++){ // iterates through indeces of elements in sequence 
//     var trial_prac = practice_seq[idx] // gets trial parameters 

//     var stimulus_path = trial_prac.image_path_target // extract stimulus path
//     var scene_prac = document.createElement("scene");
//     scene_prac.src = stimulus_path;
//     console.log(typeof scene_prac.src)
//     document.getElementById("preload").appendChild(scene_prac);

//     var mask_path = trial_prac.mask_path
//     var mask_prac = document.createElement("mask");
//     mask_prac.src = mask_path;
//     document.getElementById("preload_masks").appendChild(mask_prac);
//   }


//   for (var idx=0; idx <stim_seq.length; idx++){ // iterates through indeces of elements in sequence 
//     var trial_exp = stim_seq[idx]

//     var stimulus_path_exp = trial_exp.image_path_target
//     //console.log(stimulus_path_exp)
//     var scene_exp = document.createElement("sceneExp");
//     scene_exp.src = stimulus_path_exp;
//     document.getElementById("preloadExperiment").appendChild(scene_exp);

//     var mask_path_exp = trial_exp.mask_path
//     var mask_exp = document.createElement("maskExp");
//     mask_exp.src = mask_path_exp;
//     document.getElementById("preload_masksExperiment").appendChild(mask_exp);

//   }
// }



// INSTRUCTIONS - Before Practice // 


function showConsent(){
  $(".buttonDivPg2").show();
  $(".buttonDivPg1").hide();
  $(".buttonDivPg3").hide();
  $(".buttonDivPg4").hide();
  $(".metersButtonDiv").hide();
  $(".feetButtonDiv").hide();


  $("#startingInstructions").hide();
  $("#Instructions2").hide();

  $("#FinalInstructions").hide()


  $("#getConsent").append( 
    "<h1>Title of Study: The Visual Determinants of Size in Natural Scenes </h1>"
    + "<br>IRB #: 04168<br/>"
    + "<br>Version Date: 7/09/20<br/>"

    + "<p>The purpose of this study is to investigate how people determine the size of objects in pictures of natural scenes.</p>"
    + "<p>If you choose to take part in this study, you will participate in a research activity that involves viewing a series of pictures and answering questions about them. For example, for each picture, you might be asked about the sizes or spatial relationships of objects in the scene, or what objects were present in the scene. The total amount of time you will spend in connection with this study is about 20 minutes, and you will receive $2.50 as compensation for your participation. You may refuse to answer any of the questions and you may stop your participation in this study at any time.</p>"
    + "<p>Possible risks or discomforts you could experience during this study include: boredom or loss of confidentiality (for example, depending on where you are, someone might see you taking part in the study). </p>"
    + "<p>You will not benefit directly from your participation in the study. The benefit to science and humankind that might result from this study is: a clearer understanding about how people perceive the size and spatial relationships among objects in natural scenes.</p>"
    + " <p> Every effort will be made to keep your information confidential, however, this cannot be guaranteed. We will not receive any information about you other than your responses to the study questions. If results of this research study are reported in journals or at scientific meetings, the people who participated in this study will not be named or identified. <p/>"
    + "<p> The Office of Human Research of George Washington University, at telephone number (202) 994-2715, can provide further information about your rights as a research participant.<p/>"
    + "<p> Your willingness to participate in this research study is implied if you proceed.<p/>"
    + "<p> Please click 'AGREE' if you agree to participate:<p/>"
    );
}

function nextInstructions(){
  $("#getConsent").hide();
  $("#Instructions2").show();
  $("#FinalInstructions").hide()

  $(".buttonDivPg2").hide();
  $(".buttonDivPg1").hide();
  $(".buttonDivPg3").show();
  $(".buttonDivPg4").hide();
  $(".metersButtonDiv").hide();
  $(".feetButtonDiv").hide();
}

function finalInstructions(){
  $("#getConsent").hide();
  $("#Instructions2").hide();
  $("#FinalInstructions").show()

  $(".buttonDivPg2").hide();
  $(".buttonDivPg1").hide();
  $(".buttonDivPg3").hide();
  $(".metersButtonDiv").hide();
  $(".feetButtonDiv").hide();
  $(".buttonDivPg4").show()

  $("#FinalInstructions").append(
    "<h1> Instructions </h1>"
    + "<p>A fixation cross will appear in the center of the screen - focus on this cross. The target will then appear for a brief amount of time, so make sure you are watching closely as to not miss the target. Then, the scene and target will disappear, and you will see an image of colored squares. Once this image disappears you will be prompted to enter your distance judgment. Be sure to give your estimate as a single number, rather than a range of possible values. You can use decimals to indicate fractions. After entering your distance judgment, click the 'NEXT' button. As soon as you click this button, the fixation cross will be displayed.</p>"
    + "<p>We ask that you pay close attention on each trial so you detect all of the targets, but occasionally you may accidentally miss one. If you do, please enter '0' in the response box. You will not be penalized for missing a target, we'd just like to know so we can factor this into our analysis later.</p>"
    + "<p> You will see 256 images, and the experiment will take approximately 20 minutes. The experiment will begin with three practice trials. If you are ready to begin, please click 'BEGIN' below.</p>"
    )
}

function getUnits(){
  $("#getConsent").hide();
  $("#Instructions2").hide();
  $("#FinalInstructions").hide();
  $("#getUnits").show()

  $(".buttonDivPg2").hide();
  $(".buttonDivPg1").hide();
  $(".buttonDivPg3").hide();
  $(".buttonDivPg4").hide();
  $(".metersButtonDiv").show()
  $(".feetButtonDiv").show()

  $("#getUnits").append(
    "<p> This study will ask you to estimate the distance of objects. What unit of measurement would you like to use?<p/>"
    )
}

function recordUnitsMeters(){
  pref = true // units have been chosen 
  unit = "meters"
  console.log(unit)

  $("#getUnits").hide()
  $(".metersButtonDiv").hide()
  $(".feetButtonDiv").hide()

  $(".startPracticeButtonDiv").show()

}

function recordUnitsFeet(){
  pref = true // units have been chosen 
  unit = "feet"
  console.log(unit)

  $("#getUnits").hide()
  $(".metersButtonDiv").hide()
  $(".feetButtonDiv").hide()
  $(".startPracticeButtonDiv").show()

}

function startPractice(){
  // not recording responses from practice trials 

  $(".startPracticeButtonDiv").hide()

  if (practice_trial > 2){
    practiced = true
    $("#start_trials").show()
    $(".startTrialsButtonDiv").show();

  }

  else{
    scene_duration = getTrialDuration();
    var fixation = showFixation();
    // weird timing note... seems like the time accumulates so it is not actual duration but relative time? 
    // so mask the scene still shows up for the amount of scene_duration, but you have to account for the time already spent
    var scene = setTimeout(function(){showScene();}, fixation_time); // the time here is how long it takes to show up NOT time on the screen
    var mask = setTimeout(function(){showMask();}, fixation_time + scene_duration); // extra time added for testing purposes
    var response = setTimeout(function(){getResponse();}, fixation_time + scene_duration + mask_time)
  }
}

function runTrial(){ 

  $(".startPracticeButtonDiv").hide()
  $("#start_trials").hide()
  $(".startTrialsButtonDiv").hide();


  if (start_recording == true){ // prevents the last practice trial from being recorded 
    var trial_params = getTrialParams();

    stimulus = trial_params[0]
    duration = trial_params[1]
    actual_depth = trial_params[2]

    depth_estimate = document.getElementById("numb").value;



    console.log(typeof stimulus)
    console.log(typeof duration)
    console.log(typeof actual_depth)
    console.log(typeof depth_estimate)

    console.log(stimulus, duration, actual_depth, depth_estimate)

    saveTrialData();

    counter ++;

  }

  if (trial > num_trials){ 

    $("#lastBlockInstructions").append(
      "<p style='text-align:center'>Congratulations, you have finished the experiment. Thank you for your participation!</p>"
      +"<p style='text-align:center'>Click the button below to reveal your unique completion code.</p>")
    $("#lastBlockInstructions").show();
    $("#revealCodeButton").show();
    console.log("FINISHED")
  }

  else{

    start_recording = true; // start recording because practice trials are done 
    scene_duration = getTrialDuration();
    var fixation = showFixation();
    // weird timing note... seems like the time accumulates so it is not actual duration but relative time? 
    // so mask the scene still shows up for the amount of scene_duration, but you have to account for the time already spent
    var scene = setTimeout(function(){showScene();}, fixation_time); // the time here is how long it takes to show up NOT time on the screen
    var mask = setTimeout(function(){showMask();}, fixation_time + scene_duration); // extra time added for testing purposes
    var response = setTimeout(function(){getResponse();}, fixation_time + scene_duration + mask_time)


  }



}

function showFixation(){

  f_path = "fixation.jpg"
  $("#fixation_image").attr("src", f_path)
  $(document).ready(function(){
    $(".fixationDiv").show();
  })
}

function showScene(){
  if (practiced == false){
    var s_path = practice_seq[practice_trial].image_path_target
    var s_duration = practice_seq[practice_trial].duration 
    var actual_depth = stim_seq[trial].depth

  }
  else{ 
    var s_path = stim_seq[trial].image_path_target
    var s_duration = stim_seq[trial].duration 
    var actual_depth = stim_seq[trial].depth
  }

  $("#scene_image").attr("src", s_path);
  $(document).ready(function(){
    $(".fixationDiv").hide();
    $(".maskDiv").hide();
    $(".sceneDiv").show();
  })

}

function getTrialDuration(){
  if (practiced == false){
    var stim_duration = practice_seq[practice_trial].duration
  }
  else{ 
    var stim_duration = stim_seq[trial].duration
  }
  return stim_duration
}

function showMask(){
  if (practiced == false){
    var m_path = practice_seq[practice_trial].mask_path
  }
  else{ 
    var m_path = stim_seq[trial].mask_path
  }

  $("#mask_image").attr("src", m_path);
  $(document).ready(function(){
    $(".fixationDiv").hide();
    $(".sceneDiv").hide();
    $(".maskDiv").show();
  })

}

// https://www.w3schools.com/js/js_validation.asp
// depth estimate is validated in html response div

function getResponse(){

  $(document).ready(function(){
    $(".fixationDiv").hide();
    $(".sceneDiv").hide();
    $(".maskDiv").hide();
    $(".responseDiv").show();


  })
  // would be better to have the selected unit in the prompt - currently copping out by including prompt in html
  // $("#response").append("How far away is the target, in " + unit + "?")

}

function getTrialParams(){
  var stimulus = stim_seq[counter].image_path_target
  var duration = stim_seq[counter].duration 
  var actual_depth = stim_seq[counter].depth

  return [stimulus, duration, actual_depth];

}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function endExperiment(){
  // gives participant their unique code and saves data to server --> this page should look identical to redirect html (revealCode.html)
  $("#lastBlockInstructions").append("<br><p style='text-align:center'><strong>Your unique completion code is: </strong>" +subjID+"</p>");
  $("#revealCodeButton").hide();
  saveAllData();
}

// ---------------------
// saving data functions
// ---------------------

function saveTrialData(){
  // at the end of each trial, appends values to data dictionary

  // global variables --> will be repetitive, same value for every row (each row will represent one trial)
  thisData["subjID"].push(subjID);
  thisData["experimentName"].push("DepthScenes");
  thisData["versionName"].push("duration_manipulation");
  thisData["sequenceName"].push(sequenceName)
  thisData["windowWidth"].push($(window).width());
  thisData["windowHeight"].push($(window).height());
  thisData["screenWidth"].push(screen.width);
  thisData["screenHeight"].push(screen.height);
  thisData["startDate"].push(startDate);
  thisData["startTime"].push(startTime);
  thisData["unitSelection"].push(unit);

  // trial-by-trial variables, changes each time this function is called
  thisData["stimulus"].push(stimulus);
  thisData["duration"].push(duration);
  thisData["actual_depth"].push(actual_depth);
  thisData["depth_estimate"].push(depth_estimate);

  console.log(stimulus, "this data stimulus")

}

function saveAllData() {
  // saves last pieces of data that needed to be collected at the end, and calls sendToServer function

  // add experimentTime and totalTime to data dictionary
  var experimentTime = (endExpTime - startExpTime);
  var totalTime = ((new Date()) - start);
  thisData["experimentTime"]=Array(trial).fill(experimentTime);
  thisData["totalTime"]=Array(trial).fill(totalTime);


  // change values for input divs to pass to php
  $("#experimentData").val(JSON.stringify(thisData));
  $("#completedTrialsNum").val(trial); //how many trials this participant completed

  sendToServer();
  console.log("save all data")
}

function sendToServer() {
  // send the data to the server as string (which will be parsed IN php)

  $.ajax({ //same as $.post, but allows for more options to be specified
    headers:{"Access-Control-Allow-Origin": "*", "Content-Type": "text/csv"}, //headers for request that allow for cross-origin resource sharing (CORS)
    type: "POST", //post instead of get because data is being sent to the server
    url: $("#saveData").attr("action"), //url to php
    data: $("#experimentData").val(), //not sure why specified here, since we are using the data from the input variable, but oh well

    // if it works OR fails, submit the form
    success: function(){
      document.forms[0].submit();
    },
    error: function(){
      document.forms[0].submit();
    }
  });
}

// ----------------------
// other random functions
// ----------------------

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}


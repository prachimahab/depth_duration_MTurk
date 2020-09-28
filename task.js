// Sequence A DURATION MANIPULATION TASK 
/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-ready.html",
	"stage.html",
	"postquestionnaire.html"

];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-ready.html",
];

/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/

/********************
* STROOP TEST       *
********************/
var StroopExperiment = function() {
  var stims = []
  var practice_stims = []
  var practiced = false
  var pref = false
  
  // Set the amount of time each image is shown to the subject
  //var delay = 200
  var fixation_time = 500


  //var target_time = 500
  // time is determined by duration set in updated_data.json per stim 
  // time for practice stim is set in practice_data.json (500)
  
  var mask_time = 500

  var next = function() {
    if(stims.length === 0 && pref != false){
      finish()
    } else if (pref != false && practiced === true){
      presentImage('pilot_phase')
    } else if (pref === false){



      d3.select('#prompt').html('This study will ask you to estimate the distance of objects. What unit of measurement would you like to use?')
      d3.select('#stim').html('<button id="feet" class="m3 btn btn-link">Feet</button> <br />' + '<button id="meters" class="btn m3 btn-link">Meters</button>')
      d3.select('#feet').on('click', function(){
        d3.select('#stim').html('')
        pref = 'f'
        psiTurk.recordUnstructuredData('unit', pref)
        countdown('Practice trials starting in... ')
      })
      d3.select('#meters').on('click', function(){
        d3.select('#stim').html('')
        pref = 'm'
        psiTurk.recordUnstructuredData('unit', pref)
        countdown('Practice trials starting in... ')
      })
    } else if (pref != false && practiced === false){
      presentImage('practice')
    }
	}

  var presentImage = function (mode){
    
    var dataset = []
    if(mode === 'practice'){
      dataset = practice_stims
    } else {
      dataset = stims
    }
    stim = dataset[0]
    

    d3.select('#prompt').style('opacity', 0)
    d3.select('#stim').html("<img id=\"fixation-image\" class=\"nocursor\" />" + "<img id=\"stim-image\" class=\"nocursor\" style=\"opacity: 0\" />" + "<img id=\"mask-image\" class=\"nocursor\" />")
    d3.select('#fixation-image').on('load', function(){
      d3.select('#stim-image').on('load', function(){
        setTimeout(function(){
          d3.select('#fixation-image').remove()
          d3.select('#stim-image').style('opacity', 1)
          setTimeout(function(){
            d3.select('#stim-image').remove() 
            setTimeout(function(){

              d3.select('#prompt').style('opacity', 1)
              if (pref === 'm'){
                d3.select('#prompt').html('How far away is the target, in meters?')
              } else {
                d3.select('#prompt').html('How far away is the target, in feet?')
              }
              d3.select('#stim').html('<form action="javascript:void(0); novalidate"><div id="input-container" class="form-group has-feedback"><input type="number" id="response" /><small id="invalid-feedback" style="opacity:0" class="help-block">Please enter a number greater than or equal to zero (decimals allowed).</small></div><button type="button" id="next-button" value="next-button" class="btn btn-primary m3">Next <span class="glyphicon glyphicon-arrow-right"></span></button></form>')
              d3.select('#next-button').on('click', function(){
                response = d3.select('#response').property('value')
                if(response.length > 0 && response >= 0){
                  psiTurk.recordTrialData({'phase': mode, 'image_id': stim.id, 'actual_depth': stim.target_depth, 'depth_judgement': response})
                  dataset.shift()
                  if (dataset.length === 0 && mode === 'practice'){
                    practiced = true
                    d3.select('#stim').html('')
                    countdown('The experiment will start in... ')
                    practice_stims = dataset
                  } else if (mode === 'practice' && dataset.length !=0) {
                    practice_stims = dataset                  
                    next()
                  } else {
                    stims = dataset
                    next()
                  }
                } else {
                  d3.select('#input-container').classed('has-error', true)
                  d3.select('#invalid-feedback').style('opacity', 1)
                }
              // d3.select('#mask-image').on('load', function(){
              //   setTimeout(function(){
              //     d3.select('#mask-image').remove()
              //   }, target_time)

              // })
              // d3.select('#mask-image').attr('src', stim.mask_path)
                
              })
              
            }, mask_time) 
            d3.select('#mask-image').attr('src', stim.mask_path)         
 
          }, stim.duration)
        }, fixation_time)
        
      })
      d3.select('#stim-image').attr('src', stim.image_path_target)
    })
    d3.select('#fixation-image').attr('src', stim.fixation_path)   

  }

  


  var countdown = function(message){
    d3.select('#prompt').html(message+ '3')
    var time = 3
    var interval = setInterval(function(){
      time = time - 1
      if (time != 0){
        d3.select('#prompt').html(message + time)
      } else {
        clearInterval(interval)
        next()
      }
    }, 1000)
  }

	var finish = function() {
	    //$("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new Questionnaire();
	};
	
	// Load the stage.html snippet into the body of the page
	psiTurk.showPage('stage.html');
	// Register the response handler that is defined above to handle any
	// key down events.
  //$("body").focus().keydown(response_handler); 

	// Start the test
  
  seq_filepath = '/static/js/updated_data_sequence_A.json'
  $.getJSON(seq_filepath, function(data){
    //data = _.shuffle(data) // Since I am loading an already randomized sequence don't want to re-shuffle
    stims = data
    $.getJSON('/static/js/practice_data.json', function(data){
      practice_stims = data
      next()
      $.getJSON('/static/js/fixation.json', function(data){
        fixation = data[1]

        


      })
    })
  })
};


/****************
* Questionnaire *
****************/

var Questionnaire = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});

	};

	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                psiTurk.computeBonus('compute_bonus', function(){
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 


			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'begin'});
	
	$("#next").click(function () {
	    record_responses();
	    psiTurk.saveData({
            success: function(){
                psiTurk.computeBonus('compute_bonus', function() { 
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 
            }, 
            error: prompt_resubmit});
	});
    
	
};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new StroopExperiment(); } // what you want to do when you are done with instructions
    );
});

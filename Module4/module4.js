

var currentData,
startTime;
var effect = "item-correct-pop";
var [eleText,eleCaption,eleTextMock,eleCaptionMock] = [];


function fetchData(){
  getData()
  .then(({data})=>{
      currentData = data;
      render();
  });
}


function getData(){
  let data={
      "status": "success",
      "status_code": 200,
      "message": "Problem fetched successfully",
      "data": {
          "text": "B",
          "asset": "http://15.206.80.44/storage/images/alphabets/A.png",
          "caption": "B for Ball",
          "answer": "1",
          "helper": {
              "vowel": 0,
              "consonant": 1
          },
          "question_id": 15
      }
  };

  return new Promise((res)=>{res(data)});
  
}


function render(){
  debugger;
  $(eleTextMock).html(currentData.text + currentData.text.toLowerCase());
  $(eleText).html(currentData.text + currentData.text.toLowerCase());

  $(eleCaption).html(currentData.caption);
  $(eleCaptionMock).html(currentData.caption);
  // eleSwipeImg.src = currentData.asset;
  $('li.ui-state-default.draggable-item').attr('id',currentData.answer);

  $('#swipe-img').attr('src',currentData.asset);

}

$(init);
function setup(){
  $('ul.droppable-area1').html('<li class="ui-state-default draggable-item" id="vowel"><div class="swipe-text-cntr" style="user-select: none"><p></p><p style="padding: 15px;text-align: right;"></span></div></li>');
  [eleText,eleCaption,eleTextMock,eleCaptionMock] = $('.swipe-text-cntr p');
  $('ul.droppable-area2').html('')
  $('ul.droppable-area3').html('')
}
function init() {
  setup();
  fetchData();

  $('#child-target').data('answer',"0");
  $('#adult-target').data('answer',"1");

  $(".droppable-area1, .droppable-area2, .droppable-area3")
    .sortable({
      connectWith: ".connected-sortable",
      stack: ".connected-sortable ul",
      cancel: ".ui-state-disabled",
      stop: function(event, ui) {
        $(".connected-sortable").removeClass("target-hover");
      },
      over: function(event, ui) {
        //will add class .hover to list
        $(".ui-sortable-placeholder")
          .parents("ul")
          .addClass("target-hover");
      },
      out: function(event, ui) {
        $(".ui-sortable-placeholder")
          .parents("ul")
          .removeClass("target-hover");
      },
      change: function(event, ui) {
        //will style placeholder
        $(".ui-sortable-placeholder").css({
          visibility: "visible"
          //	background: '#c4c6c8'
        });
      },
      receive: function(event, ui) {
        var correct = "correct-message";
        var wrong = "incorrect-message";
        var eleConsonant = $(".droppable-area2");
        var eleVowels = $(".droppable-area3");
        var feedback = $(".feedback-message");
        
        //testing get id of what was dragged
        var justDragged = $(ui.item).attr("id");
        var justDraggedID = "#" + justDragged;
        var answer= $(justDraggedID).closest(".droppable-area").data('answer');
          console.log(justDragged);   
          console.log(answer);   

        //for children
        
        // child 1 CORRECT
        if (justDragged === answer) {
          $("#"+justDragged).addClass(effect);
          setTimeout(()=>{$("#"+justDragged).removeClass(effect)},3000);
          renderRight(answer);
        } else  {
          renderWorng(answer);
        }
      }
    })
    .disableSelection();
}


function renderRight(answer){
  var val = answer == "0" ? "vowel" :'consonant';
  speak(currentData.text +' is '+ val);
  $('#cssHead').addClass('right-ans').removeClass('wrong-ans');
  setTimeout(()=>{$('#cssHead').removeClass('right-ans');},3000)
  $('.next-stage-btn').removeClass('hidden').addClass(effect);
}

function renderWorng(answer){
  var val = answer == "0" ? "vowel" :'consonant';
  speak(currentData.text +' is not '+ val);
  $('#cssHead').addClass('wrong-ans').removeClass('right-ans');
  setTimeout(()=>{$('#cssHead').removeClass('wrong-ans');},3000)

  $('.next-stage-btn').addClass('hidden').removeClass(effect);
}

function speak(msg){
  let speech = new SpeechSynthesisUtterance();
  speech.rate = 0.7;
  speech.pitch = 1;
  speech.volume = 1;
  speech.voice = speechSynthesis.getVoices()[0];
  speech.text = msg;

  speechSynthesis.speak(speech);
}

$('.next-stage-btn').click(init);
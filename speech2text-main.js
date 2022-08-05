
showInfo('info_start');
    var create_email = false;
    var final_transcript = '';
    var interim_transcript = '';
    var recognizing = false;
    var ignore_onend;
    var start_timestamp;
    if (!('webkitSpeechRecognition' in window)) {upgrade();} 
    
    else {
      start_button.style.display = 'inline-block';
      var recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      
      recognition.onstart = function() { // mikrofonu aktive et
    console.log("on start -> "+ document.getElementById("final_span").textContent);
        recognizing = true;
        showInfo("info_speak_now");
        start_img.src = 'spech2text-mic-animate.gif';
        start_img.title = 'Cliquez pour arrêter la Transcription';
      };
    
      recognition.onerror = function(event) {
        if (event.error == 'no-speech') {
          start_img.src = 'spech2text-mic.gif';
          showInfo('info_no_speech');
          ignore_onend = true;
        }
        if (event.error == 'audio-capture') {    
          start_img.src = 'spech2text-mic.gif';
          showInfo('info_no_microphone');
          ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
    console.log("Erreur : not-allowed");        
          if (event.timeStamp - start_timestamp < 100) {
            showInfo('info_blocked');
          } else {
            showInfo('info_denied');
          }
          ignore_onend = true;
        }
      };
    
      recognition.onend = function() {
  console.log("onEnd -> "+ document.getElementById("final_span").textContent);
  
        recognizing = false;
        if (ignore_onend) {
          return;
        }
        start_img.src = 'spech2text-mic.gif';
        start_img.title="Tikla ve konus";

        if (!final_transcript) {
  console.log(" not final_transcript");
          showInfo('info_start');
          return;
        }

        showInfo('');

        if (window.getSelection) {
          window.getSelection().removeAllRanges();
          var range = document.createRange();
  console.log("createRange -> "+ range);        
  //        range.selectNode(document.getElementById('final_span'));
  //       window.getSelection().addRange(range);
        }
        if (create_email) {
          create_email = false;
          createEmail();
        }
      };

      recognition.onresult = function(event) {
        // **** Final spanda ne var bakalim
     
        const d = new Date();
        const zaman=d.getDay()+"-"+d.getMonth()+"-"+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes();


        // ****************************
        // ***** Konusma toplama ******
        // ****************************
        interim_transcript = '';
        
        // On recupère le contenu du textarea
        final_transcript=document.getElementById("final_span").textContent;

        for (var i = event.resultIndex; i < event.results.length; ++i) {
          
          if (event.results[i].isFinal) {         
            // ON ERCRIT dans textarea
            InsertHTML(capitalize(event.results[i][0].transcript)+". ") ;        
            final_transcript +="- "+capitalize(event.results[i][0].transcript)+".\n";
            interim_transcript += event.results[i][0].transcript;
          } 
          
          else { 
            interim_transcript += event.results[i][0].transcript;
          }
        }


      final_span.innerHTML = final_transcript; 
     // interim_span.innerHTML = interim_transcript; 
      document.getElementById("interim_span").innerHTML=interim_transcript;
      console.log("je passe"+interim_transcript);
        if (final_transcript || interim_transcript) {
          showButtons('inline-block');
        }
      };
    }
    
/* ********************************************** */
/* ****** Les fonctions Complémentaires ********* */
/* ********************************************** */




    function upgrade() {
      start_button.style.visibility = 'hidden';
      showInfo('info_upgrade');
    }
    
    var two_line = /\n\n/g;
    var one_line = /\n/g;
    function linebreak(s) {
      return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
    }
    
    var first_char = /\S/;
    function capitalize(s) {
      return s.replace(first_char, function(m) { return m.toUpperCase(); });
    }
    
  
    function createEmail() {
      var n = final_transcript.indexOf('\n');
      if (n < 0 || n >= 80) {
        n = 40 + final_transcript.substring(40).indexOf(' ');
      }
      var subject = encodeURI(final_transcript.substring(0, n));
      var body = encodeURI(final_transcript.substring(n + 1));
      window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
    }
    
    function copyButton() {
      if (recognizing) {
        recognizing = false;
        recognition.stop();
      }
      copy_button.style.display = 'none';
      copy_info.style.display = 'inline-block';
      showInfo('');
    }
    
    function emailButton() {
      if (recognizing) {
        create_email = true;
        recognizing = false;
        recognition.stop();
      } else {
        createEmail();
      }
      email_button.style.display = 'none';
      email_info.style.display = 'inline-block';
      showInfo('');
    }
    
    function startButton(event) { // mikrofona tikladik
var karatahta=document.getElementById("final_span").textContent;
console.log("startButton -> "+ karatahta);

      if (recognizing) {
        recognition.stop();
        return;
      }
      final_transcript = ' ';
      var select_giris = document.getElementById('giris_dili');
	    var option_giris = select_giris.options[select_giris.selectedIndex];
      recognition.lang=option_giris.value;
      recognition.start();
      ignore_onend = false;
final_span.innerHTML = karatahta;
      interim_span.innerHTML = '';
      start_img.src = 'spech2text-mic-slash.gif';
      showInfo('info_allow');
      showButtons('none');
      start_timestamp = event.timeStamp;
    }
    
    function showInfo(s) {
      if (s) {
        //console.log(info);
        for (var child = info.firstChild; child; child = child.nextSibling) {
          if (child.style) {
            child.style.display = child.id == s ? 'inline' : 'none';
          }
        }
        info.style.visibility = 'visible';
      } else {
        info.style.visibility = 'hidden';
      }
    }
    
    var current_style;
    function showButtons(style) {
      if (style == current_style) {
        return;
      }
      current_style = style;
      console.log(style);
      copy_button.style.display = style;
      email_button.style.display = style;
      copy_info.style.display = 'none';
      email_info.style.display = 'none';
    }

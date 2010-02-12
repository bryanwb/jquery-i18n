/**
* @fileOverview a footer widget 
* @author Bryan Berry <bryan@olenepal.org> 
*  uses MIT License
*/



(function($){

     // This is a dummy function, just here as placeholder to
     // to make the jsdoc tool happy
     /** @name $.ui.kFooter
      * @namespace kFooter widget 
      * @example Emits the event kFooterWinGame when the maxScore is reached <br />
      * Emits the event kFooterRestart when game restarted <br />
      * Start button emits kFooterStart event when clicked <br />
      * Restart button emits kFooterRestart event when clicked <br />
      * Pause button emits the kFooterPause event when clicked <br />
      */
     $.ui.kFooter = function(){};

     $.widget('ui.kFooter',
	      /** @lends $.ui.kFooter.prototype */
	      {
		  /** Gets the current score
		   * @returns {Number} current score
		   */
		  getScore : function(){
		      return this._getData('score');
		  },
		   /** Sets the current score
		   * @param {Number} newScore new score
		   */
		  setScore : function(newScore){
		      this._setData('score', parseInt(newScore));
		      this._refresh();
		  },
		  /** Gets the current total
		   * @returns {Number} current total
		   */
		  getTotal : function(){
		      return this._getData('total');
		  },
		  /** Sets the current total
		   * @param {Number} newTotal new total
		   */
		  setTotal : function(newTotal){
		      this._setData('total', parseInt(newTotal));
		      this._refresh();  
		  },
		  /**
		   * Resets the score and total to initial values and triggers 
		   * the "kFooterRestart" event
		   */
		  restart : function(){
		      this.element.trigger('kFooterRestart');
		      this._setData('score', this._getData('initialScore'));
		      this._setData('total', this._getData('initialTotal'));
		      this._refresh();
		  },
		  /** Increments the score by 1 or by the supplied numeric argument
		   * @param {Number} [val] increment value
		   */
		  inc : function(val){
		      var incVal = parseInt(val) || 1;
		      this._setData('score',  this._getData('score') + incVal);
		      this._refresh();
		      if(this._getData('winScore') === this._getData('score')){
			  this.element.trigger('kFooterWinGame');
		      }
		  },
		   /** Increments the total by 1 or by the supplied numeric argument
		   * @param {Number} [val] increment value
		   */
		  incTotal : function(val){
		      var incVal = parseInt(val) || 1;
		      this._setData('total',  this._getData('total') + incVal);
		      this._refresh();
		  },
		   /** Decrements the score by 1 or by the supplied numeric argument
		   * @param {Number} [val] decrement value
		   */
		  dec : function(val){
		      var decVal = parseInt(val) || 1;
		      this._setData('score',  this._getData('score') - decVal);
		      this._refresh();
		  },
		   /** Decrements the total by 1 or by the supplied numeric argument
		   * @param {Number} [val] decrement value
		   */
		  decTotal : function(val){
		      var decVal = parseInt(val) || 1;
		      this._setData('total',  this._getData('total') - decVal);
		      this._refresh();
		  },
		  /** Start the timer, defaults to 0:00 if no arguments supplied
		   * @param {Number} [minutes] value for minutes, default to 0
		   * @param {Number} [seconds]  value for seconds, default to 0 
		   */ 
		  startTimer : function(minutes, seconds){
		      var timerRunning = this._getData('timerRunning')|| false;

		      if (this._$timer && timerRunning === false){
			  var mins = minutes || 0;
			  var secs = seconds || 0;
			  var timerId = null;
			  var self = this;
		      
		      
			  this._setData('mins', mins);
			  this._setData('secs', secs);

			  var addLeadingZero = function(num){
			      if(''.concat(num).length === 1){
				  return "0".concat(num);
			      } else {
				  return num;
			      }
			    
			  };

			  var increaseTimer = function(){
			      if (self._getData('timerRunning') === false){
				  return;
			      }

			      var s = self._getData('secs') + 1;
			      var m = null;
			      var timerId = null;
					  
			      if (s < 60) {
				  self._setData('secs', s);
				  self._$timerSecs.text(self._n(addLeadingZero(s)));
			      } else {
				  s = 0;
				  m = self._getData('mins') + 1;
				  self._$timerSecs.text(self._n(addLeadingZero(s)));
				  self._$timerMins.text(self._n(addLeadingZero(m)));
				  self._setData('secs', s);
				  self._setData('mins', m);
			      }
				      
			      timerId = setTimeout(increaseTimer, 1000);
			      self._setData('timerId', timerId);

			  };
			  
			  timerId = setTimeout(increaseTimer , 1000);

			  this._setData('timerRunning', true);
			  this._setData('timerId', timerId);
		      }
		  },
		  /** Stop the timer
		   */
		  stopTimer : function(){
		      this._setData('timerRunning', false);
		  },
		  _ : function(val, loc){
		      return $.i18n.call($.ui.kFooter, val, loc);
		  },
		  _n : function(val, loc){
		      return $._n(val, loc);
		  },
		  _init : function(){

		      var divDisplay = "inline";
		      var score = this.options.score;
		      var total = this.options.total;
		      var self = this;
		      
		      var options = $.extend({}, $.ui.kFooter.defaults, this.options);

		      this._setData('initialScore', parseInt(options.score));
		      this._setData('initialTotal', parseInt(options.total));
		      this._setData('score', parseInt(options.score));
		      this._setData('total', parseInt(options.total)); 
		      this._setData('winScore', parseInt(options.winningScore)); 
		      this._setData('locale', options.locale);

		     
		      this.element.addClass('ui-widget ui-widget-content ' +
			      ' ui-kFooter');
		      
		      
		      var $kFooter = $("<ul></ul>");
		     
		      
		      if(options.scoreboard === true){
			  
			  var $scoreboard = $("<li class='left'>" + this._("Score") + 
			      "</li>" + "<li class='left'>" +
			      "<span id='kFooterScore' class='ui-corner-all number'>" + 
			      this._n(score) + "</span></li>" +
			      "<li class='left'>" + this._("Total") + "</li>" +
			      "<li class='left'><span id='kFooterTotal' " +
			      "class='ui-corner-all number'>" + 
			  this._n(total) + "</span></li>")
			      .appendTo($kFooter);
			 
			  this._score = $('#kFooterScore', $scoreboard);
			  this._total = $('#kFooterTotal', $scoreboard);

		      }

		      if(options.timer === true){
			  this._$timer = $("<li class='left'>" + this._("Timer") + 
			      "</li>" +
			      "<li class='left'><span id='kFooterMins'" + 
			      "class='ui-corner-all" +
			      " number timer'>" + this._n("00") + 
			      "</span></li>" +
			      "<li class='left'><span id='kFooterSecs'" + 
			      "class='ui-corner-all " +
			      "number timer'>"+ this._n("00") + 
			      "</span></li>")
			      .appendTo($kFooter);

			  this._$timerMins = $('#kFooterMins', this._$timer);
			  this._$timerSecs = $('#kFooterSecs', this._$timer);		     
		      }

		      //if options.checkAnswerBtn === true
			 
		      if (options.restartButton === true){
			  var $restartButton = $("<li class='right'><button " +
			      "class='ui-corner-all ui-state-default'>" +
 			      "<span class='ui-icon ui-icon-arrowrefresh-1-w'>" +
			      "</span>" + 
			      "<span class='text left'>" + this._('Play Again') + 
			      "</span></button></li>")
			      .click(function(){ 
					 self.startTimer();
					 self.restart();
				     })
			      .appendTo($kFooter);
		      }
		      
		       if (options.pauseButton === true){
			  var $pauseButton = $("<li class='right'><button " +
			      "class='ui-corner-all ui-state-default'>" +
 			      "<span class='ui-icon ui-icon-pause'>" +
			      "</span>" + 
			      "<span class='text left'>" + this._('Pause') + 
			      "</span></button></li>")
			      .click(function(){ 
					 self.stopTimer();
					 self.element.trigger('kFooterPause'); 
				     })
			      .appendTo($kFooter);
		      }

		      if (options.startButton === true){
			  var $startButton = $("<li class='right'><button " +
			      "class='ui-corner-all ui-state-default'>" +
 			      "<span class='ui-icon ui-icon-play'>" +
			      "</span>" + 
			      "<span class='text left'>" + this._('Start') + 
			      "</span></button></li>")
			      .click(function(){ 
				      self.startTimer();
				      self.element.trigger('kFooterStart'); 
				     })
			      .appendTo($kFooter);
		      }
		  
		      $('button', $kFooter).hover(
			      function(){ 
				  $(this).addClass("ui-state-hover"); 
			      },
			      function(){ 
				  $(this).removeClass("ui-state-hover"); 
			      });
		      
		      
		      // Check if any html w/in this.element, if so wrap it in <li> </li>
		      // and add to $kFooter later
		      var $userHtml = this.element
			  .children()
			  .appendTo($kFooter);
			  

		      $userHtml.wrap('<li class="left"></li>');

		      //get rid of userHtml
		      this.element.empty();
		      
		      this.element.append($kFooter);
		      
		  },
		  _refresh : function(){
		      this._score.text(this._n(this._getData('score')));
		      this._total.text(this._n(this._getData('total')));
		  },
		  /** Removes the kFooter widget and all related data from the DOM */
		  destroy : function(){
		      this.element.remove();
		      $.widget.prototype.destroy.apply(this, arguments);
		  }

		  
	      });

	      $.ui.kFooter.getter = ['getScore', 'getTotal', '_n', '_' ];

	      $.ui.kFooter.i18n = {};

		
		/** Default settings for the kFooter widget
		 * @namespace Default settings for the kFooter widget
		 * @extends $.ui.kFooter
		 */			   
	      $.ui.kFooter.defaults = {
                  /** Initial score
		   * @type Number 
		   * @default 0
		   */
		  score: 0, 
		  /** Initial total
		   * @type Number
		   * @default 0
		   */
		  total: 0, 
		  /** The score that will win the game
		   * @type Number
		   * @default 0
		   */
		  winningScore: 0,
		  /** Default locale, valid options are "en" and "ne" 
		   * @type String
		   * @default "en"
		   */
		  locale: "ne",
		  /** Display the scoreboard
		   * @type boolean
		   * @default true
		   */
		  scoreboard: true,
		  /** Display the Start Button
		   * @type boolean
		   * @default false
		   */
		  startButton: false,
		  /** Display the Retart Button
		   * @type boolean
		   * @default true
		   */
		  restartButton: true,
		  /** Display the Pause Button
		   * @type boolean
		   * @default false
		   */
		  pauseButton: false,
		  /** Display the timer
		   * @type boolean
		   * @default false
		   */
		  timer: false
	      };

 })(jQuery);
var Vue = require('vue');

var STOP = 0, START = 1, POSE = 2, TIMEOUT = 3, DEFAULT_TIME=300000;

var TimerComponent = Vue.extend({
  data: {
    limit: DEFAULT_TIME,
    _limit: DEFAULT_TIME,
    rest: DEFAULT_TIME,
    startTime: null,
    timer: null,
    state: STOP
  },
  computed: {
    time: function (){
      return this.minutes + ":" + this.seconds;
    },
    seconds: function (){
      var strsec,sec = Math.ceil((this.$data.rest / 1000) % 60);
      if (sec < 10){
        strsec = "0"+sec;
      } else {
        strsec = sec;
      }
      return strsec;
    },
    minutes: function (){
      var strmin,min = Math.ceil((this.$data.rest / 1000) / 60);
      if (min < 10){
        strmin = "0"+min;
      } else {
        strmin = min;
      }
      return strmin;
    }
  },
  methods: {
    getRest: function (){
      var vm = this;

      if (vm.state==START){
        vm.$data.rest = vm.$data.limit - (Date.now() - vm.$data.startTime);
        if (vm.$data.rest <= 0){
          vm.$data.state = TIMEOUT;
        }
      }
      
      return vm.$data.rest;
    },
    setTime: function (time){
      if(this.state!=STOP){
        this.reset();
      }
      return this.$data.limit = this.$data._limit = this.$data.rest = time;
    },
    start: function (time){
      var vm = this;

      if (vm.$data.state != START){
        vm.$data.state = START;
        vm.$data.startTime = Date.now();

        if (!vm.$data.timer){
          vm.$data.timer = setInterval(vm.getRest.bind(vm))
        }
      }

      return vm.$data.timer;
    },
    pose: function (){
      var vm = this;
      if (vm.$data.state==START){
        vm.$data.state = POSE;
        return vm.$data.limit = vm.getRest();
      }
      return vm.$data.limit;
    },
    reset: function (){
      var vm = this;
      vm.$data.state = STOP;
      clearInterval(vm.$data.timer);
      vm.$data.startTime = vm.$data.timer = null;
      return vm.$data.rest = vm.$data.limit = vm.$data._limit;
    }
  }
});

module.exports = TimerComponent;

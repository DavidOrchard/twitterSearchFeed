(function(e,t){if(!e)throw"jasmine library isn't loaded!";var n={};n.color_map={green:32,red:31},n.colorize_text=function(e,t){var n=this.color_map[t];return"["+n+"m"+e+"[0m"};var r=function(){if(!t||!t.log)throw"console isn't present!";this.status=this.statuses.stopped},i=r.prototype;i.statuses={stopped:"stopped",running:"running",fail:"fail",success:"success"},i.reportRunnerStarting=function(e){this.status=this.statuses.running,this.start_time=(new Date).getTime(),this.executed_specs=0,this.passed_specs=0,this.log("Starting...")},i.reportRunnerResults=function(e){var t=this.executed_specs-this.passed_specs,n=this.executed_specs+(this.executed_specs===1?" spec, ":" specs, "),r=t+(t===1?" failure in ":" failures in "),i=t>0?"red":"green",s=(new Date).getTime()-this.start_time;this.log(""),this.log("Finished"),this.log("-----------------"),this.log(n+r+s/1e3+"s.",i),this.status=t>0?this.statuses.fail:this.statuses.success,this.log(""),this.log("ConsoleReporter finished")},i.reportSpecStarting=function(e){this.executed_specs++},i.reportSpecResults=function(e){if(e.results().passed()){this.passed_specs++;return}var t=e.suite.description+" : "+e.description;this.log(t,"red");var n=e.results().getItems();for(var r=0;r<n.length;r++){var i=n[r].trace.stack||n[r].trace;this.log(i,"red")}},i.reportSuiteResults=function(e){if(!e.parentSuite)return;var t=e.results(),n=t.totalCount-t.passedCount,r=n>0?"red":"green";this.log(e.getFullName()+": "+t.passedCount+" of "+t.totalCount+" passed.",r)},i.log=function(e,r){var i=r!=undefined?n.colorize_text(e,r):e;t.log(i)},e.ConsoleReporter=r})(jasmine,console);
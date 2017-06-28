module.exports = requestTime;

function requestTime() {
   return function* requestTime(next) {
       const start = Date.now();
       yield* next;
       const delta = Math.ceil(Date.now() - start);
       // log all requests that take longer than 150ms
       if(delta > 150)
          console.log('Request took too long! ' + delta + 'ms: ' + this.request.method + ' ' + this.request.path);
     }
}

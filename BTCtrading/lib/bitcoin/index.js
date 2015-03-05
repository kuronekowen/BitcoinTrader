    var synaptic = require('synaptic'); // this line is not needed in the browser
var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;


 tPrices=[];
        tVol=[];
        tSenti=[];

        buyOrders=0;
        tBid=[];
        tAsk=[];
        tSpread =[];

        startingPot = 10000000;
        function btcEstimate(theNum, generations, callback){

            var options = {
                host: 'btc-maybe588.rhcloud.com',
                path: '/cloud/models/btc/minutePrices.php'
                };
                http.get(options, function (http_res) {

                 var data = "";

                // this event fires many times, each time collecting another piece of the response
                http_res.on("data", function (chunk) {
                    // append this chunk to our growing `data` var
                    data += chunk;
                });

                // this event fires *one* time, after all the `data` events/chunks have been gathered
                http_res.on("end", function () {
                    // you can use res.send instead of console.log to output via express
                   

                   runGuestimate(JSON.parse(data), theNum, generations, callback);
                   return;

                 });



            });



        }



        theNum1 = 0;
        generations1=0;
        callback1=0;

         function btcEstimate2(theNum, generations, callback){
            theNum1 = 0;
        generations1=0;
        callback1=0;

            mainData =[];
            var options = {
                host: 'btc-maybe588.rhcloud.com',
                path: '/cloud/models/btc/minutePrices.php'
                };
                http.get(options, function (http_res) {

                 var data = "";

                // this event fires many times, each time collecting another piece of the response
                http_res.on("data", function (chunk) {
                    // append this chunk to our growing `data` var
                    data += chunk;
                });

                // this event fires *one* time, after all the `data` events/chunks have been gathered
                http_res.on("end", function () {
                    // you can use res.send instead of console.log to output via express
                   

                  // runGuestimate2(JSON.parse(data), theNum, generations, callback);
                  mainData = JSON.parse(data);
                  theNum1 = theNum;
        generations1=generations;
       // callback1=callback;

                  download('http://btc-maybe588.rhcloud.com/cloud/models/btc/trainerCoin.php', trainingDataParse);
                   return;

                 });



            });



        }

        function trainingDataParse(theD){

            runGuestimate2(mainData, JSON.parse(theD), theNum1, generations1, callback1);

        }

        function runGuestimate(mData, theNum, generations, callback){
          //console.log('runGuestimate got called');
          // return;

            var plusMinusToggle = true;
            for(iteration =0; iteration< parseInt(generations*2); iteration++){
               // console.log("iteration="+iteration)

             tPrices=[];
        tVol=[];
        tSenti=[];

        buyOrders=0;

        startingPot = 10000000;

           // console.log(mData);


            var allPrices= mData['prices'].reverse();
          //  mData= allPrices;

                for(i in allPrices){

                        tPrices.push(parseFloat(allPrices[i]['current']));
                        tVol.push(parseFloat(allPrices[i]['volume']));      

                 }









                 var orders = {"past":[], "future":[], "return":0};

                 for(y=theNum; y<tPrices.length +theNum; y++ ){

                //y is today 
               var  multiple =1;
               var highestCorr = 0;
               var isBuying = false;

                //the for loop looks at this minute and next, then this minute and 2 mins... for each of these, if ther is a correlation greater than 9, then it makes that highest for parsing how we did
                for(u = 1; u<theNum; u++){
                    y = parseInt(y);

                    //for generations
                    var whereWeAt = u;
                    if(plusMinusToggle==true){
                          whereWeAt = u +iteration;

                    }

                    else{
                       whereWeAt = u -iteration;
                    }
                  

                    //for generations
                    var tStart= y-theNum;
                    var tEnd = y;

                    var res1 = outwayCorr(tVol, tPrices, whereWeAt, tStart, tEnd);

                   // var res2 = outwayCorr(tSenti, tPrices, u, tStart, tEnd);

                    var order = "nogo";
                    if(res1['correlation']>highestCorr){
                        if(res1['correlation']>.9 && res1['correlation'] <2 ){
                             //console.log("offest is"+ res1['offset'] + "at "+ res1['correlation'] + "with stat index of "+ tStart+ "and end index of "+ tEnd);
                            //console.log('found a buy');
                            isBuying=true;
                        }
                        else{
                            continue;
                        }
                       

                        highestCorr=res1['correlation'];

                        if(highestCorr > .99){
                            multiple=10000
                        }
                        else if(highestCorr > .95){
                            multiple=10000
                        }
                        else{
                            multiple = 300;
                        }
                       var thisOffest = res1['offset'];
                        //console.log("offset="+thisOffest)
                      var todaysPrice =  tPrices[y];

                       try{
                         var todaysDate1 = allPrices[y]['timestamp'];

                       }

                       catch(err){
                       // console.log('future dat?');
                        //the date we will be selling is always "today"

                         var todaysDate1 = y;
                         var timeDiff = y- tPrices.length;
                         var todaysDate1 = new Date();
                        todaysDate1.setMinutes(todaysDate1.getMinutes() + timeDiff);
                       }
                      
                     var  offsetDay = y - thisOffest ;
                     var   offsetDayAfter = y - thisOffest+1;
                        try{
                             var indicateDay = allPrices[offsetDayAfter]['timestamp'];
                       
                        }
                        catch(err){

                            var indicateDay = offsetDayAfter;
                             var timeDiff = offsetDayAfter- tPrices.length;
                        indicateDay = new Date();
                        indicateDay.setMinutes(indicateDay.getMinutes() + timeDiff);
                      
                       
                        }
                      //  console.log('indicate date='+ indicateDay)
                       var todaysDate = parseInt(y);

                        //determine win or loss
                        





                        //go to this offset in the data and
                        //look at direction of two values
                        //if is supposed to go up on next day, do a buy sell starting with this offset

                    }


                


                }

                if(isBuying ==false){
                    //console.log("skipping");
                    continue;
                }
                    if(tPrices[offsetDay] < tPrices[offsetDayAfter]){

                           var result3 = "won";
                        }
                        else{
                           var result3="lost";
                        }

                        if(result3=="lost" && res1['rel']== "diff"){
                          //console.log("buy");
                            buyOrders= buyOrders+1;
                            order="buy";
                        }
                         if(result3=="won" && res1['rel']== "same"){
                          // console.log("buy");
                            buyOrders= buyOrders+1;
                            order="buy";
                        }

                        if(order == "buy"){

                          var tomorrow=  todaysDate+1;
                          var today = todaysDate;

                            if(typeof(tPrices[tomorrow]) !="undefined"){

                                
                            
                           startingPot = startingPot-(tPrices[today]* multiple);
                           startingPot = startingPot+(tPrices[tomorrow] * multiple);
                          // console.log("bought at "+ multiple +" BTC at "+tPrices[today] + "on " +indicateDay );
                          // console.log("sold at "+ multiple +" BTC at "+tPrices[tomorrow] + " on " +todaysDate1 );
                           orders['past'].push({'buy':tPrices[todaysDate], 'sell':tPrices[tomorrow], 'buyTime':allPrices[today]['timestamp'], 'sellTime':allPrices[tomorrow]['timestamp'], 'period':whereWeAt });
                       }

                       else{

                        //echo this is for today!!!
                       // console.log("this is for today");
                       // console.log("time to buy is "+ indicateDay );
                       // console.log("time to sell is "+ todaysDate1 );
                           orders['future'].push({'buyTime':indicateDay, 'sellTime':todaysDate1, 'period':whereWeAt });
                    
                       }

                        }

                //look at last 40 days and find best correlation

                //go to the offset and place buy order day before and sell order day after

            }

            orders['return'] = (((startingPot/10000000)* 100)- 100)+"%";


            var whatWeDid = (startingPot/10000000);
           // console.log("we did... "+ whatWeDid)
            if(whatWeDid< 1){
              //  console.log('loss... need new generation... going to iteration #'+ iteration+1);

                //toggle the plus and minus to go both ways
                if(plusMinusToggle==true){
                          plusMinusToggle=false;

                    }

                    else{
                        plusMinusToggle=true;
                    }
            }
            else{
           //   console.log('jsonp')
                 btcGlobResp.send(callback+"("+JSON.stringify(orders)+")");
                return;
            }















        }



       // console.log('jsonp 1')

            btcGlobResp.send(callback+"("+JSON.stringify(orders)+")");
                
            return;
        }










//test
 //btcEstimate2(10 ,20, '');



        function runGuestimate2(mData, trainingData, theNum, generations, callback){
         

//console.log(trainingData);


        tPrices=[];

 //tVol is spread ratio
        tVol=[];
        tSenti=[];

        buyOrders=0;

        startingPot = 10000000;


        trSpreads = [];

           // console.log(mData);

            var allPrices= mData['prices'].reverse();
          //  mData= allPrices;

          
                for(i in allPrices){

                    var next = parseInt(i)+1;
                    // console.log("prices="+allPrices[next]['ask']);
                  //   console.log((sqrt(parseFloat(allPrices[next]['current']) /parseFloat(allPrices[i]['current']))*.5);)
                        try{
                        tPrices.push(Math.sqrt(parseFloat(allPrices[next]['bid']) /parseFloat(allPrices[i]['bid']))*.5);
                         tVol.push(parseFloat(allPrices[i]['bid']) /parseFloat(allPrices[i]['ask']));      
                    }
                    catch(err){
                        //console.log("end")
                    }
                 }



 //console.log('ttttt');

 //console.log(tVol);

               // console.log(tPrices);
          // create the network
          var inputLayer = new Layer(2);
          var hiddenLayer = new Layer(3);
          var outputLayer = new Layer(1);

          inputLayer.project(hiddenLayer);
          hiddenLayer.project(outputLayer);

          var myNetwork = new Network({
              input: inputLayer,
              hidden: [hiddenLayer],
              output: outputLayer
          });

// train the network

//.05 ... .057 is winner
          var learningRate = .001;
          var t = 0;
          for (var i = 0; i < 300000; i++)
          {
              // 0,0 => 0
              if(i==0){
                  console.log(trainingData['blocks']['buy'][t]['spreadBefore'].length);
              }
              if(t>=trainingData['blocks']['buy'].length){
                  t=0;

              }
          /*
              myNetwork.activate(trainingData['blocks']['buy'][t]['bidsRateBefore']);
              myNetwork.propagate(learningRate, [1]);

              // 0,1 => 1
               myNetwork.activate(trainingData['blocks']['dont'][t]['bidsRateBefore']);
              myNetwork.propagate(learningRate, [0]);

              */


                myNetwork.activate(trainingData['blocks']['buy'][t]['spreadBefore']);
              myNetwork.propagate(learningRate, [1]);

              // 0,1 => 1
               myNetwork.activate(trainingData['blocks']['dont'][t]['spreadBefore']);
              myNetwork.propagate(learningRate, [0]);

/*
    // 1,0 => 1
    myNetwork.activate([1,0]);
    myNetwork.propagate(learningRate, [1]);

    // 1,1 => 0
    myNetwork.activate([1,1]);
    myNetwork.propagate(learningRate, [0

        */
          t=t+1;
}


//get last 15 of bids

var happeningNow = tVol.slice((tVol.length-15), tVol.length);


//hour and half ago
//var happeningNow = tVol.slice((tVol.length-90), tVol.length-75);


//rando


//var happeningNow = tVol.slice((tPrices.length-75), tVol.length-60);

console.log('happening now...');
console.log(happeningNow);
console.log('should be 15... '+happeningNow.length);

// test the network
r = myNetwork.activate(happeningNow); // [0.015020775950893527]
//myNetwork.activate([0,1]); // [0.9815816381088985]
//myNetwork.activate([1,0]); // [0.9871822457132193]
//myNetwork.activate([1,1]); // [0.012950087641929467]
console.log('predicting...');
console.log(r);

if(r >= .5){

  console.log('thinking were going up!!');
  var key = 'v9z7Kloca21OPTSLnMF3CdzooPR1VcBO';
      var secret = 'FIXJr7WexG0Y4ncVRrWvSdQKYKQUz3zs';
      var client_id = 748136;
      var amount = .04;

      var theTrader= new trader(key, secret, client_id, amount);

      //this will do it
      theTrader.checkBenchMark();
}
else{


  console.log('not seeing buy... checking now to see if I am holding and should sell');
  var resp= {"status":"fail", "msg":"not seeing sell at lower than .5"};
            bitTradeResp.send(JSON.stringify(resp));
}




        }




















 





function LSTM(input, blocks, output)
{
    // create the layers
    var inputLayer = new Layer(input);
    var inputGate = new Layer(blocks);
    var forgetGate = new Layer(blocks);
    var memoryCell = new Layer(blocks);
    var outputGate = new Layer(blocks);
    var outputLayer = new Layer(output);

    // connections from input layer
    var input = inputLayer.project(memoryCell);
    inputLayer.project(inputGate);
    inputLayer.project(forgetGate);
    inputLayer.project(outputGate);

    // connections from memory cell
    var output = memoryCell.project(outputLayer);

    // self-connection
    var self = memoryCell.project(memoryCell, Layer.connectionType.ONE_TO_ONE);

    // peepholes
    memoryCell.project(inputGate,  Layer.connectionType.ONE_TO_ONE);
    memoryCell.project(forgetGate, Layer.connectionType.ONE_TO_ONE);
    memoryCell.project(outputGate, Layer.connectionType.ONE_TO_ONE);

    // gates
    inputGate.gate(input, Layer.gateType.INPUT);
    forgetGate.gate(self, Layer.gateType.ONE_TO_ONE);
    outputGate.gate(output, Layer.gateType.OUTPUT);

    // input to output direct connection
    inputLayer.project(outputLayer);

    // set the layers of the neural network
    this.set({
        input: inputLayer,
        hidden: hiddenLayers,
        output: outputLayer
    });
}

// extend the prototype chain
LSTM.prototype = new Network();
LSTM.prototype.constructor = LSTM;








function Perceptron(input, hidden, output)
{
    // create the layers
    var inputLayer = new Layer(input);
    var hiddenLayer = new Layer(hidden);
    var outputLayer = new Layer(output);

    // connect the layers
    inputLayer.project(hiddenLayer);
    hiddenLayer.project(outputLayer);

    // set the layers
    this.set({
        input: inputLayer,
        hidden: [hiddenLayer],
        output: outputLayer
    });
}

// extend the prototype chain
Perceptron.prototype = new Network();
Perceptron.prototype.constructor = Perceptron



         function playTradeDay(theNum, lossTol){

            tPrices=[];
             tVol=[];
            tSenti=[];

            //pair arrays to match dates in 2 arrays
            for(i in allPrices){

                for(j in allNews){

                    if(allNews[j]['dateT'].split(" ")[0] == allPrices[i]['tDate'].split(" ")[0]){

                        tPrices.push(parseFloat(allPrices[i]['avg']));
                        tVol.push(parseFloat(allPrices[i]['volume']));
                        tSenti.push(parseFloat(allNews[j]['sentiment']));

                    }
                }           

            }
           




             // start from 3 months out

            // find the best correlations...

            //look for a price hike... based on probablity trade

            //keep record of start balance and end balance


        }



            function outwayCorr(series11, series22, tries, start, end){

                var series1 = series11;
               var  series2=series22;
                 if(typeof tries == "undefined"){
                        var tries = 10;
                    }

                    if(typeof start == "undefined"){
                        var start = 0;
                    }

                    if(typeof end == "undefined"){
                        var end = (series1.length); console.log(end);
                    }
                  series1= series1.slice(start,end);
                    series2= series2.slice(start,end);

                    var highestCorr = 0;
                    var whichRel = "diff";
                    var bestOffset = 1;
                for(t= 1; t<= tries; t++ ){
                    var off= parseInt(t);
                    var theRes = determineCorr(series1, series2,off);
                    if(theRes['by'] > highestCorr){
                        highestCorr= theRes['by'];
                        whichRel= theRes['results'];
                        bestOffset = off;

                    }
                   
                }

                 return {"offset":bestOffset, "rel":whichRel, "correlation":highestCorr};
            }

            function determineCorr(series1, series2, offset){

              //  console.log('hmm');
                if(typeof offset == "undefined"){
                        offset = 1;
                    }
                //generate an array of when what
                var allCor= [];
                for( k in series1){
                   // console.log('going');
                    if(typeof series2[k] == "undefined"){
                        break;
                    }


                    k = parseInt(k);
                    var n = k+offset;

                    if(typeof series1[n] == "undefined"){
                        break;
                    }
                    var before1= series1[k];
                    var after1 = series1[n];

                     var before2= series2[k];
                    var after2 = series2[n];

                    var toAdd = whenWhat(before1, after1, before2, after2);
                    allCor.push(toAdd);


                }
               var result1 = getCorrelation(allCor);
                return result1;
            }

           function whenWhat( beforeF1, afterF1, beforeF2, afterF2){

                var whatHappend1 = "lost";
                var whatHappend2 = "lost";
                //
                if(beforeF1 >= afterF1){
                     whatHappend1 = "won";
                    //factor 1 increased or stayed same
                }
                else{
                    //factor 1 decreased
                     whatHappend1 = "lost";
                }

                 if(beforeF2 >= afterF2){
                     whatHappend2 = "won";
                    //factor 2 increased or stayed same
                }
                else{
                     whatHappend2 = "lost";
                    //factor 1 decreased
                }

                return [whatHappend1, whatHappend2];

            }

            //66 percent correlation
            [['won', 'won'],['won', 'won'],['won', 'lost']]

            function getCorrelation(arr1){
                var results = [];
                for(i in arr1){

                    if(arr1[i][0] == arr1[i][1]){
                        results.push("same");
                    }
                    else{

                          results.push("diff");
                    }
                }
                var sameNum=0;
                var diffNum = 0;
                var all = results.length;

                for( j in results){
                    if(results[j]=="same"){
                        sameNum= sameNum +1;
                    }
                    else{
                        diffNum = diffNum+1;
                    }
                }

                if(diffNum>= sameNum){
                    return {results:"diff", "by":(diffNum/all)}
                }

                else{
                    return {results:"same", "by":(sameNum/all)}
                }
            }



/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const AWS = require("aws-sdk");
const ddbAdapter = require('ask-sdk-dynamodb-persistence-adapter');
const dynamola = require('dynamola');
let myDb = new dynamola("names", "id", null);

const helper = require('./helper');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
 //       const attributesManager = handlerInput.attributesManager;
   //     try {
            //const attributes = await attributesManager.getPersistentAttributes() || {};
            //console.log('attributes is: ', attributes);
            
            //const counter = await attributes.hasOwnProperty('counter') ? attributes.counter : 0;
            
            //const speakOutput = `Hello! Welcome to Connection Database. We can connect to your database `;
            
//            return handlerInput.responseBuilder
  //              .speak(speakOutput)
    //            .reprompt(speakOutput)
      //          .getResponse();
//        } catch(e) {
  //          console.log('Error: ', e);
            
    //        const speakOutput = `Sorry, I encountered an error while handling your request. ${e}`;
            
      //      return handlerInput.responseBuilder
        //        .speak(speakOutput)
          //      .reprompt(speakOutput)
                //.getResponse();
        //}
        
        await myDb.getItem(1).then((data) => {
    if(!data){
          console.log('Error: no existe' );
            
            const speakOutput = `no existe`;
            
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
    }
    else {
            console.log('attributes is: ', data);
        
            const speakOutput = `Hello! Welcome to Connection Database. We can connect to your database ${data}`;
            
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
    }
})
.catch((e) => {
     console.log('Error: ', e);
            
            const speakOutput = `Sorry, I encountered an error while handling your request. ${e}`;
            
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
});
    }
    
}
       


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
    
};

//const SessionEndedRequestHandler = {
    //async handle(handlerInput){

    //const attributesManager = handlerInput.attributesManager;
//    const attributes = await attributesManager.getPersistentAttributes() || {};
    //console.log('attributes is: ', attributes);

    //const counter = attributes.hasOwnProperty('counter')? attributes.counter : 0;

//    let speechOutput = `Hi there, Hello World! Your counter is ${counter}`;

  //  return handlerInput.responseBuilder
//        .speak(speechOutput)
      //  .getResponse();
    //}
//}


const GetServiceIntentHandler = {
    canHandle(handlerInput) {
         return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' 
          && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetData';
    },
    handle(handlerInput) {
        
        var service;
        var resolvedService;
        var serviceSlot;
    
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        serviceSlot = Alexa.getSlot(handlerInput.requestEnvelope, "service");
        service = serviceSlot.value;

        //service = helper.getSpokenWords(handlerInput, "service");
        resolvedService = helper.getResolvedWords(handlerInput, "service");

        var speakOutput = "";

        if (resolvedService) {
        
        var selectedService = resolvedService[0].value.name
        
        speakOutput = `I heard you say that you want know ${selectedService}. `
        if (selectedService === "name") {
         speakOutput += `We offer all names of our database`;
         }
        //if (selectedService === "vet") {
        // speakOutput += `We offer vaccinations and checkups. `;
        // }
        //if (selectedService === "trainer") {
         //speakOutput += `We offer beginner, intermediate, and advanced obedience training. `;
         //}
         speakOutput += "Which service are you interested in?";
         
         const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
         
         sessionAttributes.selectedService = selectedService;
         
         handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        }

         else {
             speakOutput = `I heard you say ${service}. I don't offer that service. Choose from dog training, dog walking, or veterinary care.`;
         }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};



/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
   handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
          .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        GetServiceIntentHandler,
        IntentReflectorHandler)
    .addErrorHandlers(ErrorHandler)
//    .withCustomUserAgent('sample/hello-world/v1.2')
    .withPersistenceAdapter(
        new ddbAdapter.DynamoDbPersistenceAdapter({
            tableName: 'name',
            createTable: false,
            dynamoDBClient: new AWS.DynamoDB({apiVersion: '2.637.0', region: 'us-east-1'})
        })
    )
    .lambda();
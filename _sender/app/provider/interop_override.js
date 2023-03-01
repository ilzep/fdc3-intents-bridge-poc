import {getAppsByIntent} from './apps.js';
import {getIntent} from './intent.js';
import {launchWindow} from './launch_window.js';

const NO_APPS_FOUND = 'NoAppsFound';
export function interopOverride(InteropBroker, provider, options, ...args) {
    class InteropOverride extends InteropBroker {

        clientBus;

        async handleInfoForIntent(intentOptions, clientIdentity) {
            console.info(`[handleInfoForIntent]`);

            const result = await getIntent(
                intentOptions.name,
                intentOptions.context?.type
            );

            if (result === null) {
                throw new Error(NO_APPS_FOUND);
            }

            const response = {
                intent: result.intent,
                apps: result.apps.map((app) => {
                    const appEntry = {
                        name: app.appId,
                        appId: app.appId,
                        title: app.title,
                    };
                    return appEntry;
                }),
            };

            return response;
        }

        async handleFiredIntent(intent) {
            console.info(`[handleFiredIntent] intent: ${JSON.stringify(intent)}`);
    
            let intentApps = await getAppsByIntent(intent.name);
    
            if (intentApps.length === 0) {
                console.info(`[handleFiredIntent] No apps support this intent`);
                throw new Error(NO_APPS_FOUND);
            }

            console.log(`[handleFiredIntent] apps ${JSON.stringify(intentApps)}`);
            
            //only handle first app for this example
            const intentApp = intentApps[0]; 
            let intentResolver;

            if(intentApp.appId === 'matrix') {
                intentResolver = await this.sendMessageOverBridge(
                    intentApp,
                    intent
                );
            } else {
                intentResolver = await this.launchAppWithIntent(
                    intentApp,
                    intent
                );
            }
            
    
            if (intentResolver === null) {
                throw new Error('No Intent Resolver found');
            }
    
            return intentResolver;
        }

        // open an app on the same platform
        async launchAppWithIntent(app, intent) {
            console.info(`[launchAppWithIntent], app: ${JSON.stringify(app)}`);
            console.info(`[launchAppWithIntent], intent: ${JSON.stringify(intent)}`);

            //const identity = await launchApp(app);
            const identity = await launchWindow(app);

            console.info(
                `[launchAppWithIntent] app launched, identity: ${JSON.stringify(
                identity
                )}`
            );

            await super.setIntentTarget(intent, identity);

            return {
                source: app.appId,
                version: app.version,
            };
        }

        // send messages over a bridge to a different platform
        async sendMessageOverBridge(app, intent) {
            console.info(`[sendMessageOverBridge], app: ${JSON.stringify(app)}`);
            console.info(`[sendMessageOverBridge], intent: ${JSON.stringify(intent)}`);

            const clientBus = await fin.InterApplicationBus.Channel.connect('currencyPairChannel', {payload: 'auth_token'});
            const response = await clientBus.dispatch('sendCurrencyPair', intent);
            // const response = await clientBus.send('','sendCurrencyPair', intent);
            console.info(`[sendMessageOverBridge], response: ${JSON.stringify(response)}`);
            return {
                source: app.appId,
                version: app.version,
            };
        }
    }

    
    return new InteropOverride(provider, options, ...args);
  }
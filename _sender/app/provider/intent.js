import {getApps} from './apps.js';


export async function getIntent(intent, contextType) {
    const apps = await getApps();
    let intents = {};

    if (Array.isArray(apps)) {
      for (const value of apps) {
        if (value.intents !== undefined) {
          for (let i = 0; i < value.intents.length; i++) {
            if (value.intents[i].name === intent) {
              if (contextType === undefined) {
                intents = updateEntry(intents, value.intents[i], value);
              } else if (
                Array.isArray(value.intents[i].contexts) &&
                value.intents[i].contexts.includes(contextType)
              ) {
                intents = updateEntry(intents, value.intents[i], value);
              }
            }
          }
        }
      }

      const results = Object.values(intents);
      if (results.length === 0) {
        console.info(
          `[getIntent] No results found for findIntent for intent ${intent} and context ${contextType}`
        );
        return null;
      } else if (results.length === 1) {
        return results[0];
      }
      console.warn(
        `[getIntent] Received more than one result for findIntent for intent ${intent} and context ${contextType}. Returning the first entry.`
      );
      return results[0];
    }
    console.warn(
      `[getIntent] There was no apps returned so we are unable to find apps that support an intent`
    );
    return null;
  }

  function updateEntry(source, intent, app) {
    if (source[intent.name] === undefined) {
      source[intent.name] = {
        intent: {
          name: intent.name,
          displayName: intent.displayName,
        },
        apps: [],
      };
    }
    source[intent.name].apps.push(app);
    return source;
  }

export async function getApps() {
    console.info(`[getApps] Requesting apps`);
    return [
      {
        appId: 'matrix',
        name: 'matrix',
        manifestType: 'openfin',
        title: 'platform_sender',
        description: 'platform_sender',
        images: [],
        contactEmail: 'support@openfin.co',
        supportEmail: 'support@openfin.co',
        publisher: 'openfin',
        icons: [],
        intents: [
            {
                name: 'ViewInstrument',
                displayName: 'View Instrument',
                contexts: ['fdc3.instrument'],
              },
        ],
      },
      {
        appId: 'platform_receiver',
        name: 'platform_receiver',
        manifest: 'http://localhost:4000/_sender/app/receiver.json',
        manifestType: 'openfin',
        title: 'platform_receiver',
        description: 'platform_receiver',
        images: [],
        contactEmail: 'support@openfin.co',
        supportEmail: 'support@openfin.co',
        publisher: 'openfin',
        icons: [],
        intents: [
          {
            name: 'ViewChart',
            displayName: 'View Chart',
            contexts: ['fdc3.instrument'],
        },
        ],
      },
    ];
  }

  export async function getAppsByIntent(intent) {
    const apps = await getApps();

    const filteredApps = apps.filter((value) => {
      if (value.intents === undefined) {
        return false;
      }

      for (let i = 0; i < value.intents.length; i++) {
        if (value.intents[i].name.toLowerCase() === intent.toLowerCase()) {
          return true;
        }
      }

      return false;
    });

    return filteredApps;
  }

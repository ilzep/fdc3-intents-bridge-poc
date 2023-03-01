export async function getApps() {
    console.info(`[getApps] Requesting apps`);
    return [
      {
        appId: 'matrix',
        name: 'matrix',
        manifest: 'http://localhost:4000/_receiver/app/receiver.json',
        manifestType: 'openfin',
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
        appId: 'platform_sender2',
        name: 'platform_sender2',
        manifest: 'http://localhost:4000/_sender/app/sender2.json',
        manifestType: 'openfin',
        title: 'platform_sender2',
        description: 'platform_sender2',
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
          {
            name: 'ViewContact',
            displayName: 'View Contact',
            contexts: ['fdc3.instrument'],
          },
        ],
      },
      {
        appId: 'platform_sender3',
        name: 'platform_sender3',
        manifest: 'http://localhost:4000/_sender/app/sender2.json',
        manifestType: 'openfin',
        title: 'platform_sender3',
        description: 'platform_sender3',
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
          {
            name: 'ViewContact',
            displayName: 'View Contact',
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

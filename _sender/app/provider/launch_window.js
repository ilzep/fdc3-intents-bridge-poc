export async function doesWindowExist(name, uuid) {
    const win = fin.Window.wrapSync({ name, uuid });
    let exists = false;

    try {
      await win.getInfo();
      exists = true;

      if (await win.isShowing()) {
        await win.bringToFront();
      }
    } catch {
      exists = false;
    }

    return exists; 
  }

  export async function launchWindow(windowApp) {
    if (windowApp === undefined || windowApp === null) {
      console.warn(`[launchWindow] No app was passed to launchWindow`);
      return null;
    }

    let manifest;

    const manifestResponse = await fetch(windowApp.manifest);
    manifest = await manifestResponse.json();

    manifest = {
      fdc3InteropApi: manifest.platform.defaultWindowOptions.fdc3InteropApi,
      url: manifest.snapshot.windows[0].url,
      name: manifest.snapshot.windows[0].name,
    };

    const name = manifest.name;
    let identity = { uuid: fin.me.identity.uuid, name };
    const wasNameSpecified = name !== undefined;
    let windowExists = false;

    if (wasNameSpecified) {
      windowExists = await doesWindowExist(identity.name, identity.uuid);
    } else {
      manifest.name = `classic-window-${randomUUID()}`;
      identity.name = manifest.name;
    }

    if (!windowExists) {
      try {
        const createdWindow = await fin.Window.create(manifest);
        identity = createdWindow.identity;
      } catch (err) {
        console.error(`[launchWindow] Error launching window: ${err}`);
        return null;
      }
    }
    return identity;
  }

  function randomUUID() {
    const getRandomHex = (c) =>
      (
        c ^
        (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16);
    return '10000000-1000-4000-8000-100000000000'.replace(
      /[018]/g,
      getRandomHex
    );
  }
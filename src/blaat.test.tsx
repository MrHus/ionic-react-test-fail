import {
  IonApp,
  IonBadge,
  IonRouterOutlet,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { mockIonicReact, waitForIonicReact } from '@ionic/react-test-utils';
import { act, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Route } from 'react-router-dom';

setupIonicReact();
mockIonicReact();

describe('A random component', () => {
  it('This test fails due to PrettyFormatPluginError: Invalid string length', async () => {
    console.log(1);

    // Scenario A: this one causes the infinite loop
    render(
      <IonApp>
        <IonReactRouter history={createMemoryHistory()}>
          <IonRouterOutlet>
            <Route path="/">
              <IonBadge color="primary">Hello world!</IonBadge>
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    );

    // Scenario B: this one causes a very large FiberNode to be rendered, which
    // is not human readable. Perhaps this is the source of the problem?
    // render(<IonBadge color="primary">Hello world!</IonBadge>);

    console.log(2);

    await act(async () => {
      await waitForIonicReact();
    });

    console.log(3);

    // This assertion is just so the test fails
    await screen.findAllByText('This string should not be findable.');

    /*
      When the `screen.findAllByText` fails, @testing-library/react
      will attempt to render the `screen`. It does so by calling a
      library called `pretty-format` with a custom formatter, which
      job it is to render the current screen in a human readable way.

      For some reason `ionic` puts this mechanism in an infinite loop,
      
      If you manually change the `printObjectProperties` function at
      `node_modules/pretty-format/build/collections.js` and add some
      logs, you can see how many times it is called.  
    */
  });
});

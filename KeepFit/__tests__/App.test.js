import React from 'react';
import renderer from 'react-test-renderer';

import App from '../src/index';

describe('<App />', () => {
  it('App renders properly without error, has 1 child', async () => {
    jest.useFakeTimers()
    console.warn = () => {};
    const tree = await renderer.create(<App />).toJSON();
    expect(tree.children.length).toBe(1);
  });
});

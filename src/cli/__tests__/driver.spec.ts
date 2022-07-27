import {Driver} from '../driver';

describe('Driver', () => {
  it('loads configuration file correctly', async () => {
    const driver = new Driver();
    const configuration = await driver.loadConfiguration('fixtures/imports/correct-config.js');
    expect(configuration).toBeDefined();
  });

  it('raises an error and exits on missing configuration', async () => {
    const driver = new Driver();
    expect(async () => {
      await driver.loadConfiguration('fixtures/imports/incorrect-config.js');
    }).rejects.toThrowError();
  });
});

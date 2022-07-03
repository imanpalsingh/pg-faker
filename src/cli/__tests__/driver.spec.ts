import {Driver} from '../driver';

describe('Driver', () => {
  it('loads configuration file correctly', async () => {
    const driver = new Driver();
    const configuration = await driver.loadConfiguration('fixtures/imports/correct-config.js');
    expect(configuration).toBeDefined();
  });

  it('raises an error and exits on missing configuration', async () => {
    const driver = new Driver();
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    await driver.loadConfiguration('fixtures/imports/incorrect-config.js');
    expect(mockExit).toBeCalled();
  });
});

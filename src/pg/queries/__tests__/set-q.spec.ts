import { SetQ } from '../set-q';

describe("Set q", () => {

  const query = `SET idle_in_transaction_session_timeout = 0;`;

  it("Identifies correct queries", () => {
    const matcher = new SetQ()
    expect(matcher.match(query)).not.toHaveLength(0);
  })
})

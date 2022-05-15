import { Select } from '../select';


describe("Select", () => {

  const query = `SELECT pg_catalog.set_config('search_path', '', false);`;

  it("Identifies correct queries", () => {
    const matcher = new Select()
    expect(matcher.match(query)).not.toHaveLength(0);
  })
})

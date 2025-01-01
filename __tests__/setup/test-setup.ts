import { clearTestDb, connectTestDb, disconnectTestDb } from "../api/helpers/db";


beforeAll(async () => {
  await connectTestDb();
});

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

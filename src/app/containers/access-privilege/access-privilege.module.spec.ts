import { AccessPrivilegeModule } from './access-privilege.module';

describe('AccessPrivilegeModule', () => {
  let accessPrivilegeModule: AccessPrivilegeModule;

  beforeEach(() => {
    accessPrivilegeModule = new AccessPrivilegeModule();
  });

  it('should create an instance', () => {
    expect(accessPrivilegeModule).toBeTruthy();
  });
});

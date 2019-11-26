import { AuditModule } from './audit.module';

describe('AuditModule', () => {
  let auditModule: AuditModule;

  beforeEach(() => {
    auditModule = new AuditModule();
  });

  it('should create an instance', () => {
    expect(auditModule).toBeTruthy();
  });
});

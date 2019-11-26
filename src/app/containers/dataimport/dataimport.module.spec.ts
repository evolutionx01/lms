import { DataimportModule } from './dataimport.module';

describe('DataimportModule', () => {
  let dataimportModule: DataimportModule;

  beforeEach(() => {
    dataimportModule = new DataimportModule();
  });

  it('should create an instance', () => {
    expect(dataimportModule).toBeTruthy();
  });
});

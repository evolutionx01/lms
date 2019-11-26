import { CaqhModule } from './caqh.module';

describe('CaqhModule', () => {
  let caqhModule: CaqhModule;

  beforeEach(() => {
    caqhModule = new CaqhModule();
  });

  it('should create an instance', () => {
    expect(caqhModule).toBeTruthy();
  });
});

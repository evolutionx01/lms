import { DatauploadModule } from './dataupload.module';

describe('DatauploadModule', () => {
  let datauploadModule: DatauploadModule;

  beforeEach(() => {
    datauploadModule = new DatauploadModule();
  });

  it('should create an instance', () => {
    expect(datauploadModule).toBeTruthy();
  });
});

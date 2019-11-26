import { FormGroupModule } from './form-group.module';

describe('FormGroupModule', () => {
  let formGroupModule: FormGroupModule;

  beforeEach(() => {
    formGroupModule = new FormGroupModule();
  });

  it('should create an instance', () => {
    expect(formGroupModule).toBeTruthy();
  });
});

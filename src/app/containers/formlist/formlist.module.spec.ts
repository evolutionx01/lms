import { FormlistModule } from './formlist.module';

describe('FormlistModule', () => {
  let formlistModule: FormlistModule;

  beforeEach(() => {
    formlistModule = new FormlistModule();
  });

  it('should create an instance', () => {
    expect(formlistModule).toBeTruthy();
  });
});

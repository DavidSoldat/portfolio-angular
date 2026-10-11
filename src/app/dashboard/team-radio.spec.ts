import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TeamRadio } from './team-radio';

async function setup() {
  TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
  const fixture = TestBed.createComponent(TeamRadio);
  await fixture.whenStable();
  const el = fixture.nativeElement as HTMLElement;
  const http = TestBed.inject(HttpTestingController);
  const type = (sel: string, value: string) => {
    const input = el.querySelector(sel) as HTMLInputElement | HTMLTextAreaElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };
  const submit = async () => {
    (el.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    await fixture.whenStable();
  };
  return { fixture, el, http, type, submit };
}

describe('TeamRadio', () => {
  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('shows field errors and sends nothing when submitted empty', async () => {
    const { el, submit } = await setup();
    await submit();
    expect(el.querySelector('#err-name')?.textContent).toContain('Enter your name.');
    expect(el.querySelector('#err-email')).toBeTruthy();
    expect(el.querySelector('#err-message')).toBeTruthy();
  });

  it('posts a valid message and shows the sent state', async () => {
    const { el, http, type, submit, fixture } = await setup();
    type('input[name="name"]', 'Ana');
    type('input[name="email"]', 'ana@example.com');
    type('textarea[name="message"]', 'Hello David, are you available?');
    await submit();
    expect(el.querySelector('button[type="submit"]')?.textContent).toContain('Sending');
    const req = http.expectOne('/api/contact');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Ana', email: 'ana@example.com', message: 'Hello David, are you available?', website: '' });
    req.flush({ ok: true });
    await fixture.whenStable();
    expect(el.querySelector('[role="status"]')?.textContent).toContain("I'll reply to ana@example.com");
  });

  it('shows the error message with the email fallback when the server fails', async () => {
    const { el, http, type, submit, fixture } = await setup();
    type('input[name="name"]', 'Ana');
    type('input[name="email"]', 'ana@example.com');
    type('textarea[name="message"]', 'Hello David, are you available?');
    await submit();
    http.expectOne('/api/contact').flush({ error: 'x' }, { status: 502, statusText: 'Bad Gateway' });
    await fixture.whenStable();
    expect(el.querySelector('[role="alert"]')?.textContent).toContain('davidsoldat00@gmail.com');
  });
});

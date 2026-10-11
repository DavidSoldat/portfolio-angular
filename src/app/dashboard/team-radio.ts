import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContactErrors, ContactField, validateContact } from '../../shared/contact';
import { PROFILE } from '../content/profile';

type Status = 'idle' | 'sending' | 'sent' | 'error';

@Component({
  selector: 'app-team-radio',
  imports: [ReactiveFormsModule],
  host: { class: 'block' },
  template: `
    <section class="flex h-full flex-col gap-3 border border-t-4 border-line border-t-yellow bg-panel px-[18px] py-4" aria-labelledby="radio-h">
      <div class="flex items-center gap-3">
        <svg width="40" height="24" viewBox="0 0 40 24" aria-hidden="true">
          <path class="fill-none stroke-yellow stroke-2" stroke-linejoin="round" d="M2 12h4l3-8 4 16 4-12 3 6 3-2h4l3-6 3 10 2-4h3" />
        </svg>
        <h2 id="radio-h" class="disp text-2xl font-extrabold">Team radio</h2>
      </div>
      @if (status() === 'sent') {
        <p role="status" class="text-[15px] text-[#b8f5cb]">Message sent. I'll reply to {{ sentTo() }}.</p>
        <button type="button" class="btn btn-ghost self-start" (click)="status.set('idle')">Send another message</button>
      } @else {
        <p class="text-[15px] text-soft">Got a role or a project in mind? Send a message and it lands in my inbox.</p>
        <form class="flex flex-col gap-2.5" [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <label class="field">Name
              <input name="name" formControlName="name" autocomplete="name"
                     [attr.aria-invalid]="!!shown('name')" [attr.aria-describedby]="shown('name') ? 'err-name' : null" />
              @if (shown('name'); as e) { <span id="err-name" class="err">{{ e }}</span> }
            </label>
            <label class="field">Email
              <input name="email" type="email" formControlName="email" autocomplete="email"
                     [attr.aria-invalid]="!!shown('email')" [attr.aria-describedby]="shown('email') ? 'err-email' : null" />
              @if (shown('email'); as e) { <span id="err-email" class="err">{{ e }}</span> }
            </label>
          </div>
          <label class="field">Message
            <textarea name="message" rows="3" class="resize-y" formControlName="message"
                      [attr.aria-invalid]="!!shown('message')" [attr.aria-describedby]="shown('message') ? 'err-message' : null"></textarea>
            @if (shown('message'); as e) { <span id="err-message" class="err">{{ e }}</span> }
          </label>
          <!-- Honeypot: hidden from people and assistive tech, bots fill it in. -->
          <label class="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">Leave this empty
            <input name="hp_trap" formControlName="hp_trap" tabindex="-1" autocomplete="off" />
          </label>
          <button type="submit" class="btn btn-yellow self-start" [disabled]="status() === 'sending'">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path class="fill-ground" d="M1 8 15 1 11 15 8 9z" /></svg>
            {{ status() === 'sending' ? 'Sending…' : 'Send message' }}
          </button>
          @if (status() === 'error') {
            <p role="alert" class="err">Couldn't send the message. Try again or email {{ email }}.</p>
          }
        </form>
      }
    </section>
  `,
  styles: `
    .field { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: var(--color-muted); }
    .field input, .field textarea {
      width: 100%; min-height: 44px; padding: 10px 12px; font: inherit; font-size: 15px;
      color: var(--color-text); background: var(--color-deep); border: 1px solid var(--color-line-2);
    }
    [aria-invalid='true'] { border-color: #ff6b6b !important; }
    .err { font-size: 13px; color: #ff9b9b; }
  `,
})
export class TeamRadio {
  private readonly http = inject(HttpClient);
  protected readonly email = PROFILE.email;
  protected readonly status = signal<Status>('idle');
  protected readonly sentTo = signal('');
  private readonly submitted = signal(false);

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true }),
    message: new FormControl('', { nonNullable: true }),
    hp_trap: new FormControl('', { nonNullable: true }),
  });

  private errors(): ContactErrors {
    const r = validateContact(this.form.getRawValue());
    return r.ok ? {} : r.errors;
  }

  protected shown(field: ContactField): string | undefined {
    const touched = this.form.controls[field].touched || this.submitted();
    return touched ? this.errors()[field] : undefined;
  }

  protected submit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    const result = validateContact(this.form.getRawValue());
    if (!result.ok || this.status() === 'sending') return;
    this.status.set('sending');
    this.http.post('/api/contact', this.form.getRawValue()).subscribe({
      next: () => {
        this.sentTo.set(result.value.email);
        this.status.set('sent');
        this.form.reset();
        this.submitted.set(false);
      },
      error: () => this.status.set('error'),
    });
  }
}

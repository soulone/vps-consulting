import { Component, signal, afterNextRender, DestroyRef, inject, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('VPS Consulting');
  private readonly destroyRef = inject(DestroyRef);
  private lastScrollY = 0;
  private fabOpen = false;

  @HostListener('window:scroll')
  onScroll() {
    const nav = document.getElementById('main-nav');
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 10);

    const fab = document.getElementById('whatsapp-fab');
    if (!fab) return;
    const currentY = window.scrollY;
    if (currentY > this.lastScrollY && currentY > 200) {
      fab.classList.add('fab-hidden');
    } else {
      fab.classList.remove('fab-hidden');
    }
    this.lastScrollY = currentY;
  }

  constructor() {
    afterNextRender(() => {
      this.initReveals();
      this.initFab();
    });
  }

  private initFab() {
    const btn = document.getElementById('fab-btn');
    const fab = document.getElementById('whatsapp-fab');
    if (!btn || !fab) return;

    btn.addEventListener('click', () => {
      this.fabOpen = !this.fabOpen;
      fab.classList.toggle('fab-open', this.fabOpen);
      const icon = document.getElementById('fab-icon');
      if (icon) icon.className = this.fabOpen ? 'ph ph-x text-xl' : 'ph ph-chat-circle-dots text-xl';
    });

    document.addEventListener('click', (e) => {
      if (this.fabOpen && !fab.contains(e.target as Node)) {
        this.fabOpen = false;
        fab.classList.remove('fab-open');
        const icon = document.getElementById('fab-icon');
        if (icon) icon.className = 'ph ph-chat-circle-dots text-xl';
      }
    });
  }

  private initReveals() {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    const targets = document.querySelectorAll('.reveal');
    for (const el of targets) {
      observer.observe(el);
    }

    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}

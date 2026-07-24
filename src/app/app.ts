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

  @HostListener('window:scroll')
  onScroll() {
    const nav = document.getElementById('main-nav');
    if (nav) {
      nav.classList.toggle('is-scrolled', window.scrollY > 10);
    }
  }

  constructor() {
    afterNextRender(() => {
      this.initReveals();
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

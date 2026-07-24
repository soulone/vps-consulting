import { Component, signal, afterNextRender, DestroyRef, inject } from '@angular/core';
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
  private rafId = 0;

  constructor() {
    afterNextRender(() => {
      this.initNavScroll();
      this.initReveals();
    });
  }

  private initNavScroll() {
    const check = () => {
      const nav = document.getElementById('main-nav');
      if (!nav) { setTimeout(check, 100); return; }

      const onScroll = () => {
        nav.classList.toggle('is-scrolled', window.scrollY > 10);
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); // ejecutar al inicio
      this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
    };

    setTimeout(check, 50);
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

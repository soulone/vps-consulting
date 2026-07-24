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
  private megaOpen = false;

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
      this.initMega();
      this.initParallax();
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
      if (icon) {
        icon.className = this.fabOpen ? 'ph ph-x text-xl' : 'ph ph-chat-circle-dots text-xl';
        icon.style.color = '#194669';
      }
    });
  }

  private initParallax() {
    const mockup = document.getElementById('app-mockup');
    if (!mockup) return;

    const cards = mockup.querySelectorAll('.hidden.lg\\:block .floating-ui') as NodeListOf<HTMLElement>;

    mockup.addEventListener('mousemove', (e) => {
      const rect = mockup.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      cards.forEach((card) => {
        const speed = parseFloat(card.dataset['speed'] || '0.05');
        const moveX = x * speed * 40;
        const moveY = y * speed * 40;
        card.style.transform = `translate(${moveX}px, ${moveY}px)`;
        card.style.transition = 'transform 0.2s ease-out';
      });
    });

    mockup.addEventListener('mouseleave', () => {
      cards.forEach((card) => {
        card.style.transform = 'translate(0, 0)';
      });
    });

    let editMode = false;
    let dragTarget: HTMLElement | null = null;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0;

    const toggleBtn = document.getElementById('edit-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        editMode = !editMode;
        cards.forEach((card) => {
          card.style.outline = editMode ? '2px dashed var(--color-signal)' : '';
          card.style.cursor = editMode ? 'grab' : '';
        });
        toggleBtn.style.color = editMode ? 'var(--color-signal)' : '';
        toggleBtn.style.borderColor = editMode ? 'var(--color-signal)' : '';
        console.log(editMode ? '✏️ Edit mode ON' : '✏️ Edit mode OFF');
      });
    }

    mockup.addEventListener('mousedown', (e) => {
      if (!editMode) return;
      const target = (e.target as HTMLElement).closest('.floating-ui') as HTMLElement;
      if (!target) return;
      e.preventDefault();
      dragTarget = target;
      startX = e.clientX;
      startY = e.clientY;

      // Read initial percentage from inline style or convert computed px to %
      if (target.style.left) {
        startLeft = parseFloat(target.style.left); // already %
      } else if (target.style.right) {
        startLeft = -parseFloat(target.style.right); // already %, negate
      } else {
        const cs = getComputedStyle(target);
        if (cs.left !== 'auto') {
          startLeft = parseFloat(cs.left) / mockup.offsetWidth * 100;
        } else {
          startLeft = -(parseFloat(cs.right) / mockup.offsetWidth * 100);
        }
      }
      
      if (target.style.top) {
        startTop = parseFloat(target.style.top); // already %
      } else {
        startTop = parseFloat(getComputedStyle(target).top) / mockup.offsetHeight * 100 || 0;
      }
      target.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!editMode || !dragTarget) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const rect = mockup.getBoundingClientRect();

      if (dragTarget.style.left) {
        const newLeft = Math.max(-15, Math.min(95, startLeft + dx / rect.width * 100));
        dragTarget.style.left = newLeft + '%';
        dragTarget.style.right = '';
      } else {
        const newRight = Math.max(-15, Math.min(95, -startLeft - dx / rect.width * 100));
        dragTarget.style.right = newRight + '%';
        dragTarget.style.left = '';
      }
      dragTarget.style.top = Math.max(-15, Math.min(95, startTop + dy / rect.height * 100)) + '%';
    });

    window.addEventListener('mouseup', () => {
      if (dragTarget) {
        dragTarget.style.cursor = 'grab';
        const xProp = dragTarget.style.left ? `left: ${dragTarget.style.left}` : `right: ${dragTarget.style.right}`;
        console.log(`📍 ${xProp}; top: ${dragTarget.style.top};`);
        dragTarget = null;
      }
    });
  }

  private initMega() {
    const trigger = document.getElementById('mega-link');
    const panel = document.querySelector('.mega-panel') as HTMLElement;
    const backdrop = document.getElementById('mega-backdrop');
    if (!trigger || !panel || !backdrop) return;

    const toggleMega = (open: boolean) => {
      this.megaOpen = open;
      panel.classList.toggle('mega-open', open);
      backdrop.classList.toggle('hidden', !open);
    };

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMega(!this.megaOpen);
    });

    backdrop.addEventListener('click', () => toggleMega(false));
    document.addEventListener('click', (e) => {
      if (this.megaOpen && !trigger.parentElement!.contains(e.target as Node) && !panel.contains(e.target as Node)) {
        toggleMega(false);
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

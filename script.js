// ===== MAA Landing Page — Interactive Logic =====
document.addEventListener('DOMContentLoaded', () => {

  // ===== NAV SCROLL =====
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.pageYOffset > 50);
  }, { passive: true });

  // ===== MOBILE NAV =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  // ===== SCROLL ANIMATIONS =====
  const els = document.querySelectorAll('.anim');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('show'), i * 60);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => obs.observe(el));

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const t = document.querySelector(this.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // ===== HERO PARALLAX ORBS =====
  const hero = document.querySelector('.hero');
  const orbs = document.querySelectorAll('.hero-orb');
  if (hero && orbs.length) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      orbs.forEach((o, i) => {
        const s = (i + 1) * 18;
        o.style.transform = `translate(${x * s}px, ${y * s}px)`;
      });
    });
  }

  // ===== PHONE TILT =====
  const phones = document.querySelectorAll('.phone');
  phones.forEach(p => {
    p.addEventListener('mousemove', (e) => {
      const r = p.getBoundingClientRect();
      const cx = r.width / 2, cy = r.height / 2;
      const rx = ((e.clientY - r.top) - cy) / cy * -5;
      const ry = ((e.clientX - r.left) - cx) / cx * 5;
      p.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    });
    p.addEventListener('mouseleave', () => {
      // Reset to class default
      if (p.classList.contains('phone-c')) p.style.transform = 'translateY(-24px)';
      else if (p.classList.contains('phone-l')) p.style.transform = 'perspective(1200px) rotateY(8deg)';
      else if (p.classList.contains('phone-r')) p.style.transform = 'perspective(1200px) rotateY(-8deg)';
      else p.style.transform = '';
    });
  });

  // ===== CAROUSEL DRAG =====
  const carousel = document.getElementById('carousel');
  if (carousel) {
    let down = false, sx, sl;
    carousel.addEventListener('mousedown', e => {
      down = true; carousel.style.cursor = 'grabbing';
      sx = e.pageX - carousel.offsetLeft; sl = carousel.scrollLeft;
    });
    carousel.addEventListener('mouseleave', () => { down = false; carousel.style.cursor = 'grab'; });
    carousel.addEventListener('mouseup', () => { down = false; carousel.style.cursor = 'grab'; });
    carousel.addEventListener('mousemove', e => {
      if (!down) return; e.preventDefault();
      carousel.scrollLeft = sl - ((e.pageX - carousel.offsetLeft) - sx) * 2;
    });
  }

  // ===== DEMO CHATBOT =====
  const chatIn = document.getElementById('chatIn');
  const chatSend = document.getElementById('chatSend');
  const chatMsgs = document.getElementById('chatMsgs');

  const responses = {
    sad: "I hear you, and your feelings are valid. 💙 Sometimes sadness is our mind's way of processing things. Would you like to try a guided breathing exercise, or just talk more?",
    stressed: "Stress can feel overwhelming, but you're being brave by sharing. 🌿 Try this: inhale 4s, hold 4s, exhale 6s. Repeat 3 times. You've got this.",
    anxious: "Anxiety can feel like a storm, but storms always pass. 🌈 Try grounding: name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.",
    lonely: "Loneliness is hard, but you're not alone right now. 🤗 I'm right here. Sometimes just knowing someone listens makes a difference. Tell me more.",
    angry: "It sounds like you're carrying frustration. That's understandable. 🔥 Anger often masks hurt or disappointment. When ready, we can explore what's underneath.",
    tired: "Exhaustion is your body speaking. 😴 Rest isn't laziness — it's recovery. What small thing could you do for yourself today?",
    depressed: "Thank you for trusting me. 💜 Depression is real and hard, but reaching out shows strength. If in crisis, please contact a helpline. I'm here to listen.",
    worried: "Worry makes everything feel urgent. 🌸 Most worries never happen. What's ONE thing you can control right now?",
    scared: "Fear is natural, and you're braver than you think. 🌟 You're here, talking about it — that takes courage.",
    overwhelmed: "When everything feels too much, break it down. 🧩 What's the ONE thing most pressing right now? Let's tackle that.",
    happy: "Wonderful! 🌟 What's making you feel good? Savoring positive moments builds emotional resilience.",
    good: "I'm glad! ☀️ Understanding what lifts us up is just as important as what brings us down.",
    great: "Amazing! 🎉 Your positive energy is beautiful. Keep riding this wave!",
    calm: "Calm is beautiful. 🍃 Sounds like you're centered. Enjoy this moment — you've earned it.",
    hello: "Hello! 👋 Welcome to your safe space. How are you feeling right now?",
    hi: "Hey! 😊 This is a judgment-free zone. What would you like to talk about?",
    help: "Of course! 🤝 Tell me how you're feeling, and I'll do my best to support you.",
    thanks: "You're welcome! 💛 Reaching out is a sign of strength. I'm always here.",
    default: "Thank you for sharing. 💛 Whatever you're feeling is valid. Can you tell me more? Sometimes putting things into words brings clarity."
  };

  function getReply(text) {
    const t = text.toLowerCase();
    for (const [k, v] of Object.entries(responses)) {
      if (k !== 'default' && t.includes(k)) return v;
    }
    if (t.includes('?')) return "That's thoughtful. 🤔 The fact that you're asking shows real awareness. What do you think the answer might be?";
    return responses.default;
  }

  function addMsg(text, type) {
    const d = document.createElement('div');
    d.className = `msg ${type}`;
    d.textContent = text;
    chatMsgs.appendChild(d);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }

  function send() {
    const text = chatIn.value.trim();
    if (!text) return;
    addMsg(text, 'user');
    chatIn.value = '';

    // Typing indicator
    const dot = document.createElement('div');
    dot.className = 'msg bot';
    dot.textContent = '···';
    dot.style.opacity = '.4';
    chatMsgs.appendChild(dot);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;

    setTimeout(() => {
      chatMsgs.removeChild(dot);
      addMsg(getReply(text), 'bot');
    }, 700 + Math.random() * 500);
  }

  if (chatSend) chatSend.addEventListener('click', send);
  if (chatIn) chatIn.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); send(); } });

  // ===== JOIN COMMUNITY (simple feedback) =====
  const heroJoin = document.getElementById('heroJoin');
  const heroEmail = document.getElementById('heroEmail');
  if (heroJoin) {
    heroJoin.addEventListener('click', () => {
      const email = heroEmail.value.trim();
      if (email && email.includes('@')) {
        heroJoin.textContent = '✓ Joined!';
        heroJoin.style.background = '#5ce0d8';
        heroEmail.value = '';
        setTimeout(() => {
          heroJoin.innerHTML = 'Join Community <span class="dot"></span>';
          heroJoin.style.background = '';
        }, 3000);
      } else {
        heroEmail.style.borderColor = '#f06060';
        heroEmail.focus();
        setTimeout(() => heroEmail.style.borderColor = '', 2000);
      }
    });
  }

});

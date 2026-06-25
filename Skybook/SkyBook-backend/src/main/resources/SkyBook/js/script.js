/* =====================================================
   SkyBook — script.js
===================================================== */

// Backend API base URL. The Spring Boot backend runs locally on port 8080.
// If it isn't running (e.g. when viewing the site live on Netlify), every
// API call below safely falls back to demo/local behavior.
const API_BASE = 'http://localhost:8080/api';

// ---------- EmailJS config ----------
// 1. Create a free account at https://www.emailjs.com
// 2. Add an Email Service (e.g. Gmail) -> copy its Service ID below
// 3. Create two Email Templates (one for bookings, one for contact form)
//    and copy their Template IDs below
// 4. Go to Account > General -> copy your Public Key below
// Until you fill these in with your real values, email sending is skipped
// silently and the site keeps working exactly as before.
const EMAILJS_PUBLIC_KEY = 'qnmB9KhUVWrMgDFSq';
const EMAILJS_SERVICE_ID = 'service_t192koz';
const EMAILJS_BOOKING_TEMPLATE_ID = 'template_37uybi7';
const EMAILJS_CONTACT_TEMPLATE_ID = 'template_ewu88gj';

function emailjsReady() {
  return typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';
}

document.addEventListener('DOMContentLoaded', function () {

  if (emailjsReady()) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  /* ---------- Loading Screen ---------- */
  const loader = document.getElementById('loading-screen');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hide'), 350);
    });
    setTimeout(() => loader.classList.add('hide'), 1800);
  }

  /* ---------- Sticky Navbar ---------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  /* ---------- Mobile Menu ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('open');
    }));
  }

  /* ---------- Active Nav Link Highlighting ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
  });

  /* ---------- Scroll Reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => obs.observe(el));
  }

  /* ---------- Counter Animation ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => counterObs.observe(c));
  }
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    let current = 0;
    const duration = 1400;
    const start = performance.now();
    function step(ts) {
      const progress = Math.min((ts - start) / duration, 1);
      current = Math.floor(progress * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(step);
  }

  /* ---------- Button Ripple Effect ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      circle.style.width = circle.style.height = diameter + 'px';
      circle.style.left = (e.clientX - this.getBoundingClientRect().left - diameter / 2) + 'px';
      circle.style.top = (e.clientY - this.getBoundingClientRect().top - diameter / 2) + 'px';
      circle.classList.add('ripple');
      const old = this.querySelector('.ripple');
      if (old) old.remove();
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });

  /* ---------- Back To Top ---------- */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
    });
  });

  /* ---------- Flight Search Form (Home / Flights) ---------- */
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = 'flights.html';
    });
  }

  /* ---------- Seat Selection Logic (Booking Page) ---------- */
  const seatGrid = document.getElementById('seat-grid');
  if (seatGrid) {
    const occupiedSeats = ['A2', 'B4', 'C1', 'D3'];
    let selectedSeats = [];
    const pricePerSeat = 4599;

    const seatEls = seatGrid.querySelectorAll('.seat');
    seatEls.forEach(seat => {
      const seatId = seat.dataset.seat;
      if (occupiedSeats.includes(seatId)) seat.classList.add('occupied');

      seat.addEventListener('click', () => {
        if (seat.classList.contains('occupied')) return;
        seat.classList.toggle('selected');
        if (seat.classList.contains('selected')) {
          selectedSeats.push(seatId);
        } else {
          selectedSeats = selectedSeats.filter(s => s !== seatId);
        }
        updateSeatSummary();
      });
    });

    function updateSeatSummary() {
      const summaryEl = document.getElementById('selected-seats');
      const totalEl = document.getElementById('seat-total');
      const countEl = document.getElementById('seat-count');
      if (summaryEl) summaryEl.textContent = selectedSeats.length ? selectedSeats.sort().join(', ') : 'None selected';
      if (countEl) countEl.textContent = selectedSeats.length;
      if (totalEl) totalEl.textContent = '₹' + (selectedSeats.length * pricePerSeat).toLocaleString();
    }
    updateSeatSummary();

    /* ---------- Passenger Form Validation ---------- */
    const passengerForm = document.getElementById('passenger-form');
    if (passengerForm) {
      passengerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        const nameField = document.getElementById('p-name');
        const emailField = document.getElementById('p-email');
        const phoneField = document.getElementById('p-phone');

        valid = validateField(nameField, nameField.value.trim().length >= 3) && valid;
        valid = validateField(emailField, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) && valid;
        valid = validateField(phoneField, /^[0-9]{10}$/.test(phoneField.value.trim())) && valid;

        if (selectedSeats.length === 0) {
          alert('Please select at least one seat before proceeding.');
          valid = false;
        }

        if (valid) {
          const genderField = document.getElementById('p-gender');
          const bookingPayload = {
            passengerName: nameField.value.trim(),
            email: emailField.value.trim(),
            phone: phoneField.value.trim(),
            gender: genderField ? genderField.value : '',
            flightId: 'SB-204',
            seats: selectedSeats.sort()
          };

          const authToken = localStorage.getItem('skybook_token');
          const bookingHeaders = { 'Content-Type': 'application/json' };
          if (authToken) bookingHeaders['Authorization'] = `Bearer ${authToken}`;

          fetch(`${API_BASE}/bookings`, {
            method: 'POST',
            headers: bookingHeaders,
            body: JSON.stringify(bookingPayload)
          })
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(data => {
              // Backend saved it to the database and generated a real PNR
              sessionStorage.setItem('skybook_passenger', data.passengerName);
              sessionStorage.setItem('skybook_seats', selectedSeats.sort().join(', '));
              sessionStorage.setItem('skybook_pnr', data.pnr);
              sendBookingEmail(bookingPayload, data.pnr);
              window.location.href = 'ticket.html';
            })
            .catch(() => {
              // Backend not running (e.g. on Netlify) — fall back to local-only demo flow
              const demoPnr = Math.random().toString(36).substring(2, 8).toUpperCase();
              sessionStorage.setItem('skybook_passenger', nameField.value.trim());
              sessionStorage.setItem('skybook_seats', selectedSeats.sort().join(', '));
              sessionStorage.setItem('skybook_pnr', demoPnr);
              sendBookingEmail(bookingPayload, demoPnr);
              window.location.href = 'ticket.html';
            });
        }
      });
    }
  }

  function validateField(field, condition) {
    if (!field) return true;
    const group = field.closest('.form-group');
    if (condition) {
      group.classList.remove('error');
      return true;
    } else {
      group.classList.add('error');
      return false;
    }
  }

  /* ---------- EmailJS helpers ---------- */
  function sendBookingEmail(booking, pnr) {
    if (!emailjsReady()) return; // EmailJS not configured yet — skipped silently
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_BOOKING_TEMPLATE_ID, {
      to_name: booking.passengerName,
      to_email: booking.email,
      flight_id: booking.flightId,
      seats: booking.seats.join(', '),
      pnr: pnr
    }).catch(err => console.error('EmailJS booking email failed:', err));
  }

  function sendContactEmail(contact) {
    if (!emailjsReady()) return;
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TEMPLATE_ID, {
      from_name: contact.name,
      from_email: contact.email,
      from_phone: contact.phone,
      message: contact.message
    }).catch(err => console.error('EmailJS contact email failed:', err));
  }

  /* ---------- Random Ticket Generator (Ticket Page) ---------- */
  const ticketEl = document.getElementById('ticket-data');
  if (ticketEl) {
    const passenger = sessionStorage.getItem('skybook_passenger') || 'Aarav Sharma';
    const seats = sessionStorage.getItem('skybook_seats') || 'B3';
    const flightNumbers = ['SK-204', 'SK-318', 'SK-477', 'SK-552'];
    const gates = ['A12', 'B07', 'C03', 'D21'];
    const boardingTimes = ['06:40', '09:15', '13:50', '18:25'];
    const pnr = sessionStorage.getItem('skybook_pnr') || Math.random().toString(36).substring(2, 8).toUpperCase();

    document.getElementById('t-name').textContent = passenger;
    document.getElementById('t-flight').textContent = flightNumbers[Math.floor(Math.random() * flightNumbers.length)];
    document.getElementById('t-seat').textContent = seats;
    document.getElementById('t-gate').textContent = gates[Math.floor(Math.random() * gates.length)];
    document.getElementById('t-boarding').textContent = boardingTimes[Math.floor(Math.random() * boardingTimes.length)];
    document.getElementById('t-pnr').textContent = pnr;
  }

  /* ---------- Print / Download Ticket ---------- */
  const printBtn = document.getElementById('print-ticket');
  if (printBtn) printBtn.addEventListener('click', () => window.print());

  const downloadBtn = document.getElementById('download-ticket');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const name = document.getElementById('t-name')?.textContent || '—';
      const flight = document.getElementById('t-flight')?.textContent || '—';
      const seat = document.getElementById('t-seat')?.textContent || '—';
      const gate = document.getElementById('t-gate')?.textContent || '—';
      const boarding = document.getElementById('t-boarding')?.textContent || '—';
      const pnr = document.getElementById('t-pnr')?.textContent || '—';

      const ticketHtml = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>SkyBook Ticket - ${pnr}</title>
<style>
body{font-family:Arial,sans-serif;background:#f6f8fc;padding:40px;}
.ticket{max-width:600px;margin:0 auto;background:#0a1c40;color:#fff;border-radius:18px;padding:36px;box-shadow:0 10px 30px rgba(0,0,0,.2);}
.brand{font-weight:800;font-size:20px;margin-bottom:24px;}
.brand span{color:#e8b545;}
.route{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;font-size:26px;font-weight:800;}
table{width:100%;border-collapse:collapse;margin-top:10px;}
td{padding:10px 0;font-size:14px;border-bottom:1px solid rgba(255,255,255,.15);}
td.label{color:#9aa8c2;text-transform:uppercase;font-size:11px;letter-spacing:.5px;}
.pnr{margin-top:24px;text-align:center;background:rgba(255,255,255,.08);padding:14px;border-radius:10px;letter-spacing:2px;font-weight:700;}
</style></head>
<body>
  <div class="ticket">
    <div class="brand">✈ Sky<span>Book</span> — Digital Boarding Pass</div>
    <div class="route"><span>PNQ</span><span>✈</span><span>DEL</span></div>
    <table>
      <tr><td class="label">Passenger</td><td>${name}</td></tr>
      <tr><td class="label">Flight No.</td><td>${flight}</td></tr>
      <tr><td class="label">Seat</td><td>${seat}</td></tr>
      <tr><td class="label">Boarding Time</td><td>${boarding}</td></tr>
      <tr><td class="label">Gate</td><td>${gate}</td></tr>
    </table>
    <div class="pnr">PNR: ${pnr}</div>
  </div>
</body></html>`;

      const blob = new Blob([ticketHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SkyBook-Ticket-${pnr}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  /* ---------- Contact Form Validation ---------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const name = document.getElementById('c-name');
      const email = document.getElementById('c-email');
      const phone = document.getElementById('c-phone');
      const message = document.getElementById('c-message');

      valid = validateField(name, name.value.trim().length >= 3) && valid;
      valid = validateField(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) && valid;
      valid = validateField(phone, /^[0-9]{10}$/.test(phone.value.trim())) && valid;
      valid = validateField(message, message.value.trim().length >= 10) && valid;

      const successEl = document.getElementById('contact-success');
      if (valid) {
        const payload = {
          name: name.value.trim(),
          email: email.value.trim(),
          phone: phone.value.trim(),
          message: message.value.trim()
        };

        fetch(`${API_BASE}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(() => { /* backend not running — message still confirmed below for demo purposes */ });

        sendContactEmail(payload);

        contactForm.reset();
        if (successEl) successEl.style.display = 'block';
      } else if (successEl) {
        successEl.style.display = 'none';
      }
    });
  }

  /* ---------- Flights Filter / Sort (Flights Page) ---------- */
  const flightList = document.getElementById('flight-list');
  if (flightList) {
    const cards = Array.from(flightList.querySelectorAll('.flight-card'));
    const sortSelect = document.getElementById('sort-select');
    const priceRange = document.getElementById('price-range');
    const priceRangeVal = document.getElementById('price-range-val');
    const stopFilters = document.querySelectorAll('.stop-filter');

    function applyFilters() {
      const maxPrice = priceRange ? parseInt(priceRange.value, 10) : Infinity;
      const checkedStops = Array.from(stopFilters).filter(c => c.checked).map(c => c.value);
      cards.forEach(card => {
        const price = parseInt(card.dataset.price, 10);
        const stops = card.dataset.stops;
        const stopOk = checkedStops.length === 0 || checkedStops.includes(stops);
        card.style.display = (price <= maxPrice && stopOk) ? '' : 'none';
      });
    }

    if (priceRange) {
      priceRange.addEventListener('input', () => {
        if (priceRangeVal) priceRangeVal.textContent = '₹' + parseInt(priceRange.value, 10).toLocaleString();
        applyFilters();
      });
    }
    stopFilters.forEach(c => c.addEventListener('change', applyFilters));

    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        const sorted = cards.slice().sort((a, b) => {
          if (sortSelect.value === 'price-asc') return a.dataset.price - b.dataset.price;
          if (sortSelect.value === 'price-desc') return b.dataset.price - a.dataset.price;
          if (sortSelect.value === 'duration') return a.dataset.duration - b.dataset.duration;
          return 0;
        });
        sorted.forEach(card => flightList.appendChild(card));
      });
    }
  }


  /* ---------- Flight Status / PNR Tracker (new feature) ---------- */
  const statusForm = document.getElementById('status-form');
  if (statusForm) {
    const knownGates = ['A12', 'B07', 'C03', 'D21'];
    const knownTimes = ['06:40', '09:15', '13:50', '18:25'];
    statusForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('pnr-input');
      const resultBox = document.getElementById('status-result');
      const pnr = input.value.trim().toUpperCase();

      if (pnr.length < 5) {
        resultBox.innerHTML = '<p class="status-error">Please enter a valid PNR (5-6 characters).</p>';
        return;
      }

      // Deterministic "lookup" based on PNR text so the same PNR always shows the same demo result
      let seed = 0;
      for (let i = 0; i < pnr.length; i++) seed += pnr.charCodeAt(i);
      const gate = knownGates[seed % knownGates.length];
      const time = knownTimes[seed % knownTimes.length];
      const statuses = ['On Time', 'Boarding Soon', 'Gate Open'];
      const status = statuses[seed % statuses.length];

      resultBox.innerHTML = `
        <div class="status-card">
          <div>PNR<strong>${pnr}</strong></div>
          <div>Route<strong>PNQ &rarr; DEL</strong></div>
          <div>Boarding Time<strong>${time}</strong></div>
          <div>Gate<strong>${gate}</strong></div>
          <div>Status<strong>${status}</strong></div>
        </div>`;
    });
  }

  /* ---------- Newsletter Signup ---------- */
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailField = document.getElementById('newsletter-email');
      const msg = document.getElementById('newsletter-msg');
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
        msg.style.display = 'block';
        newsletterForm.reset();
        setTimeout(() => { msg.style.display = 'none'; }, 4000);
      }
    });
  }


  /* ---------- Auth: render nav (logged in vs logged out) ---------- */
  function renderAuthNav() {
    const navAuth = document.getElementById('nav-auth');
    if (!navAuth) return;
    const token = localStorage.getItem('skybook_token');
    const userName = localStorage.getItem('skybook_user_name');

    if (token && userName) {
      navAuth.innerHTML = `
        <span class="nav-user-name">Hi, ${userName.split(' ')[0]}</span>
        <button class="nav-logout-btn" id="nav-logout-btn">Logout</button>`;
      const logoutBtn = document.getElementById('nav-logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          localStorage.removeItem('skybook_token');
          localStorage.removeItem('skybook_user_name');
          localStorage.removeItem('skybook_user_email');
          window.location.href = 'index.html';
        });
      }
    } else {
      navAuth.innerHTML = `
        <a href="login.html" class="btn btn-outline" style="color:var(--navy-950);border-color:var(--gray-200);">Login</a>
        <a href="signup.html" class="btn btn-dark">Sign Up</a>`;
    }
  }
  renderAuthNav();

  /* ---------- Signup Form ---------- */
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const errorBox = document.getElementById('auth-error');
      const name = document.getElementById('su-name').value.trim();
      const email = document.getElementById('su-email').value.trim();
      const password = document.getElementById('su-password').value;

      errorBox.classList.remove('show');

      fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
        .then(res => {
          if (!res.ok) return res.text().then(msg => Promise.reject(msg));
          return res.json();
        })
        .then(data => {
          localStorage.setItem('skybook_token', data.token);
          localStorage.setItem('skybook_user_name', data.name);
          localStorage.setItem('skybook_user_email', data.email);
          window.location.href = 'index.html';
        })
        .catch(err => {
          errorBox.textContent = typeof err === 'string'
            ? err
            : 'Could not sign up. Make sure the backend server is running on localhost:8080.';
          errorBox.classList.add('show');
        });
    });
  }

  /* ---------- Login Form ---------- */
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const errorBox = document.getElementById('auth-error');
      const email = document.getElementById('li-email').value.trim();
      const password = document.getElementById('li-password').value;

      errorBox.classList.remove('show');

      fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
        .then(res => {
          if (!res.ok) return res.text().then(msg => Promise.reject(msg));
          return res.json();
        })
        .then(data => {
          localStorage.setItem('skybook_token', data.token);
          localStorage.setItem('skybook_user_name', data.name);
          localStorage.setItem('skybook_user_email', data.email);
          window.location.href = 'index.html';
        })
        .catch(err => {
          errorBox.textContent = typeof err === 'string'
            ? err
            : 'Could not log in. Make sure the backend server is running on localhost:8080.';
          errorBox.classList.add('show');
        });
    });
  }

  /* ---------- My Bookings Page ---------- */
  const myBookingsList = document.getElementById('my-bookings-list');
  if (myBookingsList) {
    const token = localStorage.getItem('skybook_token');
    const loggedOutBox = document.getElementById('my-bookings-logged-out');
    const emptyBox = document.getElementById('my-bookings-empty');
    const errorBox = document.getElementById('my-bookings-error');

    if (!token) {
      loggedOutBox.style.display = 'block';
    } else {
      fetch(`${API_BASE}/bookings/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(bookings => {
          if (!bookings.length) {
            emptyBox.style.display = 'block';
            return;
          }
          myBookingsList.innerHTML = bookings.map(b => `
            <div class="booking-card">
              <div class="bc-top">
                <span class="bc-route">${b.flightId}</span>
                <span class="bc-pnr">${b.pnr || '—'}</span>
              </div>
              <div class="bc-row"><span>Passenger</span><strong>${b.passengerName}</strong></div>
              <div class="bc-row"><span>Seats</span><strong>${(b.seats || []).join(', ') || '—'}</strong></div>
              <div class="bc-row"><span>Phone</span><strong>${b.phone || '—'}</strong></div>
            </div>
          `).join('');
        })
        .catch(() => { errorBox.style.display = 'block'; });
    }
  }

});

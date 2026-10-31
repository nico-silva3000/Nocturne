// Nocturne | interactions
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// 1. Navigation: mobile menu, and highlight the section being read
const menu = $('#menu');
const toggle = $('.nav__toggle');
const links = $$('#menu a');

toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
});
links.forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}));

const watcher = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(section => watcher.observe(section));

// 2. Project cards: show and hide details
$$('.more').forEach(button => button.addEventListener('click', () => {
  const details = document.getElementById(button.getAttribute('aria-controls'));
  const opening = details.hidden;
  details.hidden = !opening;
  button.setAttribute('aria-expanded', opening);
  button.textContent = opening ? 'Hide details' : 'Show details';
}));

// 3. Cassette player: MP3 audio
const tape = $('#tape');
const playButton = $('#tape-play');
const flipButton = $('#tape-flip');
const volume = $('#tape-vol');
const sideName = $('#tape-side');
const audio = $('#cassette-audio');

let side = 'A';

audio.volume = Number(volume.value);

playButton.addEventListener('click', async () => {
  if (audio.paused) {
    try {
      await audio.play();
    } catch (error) {
      console.error('Audio could not play:', error);
    }
  } else {
    audio.pause();
  }
});

audio.addEventListener('play', () => {
  tape.classList.add('is-playing');
  playButton.textContent = 'Pause';
  playButton.setAttribute('aria-pressed', 'true');
});

audio.addEventListener('pause', () => {
  tape.classList.remove('is-playing');
  playButton.textContent = 'Play';
  playButton.setAttribute('aria-pressed', 'false');
});

audio.addEventListener('ended', () => {
  tape.classList.remove('is-playing');
  playButton.textContent = 'Play';
  playButton.setAttribute('aria-pressed', 'false');
});

flipButton.addEventListener('click', () => {
  side = side === 'A' ? 'B' : 'A';
  sideName.textContent = 'Side ' + side;

  audio.pause();
  audio.currentTime = 0;
});

volume.addEventListener('input', () => {
  audio.volume = Number(volume.value);
});
// 4. Contact form validation
const form = $('#contact-form');
const status = $('#form-status');
const rules = {
  name: value => value.trim().length >= 2 || 'Enter your name (at least 2 characters).',
  email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Enter an email like name@example.com.',
  message: value => value.trim().length >= 10 || 'Write at least 10 characters.'
};

form.addEventListener('submit', event => {
  event.preventDefault();
  let allValid = true;
  Object.keys(rules).forEach(id => {
    const input = form.elements[id];
    const result = rules[id](input.value);
    const field = input.closest('.field');
    field.classList.toggle('invalid', result !== true);
    $('.error', field).textContent = result === true ? '' : result;
    if (result !== true) allValid = false;
  });
  // TODO: to really send messages, post the data with fetch() to a form service such as Formspree.
  status.textContent = allValid ? 'Your message is valid, but sending is not set up yet.' : 'Fix the marked fields and try again.';
  if (allValid) form.reset();
});

// 5. Footer year
$('#year').textContent = new Date().getFullYear();
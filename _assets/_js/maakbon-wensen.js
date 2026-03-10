/**
 * Maakbon flow – step 1: reden/wensen options and message counter.
 * Populates flowWensOptions from wensen-config; handles wens selection and placeholder.
 */

import { WENSEN, DEFAULT_PLACEHOLDER } from '../_components/wensen-config.js';

const WENS_BASE = '_assets/_style/_images/_wens/';

export function buildWensLookup(wensen) {
	const WENS_PLACEHOLDERS = {};
	const WENS_IMAGES = {};
	wensen.forEach(w => { WENS_PLACEHOLDERS[w.key] = DEFAULT_PLACEHOLDER; });
	wensen.forEach(w => { WENS_IMAGES[w.key] = 'wens__' + w.key + '.png'; });
	return { WENS_PLACEHOLDERS, WENS_IMAGES };
}

export function initWensen(state) {
	const { WENS_PLACEHOLDERS, WENS_IMAGES } = buildWensLookup(WENSEN);

	const WENS_BACK_IMAGES = 6;
	const backIndices = [1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5);
	const flowWensContainer = document.getElementById('flowWensOptions');
	flowWensContainer.innerHTML = WENSEN.map((w, i) => {
		const backNum = String(backIndices[i % WENS_BACK_IMAGES]).padStart(3, '0');
		const backUrl = '_assets/_style/_images/_wens-back/wens__back--' + backNum + '.png';
		return '<button type="button" class="wasbon-wens-btn border-2 border-white/30 rounded-xl bg-white/10 hover:border-white/60 transition-colors text-left" data-wens="' + w.key + '" data-name="' + (w.name || '').replace(/"/g, '&quot;') + '" style="background-image: url(\'' + backUrl + '\')">' +
			'<img src="' + w.thumbnail + '" alt="' + (w.alt || '').replace(/"/g, '&quot;') + '" class="wasbon-wens-image object-contain max-h-[144px]">' +
			'</button>';
	}).join('');

	const berichtEl = document.getElementById('persoonlijk_bericht');
	if (berichtEl) {
		berichtEl.placeholder = DEFAULT_PLACEHOLDER;
		// No line breaks: block Enter and strip pasted newlines
		berichtEl.addEventListener('keydown', function (e) {
			if (e.key === 'Enter') e.preventDefault();
		});
		berichtEl.addEventListener('input', function () {
			const val = this.value;
			if (/\r|\n/.test(val)) {
				const start = this.selectionStart;
				const newVal = val.replace(/\r?\n/g, ' ');
				this.value = newVal;
				const pos = Math.min(start, newVal.length);
				this.setSelectionRange(pos, pos);
			}
		});
	}

	function updatePersoonlijkBerichtCounter() {
		const el = document.getElementById('persoonlijk_bericht');
		const counter = document.getElementById('persoonlijk_bericht_counter');
		if (el && counter) counter.textContent = el.value.length + '/160';
	}
	if (berichtEl) berichtEl.addEventListener('input', updatePersoonlijkBerichtCounter);
	updatePersoonlijkBerichtCounter();

	document.querySelectorAll('.wasbon-wens-btn').forEach(btn => {
		btn.addEventListener('click', function () {
			document.querySelectorAll('.wasbon-wens-btn').forEach(b => b.classList.remove('selected', 'border-[#FACC15]'));
			this.classList.add('selected', 'border-[#FACC15]');
			const key = this.getAttribute('data-wens');
			document.getElementById('flowReden').value = key;
			const placeholder = WENS_PLACEHOLDERS[key] || DEFAULT_PLACEHOLDER;
			if (berichtEl) berichtEl.placeholder = placeholder;
			state.updatePreviews();
			state.goNext();
		});
	});

	// Scale wasbon-wens-btn by position: below 60% viewport from top = 0.8, scrolling up = 1
	function updateWensBtnScales() {
		const container = document.getElementById('flowWensOptions');
		if (!container) return;
		const containerRect = container.getBoundingClientRect();
		const threshold = containerRect.top + containerRect.height * 0.6;
		const bottom = containerRect.bottom;
		container.querySelectorAll('.wasbon-wens-btn').forEach(btn => {
			const rect = btn.getBoundingClientRect();
			const centerY = rect.top + rect.height / 2;
			let scale = 1;
			if (centerY > threshold) {
				const range = bottom - threshold;
				const t = range > 0 ? (centerY - threshold) / range : 1;
				scale = 1 - 0.2 * Math.min(1, t);
			}
			btn.style.setProperty('--wens-scale', scale);
		});
	}
	flowWensContainer.addEventListener('scroll', updateWensBtnScales);
	state.updateWensBtnScales = updateWensBtnScales;
	if (state.setWensImages) state.setWensImages(WENS_IMAGES);
	return { WENS_IMAGES, WENS_PLACEHOLDERS };
}

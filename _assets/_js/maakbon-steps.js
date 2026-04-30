/**
 * Maakbon flow – steps 6 (delivery), 7 (send date), 8 (waarde); section 3/6/7 buttons.
 */

export function initSteps(state) {
	function updateSection4DeliveryFields() {
		const deliverySop = document.getElementById('deliverySop')?.value || 'email';
		const ontvangerEmailWrap = document.getElementById('ontvangerEmailWrap');
		const ontvangerMobielWrap = document.getElementById('ontvangerMobielWrap');
		const ontvangerAdresWrap = document.getElementById('ontvangerAdresWrap');
		if (ontvangerEmailWrap) ontvangerEmailWrap.classList.toggle('hidden', deliverySop !== 'email');
		if (ontvangerMobielWrap) ontvangerMobielWrap.classList.toggle('hidden', deliverySop !== 'whatsapp');
		if (ontvangerAdresWrap) ontvangerAdresWrap.classList.toggle('hidden', deliverySop !== 'post');
	}

	// Step 4: enable "Voeg toe" only when receiver name has input
	const receiverInput = document.getElementById('receiver_name');
	const btnStep4 = document.getElementById('btnStep4VoegToe');
	function updateStep4Button() {
		if (btnStep4) btnStep4.disabled = !(receiverInput && receiverInput.value.trim().length > 0);
	}
	if (receiverInput) {
		receiverInput.addEventListener('input', updateStep4Button);
		receiverInput.addEventListener('change', updateStep4Button);
	}
	updateStep4Button();

	// Step 8 (Hoe wil je geven): enable "Doorgaan" when delivery option is selected
	document.querySelectorAll('.sop-delivery-option').forEach(btn => {
		btn.addEventListener('click', function () {
			const isPost = this.classList.contains('delivery-post-option');
			document.querySelectorAll('.sop-delivery-option').forEach(b => b.classList.remove('ring-2', 'ring-[#FACC15]', 'bg-sky-200'));
			this.classList.add('ring-2', 'ring-[#FACC15]', 'bg-sky-200');
			document.getElementById('deliverySop').value = this.getAttribute('data-sop');
			state.deliveryPrice = parseFloat(this.getAttribute('data-price'));
			updateSection4DeliveryFields();
			if (isPost) this.classList.add('delivery-post--expanded');
			const btnStep8 = document.getElementById('btnStep8Doorgaan');
			if (btnStep8) btnStep8.disabled = false;
		});
	});
	updateSection4DeliveryFields();

	// Min date for send: when post delivery, at least 2 days in advance
	function getMinSendDate() {
		const d = new Date();
		d.setDate(d.getDate() + 2);
		return d.toISOString().slice(0, 10);
	}
	function getTodayISO() {
		return new Date().toISOString().slice(0, 10);
	}
	function isSendDateValid(dateStr, isPost) {
		if (!dateStr || !dateStr.trim()) return false;
		if (isPost) {
			const min = getMinSendDate();
			return dateStr >= min;
		}
		return true;
	}

	// Step 9 (Wanneer wil je geven): enable "Bestellen" only when "Verstuur direct" or when "datum" + valid date
	document.querySelectorAll('.send-date-option').forEach(btn => {
		btn.addEventListener('click', function () {
			document.querySelectorAll('.send-date-option').forEach(b => b.classList.remove('ring-2', 'ring-[#FACC15]', 'bg-sky-200'));
			this.classList.add('ring-2', 'ring-[#FACC15]', 'bg-sky-200');
			const sendMode = this.getAttribute('data-send');
			document.getElementById('sendWhen').value = sendMode;
			const expandEl = this.querySelector('.send-date-expand');
			const datePicker = document.getElementById('sendDatePicker');
			const sendDateError = document.getElementById('sendDateError');
			if (sendDateError) {
				sendDateError.classList.add('hidden');
				sendDateError.textContent = '';
			}
			const btnStep9 = document.getElementById('btnStep9Bestellen');
			if (expandEl) {
				if (sendMode === 'datum') {
					expandEl.classList.add('send-date-expand--open');
					const isPost = document.getElementById('deliverySop')?.value === 'post';
					if (datePicker) datePicker.min = isPost ? getMinSendDate() : getTodayISO();
					// Keep Bestellen disabled until a valid date is set
					if (btnStep9) btnStep9.disabled = true;
					if (datePicker) datePicker.value = '';
					document.getElementById('sendDate').value = '';
				} else {
					expandEl.classList.remove('send-date-expand--open');
					if (btnStep9) btnStep9.disabled = false;
				}
			} else if (sendMode === 'direct') {
				// "Verstuur direct" has no expandEl; enable button
				if (btnStep9) btnStep9.disabled = false;
			}
			document.querySelectorAll('.send-date-option').forEach(b => {
				const ex = b.querySelector('.send-date-expand');
				if (ex && b !== this) ex.classList.remove('send-date-expand--open');
			});
		});
	});

	// When user picks a date and "datum" is selected: enable Bestellen only if valid (post => min 2 days ahead)
	const sendDatePicker = document.getElementById('sendDatePicker');
	const btnStep9 = document.getElementById('btnStep9Bestellen');
	if (sendDatePicker && btnStep9) {
		function updateStep9Button() {
			const sendWhen = document.getElementById('sendWhen')?.value;
			if (sendWhen !== 'datum') return;
			const dateStr = sendDatePicker.value.trim();
			const isPost = document.getElementById('deliverySop')?.value === 'post';
			const errEl = document.getElementById('sendDateError');
			if (!dateStr) {
				if (errEl) {
					errEl.classList.add('hidden');
					errEl.textContent = '';
				}
				btnStep9.disabled = true;
				return;
			}
			if (isPost && !isSendDateValid(dateStr, true)) {
				if (errEl) {
					errEl.textContent = 'Kies een datum minstens 2 dagen van tevoren bij verzending via post.';
					errEl.classList.remove('hidden');
				}
				btnStep9.disabled = true;
				return;
			}
			if (errEl) {
				errEl.classList.add('hidden');
				errEl.textContent = '';
			}
			btnStep9.disabled = false;
		}
		sendDatePicker.addEventListener('change', updateStep9Button);
		sendDatePicker.addEventListener('input', updateStep9Button);
	}

	document.querySelector('.send-step-next')?.addEventListener('click', function () {
		const sendWhen = document.getElementById('sendWhen').value;
		if (sendWhen === 'datum') {
			const dateValue = document.getElementById('sendDatePicker').value.trim();
			if (!dateValue) {
				alert('Kies een verzenddatum.');
				return;
			}
			document.getElementById('sendDate').value = dateValue;
		} else {
			document.getElementById('sendDate').value = '';
		}
		state.goNext();
	});

	// Step 8: waarde
	document.querySelectorAll('.waarde-option').forEach(btn => {
		btn.addEventListener('click', function () {
			document.querySelectorAll('.waarde-option').forEach(b => b.classList.remove('ring-2', 'ring-[#FACC15]'));
			this.classList.add('ring-2', 'ring-[#FACC15]');
			state.waarde = parseFloat(this.getAttribute('data-waarde'));
			document.getElementById('flowWaarde').value = state.waarde;
			state.goNext();
		});
	});
	document.querySelector('.waarde-option[data-waarde="15"]')?.classList.add('ring-2', 'ring-[#FACC15]');

	// Step 9: Bestellen -> Section 4 (validate send date when "datum": required; if post, min 2 days ahead)
	document.getElementById('btnStep9Bestellen')?.addEventListener('click', function () {
		const sendWhen = document.getElementById('sendWhen')?.value;
		if (sendWhen === 'datum') {
			const dateStr = document.getElementById('sendDatePicker')?.value?.trim() || '';
			const isPost = document.getElementById('deliverySop')?.value === 'post';
			const errEl = document.getElementById('sendDateError');
			if (!dateStr) {
				if (errEl) {
					errEl.textContent = 'Kies een verzenddatum.';
					errEl.classList.remove('hidden');
				}
				return;
			}
			if (isPost && !isSendDateValid(dateStr, true)) {
				if (errEl) {
					errEl.textContent = 'Bij verzending via post moet de datum minstens 2 dagen van tevoren zijn.';
					errEl.classList.remove('hidden');
				}
				return;
			}
			document.getElementById('sendDate').value = dateStr;
			if (errEl) {
				errEl.classList.add('hidden');
				errEl.textContent = '';
			}
		}
		state.showSection(4);
	});

	// Section 7: Factuur nodig -> Section 8
	document.getElementById('linkFactuur')?.addEventListener('click', function (e) {
		e.preventDefault();
		state.showSection(8);
	});
	// Section 5: Wijzig e-mail -> terug naar Section 4
	document.getElementById('btnEmailWijzig')?.addEventListener('click', () => state.showSection(4));
}

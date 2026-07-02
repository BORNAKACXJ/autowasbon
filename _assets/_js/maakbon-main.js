/**
 * Maakbon flow – entry: init on DOMContentLoaded.
 * Wires Lottie, flow state, wensen, SOP, steps, receiver input.
 */

import { initLottieClickFeedback } from './maakbon-lottie.js';
import { createFlowState } from './maakbon-flow.js';
import { initFlowAnimations } from './flow-animations.js';
import { initWensen } from './maakbon-wensen.js';
import { initSop } from './maakbon-sop.js';
import { initSteps } from './maakbon-steps.js';
import { initFlowValidation } from './flow-validation.js';
import { MAX_PHOTO_BYTES } from './maakbon-config.js';
import { initBackendIntegration } from './backend-integration.js';
import { initBackendVoucherThanks } from './backend-voucher-thanks.js';
import { initBackendVoucherInvoice } from './backend-voucher-invoice.js';

document.addEventListener('DOMContentLoaded', async function () {
	initLottieClickFeedback();

	const state = createFlowState();
	window.editStep = (step) => state.editStep(step);
	initFlowAnimations(state);

	const flowValidation = initFlowValidation();

	document.getElementById('btnStart').addEventListener('click', () => state.goNext());

	initBackendIntegration({ state, flowValidation });
	initBackendVoucherThanks();
	initBackendVoucherInvoice({ state, flowValidation });

	document.querySelectorAll('.step-volgende-btn').forEach(btn => btn.addEventListener('click', () => state.goNext()));

	document.getElementById('btnAfrekenen').addEventListener('click', async () => {
		const valid = await flowValidation.revalidate();
		if (valid) state.goNext();
	});

	document.getElementById('btnPaymentRetry')?.addEventListener('click', () => state.showSection(7));

	// Receiver name: sync to hidden field, update preview on card, remove readonly on interaction (prevent autofill)
	const receiverInput = document.getElementById('receiver_name');
	const receiverHidden = document.getElementById('receiver_name_hidden');
	const previewNameBoog = document.getElementById('previewNameBoog');
	if (receiverInput) {
		function syncReceiver() {
			if (receiverHidden) receiverHidden.value = receiverInput.value;
			if (previewNameBoog) previewNameBoog.textContent = (receiverInput.value && receiverInput.value.trim()) ? receiverInput.value.trim() : 'Naam';
		}
		receiverInput.addEventListener('input', syncReceiver);
		receiverInput.addEventListener('change', syncReceiver);
		syncReceiver();
		document.getElementById('flowForm').addEventListener('submit', () => syncReceiver());
		['mousedown', 'touchstart'].forEach(function (ev) {
			receiverInput.addEventListener(ev, function () {
				receiverInput.removeAttribute('readonly');
			}, { once: true, passive: true });
		});
	}

	// Step 5: show selected photo in preview (no upload, local display only)
	const photoInput = document.getElementById('photoUpload');
	const photoPreview = document.getElementById('media__upload--preview');
	const photoError = document.getElementById('photoUploadError');
	const placeholderSrc = photoPreview && photoPreview.src;
	function showPhotoError(message) {
		if (!photoError) return;
		photoError.textContent = message;
		photoError.classList.remove('hidden');
	}
	function clearPhotoError() {
		if (!photoError) return;
		photoError.textContent = '';
		photoError.classList.add('hidden');
	}
	function resetPhotoSelection() {
		if (photoInput) photoInput.value = '';
		if (placeholderSrc) photoPreview.src = placeholderSrc;
	}
	if (photoInput && photoPreview) {
		photoInput.addEventListener('change', function () {
			const file = this.files && this.files[0];
			if (!file) {
				clearPhotoError();
				if (placeholderSrc) photoPreview.src = placeholderSrc;
				return;
			}
			if (!file.type.startsWith('image/')) {
				showPhotoError('Dit bestand is geen afbeelding. Kies een andere afbeelding.');
				resetPhotoSelection();
				return;
			}
			if (file.size > MAX_PHOTO_BYTES) {
				showPhotoError('Deze foto is te groot (maximaal 1 MB). Kies een andere afbeelding.');
				resetPhotoSelection();
				return;
			}
			clearPhotoError();
			const prevUrl = photoPreview.dataset.objectUrl;
			if (prevUrl) URL.revokeObjectURL(prevUrl);
			const url = URL.createObjectURL(file);
			photoPreview.dataset.objectUrl = url;
			photoPreview.src = url;
		});
	}

	initWensen(state);
	initSop(state);
	initSteps(state);
});

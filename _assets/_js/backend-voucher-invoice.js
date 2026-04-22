import { sendInvoiceEmail } from './backend-api.js';

function readTrimmedValue(form, fieldName) {
	return (form.querySelector(`input[name="${fieldName}"]`)?.value || '').trim();
}

function resolveVoucherId() {
	const hiddenVoucherId = document.getElementById('voucherUuid')?.value?.trim();
	const datasetVoucherId = document.getElementById('flowForm')?.dataset?.voucherId?.trim();
	const globalVoucherId = typeof window !== 'undefined' ? (window.__voucherId || '').trim() : '';
	return hiddenVoucherId || datasetVoucherId || globalVoucherId || '';
}

function buildInvoicePayload() {
	const form = document.getElementById('flowForm');
	if (!form) return null;

	const payload = {
		invoice_company: readTrimmedValue(form, 'factuur_bedrijfsnaam'),
		invoice_firstname: readTrimmedValue(form, 'factuur_voornaam'),
		invoice_email: readTrimmedValue(form, 'factuur_email'),
		invoice_street: readTrimmedValue(form, 'factuur_straat'),
		invoice_housenumber: readTrimmedValue(form, 'factuur_huisnummer'),
		invoice_postcode: readTrimmedValue(form, 'factuur_postcode'),
		invoice_city: readTrimmedValue(form, 'factuur_plaats')
	};

	return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== ''));
}

export function initBackendVoucherInvoice({ state, flowValidation }) {
	const btnMaakFactuur = document.getElementById('btnMaakFactuur');
	if (!btnMaakFactuur || !state || !flowValidation) return;

	btnMaakFactuur.addEventListener('click', async (e) => {
		e.preventDefault();

		const valid = await flowValidation.revalidate();
		if (!valid) return;

		const voucherId = resolveVoucherId();
		if (!voucherId) {
			alert('Factuur kan nog niet worden aangevraagd: voucherreferentie ontbreekt. Open de betaalbevestiging opnieuw via de link uit de betaalflow.');
			return;
		}

		const payload = buildInvoicePayload();
		if (!payload) {
			alert('Kon factuurgegevens niet verzamelen. Probeer het opnieuw.');
			return;
		}

		const originalHtml = btnMaakFactuur.innerHTML;
		btnMaakFactuur.disabled = true;
		btnMaakFactuur.innerHTML = 'Bezig... <i class="fa-sharp fa-solid fa-spinner fa-spin ml-2"></i>';

		const result = await sendInvoiceEmail(voucherId, payload);

		btnMaakFactuur.disabled = false;
		btnMaakFactuur.innerHTML = originalHtml;

		if (result.success) {
			state.showSection(9);
			return;
		}

		alert(result.error || 'Factuur kon niet worden verstuurd. Probeer het opnieuw.');
	});
}

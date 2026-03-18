/**
 * Backend API – voucher endpoint config and fetch logic.
 * No DOM knowledge; pure API layer.
 */

/** API endpoint to create voucher and get Mollie redirect URL. POST FormData, expects { data: { mollie_payment_link } } on success. */
export const VOUCHER_API_URL = 'https://beleving.api.autowasbon.nl/api/v1/vouchers';

/** URL where Mollie redirects after payment (thank-you page). */
export const VOUCHER_RETURN_URL = typeof window !== 'undefined' ? (window.location.origin + '/bedankt') : '';

/**
 * POST voucher FormData to API.
 * @param {FormData} formData
 * @returns {Promise<{ success: boolean, redirectUrl?: string, error?: string }>}
 */
export async function createVoucher(formData) {
	try {
		const response = await fetch(VOUCHER_API_URL, {
			method: 'POST',
			body: formData,
			headers: { 'Accept': 'application/json' }
		});

		const data = await response.json().catch(() => ({}));
		console.log('[Voucher] Response status:', response.status, response.statusText);
		console.log('[Voucher] Response body:', data);

		const redirectUrl = data.data?.mollie_payment_link || data.mollie_payment_link || data.redirect_url;
		if (response.ok && redirectUrl) {
			return { success: true, redirectUrl };
		}

		const errors = data.errors ? Object.values(data.errors).flat().join(', ') : null;
		const error = errors || data.message || data.error || `Er ging iets mis (${response.status}). Probeer het opnieuw.`;
		return { success: false, error };
	} catch (err) {
		console.error('[Voucher] POST error:', err);
		return { success: false, error: 'Kon geen verbinding maken met de server. Controleer je internetverbinding en probeer het opnieuw.' };
	}
}

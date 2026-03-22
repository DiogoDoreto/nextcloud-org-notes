import axios from '@nextcloud/axios'

const BASE = '/ocs/v2.php/apps/orgnotes/api/v1'

/**
 * Fetches the current user settings from the orgnotes API.
 *
 * @return {Promise<object>} Resolved settings data object
 */
export async function getSettings() {
	const response = await axios.get(`${BASE}/settings?format=json`)
	return response.data?.ocs?.data ?? {}
}

/**
 * @param {string} notesDirectory The directory name to save
 */
export async function saveSettings(notesDirectory) {
	const response = await axios.put(`${BASE}/settings?format=json`, {
		notesDirectory,
	})
	return response.data?.ocs?.data ?? {}
}

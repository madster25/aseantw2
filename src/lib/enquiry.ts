/** Where enquiries are posted. Empty until the chamber connects a mailbox or form service. */
export const ENQUIRY_ENDPOINT = (import.meta.env.VITE_ENQUIRY_ENDPOINT ?? '').trim();
export const ENQUIRY_ENABLED = ENQUIRY_ENDPOINT.length > 0;

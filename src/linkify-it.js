// Minimal wrapper for linkify-it for use in UI code.
// Exports a factory function to create a new LinkifyIt instance for each consumer.
// This avoids shared mutable state when using add(), set(), tlds(), etc.
import LinkifyIt from 'linkify-it';
export default function newLinkify() {
	return new LinkifyIt();
}

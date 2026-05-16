export function detectPdfPageCount(buffer) {
  if (!buffer || buffer.length < 8) throw new Error('Empty file');
  const header = buffer.subarray(0, 8).toString('latin1');
  if (!header.startsWith('%PDF-')) throw new Error('Invalid PDF header');
  const text = buffer.toString('latin1');
  if (/\/Encrypt\b/.test(text)) throw new Error('Password-protected PDFs are not supported');
  const matches = text.match(/\/Type\s*\/Page\b/g);
  if (!matches?.length) throw new Error('Could not detect PDF pages');
  return matches.length;
}

export function isPdfFilename(filename = '') {
  return filename.toLowerCase().endsWith('.pdf');
}

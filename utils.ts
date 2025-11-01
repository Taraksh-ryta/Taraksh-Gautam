// A more robust markdown-to-HTML converter
export const formatContent = (text: string) => {
    // 0. Escape basic HTML tags to prevent XSS
    let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // 1. Handle multi-line code blocks first to preserve their content and newlines
    const codeBlocks: string[] = [];
    html = html.replace(/```(\w*?)\n([\s\S]+?)\n```/g, (match, lang, code) => {
        const sanitizedCode = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        const block = `<pre><code class="language-${lang || ''} bg-slate-900/50 p-3 rounded-md block whitespace-pre-wrap">${sanitizedCode}</code></pre>`;
        codeBlocks.push(block);
        return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
    });
    
    // 2. Handle blockquotes
    html = html.replace(/^(?:&gt; .*(?:\n|$))+/gm, (match) => {
        const lines = match.trim().split('\n');
        const content = lines.map(line => line.replace(/^&gt; ?/, '')).join('<br>');
        return `<blockquote class="border-l-4 border-cyan-500 pl-4 py-2 my-2">${content}</blockquote>`;
    });

    // 3. Handle lists (both ordered and unordered)
    html = html.replace(/((?:^\s*(?:-|\*|\d+\.) .*(?:\n|$))+)/gm, (match) => {
        const lines = match.trim().split('\n');
        const isOrdered = /^\s*\d+\./.test(lines[0]);
        const listTag = isOrdered ? 'ol' : 'ul';
        const listClass = isOrdered ? 'list-decimal' : 'list-disc';
        const items = lines.map(line => `<li>${line.replace(/^\s*(?:-|\*|\d+\.) /, '')}</li>`).join('');
        return `<${listTag} class="${listClass} pl-5">${items}</${listTag}>`;
    });

    // 4. Handle inline markdown for the remaining text
    html = html
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italics
        .replace(/`([^`]+)`/g, '<code class="bg-slate-600 rounded px-1 py-0.5 text-sm font-mono">$1</code>'); // Inline code

    // 5. Replace remaining newlines with <br />
    html = html.replace(/\n/g, '<br />');

    // 6. Clean up: remove <br /> that might be generated right after block elements
    html = html.replace(/(<\/(?:ul|ol|li|blockquote|pre)>)<br \/>/g, '$1');
    html = html.replace(/<br \/>(<(ul|ol|li|blockquote|pre))/g, '$1');


    // 7. Restore code blocks
    html = html.replace(/__CODE_BLOCK_(\d+)__/g, (match, index) => {
        return codeBlocks[parseInt(index, 10)];
    });

    return { __html: html };
};


// Decodes a base64 string into a Uint8Array.
export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Decodes raw PCM audio data into an AudioBuffer for playback.
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
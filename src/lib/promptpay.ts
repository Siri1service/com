/**
 * EMVCo PromptPay QR Code Generator
 * Compatible with all Thai Mobile Banking apps (K PLUS, SCB EASY, Krungthai NEXT, Bangkok Bank, etc.)
 */

function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    let x = ((crc >> 8) ^ data.charCodeAt(i)) & 0xff;
    x ^= x >> 4;
    crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ x) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function formatTag(id: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${id}${length}${value}`;
}

export function generatePromptPayPayload(target: string, amount?: number): string {
  // Sanitize target (remove dashes/spaces)
  const cleanTarget = target.replace(/[^0-9]/g, '');

  let formattedTarget = '';
  let subTag = '01'; // 01 for Mobile phone, 02 for Tax ID / Citizen ID

  if (cleanTarget.length === 10 && cleanTarget.startsWith('0')) {
    // Mobile number: change leading 0 to 66
    formattedTarget = `0066${cleanTarget.substring(1).padStart(11, '0')}`;
    subTag = '01';
  } else if (cleanTarget.length === 13) {
    // 13-digit Tax ID / Citizen ID
    formattedTarget = cleanTarget;
    subTag = '02';
  } else {
    formattedTarget = cleanTarget.padStart(13, '0');
    subTag = '02';
  }

  // Merchant Account Information
  const aid = formatTag('00', 'A000000677010111');
  const targetTag = formatTag(subTag, formattedTarget);
  const merchantInfo = formatTag('29', `${aid}${targetTag}`);

  // Base EMVCo tags
  let payload = '';
  payload += formatTag('00', '01'); // Payload Format Indicator
  payload += formatTag('01', amount ? '12' : '11'); // 11 = Static, 12 = Dynamic
  payload += merchantInfo;
  payload += formatTag('53', '764'); // Country Currency Code: 764 = THB
  payload += formatTag('58', 'TH');  // Country Code

  if (amount && amount > 0) {
    payload += formatTag('54', amount.toFixed(2));
  }

  payload += '6304'; // CRC placeholder
  const checksum = crc16(payload);

  return `${payload}${checksum}`;
}


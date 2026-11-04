import type { APIRoute } from 'astro';
import { siteConfig } from '../data/siteConfig';
import sharp from 'sharp';

const escape = (value: string) => value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
export const GET: APIRoute = async () => {
  // This static route embeds a small JPEG so contact apps can import the photo
  // without fetching a remote image after the vCard has been downloaded.
  const photo = await sharp('public/assets/people/mesfin-professional.webp')
    .resize(320, 320)
    .jpeg({ quality: 88 })
    .toBuffer();
  const companyNote = [
    `${siteConfig.companyName} - ${siteConfig.tagline}.`,
    'Solar energy solutions and professional sound systems in Addis Ababa, Ethiopia.',
    'Products include solar panels, inverters, batteries, solar water pumps, speakers, amplifiers and microphones.',
    `Visit us: ${siteConfig.address}, ${siteConfig.city}, ${siteConfig.country}.`,
  ].join('\n');
  const lines = [
    'BEGIN:VCARD', 'VERSION:3.0',
    `FN:Mesfin - ${escape(siteConfig.companyName)}`,
    'N:;Mesfin;;;',
    `ORG:${escape(siteConfig.companyName)}`,
    `TEL;TYPE=WORK,VOICE:${siteConfig.phones[0].replace(/\s+/g, '')}`,
    `EMAIL;TYPE=WORK:${escape(siteConfig.email)}`,
    `ADR;TYPE=WORK:;;${escape(siteConfig.address)};${escape(siteConfig.city)};;;${escape(siteConfig.country)}`,
    'URL:https://universalelectronicet.com/',
    `PHOTO;ENCODING=b;TYPE=JPEG:${photo.toString('base64')}`,
    `NOTE:${escape(companyNote)}`,
    'END:VCARD',
  ];
  // vCard 3.0 lines fold at 75 UTF-8 octets; continuation lines start with a space.
  const fold = (line: string) => {
    let result = '', length = 0;
    for (const character of line) {
      const bytes = new TextEncoder().encode(character).length;
      if (length + bytes > 75) { result += '\r\n '; length = 1; }
      result += character; length += bytes;
    }
    return result;
  };
  return new Response(lines.map(fold).join('\r\n') + '\r\n', {
    headers: { 'Content-Type': 'text/vcard; charset=utf-8', 'Content-Disposition': 'attachment; filename="Mesfin-Universal-Electronics.vcf"' },
  });
};

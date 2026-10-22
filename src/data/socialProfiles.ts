export interface CompanySocialProfile {
  platform: 'instagram' | 'facebook' | 'tiktok' | 'linkedin';
  label: string;
  url: string;
  handle: string;
  descriptor: string;
}
// Links provided by the business. No tracking parameters or invented Facebook handles.
export const socialProfiles: CompanySocialProfile[] = [
  {platform:'instagram',label:'Instagram',url:'https://www.instagram.com/universal_electronics_et/',handle:'@universal_electronics_et',descriptor:'Photos, product updates and company highlights'},
  {platform:'facebook',label:'Facebook',url:'https://web.facebook.com/profile.php?id=61577887168378',handle:'Universal Electronics',descriptor:'Company news and announcements'},
  {platform:'tiktok',label:'TikTok',url:'https://www.tiktok.com/@universal_electronics',handle:'@universal_electronics',descriptor:'Short product demonstrations and videos'},
  {platform:'linkedin',label:'LinkedIn',url:'https://www.linkedin.com/company/universal-electronics-et',handle:'Universal Electronics ET',descriptor:'Professional updates and company activity'},
];

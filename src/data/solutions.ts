export type Solution = {
 slug:string; eyebrow:string; title:string; teaser:string; description:string;
 photo:string; imageAlt:string; imageType:'illustration'|'product';
 categoryHref:string; categoryLabel:string; interest:string; tags:string[]; questions:string[];
};
export const solutions:Solution[] = [
 {slug:'solar-power',eyebrow:'Solar energy',title:'Solar Power',teaser:'Explore solar panels and related energy equipment.',
 description:'Explore solar modules, inverters and batteries in our catalog. Equipment selection depends on your location, power requirements, compatibility and installation conditions. Confirm models and availability before purchase.',
 photo:'/assets/projects/recreated-solar-array.webp',imageAlt:'Illustrative recreation of an archived solar installation',imageType:'illustration',categoryHref:'/shop/solar/',categoryLabel:'Browse solar equipment',interest:'Solar equipment',tags:['Solar panels','Inverters','Batteries'],questions:['What equipment do you want to power?','What is your expected daily use?','Where will you use the system?']},
 {slug:'backup-power',eyebrow:'Energy storage',title:'Backup Power',teaser:'Discover inverters and batteries for energy backup.',
 description:'Explore inverters and batteries for power backup. Battery sizing, backup duration and compatible components must be confirmed for the exact products and intended loads.',
 photo:'/assets/products/inverters/4630-PV19-4-6K-01.jpg',imageAlt:'Solar power inverter from our catalog',imageType:'product',categoryHref:'/category/inverters/',categoryLabel:'Browse inverters',interest:'Solar equipment',tags:['Inverters','Batteries','Backup'],questions:['Which devices need backup power?','How many hours of backup do you need?','Do you already have an inverter or battery?']},
 {slug:'water-pumping',eyebrow:'Agriculture & water',title:'Solar Water Pumping',teaser:'Find pumping equipment for agricultural and water needs.',
 description:'Browse water pumping equipment listed in our catalog. Proper pump selection depends on water source, required flow, pump head and available power. Confirm exact configuration for your site.',
 photo:'/assets/projects/recreated-water-station.webp',imageAlt:'Illustrative recreation of an archived solar water station',imageType:'illustration',categoryHref:'/category/solar-water-pumps/',categoryLabel:'Browse water pumps',interest:'Solar equipment',tags:['Agriculture','Water supply','Pumps'],questions:['What water source do you use?','How much water do you need?','Where will the pump be installed?']},
 {slug:'professional-sound',eyebrow:'Events & venues',title:'Professional Sound',teaser:'Explore speakers, microphones, mixers and amplifiers.',
 description:'Discover professional audio equipment for houses of worship, events, meeting spaces and other venues. Choose components based on room size, existing equipment, and speech or music requirements.',
 photo:'/assets/products/speakers/4980-01._JBL_EON715_3-4_Extreme_vert_medium.png',imageAlt:'JBL loudspeaker from our catalog',imageType:'product',categoryHref:'/shop/sound/',categoryLabel:'Browse sound equipment',interest:'Sound equipment',tags:['Churches','Events','Conference rooms'],questions:['What is your venue type?','How many people will attend?','Is the system for speech, music or both?']}
];

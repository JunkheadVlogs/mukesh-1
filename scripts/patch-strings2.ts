import fs from 'fs';
const files = ['src/Home.tsx', 'src/Layout.tsx', 'src/Faq.tsx'];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf-8');
  code = code.replace(/Jagnath Road, Opposite Wholesale Cloth Market Gate No\. 2, Gandhibagh/g, '${BUSINESS_INFO.address.street}, ${BUSINESS_INFO.address.area}');
  code = code.replace(/Jagnath Road, Opposite Wholesale Cloth Market Gate No\. 2, Gandhibagh, Nagpur, Maharashtra - 440002/g, '${BUSINESS_INFO.address.fullAddress}');
  fs.writeFileSync(file, code);
}

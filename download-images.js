import fs from 'fs';
import path from 'path';

const IMAGES_TO_DOWNLOAD = [
  {
    name: 'logo.webp',
    url: 'https://lh3.googleusercontent.com/d/1QDVfG-lK8wmYw_Wfz62Yb745gR40foRw'
  },
  {
    name: 'hero_exhibition.webp',
    url: 'https://lh3.googleusercontent.com/d/1tucc1ZblHYQt5suadHkwZl-3BzyzAuIA'
  },
  {
    name: 'main_shop_entrance.webp',
    url: 'https://lh3.googleusercontent.com/d/1IFI6HR5__1CmmWFj2SOU9dRZkJL3oSRU'
  },
  {
    name: 'billing_counter.webp',
    url: 'https://lh3.googleusercontent.com/d/1BkjTW2c9Lp0KUQH337w7boQtrXmrnHDl'
  },
  {
    name: 'saree_section.webp',
    url: 'https://lh3.googleusercontent.com/d/1ANZwb_MyHYzwJE8otCzY2DiwvkU_N7T4'
  },
  {
    name: 'lehenga_section.webp',
    url: 'https://lh3.googleusercontent.com/d/1gjPnofLFUOXMAbD4gowCAi_3ie36HJmp'
  },
  {
    name: 'category_coord_sets.webp',
    url: 'https://lh3.googleusercontent.com/d/1lSuvWpjCmEyPWtWlDOmlJPAP9oaBaW6c'
  },
  {
    name: 'category_sarees.webp',
    url: 'https://lh3.googleusercontent.com/d/1oU1UYZS8CU3OOa-3CNyc3cQlyAS0AfJ_'
  }
];

async function download() {
  const targetDir = path.join(process.cwd(), 'public', 'images');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (const img of IMAGES_TO_DOWNLOAD) {
    // We fetch them as optimized webp via wsrv.nl proxy so they are pre-optimized and properly sized format
    const wsrvUrl = `https://wsrv.nl/?url=${encodeURIComponent(img.url)}&output=webp&q=85`;
    const destPath = path.join(targetDir, img.name);
    console.log(`Downloading ${img.name} from: ${wsrvUrl}...`);

    try {
      const response = await fetch(wsrvUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(destPath, buffer);
      console.log(`Successfully saved ${img.name} (${buffer.length} bytes)`);
    } catch (err) {
      console.error(`Failed to download ${img.name}:`, err);
    }
  }

  console.log('All downloads completed!');
}

download();

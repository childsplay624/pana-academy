import { supabase } from '@/integrations/supabase/client';

export interface TextChangeProposal {
  id: string;
  table: 'pages' | 'page_sections' | 'page_content' | 'courses' | 'blog_posts' | 'testimonials' | 'platform_settings';
  recordId: string;
  recordTitle: string;
  field: string;
  oldText: string;
  newText: string;
  pageSlug?: string;
  contentKey?: string;
}

export interface SearchResult {
  table: 'pages' | 'page_sections' | 'page_content' | 'courses' | 'blog_posts' | 'testimonials' | 'platform_settings';
  recordId: string;
  recordTitle: string;
  field: string;
  currentText: string;
  score?: number;
  pageSlug?: string;
  contentKey?: string;
}

/**
 * Static page defaults registered in the system.
 */
export const STATIC_PAGE_CONTENT_DEFAULTS: Array<{
  pageSlug: string;
  contentKey: string;
  label: string;
  defaultValue: string;
}> = [
  // Contact page defaults
  { pageSlug: 'contact', contentKey: 'phone_abuja', label: 'Contact Us: Abuja Phone', defaultValue: '+234 702 600 0119' },
  { pageSlug: 'contact', contentKey: 'phone_ph', label: 'Contact Us: Port Harcourt Phone', defaultValue: '+234 702 600 0116' },
  { pageSlug: 'contact', contentKey: 'address_abuja', label: 'Contact Us: Abuja Office Address', defaultValue: 'No. 5 Vattern Street, off Amazon Street, Maitama, Abuja.' },
  { pageSlug: 'contact', contentKey: 'address_ph', label: 'Contact Us: Port Harcourt Address', defaultValue: 'Plot 94 Rivoc Road, Trans Amadi Industrial Layout, Port Harcourt.' },
  { pageSlug: 'contact', contentKey: 'address_kampala', label: 'Contact Us: Kampala Office Address', defaultValue: 'C/O Cristal Advocates, 4th Floor, Padre Pio House, Plot 32 Lumumba Avenue, Kampala.' },
  { pageSlug: 'contact', contentKey: 'address_dubai', label: 'Contact Us: Dubai Office Address', defaultValue: 'Business Center 1, M Floor, The Meydan Hotel, Nad Al Sheba, Dubai.' },
  { pageSlug: 'contact', contentKey: 'email', label: 'Contact Us: Central Direct Email', defaultValue: 'info@pana-institute.com' },
  { pageSlug: 'contact', contentKey: 'hero_title', label: 'Contact Us: Page Title', defaultValue: 'Get in Touch' },
  { pageSlug: 'contact', contentKey: 'hero_subtitle', label: 'Contact Us: Page Subtitle', defaultValue: 'We are here to advance engineering excellence.' },
  { pageSlug: 'contact', contentKey: 'offices_heading', label: 'Contact Us: Offices Section Heading', defaultValue: 'Our Offices & Hubs' },

  // About page defaults
  { pageSlug: 'about', contentKey: 'hero_title', label: 'About Us: Hero Title', defaultValue: 'About PANA Institute' },
  { pageSlug: 'about', contentKey: 'vision_body', label: 'About Us: Vision', defaultValue: 'To be the premier engineering knowledge center across Sub-Saharan Africa and globally.' },
  { pageSlug: 'about', contentKey: 'mission_body', label: 'About Us: Mission', defaultValue: 'Delivering world-class technical training, industrial asset integrity, and energy transition solutions.' },

  // General settings
  { pageSlug: 'general', contentKey: 'phone', label: 'General: Institute Main Telephone', defaultValue: '+234 702 600 0119' },
  { pageSlug: 'general', contentKey: 'email', label: 'General: Main Inquiries Email', defaultValue: 'info@pana-institute.com' },
];

/**
 * Standard known website image slots with friendly descriptions and fallbacks
 */
export const KNOWN_IMAGE_SLOTS: Array<{
  key: string;
  category: 'hero' | 'logo' | 'team' | 'values' | 'other';
  label: string;
  defaultUrl: string;
  keywords: string[];
}> = [
  // Hero slides
  { key: 'hero_slide_1', category: 'hero', label: 'Homepage Hero Slide 1 (Main Banner)', defaultUrl: '/img/hero-slide-1.jpg', keywords: ['hero', 'banner', 'homepage', 'slide 1', 'main banner', 'carousel'] },
  { key: 'hero_slide_2', category: 'hero', label: 'Homepage Hero Slide 2', defaultUrl: '/img/hero-slide-2.jpg', keywords: ['hero', 'banner', 'homepage', 'slide 2'] },
  { key: 'hero_slide_3', category: 'hero', label: 'Homepage Hero Slide 3', defaultUrl: '/img/hero-slide-3.jpg', keywords: ['hero', 'banner', 'homepage', 'slide 3'] },
  
  // Brand Logos
  { key: 'logo_main', category: 'logo', label: 'Main PANA Institute Logo (Navbar & Header)', defaultUrl: '/logo.png', keywords: ['logo', 'brand', 'navbar', 'header', 'main logo'] },
  { key: 'logo_pana_why', category: 'logo', label: 'PANA "Why Us" Brand Emblem', defaultUrl: '/panawhy.png', keywords: ['why', 'emblem', 'badge', 'logo'] },
  
  // Header Banners for Pages
  { key: 'header_about', category: 'other', label: 'About Us Page Header Banner', defaultUrl: '/img/about-header.jpg', keywords: ['about', 'about us', 'header', 'banner'] },
  { key: 'header_team', category: 'other', label: 'Leadership & Team Page Header Banner', defaultUrl: '/img/team-header.jpg', keywords: ['team', 'leadership', 'header', 'banner'] },
  { key: 'header_training', category: 'other', label: 'Training Delivery Page Header Banner', defaultUrl: '/img/training.jpg', keywords: ['training', 'delivery', 'header', 'banner'] },
  { key: 'header_consultancy', category: 'other', label: 'Consultancy Services Header Banner', defaultUrl: '/img/consultancy.jpg', keywords: ['consulting', 'consultancy', 'header', 'banner'] },
  { key: 'header_rnd', category: 'other', label: 'Research & Development (R&D) Header Banner', defaultUrl: '/img/rnd.jpg', keywords: ['rnd', 'research', 'development', 'header', 'banner'] },
  { key: 'header_sustainability', category: 'other', label: 'Sustainability & Climate Services Header', defaultUrl: '/images/sustainability_hero.jpg', keywords: ['sustainability', 'climate', 'green', 'header', 'banner'] },
  { key: 'header_global_engagements', category: 'other', label: 'Global Engagements Header Banner', defaultUrl: '/images/global_engagements_hero.jpg', keywords: ['global', 'engagements', 'international', 'header'] },
  { key: 'header_careers', category: 'other', label: 'Careers Page Header Banner', defaultUrl: '/img/careers.jpg', keywords: ['careers', 'jobs', 'hiring', 'header', 'banner'] },
  
  // Values Images
  { key: 'values_sands', category: 'values', label: 'Core Values: SANDS Graphic', defaultUrl: '/values/sands.PNG', keywords: ['values', 'sands', 'culture'] },
  { key: 'values_maxims', category: 'values', label: 'Company Maxims Graphic', defaultUrl: '/values/maxims.jpg', keywords: ['values', 'maxims', 'principles'] },
  { key: 'values_log', category: 'values', label: 'Values Section Background Image', defaultUrl: '/values/log.jpg', keywords: ['values', 'background'] },

  // Client / Partner Logos
  { key: 'logo_shell', category: 'logo', label: 'Client Logo: Shell', defaultUrl: '/shell.png', keywords: ['client', 'partner', 'shell', 'logo'] },
  { key: 'logo_total', category: 'logo', label: 'Client Logo: TotalEnergies', defaultUrl: '/total.png', keywords: ['client', 'partner', 'total', 'totalenergies', 'logo'] },
  { key: 'logo_chevron', category: 'logo', label: 'Client Logo: Chevron', defaultUrl: '/chevron.png', keywords: ['client', 'partner', 'chevron', 'logo'] },
  { key: 'logo_nnpc', category: 'logo', label: 'Client Logo: NNPC', defaultUrl: '/nnpc.png', keywords: ['client', 'partner', 'nnpc', 'logo'] },
  { key: 'logo_access_bank', category: 'logo', label: 'Client Logo: Access Bank', defaultUrl: '/access-bank.png', keywords: ['client', 'partner', 'access bank', 'logo'] },
  { key: 'logo_mtn', category: 'logo', label: 'Client Logo: MTN', defaultUrl: '/mtn.png', keywords: ['client', 'partner', 'mtn', 'logo'] },
];

function cleanDigits(str: string): string {
  return str.replace(/[^\d+]/g, '');
}

/**
 * Searches across website CMS tables for text matching a query with exact/fuzzy prioritization.
 */
export async function searchWebsiteContent(searchTerm: string): Promise<SearchResult[]> {
  const queryStr = searchTerm.trim().toLowerCase();
  if (!queryStr) return [];

  const results: SearchResult[] = [];
  const queryClean = cleanDigits(queryStr);
  const isPhoneQuery = /^\+?[\d\s\-().]{5,}$/.test(queryStr);

  try {
    // 1. Check page_content table (existing live database key-value overrides)
    const { data: pageContents } = await supabase
      .from('page_content')
      .select('id, page_slug, content_key, content_value');

    const loadedKeys = new Set<string>();

    (pageContents || []).forEach((c: any) => {
      const val = c.content_value || '';
      const keyStr = `${c.page_slug}:${c.content_key}`;
      loadedKeys.add(keyStr);

      const valLower = val.toLowerCase();
      const valDigits = cleanDigits(val);
      const isExact = valLower === queryStr || (isPhoneQuery && valDigits === queryClean);
      const isSub = valLower.includes(queryStr) || (isPhoneQuery && queryClean.length >= 7 && valDigits.includes(queryClean));
      const isKeyMatch = c.content_key.toLowerCase().includes(queryStr) || c.page_slug.toLowerCase().includes(queryStr);

      if (isExact || isSub || isKeyMatch) {
        results.push({
          table: 'page_content',
          recordId: c.id,
          recordTitle: `Page: [${c.page_slug}] ${c.content_key}`,
          field: 'content_value',
          currentText: val,
          pageSlug: c.page_slug,
          contentKey: c.content_key,
          score: isExact ? 100 : (isSub ? 80 : 50)
        });
      }
    });

    // 2. Check Static Page Defaults (for static pages where DB override row is not yet created)
    STATIC_PAGE_CONTENT_DEFAULTS.forEach((def) => {
      const keyStr = `${def.pageSlug}:${def.contentKey}`;
      if (loadedKeys.has(keyStr)) return;

      const defLower = def.defaultValue.toLowerCase();
      const defDigits = cleanDigits(def.defaultValue);
      const isExact = defLower === queryStr || (isPhoneQuery && defDigits === queryClean);
      const isSub = defLower.includes(queryStr) || (isPhoneQuery && queryClean.length >= 7 && defDigits.includes(queryClean));
      const isKeyMatch = def.contentKey.toLowerCase().includes(queryStr) || def.label.toLowerCase().includes(queryStr);

      if (isExact || isSub || isKeyMatch) {
        results.push({
          table: 'page_content',
          recordId: `new:${def.pageSlug}:${def.contentKey}`,
          recordTitle: `${def.label}`,
          field: 'content_value',
          currentText: def.defaultValue,
          pageSlug: def.pageSlug,
          contentKey: def.contentKey,
          score: isExact ? 95 : (isSub ? 75 : 45)
        });
      }
    });

    // 3. Platform Settings (key-value settings)
    const { data: settings } = await supabase.from('platform_settings').select('id, key, value, category');
    (settings || []).forEach((s: any) => {
      const valStr = typeof s.value === 'string' ? s.value : JSON.stringify(s.value);
      const valLower = valStr.toLowerCase();
      const valDigits = cleanDigits(valStr);

      const isExact = valLower === queryStr || (isPhoneQuery && valDigits === queryClean);
      const isSub = valLower.includes(queryStr) || (isPhoneQuery && queryClean.length >= 7 && valDigits.includes(queryClean));
      const isKey = s.key.toLowerCase().includes(queryStr) || s.category.toLowerCase().includes(queryStr);

      if (isExact || isSub || isKey) {
        results.push({
          table: 'platform_settings',
          recordId: s.id,
          recordTitle: `Platform Setting: [${s.category}] ${s.key}`,
          field: 'value',
          currentText: valStr,
          score: isExact ? 90 : (isSub ? 70 : 40)
        });
      }
    });

    // 4. Pages (title, description, slug)
    const { data: pages } = await supabase.from('pages').select('id, title, description, slug');
    (pages || []).forEach((page: any) => {
      const titleMatch = page.title?.toLowerCase().includes(queryStr);
      const descMatch = page.description?.toLowerCase().includes(queryStr);
      if (titleMatch) {
        results.push({
          table: 'pages',
          recordId: page.id,
          recordTitle: `Page Title: ${page.title || page.slug}`,
          field: 'title',
          currentText: page.title,
          score: page.title?.toLowerCase() === queryStr ? 85 : 55
        });
      }
      if (descMatch) {
        results.push({
          table: 'pages',
          recordId: page.id,
          recordTitle: `Page Description: ${page.title || page.slug}`,
          field: 'description',
          currentText: page.description,
          score: 50
        });
      }
    });

    // 5. Courses (Search title, description, code, and price)
    if (!isPhoneQuery) {
      // Check if query targets course price specifically
      const isPriceQuery = /\b(price|fee|cost|rate|pricing)\b/i.test(queryStr);
      // Extract potential course code from query (e.g. "SC05 price" -> "SC05")
      const codeMatchRegex = /\b([a-zA-Z]{1,4}\s?-?\d{1,4})\b/i;
      const codeExtracted = queryStr.match(codeMatchRegex)?.[1]?.replace(/\s+/g, '').toUpperCase();

      const { data: courses } = await supabase
        .from('courses')
        .select('id, title, description, code, price, is_price_tbd, is_free');

      (courses || []).forEach((course: any) => {
        const cCode = (course.code || '').toUpperCase().replace(/\s+/g, '');
        const titleMatch = course.title?.toLowerCase().includes(queryStr);
        const codeExactMatch = cCode && (cCode === queryStr.toUpperCase() || cCode === codeExtracted);
        const codeContainsMatch = cCode && queryStr.toUpperCase().includes(cCode);
        const descMatch = course.description?.toLowerCase().includes(queryStr);

        // If admin specifically asks about price or price update for a course
        if ((codeExactMatch || codeContainsMatch || titleMatch) && isPriceQuery) {
          const currentPriceStr = course.is_price_tbd 
            ? 'Contact Us (TBD)' 
            : course.is_free 
            ? 'Free' 
            : `₦${Number(course.price || 0).toLocaleString()}`;

          results.push({
            table: 'courses',
            recordId: course.id,
            recordTitle: `Course Price: [${course.code || 'COURSE'}] ${course.title}`,
            field: 'price',
            currentText: currentPriceStr,
            score: codeExactMatch ? 110 : 95
          });
        }

        // Also provide standard price slot if code was matched
        if (codeExactMatch && !isPriceQuery) {
          const currentPriceStr = course.is_price_tbd 
            ? 'Contact Us (TBD)' 
            : course.is_free 
            ? 'Free' 
            : `₦${Number(course.price || 0).toLocaleString()}`;

          results.push({
            table: 'courses',
            recordId: course.id,
            recordTitle: `Course Price: [${course.code}] ${course.title}`,
            field: 'price',
            currentText: currentPriceStr,
            score: 75
          });
        }

        if (titleMatch || codeExactMatch || codeContainsMatch) {
          results.push({
            table: 'courses',
            recordId: course.id,
            recordTitle: `Course: ${course.code ? `[${course.code}] ` : ''}${course.title}`,
            field: 'title',
            currentText: course.title,
            score: (codeExactMatch) ? 90 : ((titleMatch && course.title.toLowerCase() === queryStr) ? 80 : 40)
          });
        }
        if (descMatch) {
          results.push({
            table: 'courses',
            recordId: course.id,
            recordTitle: `Course Description: ${course.title}`,
            field: 'description',
            currentText: course.description,
            score: 30
          });
        }
      });
    }

    // 6. Testimonials
    const { data: testimonials } = await supabase.from('testimonials').select('id, name, company, content');
    (testimonials || []).forEach((t: any) => {
      if (t.name?.toLowerCase().includes(queryStr) || t.content?.toLowerCase().includes(queryStr)) {
        results.push({
          table: 'testimonials',
          recordId: t.id,
          recordTitle: `Testimonial: ${t.name}`,
          field: 'content',
          currentText: t.content,
          score: 35
        });
      }
    });

  } catch (err) {
    console.error('Error searching website content for PANA AI:', err);
  }

  results.sort((a, b) => (b.score || 0) - (a.score || 0));
  return results.slice(0, 10);
}

/**
 * Applies confirmed text update to Supabase
 */
export async function applyWebsiteTextUpdate(proposal: TextChangeProposal): Promise<{ success: boolean; error?: string }> {
  try {
    const { table, recordId, field, newText, pageSlug, contentKey } = proposal;

    if (table === 'page_content') {
      if (recordId.startsWith('new:') || (pageSlug && contentKey)) {
        const slug = pageSlug || recordId.split(':')[1];
        const key = contentKey || recordId.split(':')[2];
        const { error } = await supabase
          .from('page_content')
          .upsert(
            {
              page_slug: slug,
              content_key: key,
              content_value: newText,
              updated_at: new Date().toISOString()
            },
            { onConflict: 'page_slug,content_key' }
          );
        if (error) throw error;
      } else {
        const { error } = await supabase.from('page_content').update({ content_value: newText }).eq('id', recordId);
        if (error) throw error;
      }
    } else if (table === 'pages') {
      const { error } = await supabase.from('pages').update({ [field]: newText }).eq('id', recordId);
      if (error) throw error;
    } else if (table === 'courses') {
      if (field === 'price') {
        const cleanedDigits = newText.replace(/[^\d.]/g, '');
        const numericPrice = parseFloat(cleanedDigits);

        if (isNaN(numericPrice)) {
          throw new Error(`Invalid price value "${newText}". Please enter a valid number (e.g. 50000).`);
        }

        const isFree = numericPrice === 0;
        const { error } = await supabase
          .from('courses')
          .update({
            price: numericPrice,
            is_price_tbd: false,
            is_free: isFree,
            updated_at: new Date().toISOString()
          })
          .eq('id', recordId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('courses').update({ [field]: newText }).eq('id', recordId);
        if (error) throw error;
      }
    } else if (table === 'blog_posts') {
      const { error } = await supabase.from('blog_posts').update({ [field]: newText }).eq('id', recordId);
      if (error) throw error;
    } else if (table === 'testimonials') {
      const { error } = await supabase.from('testimonials').update({ [field]: newText }).eq('id', recordId);
      if (error) throw error;
    } else if (table === 'platform_settings') {
      const { error } = await supabase.from('platform_settings').update({ value: newText, updated_at: new Date().toISOString() }).eq('id', recordId);
      if (error) throw error;
    }

    return { success: true };
  } catch (err: any) {
    console.error('Failed to execute text update from PANA AI:', err);
    return { success: false, error: err.message || 'Database update failed' };
  }
}

export interface ImageSearchResult {
  table: 'site_images' | 'courses' | 'blog_posts' | 'team_members' | 'page_sections' | 'page_content';
  recordId: string;
  recordTitle: string;
  field: string;
  currentImageUrl: string;
  key?: string;
  category?: string;
  score?: number;
}

export interface ImageChangeProposal {
  table: 'site_images' | 'courses' | 'blog_posts' | 'team_members' | 'page_sections' | 'page_content';
  recordId: string;
  recordTitle: string;
  field: string;
  newImageUrl: string;
  key?: string;
  category?: string;
}

/**
 * Comprehensive image slot finder covering:
 * 1. Site Images (hero slides, logos, header banners, values)
 * 2. Predefined known slots (even if not yet in database)
 * 3. Team Member headshots
 * 4. Course thumbnails (with title and code match)
 * 5. Blog post covers
 * 6. Dynamic Page Builder sections (Hero bgImage, Content imageUrl, Banner bgImage)
 */
export async function searchWebsiteImages(keyword: string): Promise<ImageSearchResult[]> {
  const queryStr = keyword.trim().toLowerCase();
  const isAll = !queryStr || queryStr === 'all' || queryStr === 'images' || queryStr === 'any';
  const results: ImageSearchResult[] = [];

  try {
    // 1. Fetch site_images from database
    const { data: siteImgs } = await supabase.from('site_images').select('*').limit(50);
    const loadedKeys = new Set<string>();

    (siteImgs || []).forEach((img: any) => {
      loadedKeys.add(img.key);
      const keyLower = (img.key || '').toLowerCase();
      const catLower = (img.category || '').toLowerCase();
      const altLower = (img.alt_text || '').toLowerCase();
      const descLower = (img.description || '').toLowerCase();

      const match = isAll ||
        keyLower.includes(queryStr) ||
        catLower.includes(queryStr) ||
        altLower.includes(queryStr) ||
        descLower.includes(queryStr);

      if (match) {
        const isExact = keyLower === queryStr || catLower === queryStr;
        results.push({
          table: 'site_images',
          recordId: img.id,
          recordTitle: `Site Image: [${img.category}] ${img.alt_text || img.key}`,
          field: 'url',
          currentImageUrl: img.url,
          key: img.key,
          category: img.category,
          score: isExact ? 100 : 80
        });
      }
    });

    // 2. Predefined known slots (for site slots that use code defaults before being customized)
    KNOWN_IMAGE_SLOTS.forEach((slot) => {
      if (loadedKeys.has(slot.key)) return; // Already fetched from DB

      const match = isAll ||
        slot.key.toLowerCase().includes(queryStr) ||
        slot.category.toLowerCase().includes(queryStr) ||
        slot.label.toLowerCase().includes(queryStr) ||
        slot.keywords.some(k => queryStr.includes(k) || k.includes(queryStr));

      if (match) {
        results.push({
          table: 'site_images',
          recordId: `new_slot:${slot.key}`,
          recordTitle: `Site Image: [${slot.category}] ${slot.label}`,
          field: 'url',
          currentImageUrl: slot.defaultUrl,
          key: slot.key,
          category: slot.category,
          score: (slot.key.toLowerCase() === queryStr || slot.category.toLowerCase() === queryStr) ? 95 : 75
        });
      }
    });

    // 3. Team Members (profile photos)
    const { data: team } = await supabase.from('team_members').select('id, name, title, category, image_key').limit(30);
    (team || []).forEach((tm: any) => {
      const nameLower = (tm.name || '').toLowerCase();
      const titleLower = (tm.title || '').toLowerCase();
      const match = isAll ||
        nameLower.includes(queryStr) ||
        titleLower.includes(queryStr) ||
        queryStr.includes('team') ||
        queryStr.includes('staff') ||
        queryStr.includes('instructor') ||
        queryStr.includes('leadership');

      if (match) {
        // Find existing image from site_images or fallback
        const existingImg = (siteImgs || []).find((si: any) => si.key === tm.image_key);
        results.push({
          table: 'team_members',
          recordId: tm.id,
          recordTitle: `Team Member: ${tm.name} (${tm.title || tm.category})`,
          field: 'image_key',
          currentImageUrl: existingImg?.url || '/placeholder.svg',
          key: tm.image_key || `team_${tm.name.toLowerCase().replace(/\s+/g, '_')}`,
          category: 'team',
          score: nameLower === queryStr ? 90 : 60
        });
      }
    });

    // 4. Courses (thumbnail_url)
    const { data: courses } = await supabase.from('courses').select('id, title, code, thumbnail_url').limit(40);
    (courses || []).forEach((c: any) => {
      const titleLower = (c.title || '').toLowerCase();
      const codeLower = (c.code || '').toLowerCase();
      const match = isAll ||
        titleLower.includes(queryStr) ||
        codeLower.includes(queryStr) ||
        queryStr.includes('course') ||
        queryStr.includes('thumbnail');

      if (match) {
        results.push({
          table: 'courses',
          recordId: c.id,
          recordTitle: `Course Thumbnail: ${c.code ? `[${c.code}] ` : ''}${c.title}`,
          field: 'thumbnail_url',
          currentImageUrl: c.thumbnail_url || '/placeholder.svg',
          score: (titleLower === queryStr || codeLower === queryStr) ? 90 : 50
        });
      }
    });

    // 5. Blog Posts (featured_image)
    const { data: blogs } = await supabase.from('blog_posts').select('id, title, featured_image').limit(25);
    (blogs || []).forEach((b: any) => {
      const titleLower = (b.title || '').toLowerCase();
      const match = isAll ||
        titleLower.includes(queryStr) ||
        queryStr.includes('blog') ||
        queryStr.includes('news') ||
        queryStr.includes('article');

      if (match) {
        results.push({
          table: 'blog_posts',
          recordId: b.id,
          recordTitle: `Blog Cover: ${b.title}`,
          field: 'featured_image',
          currentImageUrl: b.featured_image || '/placeholder.svg',
          score: titleLower === queryStr ? 85 : 45
        });
      }
    });

    // 6. Dynamic Page Builder Sections (Hero, Banner, Content with image)
    const { data: sections } = await supabase.from('page_sections').select('id, section_type, content, page_id');
    (sections || []).forEach((sec: any) => {
      const c = sec.content || {};
      const imgField = c.bgImage ? 'bgImage' : (c.imageUrl ? 'imageUrl' : null);
      if (imgField && c[imgField]) {
        const titleLower = (c.title || sec.section_type || '').toLowerCase();
        const match = isAll ||
          titleLower.includes(queryStr) ||
          sec.section_type.toLowerCase().includes(queryStr) ||
          queryStr.includes('page') ||
          queryStr.includes('section');

        if (match) {
          results.push({
            table: 'page_sections',
            recordId: sec.id,
            recordTitle: `Page Section: [${sec.section_type}] ${c.title || 'Untitled'}`,
            field: imgField,
            currentImageUrl: c[imgField],
            score: 55
          });
        }
      }
    });

  } catch (err) {
    console.error('Error searching website images:', err);
  }

  // Sort results by score descending
  results.sort((a, b) => (b.score || 0) - (a.score || 0));

  return results.slice(0, 15);
}

/**
 * Uploads an image file directly from chat to Supabase Storage and returns the public URL
 */
export async function uploadChatImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `pana-ai-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    let bucketName = 'site-images';
    let { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (error) {
      bucketName = 'images';
      const fallbackUpload = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, { cacheControl: '3600', upsert: true });
      if (fallbackUpload.error) throw fallbackUpload.error;
      data = fallbackUpload.data;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return { success: true, url: publicUrlData.publicUrl };
  } catch (err: any) {
    console.error('Failed to upload image from PANA AI:', err);
    return { success: false, error: err.message || 'Image upload failed' };
  }
}

/**
 * Applies confirmed image update across any table:
 * site_images, courses, blog_posts, team_members, or page_sections
 */
export async function applyWebsiteImageUpdate(proposal: ImageChangeProposal): Promise<{ success: boolean; error?: string }> {
  try {
    const { table, recordId, field, newImageUrl, key, category } = proposal;

    if (table === 'site_images') {
      if (recordId.startsWith('new_slot:') || key) {
        const slotKey = key || recordId.replace('new_slot:', '');
        const slotCat = category || 'hero';
        const { error } = await supabase
          .from('site_images')
          .upsert(
            {
              key: slotKey,
              category: slotCat,
              url: newImageUrl,
              is_active: true,
              updated_at: new Date().toISOString()
            },
            { onConflict: 'key' }
          );
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_images')
          .update({ [field]: newImageUrl, updated_at: new Date().toISOString() })
          .eq('id', recordId);
        if (error) throw error;
      }
    } else if (table === 'team_members') {
      // Upsert a site_images row for this member's image_key and update team_members record
      const memberImageKey = key || `team_member_${recordId}`;
      const { error: imgErr } = await supabase
        .from('site_images')
        .upsert(
          {
            key: memberImageKey,
            category: 'team',
            url: newImageUrl,
            is_active: true,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'key' }
        );
      if (imgErr) throw imgErr;

      const { error: teamErr } = await supabase
        .from('team_members')
        .update({ image_key: memberImageKey, updated_at: new Date().toISOString() })
        .eq('id', recordId);
      if (teamErr) throw teamErr;
    } else if (table === 'courses') {
      const { error } = await supabase.from('courses').update({ [field]: newImageUrl }).eq('id', recordId);
      if (error) throw error;
    } else if (table === 'blog_posts') {
      const { error } = await supabase.from('blog_posts').update({ [field]: newImageUrl }).eq('id', recordId);
      if (error) throw error;
    } else if (table === 'page_sections') {
      // Fetch section, update content JSON field, and save back
      const { data: section, error: fetchErr } = await supabase.from('page_sections').select('content').eq('id', recordId).single();
      if (fetchErr) throw fetchErr;

      const updatedContent = {
        ...(section?.content || {}),
        [field]: newImageUrl
      };
      const { error: updateErr } = await supabase.from('page_sections').update({ content: updatedContent, updated_at: new Date().toISOString() }).eq('id', recordId);
      if (updateErr) throw updateErr;
    }

    return { success: true };
  } catch (err: any) {
    console.error('Failed to update website image:', err);
    return { success: false, error: err.message || 'Database update failed' };
  }
}

export interface ExtractedCourseData {
  code?: string;
  title: string;
  description: string;
  category?: string;
  level?: string;
  duration_hours?: number;
  price?: number;
  is_free?: boolean;
  is_price_tbd?: boolean;
  learning_outcomes?: string[];
  requirements?: string[];
  target_audience?: string[];
  practical_work?: string[];
  standards?: string[];
  oem_partners?: string[];
  delivery_options?: string;
  thumbnail_url?: string;
  modules?: Array<{
    title: string;
    description?: string;
    order_index: number;
  }>;
}

/**
 * Inserts or updates an extracted course directly into the Supabase database
 */
export async function postCourseFromBrochure(
  course: ExtractedCourseData
): Promise<{ success: boolean; courseId?: string; isUpdate?: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Resolve Category & Subcategory IDs if available
    let categoryId = null;
    let subcategoryId = null;

    const { data: catData } = await supabase
      .from('course_categories')
      .select('id, name')
      .ilike('name', `%${course.category || 'Operations'}%`)
      .limit(1)
      .maybeSingle();

    if (catData) categoryId = catData.id;

    // 2. Prepare course row
    const coursePayload: any = {
      code: course.code || null,
      title: course.title,
      description: course.description,
      level: (course.level || 'intermediate').toLowerCase(),
      course_type: 'onsite',
      duration_hours: course.duration_hours || 28,
      price: course.is_price_tbd ? 0 : (course.price || 0),
      is_free: course.is_free || false,
      is_price_tbd: course.is_price_tbd ?? true,
      learning_outcomes: course.learning_outcomes || [],
      requirements: course.requirements || [],
      target_audience: course.target_audience || [],
      practical_work: course.practical_work || [],
      standards: course.standards || [],
      oem_partners: course.oem_partners || [],
      delivery_options: course.delivery_options || null,
      thumbnail_url: course.thumbnail_url || null,
      status: 'published',
      category: 'general_technical',
      instructor_id: user?.id,
    };

    if (categoryId) coursePayload.category_id = categoryId;

    // Check if course already exists by course code or exact title
    let existingCourse = null;
    if (course.code) {
      const { data: byCode } = await supabase
        .from('courses')
        .select('id, title, code')
        .eq('code', course.code)
        .maybeSingle();
      if (byCode) existingCourse = byCode;
    }

    if (!existingCourse && course.title) {
      const { data: byTitle } = await supabase
        .from('courses')
        .select('id, title, code')
        .ilike('title', course.title.trim())
        .maybeSingle();
      if (byTitle) existingCourse = byTitle;
    }

    let courseId = existingCourse?.id;
    let isUpdate = false;

    if (existingCourse) {
      // Course already exists: Update the existing course record with refreshed brochure details & thumbnail
      isUpdate = true;
      const { error: updateErr } = await supabase
        .from('courses')
        .update(coursePayload)
        .eq('id', existingCourse.id);

      if (updateErr) throw updateErr;
    } else {
      // Course is new: Insert new course
      const { data: newCourse, error: courseErr } = await supabase
        .from('courses')
        .insert(coursePayload)
        .select('id, title, code')
        .single();

      if (courseErr) throw courseErr;
      courseId = newCourse?.id;
    }

    // 3. Sync Modules if provided
    if (course.modules && course.modules.length > 0 && courseId) {
      if (isUpdate) {
        // If updating an existing course, clear existing modules first to avoid duplicates
        await supabase.from('modules').delete().eq('course_id', courseId);
      }

      const moduleRows = course.modules.map((m, idx) => ({
        course_id: courseId,
        title: m.title,
        order_index: m.order_index ?? (idx + 1),
      }));

      await supabase.from('modules').insert(moduleRows);
    }

    return { success: true, courseId, isUpdate };
  } catch (err: any) {
    console.error('Failed to post course from brochure:', err);
    return { success: false, error: err.message || 'Failed to save course to database' };
  }
}

export interface ExtractedNewsData {
  title: string;
  excerpt?: string;
  content: string;
  category?: 'news' | 'media' | 'resources';
  cover_image?: string;
  published?: boolean;
}

/**
 * Inserts a new article / news post directly into the Supabase blog_posts table
 */
export async function postNewsFromAi(
  news: ExtractedNewsData
): Promise<{ success: boolean; postId?: string; slug?: string; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const slug = news.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + `-${Date.now().toString().slice(-4)}`;

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title: news.title,
        slug,
        excerpt: news.excerpt || news.title,
        content: news.content,
        cover_image: news.cover_image || null,
        published: news.published ?? true,
        published_at: new Date().toISOString(),
        author_id: user?.id,
      })
      .select('id, slug')
      .single();

    if (error) throw error;
    return { success: true, postId: data.id, slug: data.slug };
  } catch (err: any) {
    console.error('Failed to post news from PANA AI:', err);
    return { success: false, error: err.message || 'Failed to publish news post' };
  }
}


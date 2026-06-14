import { useEffect } from 'react';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  schema?: Record<string, any>;
}

export const useSEO = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  canonicalUrl,
  schema
}: SEOProps) => {
  useEffect(() => {
    // 1. Document Title
    document.title = title;

    // Helper to query or create meta tags
    const updateOrCreateMeta = (nameAttr: 'name' | 'property', attrValue: string, content: string) => {
      if (!content) return;
      let element = document.querySelector(`meta[${nameAttr}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    updateOrCreateMeta('name', 'description', description);
    if (keywords) {
      updateOrCreateMeta('name', 'keywords', keywords);
    }

    // 3. Open Graph Tags (Facebook, WhatsApp, LinkedIn)
    updateOrCreateMeta('property', 'og:title', title);
    updateOrCreateMeta('property', 'og:description', description);
    updateOrCreateMeta('property', 'og:type', ogType);
    updateOrCreateMeta('property', 'og:url', canonicalUrl || window.location.href);
    if (ogImage) {
      updateOrCreateMeta('property', 'og:image', ogImage);
    }

    // 4. Twitter Cards
    updateOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    updateOrCreateMeta('name', 'twitter:title', title);
    updateOrCreateMeta('name', 'twitter:description', description);
    if (ogImage) {
      updateOrCreateMeta('name', 'twitter:image', ogImage);
    }

    // 5. Canonical Link tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl || window.location.href);

    // 6. JSON-LD Structured Data Schema
    let schemaScript = document.getElementById('jsonld-schema');
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.setAttribute('id', 'jsonld-schema');
        schemaScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(schemaScript);
      }
      schemaScript.innerHTML = JSON.stringify(schema);
    } else {
      if (schemaScript) {
        schemaScript.remove();
      }
    }

    // Cleanup logic when page unmounts
    return () => {
      // We don't delete standard description/keywords to avoid empty head, 
      // but we do clean up schema and canonical tags if needed
      const currentSchemaScript = document.getElementById('jsonld-schema');
      if (currentSchemaScript) {
        currentSchemaScript.remove();
      }
    };
  }, [title, description, keywords, ogImage, ogType, canonicalUrl, schema]);
};

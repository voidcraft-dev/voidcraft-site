/**
 * VoidCraft CMS Client v1.0
 *
 * 跨产品共用 SDK，用于从 admin.voidcraft-dev.com 拉取公开内容。
 * 复制到你的项目，import 用。
 *
 * 用法见: voidadmin/docs/INTEGRATION.md
 *
 * Schema 同步源: voidadmin/src/lib/cms-schemas/
 * 这份 SDK 的 type 定义跟那边手动同步（schema 加新 type 时同步本文件）。
 */

// =========================================================================
// 配置
// =========================================================================

export interface CmsClientConfig {
  /** Admin 站点 URL，默认 https://admin.voidcraft-dev.com */
  baseUrl: string;
  /** 自定义 fetch（Next.js 用户可以传 ISR 参数） */
  fetch: typeof globalThis.fetch;
}

let config: CmsClientConfig = {
  baseUrl: "https://admin.voidcraft-dev.com",
  fetch: (...args) => globalThis.fetch(...args),
};

export function configureCmsClient(c: Partial<CmsClientConfig>) {
  config = { ...config, ...c };
}

export function getCmsConfig(): Readonly<CmsClientConfig> {
  return config;
}

// =========================================================================
// 错误类型
// =========================================================================

export class CmsError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status = 500, code?: string) {
    super(message);
    this.name = "CmsError";
    this.status = status;
    this.code = code;
  }
}

// =========================================================================
// 信封类型 (跟 cms_pages.content 对应)
// =========================================================================

export interface PageEnvelope<TData = unknown> {
  type: string;
  version: number;
  data: TData;
}

export interface CmsPage<TData = unknown> {
  slug: string;
  product_id: string;
  title: string | null;
  content: PageEnvelope<TData>;
  version: number;
  updated_at: string;
}

// =========================================================================
// 内部 fetch helper
// =========================================================================

async function callApi<T>(path: string): Promise<T> {
  const url = `${config.baseUrl}${path}`;
  const res = await config.fetch(url);

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new CmsError(
      `CMS API ${res.status} ${res.statusText} — ${url}\n${body}`,
      res.status,
    );
  }

  const json = (await res.json()) as {
    ok: boolean;
    data?: T;
    error?: { code: string; message: string };
  };

  if (!json.ok || json.data === undefined) {
    throw new CmsError(
      json.error?.message ?? "Unknown CMS error",
      500,
      json.error?.code,
    );
  }
  return json.data;
}

// =========================================================================
// Page API
// =========================================================================

export async function fetchPage<TData = unknown>(opts: {
  productId: string;
  slug: string;
  expectedType?: string;
  expectedVersion?: number;
}): Promise<CmsPage<TData>> {
  const { productId, slug, expectedType, expectedVersion } = opts;
  const params = new URLSearchParams({
    product_id: productId,
    slug,
  });
  const data = await callApi<{ pages: CmsPage<TData>[] }>(
    `/api/public/cms/products?${params.toString()}`,
  );
  const page = data.pages[0];
  if (!page) {
    throw new CmsError(`Page not found: ${productId}/${slug}`, 404);
  }
  if (expectedType && page.content.type !== expectedType) {
    throw new CmsError(
      `Page type mismatch for ${productId}/${slug}: got "${page.content.type}", expected "${expectedType}"`,
      500,
      "TYPE_MISMATCH",
    );
  }
  if (expectedVersion != null && page.content.version !== expectedVersion) {
    throw new CmsError(
      `Schema version mismatch for ${productId}/${slug}: got v${page.content.version}, expected v${expectedVersion}. 升级你的客户端代码或回滚 admin 编辑。`,
      500,
      "VERSION_MISMATCH",
    );
  }
  return page;
}

export async function fetchPages<TData = unknown>(opts: {
  productId?: string;
} = {}): Promise<CmsPage<TData>[]> {
  const params = new URLSearchParams();
  if (opts.productId) params.set("product_id", opts.productId);
  const data = await callApi<{ pages: CmsPage<TData>[] }>(
    `/api/public/cms/products?${params.toString()}`,
  );
  return data.pages;
}

// =========================================================================
// Posts API (cms_posts 博客)
// =========================================================================

export interface CmsPostListItem {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  tags: string[];
  published_at: string | null;
}

export interface CmsPostDetail extends CmsPostListItem {
  content_md: string;
  updated_at: string;
}

export async function fetchPosts(
  opts: { tag?: string; limit?: number } = {},
): Promise<CmsPostListItem[]> {
  const params = new URLSearchParams();
  if (opts.tag) params.set("tag", opts.tag);
  if (opts.limit) params.set("limit", String(opts.limit));
  const data = await callApi<{ posts: CmsPostListItem[] }>(
    `/api/public/cms/posts?${params.toString()}`,
  );
  return data.posts;
}

export async function fetchPost(slug: string): Promise<CmsPostDetail> {
  const data = await callApi<{ post: CmsPostDetail }>(
    `/api/public/cms/posts?slug=${encodeURIComponent(slug)}`,
  );
  return data.post;
}

// =========================================================================
// Page type data shapes (跟 voidadmin/src/lib/cms-schemas/ 同步)
// =========================================================================

export type ColorVariant =
  | "violet"
  | "blue"
  | "emerald"
  | "amber"
  | "rose"
  | "cyan";
export type ButtonVariant = "primary" | "secondary" | "outline";
export type ProductStatus = "active" | "beta" | "coming-soon" | "archived";
export type MediaType = "gradient" | "image" | "video";

export interface CtaButton {
  label: string;
  href: string;
  variant?: ButtonVariant;
}

// products-matrix
export interface ProductsMatrixData {
  headline?: string;
  subheadline?: string;
  products: Array<{
    id: string;
    name: string;
    icon?: string;
    tagline: string;
    description?: string;
    color?: ColorVariant;
    href?: string;
    status?: ProductStatus;
    tags?: string[];
    order?: number;
    featured?: boolean;
  }>;
}

// landing-hero
export interface LandingHeroData {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctas?: CtaButton[];
  media?: { type?: MediaType; src?: string; alt?: string };
  badges?: Array<{ label: string }>;
}

// landing-features
export interface LandingFeaturesData {
  headline: string;
  subheadline?: string;
  layout?: "grid-2" | "grid-3" | "grid-4" | "list";
  items: Array<{
    icon?: string;
    title: string;
    description?: string;
    highlight?: boolean;
  }>;
}

// landing-pricing
export interface LandingPricingData {
  headline: string;
  subheadline?: string;
  plans: Array<{
    id: string;
    name: string;
    price: string;
    priceUnit?: string;
    originalPrice?: string;
    highlight?: boolean;
    features?: string[];
    cta?: { label: string; href: string };
  }>;
}

// landing-faq
export interface LandingFaqData {
  headline?: string;
  items: Array<{ question: string; answer: string }>;
}

// landing-cta
export interface LandingCtaData {
  headline: string;
  subheadline?: string;
  ctas: CtaButton[];
  background?: "gradient-violet" | "gradient-blue" | "dark" | "light";
}

// landing-testimonials
export interface LandingTestimonialsData {
  headline?: string;
  items: Array<{
    name: string;
    role?: string;
    avatar?: string;
    quote: string;
    rating?: number;
  }>;
}

// about
export interface AboutData {
  headline: string;
  tagline?: string;
  story?: string[];
  team?: Array<{
    name: string;
    role?: string;
    avatar?: string;
    githubUrl?: string;
    twitterUrl?: string;
  }>;
  contactEmail?: string;
  contactGithub?: string;
}

// =========================================================================
// 类型化便捷封装
// =========================================================================

export const fetchProductsMatrix = (productId: string, slug = "products-matrix") =>
  fetchPage<ProductsMatrixData>({
    productId,
    slug,
    expectedType: "products-matrix",
    expectedVersion: 1,
  });

export const fetchHero = (productId: string, slug = "hero") =>
  fetchPage<LandingHeroData>({
    productId,
    slug,
    expectedType: "landing-hero",
    expectedVersion: 1,
  });

export const fetchFeatures = (productId: string, slug = "features") =>
  fetchPage<LandingFeaturesData>({
    productId,
    slug,
    expectedType: "landing-features",
    expectedVersion: 1,
  });

export const fetchPricing = (productId: string, slug = "pricing") =>
  fetchPage<LandingPricingData>({
    productId,
    slug,
    expectedType: "landing-pricing",
    expectedVersion: 1,
  });

export const fetchFaq = (productId: string, slug = "faq") =>
  fetchPage<LandingFaqData>({
    productId,
    slug,
    expectedType: "landing-faq",
    expectedVersion: 1,
  });

export const fetchCta = (productId: string, slug = "cta") =>
  fetchPage<LandingCtaData>({
    productId,
    slug,
    expectedType: "landing-cta",
    expectedVersion: 1,
  });

export const fetchAbout = (productId: string, slug = "about") =>
  fetchPage<AboutData>({
    productId,
    slug,
    expectedType: "about",
    expectedVersion: 1,
  });

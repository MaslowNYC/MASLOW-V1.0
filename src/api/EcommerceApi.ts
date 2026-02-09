const ECOMMERCE_API_URL = "https://api-ecommerce.hostinger.com";
const ECOMMERCE_STORE_ID = "store_01KET78XMJHGPEPK2PBY8D6RT0";

// Currency types
export interface CurrencyInfo {
	code?: string;
	symbol?: string;
	template?: string;
}

// Variant option types
export interface VariantOption {
	id: string;
	option_id: string;
	variant_id: string;
	value: string;
}

// Product option value types
export interface ProductOptionValue {
	id: string;
	option_id: string;
	variant_id: string;
	value: string;
}

// Product option types
export interface ProductOption {
	id: string;
	title: string;
	values: ProductOptionValue[];
}

// Product variant types
export interface ProductVariant {
	id: string;
	title: string;
	image_url: string | null;
	sku: string | null;
	price_in_cents: number;
	sale_price_in_cents: number | null;
	currency: string;
	currency_info?: CurrencyInfo;
	price_formatted: string;
	sale_price_formatted: string;
	manage_inventory: boolean;
	weight: number | null;
	options: VariantOption[];
	inventory_quantity: number | null;
}

// Product image types
export interface ProductImage {
	url: string;
	order: number;
	type: string;
}

// Product collection types
export interface ProductCollection {
	product_id: string;
	collection_id: string;
	order: number;
}

// Additional info types
export interface ProductAdditionalInfo {
	id: string;
	order: number;
	title: string;
	description: string;
}

// Custom field types
export interface ProductCustomField {
	id: string;
	title: string;
	is_required: boolean;
}

// Related product types
export interface ProductRelatedProduct {
	id: string;
	section_title: string;
	related_type: string;
	related_id: string;
	position: number;
}

// Product type
export interface ProductType {
	value: string;
}

// Base product response (used in list)
export interface ProductListResponse {
	id: string;
	title: string;
	subtitle: string | null;
	ribbon_text: string | null;
	description: string;
	image: string;
	price_in_cents: number;
	currency: string;
	purchasable: boolean;
	order: number;
	site_product_selection: string | null;
	images: ProductImage[];
	options: ProductOption[];
	variants: ProductVariant[];
	collections: ProductCollection[];
	additional_info: ProductAdditionalInfo[];
	type: ProductType;
	custom_fields: ProductCustomField[];
	related_products: ProductRelatedProduct[];
	updated_at: string;
}

// Extended product response (used for single product)
export interface ProductResponse extends ProductListResponse {
	status: string;
	created_at: string;
	deleted_at: string | null;
	metadata: Record<string, string>;
}

// Get products response
export interface GetProductsResponse {
	count: number;
	offset: number;
	limit: number;
	products: ProductListResponse[];
}

// Get products params
export interface GetProductsParams {
	ids?: string[];
	offset?: string;
	limit?: string;
	order?: string;
	sort_by?: string;
	is_hidden?: boolean;
	to_date?: string;
}

// Get product params
export interface GetProductParams {
	field?: string;
}

// Variant inventory
export interface VariantInventory {
	id: string;
	inventory_quantity: number;
}

// Get product quantities response
export interface GetProductQuantitiesResponse {
	variants: VariantInventory[];
}

// Get product quantities params
export interface GetProductQuantitiesParams {
	fields: string;
	product_ids: string[];
}

// Category types
export interface Category {
	id: string;
	title: string;
	image_url: string | null;
	store_id: string;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	metadata: Record<string, unknown> | null;
}

// Get categories response
export interface GetCategoriesResponse {
	categories: Category[];
	count: number;
}

// Checkout item custom field value
export interface CheckoutItemCustomFieldValue {
	custom_field_id: string;
	value: string;
}

// Checkout item
export interface CheckoutItem {
	variant_id: string;
	quantity: number;
	custom_field_values?: CheckoutItemCustomFieldValue[];
}

// Initialize checkout params
export interface InitializeCheckoutParams {
	items: CheckoutItem[];
	successUrl: string;
	cancelUrl: string;
	locale?: string;
}

// Initialize checkout response
export interface InitializeCheckoutResponse {
	url: string;
}

// Raw API response types (for internal use)
interface RawPrice {
	amount?: number;
	sale_amount?: number;
	currency_code?: string;
	currency?: CurrencyInfo;
}

interface RawVariantOption {
	id?: string;
	option_id?: string;
	variant_id?: string;
	value?: string;
}

interface RawVariant {
	id?: string;
	title?: string;
	image_url?: string | null;
	sku?: string | null;
	prices?: RawPrice[];
	manage_inventory?: boolean;
	weight?: number | null;
	options?: RawVariantOption[];
	inventory_quantity?: number | null;
}

interface RawImage {
	url?: string;
	order?: number;
	type?: string;
}

interface RawCollection {
	product_id?: string;
	collection_id?: string;
	order?: number;
}

interface RawAdditionalInfo {
	id?: string;
	order?: number;
	title?: string;
	description?: string;
}

interface RawCustomField {
	id?: string;
	title?: string;
	is_required?: boolean;
}

interface RawRelatedProduct {
	id?: string;
	section_title?: string;
	related_type?: string;
	related_id?: string;
	position?: number;
}

interface RawProductOptionValue {
	id?: string;
	option_id?: string;
	variant_id?: string;
	value?: string;
}

interface RawProductOption {
	id?: string;
	title?: string;
	values?: RawProductOptionValue[];
}

interface RawProduct {
	id: string;
	title: string;
	subtitle?: string | null;
	ribbon_text?: string | null;
	description: string;
	thumbnail?: string;
	purchasable: boolean;
	order: number;
	site_product_selection?: string | null;
	images?: RawImage[];
	media?: RawImage[];
	options?: RawProductOption[];
	variants: RawVariant[];
	product_collections?: RawCollection[];
	additional_info?: RawAdditionalInfo[];
	type?: { value?: string };
	custom_fields?: RawCustomField[];
	related_products?: RawRelatedProduct[];
	updated_at: string;
	created_at?: string;
	deleted_at?: string | null;
	status?: string;
	metadata?: Record<string, string>;
}

interface RawCollection2 {
	id: string;
	title: string;
	image_url?: string | null;
	store_id: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string | null;
	metadata?: Record<string, unknown> | null;
}

export const formatCurrency = (priceInCents: number | null | undefined, currencyInfo?: CurrencyInfo): string => {
	if (!currencyInfo || priceInCents === null || priceInCents === undefined) {
		return '';
	}

	const { code, symbol, template } = currencyInfo;
	const currencyDisplay = symbol || code || '€';
	const amount = (priceInCents / 100).toFixed(2);

	if (template) {
		return template.replace('$1', amount);
	}

	return `${currencyDisplay}${amount}`;
};

const extractVariantOptions = (options?: RawVariantOption[]): VariantOption[] => {
	return (options || []).map((opt) => ({
		id: opt?.id || "",
		option_id: opt?.option_id || "",
		variant_id: opt?.variant_id || "",
		value: opt?.value || "",
	}));
};

const extractProductOptions = (options?: RawProductOption[]): ProductOption[] => {
	return (options || []).map((opt) => ({
		id: opt?.id || "",
		title: opt?.title || "",
		values: (opt?.values || []).map((val) => ({
			id: val?.id || "",
			option_id: val?.option_id || "",
			variant_id: val?.variant_id || "",
			value: val?.value || "",
		})),
	}));
};

const extractVariants = (variants?: RawVariant[]): ProductVariant[] => {
	return (variants || []).map((v) => {
		const price_in_cents = v?.prices?.[0]?.amount || 0;
		const sale_price_in_cents = v?.prices?.[0]?.sale_amount || null;
		const currency = v?.prices?.[0]?.currency_code || "eur";

		return {
			id: v?.id || "",
			title: v?.title || "",
			image_url: v?.image_url || null,
			sku: v?.sku || null,
			price_in_cents,
			sale_price_in_cents,
			currency,
			currency_info: v?.prices?.[0]?.currency,
			price_formatted: formatCurrency(price_in_cents, v?.prices?.[0]?.currency),
			sale_price_formatted: formatCurrency(sale_price_in_cents, v?.prices?.[0]?.currency),
			manage_inventory: v?.manage_inventory || false,
			weight: v?.weight || null,
			options: extractVariantOptions(v?.options),
			inventory_quantity: v?.inventory_quantity || null,
		};
	});
};

const extractImages = (images?: RawImage[]): ProductImage[] => {
	return (images || []).map((img) => ({
		url: img?.url || "",
		order: img?.order || 0,
		type: img?.type || "",
	}));
};

const extractCollections = (collections?: RawCollection[]): ProductCollection[] => {
	return (collections || []).map((col) => ({
		product_id: col?.product_id || "",
		collection_id: col?.collection_id || "",
		order: col?.order || 0,
	}));
};

const extractAdditionalInfo = (additionalInfo?: RawAdditionalInfo[]): ProductAdditionalInfo[] => {
	return (additionalInfo || []).map((info) => ({
		id: info?.id || "",
		order: info?.order || 0,
		title: info?.title || "",
		description: info?.description || "",
	}));
};

const extractCustomFields = (customFields?: RawCustomField[]): ProductCustomField[] => {
	return (customFields || []).map((field) => ({
		id: field?.id || "",
		title: field?.title || "",
		is_required: field?.is_required || false,
	}));
};

const extractRelatedProducts = (relatedProducts?: RawRelatedProduct[]): ProductRelatedProduct[] => {
	return (relatedProducts || []).map((rel) => ({
		id: rel?.id || "",
		section_title: rel?.section_title || "",
		related_type: rel?.related_type || "",
		related_id: rel?.related_id || "",
		position: rel?.position || 0,
	}));
};

const getLowestPriceVariant = (product: RawProduct): RawVariant =>
	product.variants.reduce((acc, curr) => {
		const accPrice = acc.prices?.[0]?.sale_amount || acc.prices?.[0]?.amount || 0;
		const currPrice =
			curr.prices?.[0]?.sale_amount || curr.prices?.[0]?.amount || 0;

		return accPrice < currPrice ? acc : curr;
	});

const getProductPrice = (product: RawProduct): { price_in_cents: number; currency: string } => {
	const selectedVariant =
		product.site_product_selection === "lowest_price_first" ||
		product.site_product_selection === null
			? getLowestPriceVariant(product)
			: product.variants[0];

	const price_in_cents =
		selectedVariant?.prices?.[0]?.sale_amount ||
		selectedVariant?.prices?.[0]?.amount ||
		0;
	const currency = selectedVariant?.prices?.[0]?.currency_code || "eur";

	return { price_in_cents, currency };
};

/**
 * GET /store/{store_id}/products - List Products Endpoint
 * Retrieve a paginated list of products with filtering options
 */
export async function getProducts(params: GetProductsParams = {}): Promise<GetProductsResponse> {
	const { ids, offset, limit, order, sort_by, is_hidden, to_date } = params;
	const queryParams = new URLSearchParams();

	if (ids) {
		ids.forEach((id) => {
			queryParams.append("ids[]", id);
		});
	}

	if (offset) {
		queryParams.append("offset", String(offset));
	}

	if (limit) {
		queryParams.append("limit", String(limit));
	}

	if (order) {
		queryParams.append("order", String(order).toUpperCase());
	}

	if (sort_by) {
		queryParams.append("sort_by", String(sort_by));
	}

	if (is_hidden) {
		queryParams.append("is_hidden", String(is_hidden));
	}

	if (to_date) {
		queryParams.append("to_date", String(to_date));
	}

	const queryString = queryParams.toString();
	const url = `${ECOMMERCE_API_URL}/store/${ECOMMERCE_STORE_ID}/products${queryString ? `?${queryString}` : ""}`;

	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}

	const data = await response.json();
	return {
		count: data.count,
		offset: data.offset,
		limit: data.limit,
		products: data.products.map((product: RawProduct) => {
			const { price_in_cents, currency } = getProductPrice(product);

			return {
				id: product.id,
				title: product.title,
				subtitle: product.subtitle,
				ribbon_text: product.ribbon_text,
				description: product.description,
				image: product.thumbnail,
				price_in_cents,
				currency,
				purchasable: product.purchasable,
				order: product.order,
				site_product_selection: product.site_product_selection,
				images: extractImages(product.images),
				options: extractProductOptions(product.options),
				variants: extractVariants(product.variants),
				collections: extractCollections(product.product_collections),
				additional_info: extractAdditionalInfo(product.additional_info),
				type: {
					value: product.type?.value || "",
				},
				custom_fields: extractCustomFields(product.custom_fields),
				related_products: extractRelatedProducts(product.related_products),
				updated_at: product.updated_at,
			};
		}),
	};
}

/**
 * GET /store/{store_id}/products/{id} - Get Single Product Endpoint
 * Retrieve a single product by ID
 */
export async function getProduct(id: string, params: GetProductParams = {}): Promise<ProductResponse> {
	const { field } = params;
	const queryParams = new URLSearchParams();

	if (field) {
		queryParams.append("field", String(field));
	}

	const queryString = queryParams.toString();
	const url = `${ECOMMERCE_API_URL}/store/${ECOMMERCE_STORE_ID}/products/${id}${queryString ? `?${queryString}` : ""}`;

	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}

	const data = await response.json();
	const product: RawProduct = data.product;

	const { price_in_cents, currency } = getProductPrice(product);

	return {
		id: product.id,
		title: product.title,
		subtitle: product.subtitle ?? null,
		ribbon_text: product.ribbon_text ?? null,
		description: product.description,
		image: product.thumbnail || "",
		price_in_cents,
		currency,
		status: product.status || "",
		purchasable: product.purchasable,
		order: product.order,
		site_product_selection: product.site_product_selection ?? null,
		images: extractImages(product.media),
		options: extractProductOptions(product.options),
		variants: extractVariants(product.variants),
		collections: extractCollections(product.product_collections),
		additional_info: extractAdditionalInfo(product.additional_info),
		type: {
			value: product.type?.value || "",
		},
		custom_fields: extractCustomFields(product.custom_fields),
		related_products: extractRelatedProducts(product.related_products),
		updated_at: product.updated_at,
		created_at: product.created_at || "",
		deleted_at: product.deleted_at ?? null,
		metadata: product.metadata || {},
	};
}

/**
 * GET /store/{store_id}/variants - Get Product Quantities Endpoint
 * Retrieve a list of product variants with up-to-date inventory information
 */
export async function getProductQuantities(params: GetProductQuantitiesParams): Promise<GetProductQuantitiesResponse> {
	const { fields, product_ids } = params;
	const queryParams = new URLSearchParams();

	queryParams.append("fields", fields);

	product_ids.forEach((id) => {
		queryParams.append("product_ids[]", id);
	});

	const url = `${ECOMMERCE_API_URL}/store/${ECOMMERCE_STORE_ID}/variants?${queryParams.toString()}`;

	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}

	const data = await response.json();

	return {
		variants: (data.variants || []).map((variant: { id: string; inventory_quantity: number }) => ({
			id: variant.id,
			inventory_quantity: variant.inventory_quantity,
		})),
	};
}

/**
 * GET /store/{store_id}/collections - Get Categories Endpoint
 * Retrieve all categories (collections) for filtering products
 */
export async function getCategories(): Promise<GetCategoriesResponse> {
	const url = `${ECOMMERCE_API_URL}/store/${ECOMMERCE_STORE_ID}/collections`;

	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}

	const data = await response.json();

	return {
		categories: (data.collections || []).map((collection: RawCollection2) => ({
			id: collection.id,
			title: collection.title,
			image_url: collection.image_url,
			store_id: collection.store_id,
			created_at: collection.created_at,
			updated_at: collection.updated_at,
			deleted_at: collection.deleted_at,
			metadata: collection.metadata,
		})),
		count: data.count,
	};
}

async function getCheckoutLanguage(): Promise<string | undefined> {
	const response = await fetch(`${ECOMMERCE_API_URL}/store/${ECOMMERCE_STORE_ID}/settings`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}

	const data = await response.json();
	return data.store_owner?.language;
}

/**
 * POST /store/{store_id}/checkout - Initialize Checkout Endpoint
 * Initialize checkout/payment session for customer purchase
 */
export async function initializeCheckout(params: InitializeCheckoutParams): Promise<InitializeCheckoutResponse> {
	const { items, successUrl, cancelUrl, locale } = params;
	const url = `${ECOMMERCE_API_URL}/store/${ECOMMERCE_STORE_ID}/checkout`;

	const checkoutInitPromise = fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			items,
			successUrl,
			cancelUrl,
			locale,
			timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		}),
	});

	const [response, language] = await Promise.all([checkoutInitPromise, getCheckoutLanguage().catch(() => "en")]);

	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}

	const data = await response.json();
	const checkoutRedirectUrl = `${data.url}&lang=${(language as string)?.toLowerCase() || "en"}`;

	return { url: checkoutRedirectUrl };
}

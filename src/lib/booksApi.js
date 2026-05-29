const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '')

async function readJson(response) {
  const data = await response.json().catch(() => null)
  console.log('API Response:', { status: response.status, data })
  if (!response.ok) {
    throw new Error(data?.message || 'Unable to load books')
  }
  return data
}

function buildHeaders(token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

function normalizeBook(book) {
  if (!book) {
    return null
  }

  const images = Array.isArray(book.images)
    ? book.images
    : typeof book.uri === 'string' && book.uri
      ? [book.uri]
      : []

  const primaryImage = images[0] || book.uri || '/assets/demo.jpg'

  return {
    ...book,
    images: [...new Set(images.filter(Boolean))],
    uri: primaryImage,
    price: Number.isFinite(Number(book.price))
      ? Number(book.price)
      : Math.round(Number(book.pricePaise || 0) / 100),
    pricePaise: Number.isFinite(Number(book.pricePaise)) ? Number(book.pricePaise) : Number(book.price || 0) * 100,
  }
}

export function getBookLanguageSummary(book) {
  if (book?.bilangual) {
    return 'Bilingual'
  }

  if (book?.onlyEnglish && book?.onpunjabi) {
    return 'English + Punjabi'
  }

  if (book?.onlyEnglish) {
    return 'English'
  }

  if (book?.onpunjabi) {
    return 'Punjabi'
  }

  return 'Unspecified'
}

export async function fetchBooks() {
  const response = await fetch(`${apiBaseUrl}/books`, { cache: 'no-store' })
  const data = await readJson(response)
  return Array.isArray(data.books) ? data.books.map(normalizeBook) : []
}

export async function fetchBookBySku(sku) {
  if (!sku) {
    return null
  }

  const response = await fetch(`${apiBaseUrl}/books/${encodeURIComponent(sku)}`, { cache: 'no-store' })
  const data = await readJson(response)
  return normalizeBook(data.book)
}

export async function createBook(token, payload) {
  const response = await fetch(`${apiBaseUrl}/books`, {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  })
  const data = await readJson(response)
  return normalizeBook(data.book)
}

export async function updateBook(token, sku, payload) {
  const response = await fetch(`${apiBaseUrl}/books/${encodeURIComponent(sku)}`, {
    method: 'PATCH',
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  })
  const data = await readJson(response)
  return normalizeBook(data.book)
}

export async function uploadBookImages(token, files) {
  const formData = new FormData()
  Array.from(files || []).forEach((file) => {
    if (file) {
      formData.append('images', file)
    }
  })

  const response = await fetch(`${apiBaseUrl}/books/upload-images`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  })
  const data = await readJson(response)
  return Array.isArray(data.images) ? data.images.filter(Boolean) : []
}

export async function deleteBook(token, sku) {
  const response = await fetch(`${apiBaseUrl}/books/${encodeURIComponent(sku)}`, {
    method: 'DELETE',
    headers: buildHeaders(token),
  })
  await readJson(response)
}

export async function resetBooks(token) {
  const response = await fetch(`${apiBaseUrl}/books/admin/reset`, {
    method: 'POST',
    headers: buildHeaders(token),
  })
  const data = await readJson(response)
  return Array.isArray(data.books) ? data.books.map(normalizeBook) : []
}

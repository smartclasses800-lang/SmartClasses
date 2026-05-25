const STORAGE_KEY = 'illamipunjab.adminBooks.v1'

const rawDefaultBooks = [
  {
    title: 'Illami Punjab',
    author: 'Rebecca Yarros',
    cover: '/assets/demo.jpg',
    pages: 320,
    price: 299,
    description:
      'A gripping tale of love and resilience set in the heart of Punjab, where tradition meets modernity.',
    uri: 'https://illamipunjabmcp.vercel.app/book.webp',
    bilangual: true,
    onlyEnglish: false,
    onpunjabi: false,
  },
  {
    title: 'Punjabi Bhasha Ate Vyakaran',
    author: 'Charlie Kirk',
    cover: '/assets/demo.jpg',
    pages: 250,
    price: 199,
    description:
      'A comprehensive guide to Punjabi language and grammar, perfect for students and language enthusiasts.',
    uri: 'https://i.ibb.co/FqWzjWQN/book.jpg',
    bilangual: true,
    onlyEnglish: false,
    onpunjabi: false,
  },
  {
    title: 'Punjab Police Constable 2026 District & Armed Cadre',
    author: 'Allen Levi',
    cover: '/assets/demo.jpg',
    pages: 300,
    price: 249,
    description:
      'A comprehensive guide to the Punjab Police Constable exam, covering all important topics and practice questions.',
    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXLd0s6lxmSBqEUfKQI68Z7AG6zU2c0Nu44g&s',
    bilangual: false,
    onlyEnglish: true,
    onpunjabi: false,
  },
]

export function slugifyBookTitle(title) {
  const slug = String(title || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || 'book'
}

export function createEmptyBook() {
  return {
    sku: '',
    title: '',
    author: '',
    cover: '/assets/demo.jpg',
    pages: '',
    price: '',
    description: '',
    uri: '',
    bilangual: false,
    onlyEnglish: true,
    onpunjabi: false,
  }
}

export function normalizeBook(book, index = 0) {
  const title = String(book?.title || '').trim()
  const sku = String(book?.sku || '').trim() || slugifyBookTitle(title) || `book-${index + 1}`
  const pages = Number(book?.pages)
  const price = Number(book?.price)

  return {
    sku,
    title,
    author: String(book?.author || '').trim(),
    cover: String(book?.cover || '/assets/demo.jpg').trim() || '/assets/demo.jpg',
    pages: Number.isFinite(pages) ? pages : 0,
    price: Number.isFinite(price) ? price : 0,
    description: String(book?.description || '').trim(),
    uri: String(book?.uri || '').trim(),
    bilangual: Boolean(book?.bilangual),
    onlyEnglish: Boolean(book?.onlyEnglish),
    onpunjabi: Boolean(book?.onpunjabi),
  }
}

function makeUniqueBooks(books) {
  const usedSkus = new Set()

  return books.map((book, index) => {
    const normalized = normalizeBook(book, index)
    const baseSku = normalized.sku || slugifyBookTitle(normalized.title) || `book-${index + 1}`
    let uniqueSku = baseSku
    let suffix = 2

    while (usedSkus.has(uniqueSku)) {
      uniqueSku = `${baseSku}-${suffix}`
      suffix += 1
    }

    usedSkus.add(uniqueSku)

    return {
      ...normalized,
      sku: uniqueSku,
    }
  })
}

export function getDefaultBooks() {
  return makeUniqueBooks(rawDefaultBooks)
}

export function loadBooks() {
  if (typeof window === 'undefined') {
    return getDefaultBooks()
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY)
    if (!storedValue) {
      return getDefaultBooks()
    }

    const parsedBooks = JSON.parse(storedValue)
    if (!Array.isArray(parsedBooks)) {
      return getDefaultBooks()
    }

    return makeUniqueBooks(parsedBooks)
  } catch {
    return getDefaultBooks()
  }
}

export function saveBooks(books) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(makeUniqueBooks(books)))
}

export function resetBooks() {
  if (typeof window === 'undefined') {
    return getDefaultBooks()
  }

  const defaults = getDefaultBooks()
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
  return defaults
}

export function coerceBookFromForm(formValue) {
  const title = String(formValue.title || '').trim()
  const sku = String(formValue.sku || '').trim() || slugifyBookTitle(title)
  const pages = Number(formValue.pages)
  const price = Number(formValue.price)
  const bilangual = Boolean(formValue.bilangual)

  return normalizeBook(
    {
      ...formValue,
      sku,
      title,
      pages: Number.isFinite(pages) ? pages : 0,
      price: Number.isFinite(price) ? price : 0,
      bilangual,
      onlyEnglish: bilangual ? true : Boolean(formValue.onlyEnglish),
      onpunjabi: bilangual ? true : Boolean(formValue.onpunjabi),
    },
    0,
  )
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

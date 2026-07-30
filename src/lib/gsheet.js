const API_URL = 'https://script.google.com/macros/s/AKfycbysMDCIeBbQjRQtv_cQe9eB1tFcLYz8tiqfIdadh_I/exec'

async function request(sheet, action, opts = {}) {
  const { data, filters, orderBy, order, limit, single, idKey } = opts
  const params = new URLSearchParams({ sheet, action })

  if (data) params.set('data', JSON.stringify(data))
  if (filters) params.set('filters', JSON.stringify(filters))
  if (orderBy) params.set('orderBy', orderBy)
  if (order) params.set('order', order)
  if (limit) params.set('limit', String(limit))
  if (single) params.set('single', 'true')
  if (idKey) params.set('idKey', idKey)

  const url = `${API_URL}?${params.toString()}`
  const res = await fetch(url)
  return res.json()
}

export async function readAll(sheet, opts = {}) {
  return request(sheet, 'read', opts)
}

export async function readOne(sheet, filters, opts = {}) {
  return request(sheet, 'read', { ...opts, filters, single: true })
}

export async function insertRow(sheet, data) {
  const res = await request(sheet, 'insert', { data })
  if (res.error) throw new Error(res.error)
  return res.data
}

export async function updateRow(sheet, data, idKey = 'id') {
  const res = await request(sheet, 'update', { data, idKey })
  if (res.error) throw new Error(res.error)
  return res.data
}

export async function deleteRow(sheet, id, idKey = 'id') {
  const res = await request(sheet, 'delete', { data: { [idKey]: id }, idKey })
  if (res.error) throw new Error(res.error)
  return res
}

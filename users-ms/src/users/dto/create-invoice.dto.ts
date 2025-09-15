export interface InvoiceItemDto {
  productId: number;
  descripcion: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateInvoiceDto {
  numero: string;
  userId: number;
  total: number;
  items: InvoiceItemDto[];
}
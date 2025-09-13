import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoiceController } from './invoices.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [InvoicesService],
  controllers: [InvoiceController]
})
export class InvoicesModule {}
